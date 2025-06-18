import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Veritabanı seed işlemi başlatılıyor...');

    // --- ROLLERİ OLUŞTUR ---
    const adminRole = await prisma.role.upsert({
        where: { name: 'Admin' },
        update: {},
        create: {
            name: 'Admin',
            description: 'Tam yetkili sistem yöneticisi.',
        },
    });

    const moderatorRole = await prisma.role.upsert({
        where: { name: 'Moderator' },
        update: {},
        create: {
            name: 'Moderator',
            description: 'Kısıtlı yönetim yetkilerine sahip moderatör.',
        },
    });

    const userRole = await prisma.role.upsert({
        where: { name: 'User' },
        update: {},
        create: {
            name: 'User',
            description: 'Standart uygulama kullanıcısı.',
        },
    });

    console.log('Roller oluşturuldu:', { adminRole, moderatorRole, userRole });

    // --- İZİNLERİ OLUŞTUR ---
    const permissions = [
        { name: 'admin.dashboard.view', description: 'Admin paneline erişim izni.' },
        { name: 'admin.users.manage', description: 'Kullanıcıları yönetme izni.' },
        { name: 'admin.roles.manage', description: 'Rolleri yönetme izni.' },
        { name: 'admin.permissions.manage', description: 'İzinleri yönetme izni.' },
        { name: 'admin.settings.manage', description: 'Genel sistem ayarlarını yönetme izni.' },
        { name: 'admin.logs.view', description: 'Sistem aktivite loglarını görüntüleme izni.' },
        { name: 'content.create', description: 'İçerik oluşturma izni.' },
        { name: 'content.read', description: 'İçerikleri görüntüleme izni.' },
        { name: 'content.update.own', description: 'Kendi içeriğini düzenleme izni.' },
        { name: 'content.delete.own', description: 'Kendi içeriğini silme izni.' },
    ];

    const createdPermissions = [];
    for (const perm of permissions) {
        const permission = await prisma.permission.upsert({
            where: { name: perm.name },
            update: {},
            create: perm,
        });
        createdPermissions.push(permission);
    }

    console.log('İzinler oluşturuldu:', createdPermissions);

    // --- ROLLERİ İZİNLERE ATA ---
    const rolePermissions = [
        { roleName: 'Admin', permissionNames: [
            'admin.dashboard.view',
            'admin.users.manage',
            'admin.roles.manage',
            'admin.permissions.manage',
            'admin.settings.manage',
            'admin.logs.view',
            'content.create',
            'content.read',
            'content.update.own',
            'content.delete.own'
        ]},
        { roleName: 'Moderator', permissionNames: [
            'content.read',
            'content.update.own',
            'content.delete.own'
        ]},
        { roleName: 'User', permissionNames: [
            'content.read',
            'content.create',
            'content.update.own',
            'content.delete.own'
        ]}
    ];

    for (const { roleName, permissionNames } of rolePermissions) {
        const role = roleName === 'Admin' ? adminRole : roleName === 'Moderator' ? moderatorRole : userRole;
        for (const permName of permissionNames) {
            const permission = createdPermissions.find(p => p.name === permName);
            if (permission) {
                await prisma.rolePermission.upsert({
                    where: {
                        roleId_permissionId: {
                            roleId: role.id,
                            permissionId: permission.id,
                        },
                    },
                    update: {},
                    create: {
                        roleId: role.id,
                        permissionId: permission.id,
                    },
                });
            }
        }
    }

    console.log('Roller ve izinler ilişkilendirildi.');

    // --- ÖRNEK BİR YÖNETİCİ KULLANICI OLUŞTUR ---
    const hashedPassword = await bcrypt.hash('123456001', 10);

    const adminUser = await prisma.user.upsert({
        where: { email: 'meka@meka.com' },
        update: {},
        create: {
            email: 'meka@meka.com',
            password: hashedPassword,
            name: 'Yönetici Kullanıcı',
            emailVerified: new Date(),
            isActivated: true,
            roleId: adminRole.id, // Kullanıcıya "Admin" rolünü ata
            notificationPreference: {
                create: {
                    emailEnabled: true,
                    inAppEnabled: true,
                    securityAlerts: true,
                },
            },
        },
    });

    console.log('Örnek yönetici kullanıcı oluşturuldu ve rol atandı:', adminUser);

    console.log('Veritabanı seed işlemi tamamlandı.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
