import {
  NoteResolvers,
  CreateNoteInput,
} from "./../../__generated__/resolvers-types";
import { PrismaClient } from "@prisma/client";
const Cryptr = require("cryptr");
const crypto = require("crypto");

export const noteQueryResolvers: NoteResolvers = {
  note: async (parents: any, args: { id: string }) => {
    const prisma = new PrismaClient();
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
    console.log("note - note: ", note);
    const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);
    const decryptedNote = {
      ...note,
      title: cryptr.decrypt(title),
      content: cryptr.decrypt(content),
    };
    console.log("note - decryptedNote: ", decryptedNote);
    if (!decryptedNote) {
      throw new Error("Failed to decrypt note.");
    }

    return note;
  },
  notes: async (parents: any, args: { authorId: string }) => {
    const prisma = new PrismaClient();

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
    console.log("decryptedNotes: ", decryptedNotes);
    return decryptedNotes;
  },
};

export const noteMutationResolvers: NoteResolvers = {
  // Create Note Mutation Resolver
  createNote: async (_parent: any, args: { input: CreateNoteInput }) => {
    // // Grab args
    const { authorId, title } = args.input;

    // Grab args error handling
    if (!authorId) {
      throw new Error("Required parameter is missing.");
    }

    const prisma = new PrismaClient();

    // Encrypt data
    const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);
    const encryptedTitle = cryptr.encrypt(title || "");
    const encryptedContent = cryptr.encrypt("");

    console.log("encryptedContent: ", encryptedContent);

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
  updateNote: async (_parent: any, args: { id: string; input: any }) => {
    const prisma = new PrismaClient();
    const { id } = args;
    const { authorId, title, content } = args.input;
    console.log("updateNote - title, content: ", { title, content });

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
    const prisma = new PrismaClient();
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
};
