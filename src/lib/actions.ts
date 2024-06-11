"use server";
import { z } from 'zod';

const productSchema = z.object({
	name: z
		.string()
		.min(3, { message: "The name has to be a min charackter length of 5" }),
	category: z.string().min(1, { message: "Category is required" }),
	price: z.number().min(1, { message: "The Price has to be bigger then 1" }),
	smallDescription: z
		.string()
		.min(10, { message: "Please summerize your product more" }),
	description: z.string().min(10, { message: "Description is required" }),
	images: z.array(z.string(), { message: "Images are required" }),
	productFile: z
		.string()
		.min(1, { message: "Pleaes upload a zip of your product" }),
});