import {
  LoginResolvers,
  CreateLoginInput,
} from "./../../__generated__/resolvers-types";
import { PrismaClient } from "@prisma/client";
const bcrypt = require("bcrypt");
const crypto = require("crypto");

export const loginMutationResolvers: LoginResolvers = {
  // Create Login Mutation Resolver
  createLogin: async (_parent: any, args: { input: CreateLoginInput }) => {
    // Grab args
    const { firstName, lastName, email, password } = args.input;

    // Grab args error handling
    if (!firstName || !lastName || !email || !password) {
      throw new Error("Required parameter is missing.");
    }
    const prisma = new PrismaClient();
    // Create user
    const user = await prisma.user.create({
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
    const hashedPassword = await bcrypt.hash(password, 10);

    // Hash password error handling
    if (!hashedPassword) {
      throw new Error("Error hashing password.");
    }

    // Create login
    const login = await prisma.login.create({
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
  },
};
