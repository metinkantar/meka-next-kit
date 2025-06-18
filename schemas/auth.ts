import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[a-zA-Z0-9]/, { message: 'Password must be alphanumeric' }),
})

export const RegisterSchema = z.object({
  name: z.string().min(4, { message: "İsim gereklidir" }),
  email: z.string()
    .email({ message: "Geçersiz e-posta adresi." })
    .refine((value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value), {
      message: "E-posta adresi geçerli bir formatta olmalıdır."
    }),
  password: z.string()
    .min(8, { message: "Şifre en az 8 karakter uzunluğunda olmalıdır." })
    .refine((value) => /[a-z]/.test(value), {
      message: "Şifre en az bir küçük harf içermelidir."
    })
    .refine((value) => /[A-Z]/.test(value), {
      message: "Şifre en az bir büyük harf içermelidir."
    })
    .refine((value) => /\d/.test(value), {
      message: "Şifre en az bir rakam içermelidir."
    })
    .refine((value) => /[@$!%*?&+]/.test(value), {
      message: "Şifre en az bir özel karakter içermelidir (@, $, !, %, *, ?, &, +)."
    })
  /* password: z.string().regex(passwordRegex, {
    message: "Şifre en az 8 karakter uzunluğunda olmalı ve en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir."
  }), */
});

// Şema tanımlama
export const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Geçerli bir e-posta adresi girin." }),
});


// Şema tanımlama
export const ResetPasswordSchema = z.object({
  password: z.string()
    .min(8, { message: "Şifre en az 8 karakter uzunluğunda olmalıdır." })
    .refine((value) => /[a-z]/.test(value), {
      message: "Şifre en az bir küçük harf içermelidir."
    })
    .refine((value) => /[A-Z]/.test(value), {
      message: "Şifre en az bir büyük harf içermelidir."
    })
    .refine((value) => /\d/.test(value), {
      message: "Şifre en az bir rakam içermelidir."
    })
    .refine((value) => /[@$!%*?&+]/.test(value), {
      message: "Şifre en az bir özel karakter içermelidir (@, $, !, %, *, ?, &, +)."
    }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Parolalar eşleşmiyor",
  path: ["confirmPassword"],
});