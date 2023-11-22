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
