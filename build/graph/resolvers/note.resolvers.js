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
const resolvers_types_1 = require("./../../__generated__/resolvers-types");
const client_1 = require("@prisma/client");
const Cryptr = require("cryptr");
const crypto = require("crypto");
const prisma = new client_1.PrismaClient();
exports.noteQueryResolvers = {
    note: (parents, args) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = args;
        if (!id) {
            throw new Error("Required parameter is missing.");
        }
        const note = yield prisma.note.findFirst({
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
        const decryptedNote = Object.assign(Object.assign({}, note), { title: cryptr.decrypt(title), content: cryptr.decrypt(content) });
        if (!decryptedNote) {
            throw new Error("Failed to decrypt note.");
        }
        return note;
    }),
    notes: (parents, args) => __awaiter(void 0, void 0, void 0, function* () {
        const { authorId } = args;
        if (!authorId) {
            throw new Error("Required parameter is missing.");
        }
        const notes = yield prisma.note.findMany({
            where: { authorId },
        });
        console.log("notes: ", notes);
        if (notes) {
            const sortedNotes = notes.sort((a, b) => a.updatedAt > b.updatedAt ? -1 : 1);
            const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);
            const decryptedNotes = sortedNotes.map((note) => {
                return Object.assign(Object.assign({}, note), { title: cryptr.decrypt(note.title), content: cryptr.decrypt(note.content) });
            });
            return decryptedNotes;
        }
        else {
            return [];
        }
    }),
    notesQueries: (parents, args) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab args
        const { authorId } = args;
        // Grab args error handling
        if (!authorId) {
            throw new Error("Required parameter is missing.");
        }
        const notesQueries = yield prisma.notesQuery.findMany({
            where: { authorId },
        });
        const sortedNotesQueries = notesQueries.sort((a, b) => a.updatedAt > b.updatedAt ? 1 : -1);
        const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);
        const decryptedNotesQueries = sortedNotesQueries.map((noteQuery) => {
            return Object.assign(Object.assign({}, noteQuery), { query: cryptr.decrypt(noteQuery.query), response: cryptr.decrypt(noteQuery.response) });
        });
        return decryptedNotesQueries;
    }),
};
exports.noteMutationResolvers = {
    // Create Note Mutation Resolver
    // createNote: async (_parent: any, args: { input: CreateNoteInput }) => {
    createNote: (_parent, args) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("CREATE NOTE - CONTENT: ", args.input.content);
        // Grab args
        const { authorId, title, content } = args.input;
        // Grab args error handling
        if (!authorId) {
            throw new Error("Required parameter is missing.");
        }
        // Encrypt data
        const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);
        const encryptedTitle = cryptr.encrypt(title || "");
        console.log("CONTENT: ", content || "");
        const encryptedContent = cryptr.encrypt(content || "");
        console.log("encrypted content: ", encryptedContent);
        // Create note
        const note = yield prisma.note.create({
            data: {
                id: crypto.randomUUID(),
                authorId,
                // ...(title && { title: cryptr.encrypt(title) }),
                // ...(content && { content: cryptr.encrypt(content) }),
                title: encryptedTitle,
                content: encryptedContent,
            },
        });
        // Create note error handling
        if (!note) {
            throw new Error("Error creating note.");
        }
        return Object.assign(Object.assign({}, note), { title: title || "", content: content || "" });
    }),
    updateNote: (_parent, args) => __awaiter(void 0, void 0, void 0, function* () {
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
        const updatedNote = yield prisma.note.update({
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
        return Object.assign(Object.assign({}, updatedNote), { title,
            content });
    }),
    updateNoteTitle: (_parent, args) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, title } = args;
        // Grab args error handling
        if (!id || !title) {
            throw new Error("Required parameter is missing.");
        }
        // Encrypt data
        const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);
        const encryptedTitle = cryptr.encrypt(title);
        // Create note
        const updatedNote = yield prisma.note.update({
            where: {
                id,
            },
            data: {
                title: encryptedTitle,
            },
        });
        // Update note error handling
        if (!updatedNote) {
            throw new Error("Error updating note title.");
        }
        return Object.assign(Object.assign({}, updatedNote), { title });
    }),
    updateNoteContent: (_parent, args) => __awaiter(void 0, void 0, void 0, function* () {
        const { id, content } = args;
        // Grab args error handling
        if (!id || !content) {
            throw new Error("Required parameter is missing.");
        }
        // Encrypt data
        const cryptr = new Cryptr(process.env.CRYPTR_SECRET_KEY);
        const encryptedContent = cryptr.encrypt(content);
        // Create note
        const updatedNote = yield prisma.note.update({
            where: {
                id,
            },
            data: {
                content: encryptedContent,
            },
        });
        // Update note error handling
        if (!updatedNote) {
            throw new Error("Error updating note content.");
        }
        return Object.assign(Object.assign({}, updatedNote), { content });
    }),
    deleteNote: (_parent, args) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab args
        const { id } = args;
        // Grab args error handling
        if (!id) {
            throw new Error("Required parameter is missing.");
        }
        const note = yield prisma.note.findFirst({
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
        const decryptedNote = Object.assign(Object.assign({}, note), { title: cryptr.decrypt(title), content: cryptr.decrypt(content) });
        if (!decryptedNote) {
            throw new Error("Failed to decrypt note.");
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
        return decryptedNote;
    }),
    createNotesQuery: (_parent, args) => __awaiter(void 0, void 0, void 0, function* () {
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
        const notesQuery = yield prisma.notesQuery.create({
            data: {
                id: crypto.randomUUID(),
                authorId,
                query: encryptedQuery,
                response: encryptedResponse,
                status: resolvers_types_1.NotesQueryStatus.Pending,
            },
        });
        // Create note error handling
        if (!notesQuery) {
            throw new Error("Error creating notes query.");
        }
        return Object.assign(Object.assign({}, notesQuery), { query, response: "" });
    }),
    updateNotesQuery: (_parent, args) => __awaiter(void 0, void 0, void 0, function* () {
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
        const updatedNotesQuery = yield prisma.notesQuery.update({
            where: {
                id,
            },
            data: {
                response: encryptedResponse,
                status: resolvers_types_1.NotesQueryStatus.Successful,
            },
        });
        // Update note error handling
        if (!updatedNotesQuery) {
            throw new Error("Error updating notes query.");
        }
        const decryptedQuery = cryptr.decrypt(updatedNotesQuery.query);
        return Object.assign(Object.assign({}, updatedNotesQuery), { query: decryptedQuery, response });
    }),
    deleteNotesQuery: (_parent, args) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab args
        const { id } = args;
        // Grab args error handling
        if (!id) {
            throw new Error("Required parameter is missing.");
        }
        // Delete notes query
        const deletedNotesQuery = yield prisma.notesQuery.delete({
            where: {
                id,
            },
        });
        // Deleted note error handling
        if (!deletedNotesQuery) {
            throw new Error("Error deleting notes query.");
        }
        return deletedNotesQuery;
    }),
};
