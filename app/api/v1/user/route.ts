// app/api/user/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const passwordHash = searchParams.get("passwordHash");

  if (!email || !passwordHash) {
    return NextResponse.json(
      { message: "Email and passwordHash are required" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
        passwordHash,
      },
      include: {
        accounts: true,
        sessions: true,
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
        activityLogs: true,
        notificationPreference: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

   /*  // Kullanıcının izinlerini kontrol et
    const isAdmin = user.userRoles.some((userRole) =>
      userRole.role.rolePermissions.some(
        (rolePermission) =>
          rolePermission.permission.name === "admin.dashboard.view"
      )
    );

    // Admin kullanıcıları için ek veriler döndür
    if (isAdmin) {
      user.userRoles.forEach((userRole) => {
        userRole.role.rolePermissions.forEach((rolePermission) => {
          // Burada admin kullanıcıları için ek verileri ekleyebilirsiniz
        });
      });
    } */

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Error fetching user" },
      { status: 500 }
    );
  }
}
