import z from "zod";

export const CreateSchema = z.object({
	content: z.string().min(1, "content is required"),
});

export const UpdateSchema = z.object({
	id: z.number(),
	content: z.string().optional(),
	date: z.coerce.date().optional(),
});
