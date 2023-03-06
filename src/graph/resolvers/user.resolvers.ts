import { UserResolvers } from "../../__generated__/resolvers-types";
import { PrismaClient } from "@prisma/client";

export const userQueryResolvers: UserResolvers = {
  users: () => {
    const prisma = new PrismaClient();
    return prisma.user.findMany();
  },
};
