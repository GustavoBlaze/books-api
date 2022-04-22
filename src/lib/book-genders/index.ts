import { gql } from 'apollo-server';

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

  // public getBooksByGenderId(genderId: String): Book[] {}
}

export const Controller = new BookGenderController();

export const graphql = {
  typeDef: gql`
    type BookGender {
      id: ID!
      name: String!
    }

    type Query {
      bookGenders: [BookGender!]
      bookGender(id: ID!): BookGender!
      getBooksByGenderId(id: ID): [Book!]
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

  customResolvers: {},
};
