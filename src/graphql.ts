import { DocumentNode } from 'graphql';
import * as Books from './lib/books';
import * as BookGenders from './lib/book-genders';

const entities = [Books, BookGenders];

const typeDefs: DocumentNode[] = [];

const resolvers = {
  Query: {},
  Mutation: {},
};

entities.forEach((entity) => {
  Object.assign(resolvers.Query, entity.graphql.resolvers.Query);
  Object.assign(resolvers.Mutation, entity.graphql.resolvers.Mutation);
  Object.assign(resolvers, entity.graphql.customResolvers);
  typeDefs.push(entity.graphql.typeDef);
});

export { typeDefs, resolvers };
