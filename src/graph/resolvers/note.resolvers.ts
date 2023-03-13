import {
  NoteResolvers,
  CreateNoteInput,
} from "./../../__generated__/resolvers-types";
import { PrismaClient } from "@prisma/client";

const crypto = require("crypto");

export const noteQueryResolvers: NoteResolvers = {
  note: (parents: any, args: { id: string }) => {
    const prisma = new PrismaClient();
    const { id } = args;

    if (!id) {
      throw new Error("Required parameter is missing.");
    }

    const note = prisma.note.findFirst({
      where: {
        id,
      },
    });

    if (!note) {
      throw new Error("Can't find note.");
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
    return sortedNotes;
  },
};

export const noteMutationResolvers: NoteResolvers = {
  // Create Note Mutation Resolver
  createNote: async (_parent: any, args: { input: CreateNoteInput }) => {
    const prisma = new PrismaClient();
    // // Grab args
    const { authorId, title } = args.input;

    // Grab args error handling
    if (!authorId) {
      console.log("authorId: ", authorId);
      throw new Error("Required parameter is missing.");
    }

    // Create note
    const note = await prisma.note.create({
      data: {
        id: crypto.randomUUID(),
        authorId,
        title: title || "",
        content: [""],
      },
    });

    // Create note error handling
    if (!note) {
      throw new Error("Error creating note.");
    }

    return note;
  },
  updateNote: async (_parent: any, args: { id: string; input: any }) => {
    const prisma = new PrismaClient();
    const { id } = args;
    const { authorId, title, content } = args.input;

    // Grab args error handling
    if (!id || !authorId) {
      throw new Error("Required parameter is missing.");
    }

    // Create note
    const updatedNote = await prisma.note.update({
      where: {
        id,
      },
      data: {
        authorId,
        title: title || "",
        content: content || [""],
      },
    });

    // Update note error handling
    if (!updatedNote) {
      throw new Error("Error updating note.");
    }

    return updatedNote;
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
