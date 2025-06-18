Next.js tabanlı, modern web uygulamaları geliştirmek için kapsamlı bir başlangıç kiti.

## ✨ Temel Özellikler
- **Framework:** Next.js (App Router ile) => "next": "15.3.3",
- **Kimlik Doğrulama:** NextAuth.js => "next-auth": "^5.0.0-beta.28",
- **ORM:** Prisma (Postgre SQL) => "^6.9.0",
- **UI:** Tailwind CSS v4, Radix UI (Shadcn UI bileşenleri ile)
- **Çoklu Dil Desteği:** next-intl => "next-intl": "^4.1.0",
- **Tema Desteği:** next-themes
- **Form Yönetimi:** React Hook Form & Zod (Doğrulama için)
- **State Management:** Zustand => "zustand": "^5.0.5"
- **E-posta Gönderimi:** Nodemailer
- **Linting & Formatlama:** ESLint, Prettier (Next.js varsayılanları)

Bu, [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) ile başlatılmış bir [Next.js](https://nextjs.org) projesidir.

## Başlarken

Öncelikle, geliştirme sunucusunu çalıştırın:

```bash
npm run dev
# veya
yarn dev
# veya
pnpm dev
# veya
bun dev
```

Sonucu görmek için tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

Sayfayı düzenlemeye `app/page.tsx` dosyasını değiştirerek başlayabilirsiniz. Dosyayı düzenledikçe sayfa otomatik olarak güncellenir.

Bu proje, Vercel için yeni bir yazı tipi ailesi olan [Geist](https://vercel.com/font) yazı tipini otomatik olarak optimize etmek ve yüklemek için [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) kullanır.


### Veritabanı Kurulumu
Proje bir veritabanı kullanır. Aşağıdaki adımları izleyerek veritabanını kurabilir ve başlangıç verilerini yükleyebilirsiniz:

1.  **.env Dosyasını Yapılandırın:**
    Projenin kök dizininde bulunan `.env.example` dosyasını kopyalayarak `.env` adında yeni bir dosya oluşturun. Ardından bu dosya içerisindeki `DATABASE_URL` değişkenini kendi yerel veya uzak veritabanı bağlantı bilgilerinizle güncelleyin. PostgreSQL için örnek bir bağlantı URL'si: `DATABASE_URL="postgresql://user:password@host:port/database?schema=public"`

2.  **Veritabanı Migrasyonlarını Çalıştırın:**
    Bu komut, `prisma/schema.prisma` dosyanızdaki modellere göre veritabanı şemanızı oluşturacak veya güncelleyecektir.
    ```bash
    npx prisma migrate dev
    ```

3.  **Veritabanını Başlangıç Verileriyle Doldurun (Seed):**
    Bu komut, veritabanınıza test veya başlangıç için gerekli olan örnek verileri ekler. (`prisma/seed.ts` dosyasındaki script çalıştırılır.)
    ```bash
    npm run prisma:seed
    ```

## Daha Fazla Bilgi Edinin

Next.js hakkında daha fazla bilgi edinmek için aşağıdaki kaynaklara göz atın:

- [Next.js Belgeleri](https://nextjs.org/docs) - Next.js özellikleri ve API hakkında bilgi edinin.
- [Next.js Öğrenin](https://nextjs.org/learn) - etkileşimli bir Next.js eğitimi.

[Next.js GitHub deposuna](https://github.com/vercel/next.js) göz atabilirsiniz - geri bildirimleriniz ve katkılarınız kabulümüzdür!

## Vercel'de Dağıtın

Next.js uygulamanızı dağıtmanın en kolay yolu, Next.js'in yaratıcılarından [Vercel Platformunu](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) kullanmaktır.

Daha fazla ayrıntı için [Next.js dağıtım belgelerimize](https://nextjs.org/docs/app/building-your-application/deploying) göz atın.
# meka-next-kit