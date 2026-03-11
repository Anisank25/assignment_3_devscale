//import { log } from "@devsca/logger";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { noteRouter } from "./modules/notes/router";

const app = new Hono()
	.use(
		cors({
			origin: "*",
			allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
		}),
	)
	.route("/notes", noteRouter);

export type AppType = typeof app;

serve(
	{
		fetch: app.fetch,
		port: 8000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
