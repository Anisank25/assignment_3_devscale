import { Button } from "@devsca/ui";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { api } from "#/utils/api";

export const Route = createFileRoute("/")({
	component: App,
	loader: async () => {
		const res = await api.notes.$get();
		const notes = await res.json();

		return notes;
	},
});

function App() {
	const router = useRouter();
	const notes = Route.useLoaderData();
	const [noteContent, setNoteContent] = useState("");
	const [noteID, setNoteID] = useState<number>(0);
	const [mode,setMode] = useState <"create"|"delete"|"update"|null>(null)
	const [error, setError] = useState<string | null>(null);

	async function handleCreateNote() {
		const res = await api.notes.$post({
			json: {
				content: noteContent,
			},
		});

		const data = await res.json();
		console.log(data);
		router.invalidate();
		setMode(null)
	}

	async function handleDeleteNote() {
		try {
			const res = await api.notes.$delete({
				json: {
					id: noteID,
				},
			});
			const data = await res.json();

			if (!res.ok) {
				console.log (`Error: ${data.message}`)
				setError(data.message)
				
				
				setTimeout(() => {
					setMode(null);
				}, 1000);
				return;
			}

			setError(null);
			console.log(data);
			router.invalidate();
			setMode(null)
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			}
		}
	}

	async function handleUpdateNote() {
		try {
			const newDate = new Date();
			const res = await api.notes.$patch({
				json: {
					id: noteID,
					content: noteContent,
					date: newDate.toISOString(),
				},
			});

			const data = await res.json();

			if (!res.ok) {
				setError(data.message);
				setTimeout(() => {
					setMode(null)
				}, 1000);
				return;
			}

			console.log(data);
			router.invalidate();
			setMode(null)	

		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			}
		}
	}

	return (
		<div>
			<p className="bg-cyan-600 text-white p-3">Assignment 3 - Notes App</p>
			<br></br>
			{mode === null && (
				<div>
					<Button onClick={() => setMode("create")}>Create</Button>
					&emsp;
					<Button onClick={() => setMode("delete")}>Delete</Button>
					&emsp;
					<Button onClick={() => setMode("update")}>Update</Button>
				</div>
			)}
			
			<div>	
				{mode === "create" && (
					<div>
						<p>Create Menu</p>
						<form>
							<textarea
								placeholder="Content"
								onChange={(e) => setNoteContent(e.target.value)}
							></textarea>
							<Button onClick={handleCreateNote}>Save</Button>
						</form>
						<br></br>
						<Button onClick={() => setMode(null)}>Back</Button>
					</div>
					
				)}
				{mode === "delete" && (
					<div>
						<p>Delete Menu</p>
						<form>		
							<br></br>		
							<input
								type="number"
								placeholder="Notes ID"
								onChange={(e) => setNoteID(Number(e.target.value))}
							/>
							<div className="alert-danger">{error}</div>
							<Button onClick={handleDeleteNote}>Delete</Button>

						</form>
						<br></br>
						<Button onClick={() => setMode(null)}>Back</Button>
					</div>
				)}
				{mode === "update" && (
					<div>
						<p>Update Menu</p>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								handleUpdateNote();
							}}
						>
							<input
								type="number"
								placeholder="Notes ID"
								onChange={(e) => setNoteID(Number(e.target.value))}
							/>
							<br></br>
							<textarea
								placeholder="Content"
								onChange={(e) => setNoteContent(e.target.value)}
							></textarea>
							<div className="alert-danger">{error}</div>
							<Button onClick={handleUpdateNote}>Update</Button>
						</form>
						<br></br>
						<Button onClick={() => setMode(null)}>Back</Button>
					</div>
				)}
				<div>
					<br></br>
					{notes.map((note) => {
						return (
							<div key={note.id}>
								{note.id}
								<br></br>
								<small> {new Date(note.date).toLocaleString()}</small>
								<br></br>
								{note.content}
								<br></br>

								<br></br>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
