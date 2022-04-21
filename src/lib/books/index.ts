import { gql } from 'apollo-server';

type Book = {
  id: string;
  title: string;
  author: string;
};

class BookController {
  private _books: Book[] = [
    {
      id: new Date().getTime().toString(),
      title: 'Harry Potter and the Chamber of Secrets',
      author: 'J.K. Rowling',
    },
  ];

  public get books(): Book[] {
    return this._books;
  }

  public search(query: string): Book[] {
    const regex = new RegExp(query.split(' ').join('|'), 'i');

    return this._books.filter((book) => {
      return regex.test(book.title) || regex.test(book.author);
    });
  }

  public create(book: Omit<Book, 'id'>): Book {
    const newBook: Book = {
      id: new Date().getTime().toString(),
      ...book,
    };

    this._books.push(newBook);
    return newBook;
  }
}

export const Controller = new BookController();

export const graphql = {
  typeDef: gql`
    type Book {
      id: ID!
      title: String!
      author: String!
    }

    type Query {
      books: [Book!]!
    }

    type Mutation {
      searchBook(query: String!): [Book!]
      createBook(title: String!, author: String!): Book
    }
  `,
  resolvers: {
    Query: {
      books: () => Controller.books,
    },
    Mutation: {
      searchBook: (_, { query }) => Controller.search(query),
      createBook: (_, { title, author }) =>
        Controller.create({ title, author }),
    },
  },
};
