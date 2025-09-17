export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'librarian';
  password?: string;
}

export interface Reader {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  active: boolean;
}

export interface Author {
  id: string;
  name: string;
  nationality: string;
  birthDate?: string;
  biography?: string;
}

export interface Book {
  id: string;
  title: string;
  publishedYear: number;
  available: boolean;
  author: string | null;
  category: string | null;
  authorId: string;
}

export interface Loan {
  id: string;
  bookId: string;
  readerId: string;
  loanDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'active' | 'returned' | 'overdue';
}

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export type ReaderState = {
  readers: Reader[];
  loading: boolean;
  error: string | null;
  fetchReaders: () => Promise<void>;
  addReader: (reader: Omit<Reader, 'id' | 'createdAt'>) => Promise<Reader>;
  updateReader: (id: string, reader: Partial<Reader>) => Promise<Reader>;
  deleteReader: (id: string) => Promise<boolean>;
  getReader: (id: string) => Reader | undefined;
}

export type BookState = {
  books: Book[];
  loading: boolean;
  error: string | null;
  fetchBooks: () => Promise<void>;
  addBook: (book: Omit<Book, 'id'>) => Promise<Book>;
  updateBook: (id: string, book: Partial<Book>) => Promise<Book>;
  deleteBook: (id: string) => Promise<boolean>;
  getBook: (id: string) => Book | undefined;
}

export type AuthorState = {
  authors: Author[];
  loading: boolean;
  error: string | null;
  fetchAuthors: () => Promise<void>;
  addAuthor: (author: Omit<Author, 'id'>) => Promise<Author>;
  updateAuthor: (id: string, author: Partial<Author>) => Promise<Author>;
  deleteAuthor: (id: string) => Promise<boolean>;
  getAuthor: (id: string) => Author | undefined;
}

export type LoanState = {
  loans: Loan[];
  loading: boolean;
  error: string | null;
  fetchLoans: () => Promise<void>;
  addLoan: (bookId: string, readerId: string) => Promise<Loan>;
  returnBook: (id: string) => Promise<Loan>;
  getLoan: (id: string) => Loan | undefined;
}