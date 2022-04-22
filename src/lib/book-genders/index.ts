import { gql } from 'apollo-server';
// eslint-disable-next-line import/no-cycle
import { Controller as BookController } from '../books';

class BookGenderController {
  private _genders: BookGender[] = [
    {
      id: '1234',
      name: 'Fantasia',
    },
  ];

  get genders(): BookGender[] {
    return this._genders;
  }

  public getBookGenderById(id: String): BookGender | undefined {
    const gender = this._genders.find((item) => item.id === id);

    return gender;
  }
}

export const Controller = new BookGenderController();

export const graphql = {
  typeDef: gql`
    type BookGender {
      id: ID!
      name: String!
      books: [Book!]
    }

    type Query {
      bookGenders: [BookGender!]
      bookGender(id: ID!): BookGender!
    }
  `,

  resolvers: {
    Query: {
      bookGenders: () => Controller.genders,
      bookGender: (parent, { id }) => {
        return Controller.getBookGenderById(id);
      },
    },
    Mutation: {},
  },

  customResolvers: {
    BookGender: {
      books(parent) {
        return BookController.books.filter(
          (book) => book.genderId === parent.id,
        );
      },
    },
  },
};
