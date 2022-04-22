import { gql, UserInputError } from 'apollo-server';
// eslint-disable-next-line import/no-cycle
import { Controller as BookGenderController } from '../book-genders';

interface IBookUpdate {
  id: string;
  title?: string;
  author?: string;
}

class BookController {
  private _books: Book[] = [
    {
      id: new Date().getTime().toString(),
      title: 'Harry Potter and the Chamber of Secrets',
      author: 'J.K. Rowling',
      genderId: '1234',
    },
  ];

  public get books(): Book[] {
    return this._books;
  }

  public getBookById(id: string): Book {
    const book = this._books.find((b) => b.id === id);

    if (!book) {
      throw new UserInputError('Book not found', {
        argumentName: 'id',
      });
    }

    return book;
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

  public update({ id, title, author }: IBookUpdate): Book {
    const index = this._books.findIndex((b) => b.id === id);

    if (index === -1) {
      throw new UserInputError('Book not found', {
        argumentName: 'id',
      });
    }

    const book = this._books[index];

    if (title) book.title = title;
    if (author) book.author = author;

    return book;
  }

  public destroy(id: string): Boolean {
    const index = this._books.findIndex((b) => b.id === id);

    if (index === -1) {
      throw new UserInputError('Book not found', {
        argumentName: 'id',
      });
    }

    this._books.splice(index, 1);

    return true;
  }
}

export const Controller = new BookController();

export const graphql = {
  typeDef: gql`
    type Book {
      id: ID!
      title: String!
      author: String!
      genderId: ID
      gender: BookGender
    }

    type Query {
      books: [Book!]!
      book(id: ID!): Book!
      searchBook(query: String!): [Book!]
    }

    type Mutation {
      createBook(title: String!, author: String!): Book
      updateBook(id: ID!, title: String, author: String): Book
      deleteBook(id: ID!): Boolean
    }
  `,
  resolvers: {
    Query: {
      books: () => Controller.books,
      book: (_, { id }) => Controller.getBookById(id),
      searchBook: (parent, { query }) => {
        return Controller.search(query);
      },
    },

    Mutation: {
      createBook: (parent, { title, author }) =>
        Controller.create({ title, author }),
      updateBook: (parent, book: IBookUpdate) => Controller.update(book),
      deleteBook: (parent, { id }) => Controller.destroy(id),
    },
  },

  customResolvers: {
    Book: {
      gender(parent) {
        return BookGenderController.getBookGenderById(parent.genderId);
      },
    },
  },
};
