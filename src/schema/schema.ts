import zod from "zod";
import { toTypedSchema } from "@vee-validate/zod";

export const registrationSchema = toTypedSchema(
  zod
    .object({
      fullName: zod.string().min(1, { message: "Please enter full name" }),
      email: zod
        .string()
        .min(1, { message: "Please enter yout email" })
        .email({ message: "Must be valid email" }),
      password: zod
        .string()
        .min(1, { message: "Please, enter password" })
        .min(3, { message: "Must be more than 3 letters" })
        .max(16, { message: "Must be less than 16 letters" }),
      c_password: zod
        .string()
        .min(1, { message: "Please enter password confirmation" }),
      country: zod
        .string()
        .min(1, { message: "Please enter country of residence" }),
      city: zod.string().min(1, { message: "Please enter city of residence" }),
      address: zod.string().min(1, { message: "Please enter your address" }),
    })
    .refine((schema) => schema.c_password === schema.password, {
      message: "Passwords don't match",
      path: ["c_password"],
    })
);

export const logInSchema = toTypedSchema(
  zod.object({
    email: zod
      .string()
      .min(1, { message: "Your email is required" })
      .email({ message: "Must be a valid email" }),
    password: zod.string().min(1, {
      message: "Your Password is Required",
    }),
  })
);

export const createProductSchema = toTypedSchema(
  zod.object({
    name: zod
      .string()
      .min(1, "Product name is required")
      .max(64, "Product name must be less than 64 characters"),
    type: zod
      .string()
      .min(1, {
        message: "Product type is Required",
      })
      .max(24, "Product type must be less than 20 characters"),
    quantity: zod
      .number()
      .min(0, "Product Quantity is required")
      .max(100, "Product Quantity must be less than 100"),
    price: zod
      .number()
      .min(0, "Product Price is required")
      .max(100000000, "Product Price must be less than 100000000$"),
    description: zod
      .string()
      .min(1, {
        message: "Product description is Required",
      })
      .max(1500, "Product description must be less than 1500 characters"),
    images: zod.array(zod.instanceof(File)).min(1, "at least one image"),
  })
);

export const editProductSchema = toTypedSchema(
  zod.object({
    name: zod
      .string()
      .min(1, "Product name is required")
      .max(64, "Product name must be less than 64 characters"),
    type: zod
      .string()
      .min(1, {
        message: "Product type is Required",
      })
      .max(24, "Product type must be less than 20 characters"),
    quantity: zod
      .number()
      .min(0, "Product Quantity is required")
      .max(100, "Product Quantity must be less than 100"),
    price: zod
      .number()
      .min(0, "Product Price is required")
      .max(100000000, "Product Price must be less than $100000000"),
    description: zod
      .string()
      .min(1, {
        message: "Product description is Required",
      })
      .max(1500, "Product description must be less than 1500 characters"),
    images: zod.array(zod.any()).min(1, "at least one image"),
    files: zod.any().optional(),
  })
);

export const checkoutSchema = toTypedSchema(
  zod.object({
    country: zod
      .string()
      .min(1, { message: "Please enter country of residence" }),
    city: zod.string().min(1, { message: "Please enter city of residence" }),
    address: zod.string().min(1, { message: "Please enter your address" }),
  })
);
