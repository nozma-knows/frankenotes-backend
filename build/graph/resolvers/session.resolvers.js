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
exports.sessionMutationResolvers = exports.sessionQueryResolvers = void 0;
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.sessionQueryResolvers = {
    session: (parents, args, contextValue) => {
        const { id } = args;
        if (!id) {
            throw new Error("Required parameter is missing.");
        }
        const prisma = new client_1.PrismaClient();
        const session = prisma.session.findUnique({
            where: {
                id,
            },
        });
        if (!session) {
            throw new Error("Can't find session.");
        }
        return session;
    },
};
// Mutation Resolvers for managing a users session
exports.sessionMutationResolvers = {
    // Login Mutation
    login: (parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab args
        const { email, password } = args.input;
        // Grab args error handling
        if (!email || !password) {
            throw new Error("Required parameter is missing.");
        }
        const prisma = new client_1.PrismaClient();
        // Grab login
        const login = yield prisma.login.findUnique({
            where: {
                email: email,
            },
        });
        // Grab login error handling
        if (!login) {
            throw new Error("Invalid email or password");
        }
        // Verify if password is correct
        const correctPassword = yield bcrypt.compare(password, login.hashedPassword);
        // Incorrect password error handling
        if (!correctPassword) {
            throw new Error("Invalid email or password");
        }
        // Grab user
        const user = yield prisma.user.findUnique({
            where: {
                email,
            },
        });
        // Grab user error handling
        if (!user) {
            throw new Error("Grabbing user");
        }
        // Create exiry and set to now + 4 hours
        const date = new Date();
        const expiry = new Date(date.setHours(date.getHours() + 4));
        // Create JWT token
        const token = jwt.sign({
            userId: user.id,
            expiry,
        }, process.env.JWT_PRIVATE_KEY);
        // Create JWT token error handling
        if (!token) {
            throw new Error("Error creating JWT token");
        }
        // If session doesn't exist, create and return session
        return yield prisma.session.create({
            data: {
                token,
            },
        });
    }),
    // Logout Mutaiton
    logout: (parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab userId from context
        const { userId, token } = contextValue;
        // Grab userId error handling
        if (!userId) {
            throw new Error("Must be authenticated to call this endpoint.");
        }
        const prisma = new client_1.PrismaClient();
        // Grab session from token
        const session = yield prisma.session.findUnique({
            where: {
                token,
            },
        });
        if (!session) {
            throw new Error("Session is not valid.");
        }
        const sessionId = session.id;
        if (!sessionId) {
            throw new Error("Session ID missing.");
        }
        // Delete session
        const logout = yield prisma.session.delete({
            where: {
                id: sessionId,
            },
        });
        // Delete session error handling
        if (!logout) {
            throw new Error("Invalid session id");
        }
        // return deleted session
        return logout;
    }),
};
