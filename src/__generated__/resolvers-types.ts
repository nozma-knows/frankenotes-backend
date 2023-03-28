import { GraphQLResolveInfo } from "graphql";
import { Context } from "../graph/resolvers/types";
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CreateLoginInput = {
  email: Scalars["String"];
  firstName: Scalars["String"];
  lastName: Scalars["String"];
  password: Scalars["String"];
  passwordConfirmation: Scalars["String"];
};

export type CreateNotesQueryInput = {
  authorId: Scalars["ID"];
  query: Scalars["String"];
};

export type Login = {
  __typename?: "Login";
  email: Scalars["String"];
  id: Scalars["ID"];
  user: User;
};

export type LoginInput = {
  email: Scalars["String"];
  password: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  createLogin: Login;
  createNote: Note;
  createNotesQuery: NotesQuery;
  deleteNote: Note;
  deleteNotesQueries: Scalars["Boolean"];
  deleteNotesQuery: NotesQuery;
  login: Session;
  logout: Session;
  updateNote: Note;
  updateNotesQuery: NotesQuery;
};

export type MutationCreateLoginArgs = {
  input: CreateLoginInput;
};

export type MutationCreateNoteArgs = {
  input: NoteInput;
};

export type MutationCreateNotesQueryArgs = {
  input: CreateNotesQueryInput;
};

export type MutationDeleteNoteArgs = {
  id: Scalars["String"];
};

export type MutationDeleteNotesQueriesArgs = {
  authorId: Scalars["String"];
};

export type MutationDeleteNotesQueryArgs = {
  id: Scalars["String"];
};

export type MutationLoginArgs = {
  input: LoginInput;
};

export type MutationUpdateNoteArgs = {
  id: Scalars["String"];
  input: NoteInput;
};

export type MutationUpdateNotesQueryArgs = {
  id: Scalars["String"];
  input: UpdateNotesQueryInput;
};

export type Note = {
  __typename?: "Note";
  author: User;
  authorId: Scalars["String"];
  createdAt: Scalars["String"];
  editorState: Scalars["String"];
  id: Scalars["ID"];
  title?: Maybe<Scalars["String"]>;
  updatedAt: Scalars["String"];
};

export type NoteInput = {
  authorId: Scalars["ID"];
  editorState: Scalars["String"];
  title?: InputMaybe<Scalars["String"]>;
};

export type NotesQuery = {
  __typename?: "NotesQuery";
  author: User;
  authorId: Scalars["String"];
  createdAt: Scalars["String"];
  id: Scalars["ID"];
  query: Scalars["String"];
  response?: Maybe<Scalars["String"]>;
  status?: Maybe<NotesQueryStatus>;
  updatedAt: Scalars["String"];
};

export enum NotesQueryStatus {
  Error = "ERROR",
  Pending = "PENDING",
  Successful = "SUCCESSFUL",
}

export type Query = {
  __typename?: "Query";
  note?: Maybe<Note>;
  notes?: Maybe<Array<Maybe<Note>>>;
  notesQueries?: Maybe<Array<Maybe<NotesQuery>>>;
  session?: Maybe<Session>;
  users?: Maybe<Array<Maybe<User>>>;
};

export type QueryNoteArgs = {
  id: Scalars["String"];
};

export type QueryNotesArgs = {
  authorId: Scalars["String"];
};

export type QueryNotesQueriesArgs = {
  authorId: Scalars["String"];
};

export type QuerySessionArgs = {
  id: Scalars["String"];
};

export type Session = {
  __typename?: "Session";
  id: Scalars["ID"];
  token: Scalars["String"];
};

export type UpdateNotesQueryInput = {
  response: Scalars["String"];
};

export type User = {
  __typename?: "User";
  email?: Maybe<Scalars["String"]>;
  emailVerified?: Maybe<Scalars["Boolean"]>;
  firstName?: Maybe<Scalars["String"]>;
  id: Scalars["ID"];
  lastName?: Maybe<Scalars["String"]>;
  notes?: Maybe<Array<Maybe<Note>>>;
  notesQueries?: Maybe<Array<Maybe<NotesQuery>>>;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  CreateLoginInput: CreateLoginInput;
  CreateNotesQueryInput: CreateNotesQueryInput;
  ID: ResolverTypeWrapper<Scalars["ID"]>;
  Login: ResolverTypeWrapper<Login>;
  LoginInput: LoginInput;
  Mutation: ResolverTypeWrapper<{}>;
  Note: ResolverTypeWrapper<Note>;
  NoteInput: NoteInput;
  NotesQuery: ResolverTypeWrapper<NotesQuery>;
  NotesQueryStatus: NotesQueryStatus;
  Query: ResolverTypeWrapper<{}>;
  Session: ResolverTypeWrapper<Session>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  UpdateNotesQueryInput: UpdateNotesQueryInput;
  User: ResolverTypeWrapper<User>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars["Boolean"];
  CreateLoginInput: CreateLoginInput;
  CreateNotesQueryInput: CreateNotesQueryInput;
  ID: Scalars["ID"];
  Login: Login;
  LoginInput: LoginInput;
  Mutation: {};
  Note: Note;
  NoteInput: NoteInput;
  NotesQuery: NotesQuery;
  Query: {};
  Session: Session;
  String: Scalars["String"];
  UpdateNotesQueryInput: UpdateNotesQueryInput;
  User: User;
}>;

export type LoginResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Login"] = ResolversParentTypes["Login"]
> = ResolversObject<{
  email?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  user?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"]
> = ResolversObject<{
  createLogin?: Resolver<
    ResolversTypes["Login"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateLoginArgs, "input">
  >;
  createNote?: Resolver<
    ResolversTypes["Note"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateNoteArgs, "input">
  >;
  createNotesQuery?: Resolver<
    ResolversTypes["NotesQuery"],
    ParentType,
    ContextType,
    RequireFields<MutationCreateNotesQueryArgs, "input">
  >;
  deleteNote?: Resolver<
    ResolversTypes["Note"],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteNoteArgs, "id">
  >;
  deleteNotesQueries?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteNotesQueriesArgs, "authorId">
  >;
  deleteNotesQuery?: Resolver<
    ResolversTypes["NotesQuery"],
    ParentType,
    ContextType,
    RequireFields<MutationDeleteNotesQueryArgs, "id">
  >;
  login?: Resolver<
    ResolversTypes["Session"],
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, "input">
  >;
  logout?: Resolver<ResolversTypes["Session"], ParentType, ContextType>;
  updateNote?: Resolver<
    ResolversTypes["Note"],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateNoteArgs, "id" | "input">
  >;
  updateNotesQuery?: Resolver<
    ResolversTypes["NotesQuery"],
    ParentType,
    ContextType,
    RequireFields<MutationUpdateNotesQueryArgs, "id" | "input">
  >;
}>;

export type NoteResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Note"] = ResolversParentTypes["Note"]
> = ResolversObject<{
  author?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  authorId?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  editorState?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type NotesQueryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["NotesQuery"] = ResolversParentTypes["NotesQuery"]
> = ResolversObject<{
  author?: Resolver<ResolversTypes["User"], ParentType, ContextType>;
  authorId?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  query?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  response?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  status?: Resolver<
    Maybe<ResolversTypes["NotesQueryStatus"]>,
    ParentType,
    ContextType
  >;
  updatedAt?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Query"] = ResolversParentTypes["Query"]
> = ResolversObject<{
  note?: Resolver<
    Maybe<ResolversTypes["Note"]>,
    ParentType,
    ContextType,
    RequireFields<QueryNoteArgs, "id">
  >;
  notes?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Note"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryNotesArgs, "authorId">
  >;
  notesQueries?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["NotesQuery"]>>>,
    ParentType,
    ContextType,
    RequireFields<QueryNotesQueriesArgs, "authorId">
  >;
  session?: Resolver<
    Maybe<ResolversTypes["Session"]>,
    ParentType,
    ContextType,
    RequireFields<QuerySessionArgs, "id">
  >;
  users?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["User"]>>>,
    ParentType,
    ContextType
  >;
}>;

export type SessionResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["Session"] = ResolversParentTypes["Session"]
> = ResolversObject<{
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  token?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserResolvers<
  ContextType = Context,
  ParentType extends ResolversParentTypes["User"] = ResolversParentTypes["User"]
> = ResolversObject<{
  email?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  emailVerified?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  firstName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  notes?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Note"]>>>,
    ParentType,
    ContextType
  >;
  notesQueries?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["NotesQuery"]>>>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  Login?: LoginResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Note?: NoteResolvers<ContextType>;
  NotesQuery?: NotesQueryResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Session?: SessionResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
}>;
