import { loginMutationResolvers } from "./login.resolvers";
import {
  sessionQueryResolvers,
  sessionMutationResolvers,
} from "./session.resolvers";
import { userQueryResolvers } from "./user.resolvers";
import { noteQueryResolvers, noteMutationResolvers } from "./note.resolvers";

export const resolvers: any = {
  Query: {
    ...sessionQueryResolvers,
    ...userQueryResolvers,
    ...noteQueryResolvers,
  },
  Mutation: {
    ...loginMutationResolvers,
    ...sessionMutationResolvers,
    ...noteMutationResolvers,
  },
};
