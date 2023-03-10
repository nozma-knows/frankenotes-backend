"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userQueryResolvers = void 0;
const client_1 = require("@prisma/client");
exports.userQueryResolvers = {
    users: () => {
        const prisma = new client_1.PrismaClient();
        return prisma.user.findMany();
    },
};
