interface NoteCreateRequest {
	title: string;
	content: string;
	color: string;
}

interface Note extends NoteCreateRequest {
	id: string;
	pinned: boolean;
	createdAt: Date;
	updatedAt: Date;
}

class NotesManager {
	private readonly storageKey = 'notes';

	getNotes(): Note[] {
		const serialized = localStorage.getItem(this.storageKey);
		console.log({ serialized });
		if (!serialized) {
			return [];
		}

		return JSON.parse(serialized);
	}

	createNote(createRequest: NoteCreateRequest) {
		const existingNotes = this.getNotes();

		const note = {
			...createRequest,
			id: this.generateId(16),
			pinned: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const updatedNotes = [...existingNotes, note];

		this.saveNotes(updatedNotes);
	}

	editNote(edit: Partial<Note>) {
		const existingNotes = this.getNotes();
		const wantedNote = existingNotes.find((note) => note.id === edit.id);
		if (!wantedNote) {
			return;
		}

		const updatedNote = {
			...wantedNote,
			...edit,
			updatedAt: new Date(),
		};

		const updatedNotes = existingNotes.map((note) => {
			if (note.id === updatedNote.id) {
				return updatedNote;
			}

			return note;
		});

		this.saveNotes(updatedNotes);
	}

	removeNote(id: string) {
		const existingNotes = this.getNotes();

		const updatedNotes = existingNotes.filter((note) => note.id !== id);

		this.saveNotes(updatedNotes);
	}

	private generateId(length: number) {
		let result = '';

		for (let i = 0; i < length; i++) {
			result += Math.floor(Math.random() * 16).toString(16);
		}

		return result;
	}

	private saveNotes(notes: Note[]) {
		localStorage.setItem(this.storageKey, JSON.stringify(notes));
	}
}

class NotesRenderer {
	constructor(private readonly notesManager: NotesManager) {}

	render() {
		const notesList = document.getElementsByClassName('notes-list')?.[0] as HTMLDivElement;
		if (!notesList) {
			return;
		}

		const notes = this.notesManager.getNotes();
		console.log({ notes });

		notesList.innerHTML = '';
		for (const note of notes) {
			const noteRender = new NoteRender(note);
			const noteElement = noteRender.render();
			notesList.appendChild(noteElement);
		}
	}
}

class NoteRender {
	constructor(private readonly note: Note) {}

	render() {
		const noteElement = document.createElement('div');
		noteElement.classList.add('note');
		noteElement.style.backgroundColor = this.note.color;

		const titleElement = document.createElement('h3');
		titleElement.innerText = this.note.title;
		noteElement.appendChild(titleElement);

		const contentElement = document.createElement('p');
		contentElement.innerText = this.note.content;
		noteElement.appendChild(contentElement);

		noteElement.addEventListener('click', () => {
			console.log('clicked');
			notesManager.removeNote(this.note.id);
			notesRenderer.render();
		});

		return noteElement;
	}
}

let notesManager: NotesManager;
let notesRenderer: NotesRenderer;
document.addEventListener('DOMContentLoaded', () => {
	notesManager = new NotesManager();
	notesRenderer = new NotesRenderer(notesManager);

	notesRenderer.render();
});

const addNote = () => {
	const title = (document.getElementById('note-editor-title') as any).value;
	const content = (document.getElementById('note-editor-body') as any).value;

	notesManager.createNote({
		title,
		content,
		color: 'yellow',
	});
	notesRenderer.render();
};
