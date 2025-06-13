// app/api/auth/verify-email/route.ts
import { NextResponse } from 'next/server';
import { prisma } from 'db';
import { getTranslations } from 'next-intl/server';

export async function POST(request: Request) {
  const t = await getTranslations('auth');
  const body = await request.json();
  const { token } = body;

  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: t('global.invalid_token') }, { status: 400 });
  }

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken || new Date() > verificationToken.expires) {
    return NextResponse.json({ error: t('global.token_is_invalid_or_expired') }, { status: 400 });
  }

  await prisma.user.update({
    where: { email: verificationToken.identifier },
    data: {
      emailVerified: new Date(),
      isActivated: true,
    },
  });

  await prisma.verificationToken.delete({
    where: { token },
  });

  return NextResponse.json({ message: t('global.email_verification_success') }, { status: 200 });
}



/* import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { prisma } from 'db';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { token } = body;

  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Geçersiz token' }, { status: 400 });
  }

  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken || new Date() > verificationToken.expires) {
    return NextResponse.json({ error: 'Token geçersiz veya süresi dolmuş' }, { status: 400 });
  }

  await prisma.user.update({
    where: { email: verificationToken.identifier },
    data: {
      emailVerified: new Date(),
      isActivated: true,
    },
  });

  await prisma.verificationToken.delete({
    where: { token },
  });

  return NextResponse.json({ message: 'E-posta başarıyla doğrulandı' }, { status: 200 });
}
 */