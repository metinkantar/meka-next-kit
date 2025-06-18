import crypto from 'crypto';

// Doğrulama tokenı oluşturma
export function generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
}