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
	//const [error, setError] = useState<string | null>(null);
	const [notif, setNotif] = useState <string|null> (null);

	async function handleCreateNote() {
		const res = await api.notes.$post({
			json: {
				content: noteContent,
			},
		});
		const data = await res.json();
		setNotif(data.message);
		router.invalidate();

		setTimeout(() => {
			setNotif(null);
			setMode(null);
		}, 2000);
	}

	async function handleDeleteNote() {
		try {
			const res = await api.notes.$delete({
				json: {
					id: noteID,
				},
			});
			const data = await res.json();
			setNotif(data.message);
			router.invalidate();

			if (!res.ok) {
				setNotif(data.message)
				
				setTimeout(() => {
					setMode(null);
				}, 1000);
				return;
			} 
				
			setTimeout(() => {
				setNotif(null);
				setMode(null);
			}, 1000);	

			setNotif(null);
			console.log(data);
			router.invalidate();
			setMode(null)
		} catch (err) {
			if (err instanceof Error) {
				setNotif(err.message);
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
			setNotif (data.message)
			router.invalidate();

			if (!res.ok) {
				setNotif(data.message);
				setTimeout(() => {
					setMode(null)
				}, 1000);
				return;
			}
			setTimeout(() => {
				setNotif(null);
				setMode(null);
			}, 1000);
		} catch (err) {
			if (err instanceof Error) {
				setNotif(err.message);
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
						<form
							onSubmit={(e) => {
								e.preventDefault();
								handleCreateNote();
							}}>
							<textarea
								placeholder="Content"
								onChange={(e) => setNoteContent(e.target.value)}
							></textarea>
							<div className = "notif">{notif}</div>
							<Button type="submit">Save</Button>
							
						</form>
						<br></br>
						<Button onClick={() => setMode(null)}>Back</Button>
					</div>
					
				)}
				{mode === "delete" && (
					<div>
						<p>Delete Menu</p>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								handleDeleteNote();
						}}>			
							<input
								type="number"
								placeholder="Notes ID"
								onChange={(e) => setNoteID(Number(e.target.value))}
							/>
							<div className = "notif">{notif}</div>
							<Button type="submit">Delete</Button>

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
							<div className = "notif">{notif}</div>
							<Button type="submit">Update</Button>
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
