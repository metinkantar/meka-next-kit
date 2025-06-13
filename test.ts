import { z } from "zod";

// Şifre doğrulama için regex
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;

// Şifre şeması
const PasswordSchema = z.object({
    password: z.string().regex(passwordRegex, {
        message: "Şifre en az 8 karakter uzunluğunda olmalı ve en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir."
    }),
});

// Test edilecek şifre
const testPassword = "123456MeKa+*";

// Şifreyi doğrula
const result = PasswordSchema.safeParse({ password: testPassword });

// Sonucu konsola yazdır
if (!result.success) {
    console.error(result.error.errors[0].message);
} else {
    console.log("Şifre geçerli");
}