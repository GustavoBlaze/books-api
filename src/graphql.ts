import * as Books from './lib/books';

export const typeDefs = [Books.graphql.typeDef];

export const resolvers = {
  Query: {
    ...Books.graphql.resolvers.Query,
  },
  Mutation: {
    ...Books.graphql.resolvers.Mutation,
  },
};
