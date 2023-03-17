"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteMutationResolvers = exports.noteQueryResolvers = void 0;
const client_1 = require("@prisma/client");
const crypto = require("crypto");
exports.noteQueryResolvers = {
    note: (parents, args) => {
        const prisma = new client_1.PrismaClient();
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
    notes: (parents, args) => __awaiter(void 0, void 0, void 0, function* () {
        const prisma = new client_1.PrismaClient();
        const { authorId } = args;
        if (!authorId) {
            throw new Error("Required parameter is missing.");
        }
        const notes = yield prisma.note.findMany({
            where: { authorId },
        });
        const sortedNotes = notes.sort((a, b) => a.updatedAt > b.updatedAt ? -1 : 1);
        return sortedNotes;
    }),
};
exports.noteMutationResolvers = {
    // Create Note Mutation Resolver
    createNote: (_parent, args) => __awaiter(void 0, void 0, void 0, function* () {
        const prisma = new client_1.PrismaClient();
        // // Grab args
        const { authorId, title } = args.input;
        // Grab args error handling
        if (!authorId) {
            console.log("authorId: ", authorId);
            throw new Error("Required parameter is missing.");
        }
        // Create note
        const note = yield prisma.note.create({
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
    }),
    updateNote: (_parent, args) => __awaiter(void 0, void 0, void 0, function* () {
        const prisma = new client_1.PrismaClient();
        const { id } = args;
        const { authorId, title, content } = args.input;
        // Grab args error handling
        if (!id || !authorId) {
            throw new Error("Required parameter is missing.");
        }
        // Create note
        const updatedNote = yield prisma.note.update({
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
    }),
    deleteNote: (_parent, args) => __awaiter(void 0, void 0, void 0, function* () {
        const prisma = new client_1.PrismaClient();
        // Grab args
        const { id } = args;
        // Grab args error handling
        if (!id) {
            throw new Error("Required parameter is missing.");
        }
        // Delete note
        const deletedNote = yield prisma.note.delete({
            where: {
                id,
            },
        });
        // Deleted note error handling
        if (!deletedNote) {
            throw new Error("Error updating note.");
        }
        return deletedNote;
    }),
};
