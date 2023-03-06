import {
  SessionResolvers,
  LoginInput,
  Session,
  // LogoutInput,
} from "./../../__generated__/resolvers-types";
import { PrismaClient } from "@prisma/client";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

export const sessionQueryResolvers: SessionResolvers = {
  session: (parents: any, args: { id: string }, contextValue: any) => {
    const { id } = args;

    if (!id) {
      throw new Error("Required parameter is missing.");
    }

    const prisma = new PrismaClient();

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
export const sessionMutationResolvers: SessionResolvers = {
  // Login Mutation
  login: async (
    parent: any,
    args: { input: LoginInput },
    contextValue: any
  ) => {
    // Grab args
    const { email, password } = args.input;

    // Grab args error handling
    if (!email || !password) {
      throw new Error("Required parameter is missing.");
    }
    const prisma = new PrismaClient();

    // Grab login
    const login = await prisma.login.findUnique({
      where: {
        email: email,
      },
    });

    // Grab login error handling
    if (!login) {
      throw new Error("Invalid email or password");
    }

    // Verify if password is correct
    const correctPassword = await bcrypt.compare(
      password,
      login.hashedPassword
    );

    // Incorrect password error handling
    if (!correctPassword) {
      throw new Error("Invalid email or password");
    }

    // Grab user
    const user = await prisma.user.findUnique({
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
    const token = jwt.sign(
      {
        userId: user.id,
        expiry,
      },
      process.env.JWT_PRIVATE_KEY
    );

    // Create JWT token error handling
    if (!token) {
      throw new Error("Error creating JWT token");
    }

    // If session doesn't exist, create and return session
    return await prisma.session.create({
      data: {
        token,
      },
    });
  },

  // Logout Mutaiton
  logout: async (parent: any, args: any, contextValue: any) => {
    // Grab userId from context
    const { userId, token } = contextValue;

    // Grab userId error handling
    if (!userId) {
      throw new Error("Must be authenticated to call this endpoint.");
    }

    const prisma = new PrismaClient();

    // Grab session from token
    const session = await prisma.session.findUnique({
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
    const logout = await prisma.session.delete({
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
  },
};
