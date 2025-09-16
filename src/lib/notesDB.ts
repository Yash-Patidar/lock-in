import Dexie, { Table } from 'dexie';

export interface StickyNote {
  id?: number;
  title: string;
  content: string;
  color: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  createdAt: Date;
  updatedAt: Date;
  pinned: boolean;
  tags: string[];
}

export class NotesDatabase extends Dexie {
  stickyNotes!: Table<StickyNote>;

  constructor() {
    super('NotesDatabase');
    this.version(1).stores({
      stickyNotes: '++id, title, content, color, createdAt, updatedAt, pinned, tags'
    });
  }
}

export const db = new NotesDatabase();

export const notesService = {
  async getAllNotes(): Promise<StickyNote[]> {
    return await db.stickyNotes.orderBy('updatedAt').reverse().toArray();
  },

  async createNote(note: Omit<StickyNote, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const now = new Date();
    return await db.stickyNotes.add({
      ...note,
      createdAt: now,
      updatedAt: now
    });
  },

  async updateNote(id: number, updates: Partial<StickyNote>): Promise<void> {
    await db.stickyNotes.update(id, {
      ...updates,
      updatedAt: new Date()
    });
  },

  async deleteNote(id: number): Promise<void> {
    await db.stickyNotes.delete(id);
  },

  async searchNotes(query: string): Promise<StickyNote[]> {
    return await db.stickyNotes
      .filter(note =>
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase()) ||
        note.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
      .toArray();
  },

  async getNotesByTag(tag: string): Promise<StickyNote[]> {
    return await db.stickyNotes
      .filter(note => note.tags.includes(tag))
      .toArray();
  }
};