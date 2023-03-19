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
exports.loginMutationResolvers = void 0;
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
exports.loginMutationResolvers = {
    // Create Login Mutation Resolver
    createLogin: (_parent, args) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab args
        const { firstName, lastName, email, password } = args.input;
        // Grab args error handling
        if (!firstName || !lastName || !email || !password) {
            throw new Error("Required parameter is missing.");
        }
        const prisma = new client_1.PrismaClient();
        // Create user
        const user = yield prisma.user.create({
            data: {
                // id: crypto.randomUUID(),
                firstName,
                lastName,
                email,
                emailVerified: false,
            },
        });
        // Create user error handling
        if (!user) {
            throw new Error("User not found.");
        }
        // Hash password
        const hashedPassword = yield bcrypt.hash(password, 10);
        // Hash password error handling
        if (!hashedPassword) {
            throw new Error("Error hashing password.");
        }
        // Create login
        const login = yield prisma.login.create({
            data: {
                id: crypto.randomUUID(),
                email,
                hashedPassword,
                userId: user.id,
            },
        });
        // Create login error handling
        if (!login) {
            throw new Error("Error creating login.");
        }
        // return login
        return login;
    }),
};
