import z, { email } from "zod";

export const createBooksSchema = z.object({
  title: z.string().min(3, "name minimal 3 karakter"),
  author: z.string().min(3, "name minimal 3 karakter"),
  category: z.string().min(3, "name minimal 3 karakter"),
  description: z.string().min(5, "description minimal 5 karakter"),
  price: z.number({ invalid_type_error: "harga harus angka" }),
//   image_url: z.string().min(3, "url minimal 3 karakter"),
});

export const updateBooksSchema = z.object({
  title: z.string().min(3, "name minimal 3 karakter").optional(),
  author: z.string().min(3, "name minimal 3 karakter").optional(),
  category: z.string().min(3, "name minimal 3 karakter").optional(),
  description: z.string().min(5, "description minimal 5 karakter").optional(),
  price: z.number({ invalid_type_error: "harga harus angka" }).optional(),
//   image_url: z.string().min(3, "url minimal 3 karakter").optional(),
});
