/* eslint-disable no-unused-vars */

declare global {
  type Book = {
    id: string;
    title: string;
    author: string;
    genderId?: string;
  };

  type BookGender = {
    id: string;
    name: string;
  };
}

export {};
