import { NextRequest } from 'next/server';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import bcrypt from 'bcryptjs';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Şifre hashleme
export async function hashPassword(password: string): Promise<string>  {
  const saltRounds: string = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, saltRounds);
}

// IP adresini almak için çeşitli başlıkları kontrol edin
export function getClientIp(request: NextRequest): string | null {
  let ip = request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('fastly-client-ip') ||
    request.headers.get('true-client-ip') ||
    request.headers.get('x-cluster-client-ip') ||
    request.headers.get('x-forwarded') ||
    request.headers.get('forwarded-for') ||
    request.headers.get('forwarded');

  // Eğer x-forwarded-for başlığı birden fazla IP içeriyorsa, ilkini alın
  if (ip && typeof ip === 'string' && ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }

  // IPv6 adreslerini IPv4'e dönüştürün
  if (ip && ip.startsWith('::ffff:')) {
    ip = ip.replace('::ffff:', '');
  }

  // Eğer IP adresi hala IPv6 formatında ise, onu IPv4'e dönüştürmeye çalışın
  if (ip && ip.includes(':')) {
    const match = ip.match(/::ffff:(\d+\.\d+\.\d+\.\d+)/);
    if (match) {
      ip = match[1];
    } else if (ip === '::1') {
      ip = 'localhost';
    }
  }

  return ip || null;
}

// Cihaz bilgilerini parçalara ayırma
export interface DeviceInfo {
  os: string | null;
  deviceType: string | null;
}

// UserAgent'ı parçalara ayırma
export function parseUserAgent(userAgent: string): DeviceInfo {
  const osRegex = /\(([^)]+)\)/;
  const deviceRegex = /(iPhone|iPad|iPod|Android|Mobile|Tablet|Windows Phone)/i;

  const osMatch = userAgent.match(osRegex);
  const deviceMatch = userAgent.match(deviceRegex);

  const os = osMatch ? osMatch[1] : 'Unknown';
  const deviceType = deviceMatch ? deviceMatch[0] : 'desktop';

  return {
    os,
    deviceType,
  };
}

