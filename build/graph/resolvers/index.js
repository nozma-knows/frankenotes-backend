"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const login_resolvers_1 = require("./login.resolvers");
const session_resolvers_1 = require("./session.resolvers");
const user_resolvers_1 = require("./user.resolvers");
exports.resolvers = {
    Query: Object.assign(Object.assign({}, session_resolvers_1.sessionQueryResolvers), user_resolvers_1.userQueryResolvers),
    Mutation: Object.assign(Object.assign({}, login_resolvers_1.loginMutationResolvers), session_resolvers_1.sessionMutationResolvers),
};
