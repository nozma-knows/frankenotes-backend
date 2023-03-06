import { loginMutationResolvers } from "./login.resolvers";
import {
  sessionQueryResolvers,
  sessionMutationResolvers,
} from "./session.resolvers";
import { userQueryResolvers } from "./user.resolvers";

export const resolvers: any = {
  Query: {
    ...sessionQueryResolvers,
    ...userQueryResolvers,
  },
  Mutation: {
    ...loginMutationResolvers,
    ...sessionMutationResolvers,
  },
};
