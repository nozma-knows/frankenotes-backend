import {
  NoteResolvers,
  CreateNoteInput,
  CreateNotesQueryInput,
  NotesQueryStatus,
  NoteInput,
  UpdateNotesQueryInput,
} from "./../../__generated__/resolvers-types";
import { PrismaClient } from "@prisma/client";
const Cryptr = require("cryptr");
const crypto = require("crypto");

const prisma = new PrismaClient();

export const noteQueryResolvers: NoteResolvers = {
  note: async (parents: any, args: { id: string }) => {
    const { id } = args;

    if (!id) {
      throw new Error("Required parameter is missing.");
    }

    const note = await prisma.note.findFirst({
      where: {
        id,
      },
    });

    // Grab note error handling
    if (!note) {
      throw new Error("Note not found.");
    }

    const { title, content } = note;
    const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);
    const decryptedNote = {
      ...note,
      title: cryptr.decrypt(title),
      content: cryptr.decrypt(content),
    };
    if (!decryptedNote) {
      throw new Error("Failed to decrypt note.");
    }

    return note;
  },
  notes: async (parents: any, args: { authorId: string }) => {
    const { authorId } = args;

    if (!authorId) {
      throw new Error("Required parameter is missing.");
    }

    const notes = await prisma.note.findMany({
      where: { authorId },
    });

    const sortedNotes = notes.sort((a: any, b: any) =>
      a.updatedAt > b.updatedAt ? -1 : 1
    );

    const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);
    const decryptedNotes = sortedNotes.map((note) => {
      return {
        ...note,
        title: cryptr.decrypt(note.title),
        content: cryptr.decrypt(note.content),
      };
    });
    return decryptedNotes;
  },
  notesQueries: async (parents: any, args: { authorId: string }) => {
    // Grab args
    const { authorId } = args;

    // Grab args error handling
    if (!authorId) {
      throw new Error("Required parameter is missing.");
    }

    const notesQueries = await prisma.notesQuery.findMany({
      where: { authorId },
    });

    const sortedNotesQueries = notesQueries.sort((a: any, b: any) =>
      a.updatedAt > b.updatedAt ? 1 : -1
    );

    const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);
    const decryptedNotesQueries = sortedNotesQueries.map((noteQuery) => {
      return {
        ...noteQuery,
        query: cryptr.decrypt(noteQuery.query),
        response: cryptr.decrypt(noteQuery.response),
      };
    });
    return decryptedNotesQueries;
  },
};

export const noteMutationResolvers: NoteResolvers = {
  // Create Note Mutation Resolver
  createNote: async (_parent: any, args: { input: CreateNoteInput }) => {
    // Grab args
    const { authorId, title } = args.input;

    // Grab args error handling
    if (!authorId) {
      throw new Error("Required parameter is missing.");
    }

    // Encrypt data
    const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);
    const encryptedTitle = cryptr.encrypt(title || "");
    const encryptedContent = cryptr.encrypt("");

    // Create note
    const note = await prisma.note.create({
      data: {
        id: crypto.randomUUID(),
        authorId,
        title: encryptedTitle,
        content: encryptedContent,
      },
    });

    // Create note error handling
    if (!note) {
      throw new Error("Error creating note.");
    }

    return {
      ...note,
      title,
      content: "",
    };
  },
  updateNote: async (_parent: any, args: { id: string; input: NoteInput }) => {
    const { id } = args;
    const { authorId, title, content } = args.input;

    // Grab args error handling
    if (!id || !authorId) {
      throw new Error("Required parameter is missing.");
    }

    // Encrypt data
    const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);
    const encryptedTitle = cryptr.encrypt(title || "");
    const encryptedContent = cryptr.encrypt(content || "");

    // Create note
    const updatedNote = await prisma.note.update({
      where: {
        id,
      },
      data: {
        authorId,
        title: encryptedTitle,
        content: encryptedContent,
      },
    });

    // Update note error handling
    if (!updatedNote) {
      throw new Error("Error updating note.");
    }

    return {
      ...updatedNote,
      title,
      content,
    };
  },
  deleteNote: async (_parent: any, args: { id: string }) => {
    // Grab args
    const { id } = args;

    // Grab args error handling
    if (!id) {
      throw new Error("Required parameter is missing.");
    }

    // Delete note
    const deletedNote = await prisma.note.delete({
      where: {
        id,
      },
    });

    // Deleted note error handling
    if (!deletedNote) {
      throw new Error("Error updating note.");
    }

    return deletedNote;
  },
  createNotesQuery: async (
    _parent: any,
    args: { input: CreateNotesQueryInput }
  ) => {
    // // Grab args
    const { authorId, query } = args.input;

    // Grab args error handling
    if (!authorId || !query) {
      throw new Error("Required parameter is missing.");
    }

    // Encrypt data
    const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);
    const encryptedQuery = cryptr.encrypt(query);
    const encryptedResponse = cryptr.encrypt("");

    // Encryption error handling
    if (!encryptedQuery || !encryptedResponse) {
      throw new Error("Failed to encrypt notes query.");
    }

    // Create notes query
    const notesQuery = await prisma.notesQuery.create({
      data: {
        id: crypto.randomUUID(),
        authorId,
        query: encryptedQuery,
        response: encryptedResponse,
        status: NotesQueryStatus.Pending,
      },
    });

    // Create note error handling
    if (!notesQuery) {
      throw new Error("Error creating notes query.");
    }

    return {
      ...notesQuery,
      query,
      response: "",
    };
  },
  updateNotesQuery: async (
    _parent: any,
    args: { id: string; input: UpdateNotesQueryInput }
  ) => {
    // // Grab args
    const { id } = args;
    const { response } = args.input;

    // Grab args error handling
    if (!id || !response) {
      throw new Error("Required parameter is missing.");
    }

    // Encrypt data
    const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);
    const encryptedResponse = cryptr.encrypt(response);

    // Create note
    const updatedNotesQuery = await prisma.notesQuery.update({
      where: {
        id,
      },
      data: {
        response: encryptedResponse,
        status: NotesQueryStatus.Successful,
      },
    });

    // Update note error handling
    if (!updatedNotesQuery) {
      throw new Error("Error updating notes query.");
    }

    const decryptedQuery = cryptr.decrypt(updatedNotesQuery.query);

    return {
      ...updatedNotesQuery,
      query: decryptedQuery,
      response,
    };
  },
  deleteNotesQuery: async (_parent: any, args: { id: string }) => {
    // Grab args
    const { id } = args;

    // Grab args error handling
    if (!id) {
      throw new Error("Required parameter is missing.");
    }

    // Delete notes query
    const deletedNotesQuery = await prisma.notesQuery.delete({
      where: {
        id,
      },
    });

    // Deleted note error handling
    if (!deletedNotesQuery) {
      throw new Error("Error deleting notes query.");
    }

    return deletedNotesQuery;
  },
};
