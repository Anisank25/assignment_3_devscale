import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { prisma } from "../../utils/prisma";
import { CreateSchema, UpdateSchema } from "./schema";

export const noteRouter = new Hono()
	.get("/", async (c) => {
		const notes = await prisma.notes.findMany();

		return c.json(notes);
	})
	.post("/", zValidator("json", CreateSchema), async (c) => {
		const body = c.req.valid("json");

		const newNote = await prisma.notes.create({
			data: {
				content: body.content,
			},
		});

		return c.json({
			message: "new note created",
			data: newNote,
		});
	})
	.patch("/", zValidator("json", UpdateSchema.partial()), async (c) => {
		try {
			const body = c.req.valid("json");
			const noteId = body.id;

			const checkIdNote = await prisma.notes.findUnique({
				where: {
					id: noteId,
				},
			});

			if (!checkIdNote) {
				return c.json({ message: "Note not found"},404);
			}

			const updateNote = await prisma.notes.update({
				where: {
					id: noteId,
				},
				data: {
					content: body.content,
					date: new Date(),
				},
			});

			return c.json({ message: `Note ${noteId} updated`, data: updateNote });
		} catch (error) {
			return c.json({ message: "Error updating note", error }, 500);
		}
	})

	.delete("/", async (c) => {
		try {
			const body = await c.req.json();
			const notesId = body.id;

			const checkIdNote = await prisma.notes.findUnique({
				where: {
					id: Number(notesId),
				},
			});

			if (!checkIdNote) {
				return c.json({ message: "Note not found"},404);
			}

			const deleteNote = await prisma.notes.delete({
				where: {
					id: Number(notesId),
				},
			});

			return c.json({ message: `notes ${notesId} deleted`, data: deleteNote });
		} catch (error) {
			return c.json({ message: "Error deleting Notes", error }, 500);
		}
	});
