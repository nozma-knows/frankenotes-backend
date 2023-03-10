import {
  NoteResolvers,
  NoteInput,
} from "./../../__generated__/resolvers-types";
const { prisma } = require("../../prisma/client");
const crypto = require("crypto");

export const noteQueryResolvers: NoteResolvers = {
  note: (parents: any, args: { id: String }) => {
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
  notes: () => {
    return prisma.note.findMany();
  },
};

export const noteMutationResolvers: NoteResolvers = {
  // Create Note Mutation Resolver
  createNote: async (_parent: any, args: { input: NoteInput }) => {
    // Grab args
    const { authorId, title, content } = args.input;
    console.log("args.input: ", { authorId, title, content });

    // Grab args error handling
    if (!authorId || !title || !content) {
      throw new Error("Required parameter is missing.");
    }

    // Create note
    const note = await prisma.note.create({
      data: {
        id: crypto.randomUUID(),
        authorId,
        title,
        content,
      },
    });

    // Create note error handling
    if (!note) {
      throw new Error("Error creating note.");
    }

    return note;
  },
  updateNote: async (_parent: any, args: { id: String; input: NoteInput }) => {
    const { id } = args;
    const { authorId, title, content } = args.input;

    // Grab args error handling
    if (!id || !authorId || !title || !content) {
      throw new Error("Required parameter is missing.");
    }

    // Create note
    const updatedNote = await prisma.note.update({
      where: {
        id,
      },
      data: {
        authorId,
        title,
        content,
      },
    });

    // Update note error handling
    if (!updatedNote) {
      throw new Error("Error updating note.");
    }

    return updatedNote;
  },
  deleteNote: async (_parent: any, args: { id: String }) => {
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
