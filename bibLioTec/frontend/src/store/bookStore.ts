import { create } from 'zustand';
import { BookState, Book } from '../types';
import { generateId } from '../lib/utils';
import { api } from '../services/api';



export const useBookStore = create<BookState>((set, get) => ({
  books: [],
  loading: false,
  error: null,

  fetchBooks: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/books');
      set({ books: response.data, loading: false });
    } catch (error) {
      set({ error: 'Falha ao carregar livros', loading: false });
    }
  },

  addBook: async (bookData) => {
    set({ loading: true, error: null });
    try {
      if (!bookData.publishedYear || isNaN(Number(bookData.publishedYear))) {
        set({ error: 'Ano de publicação é obrigatório', loading: false });
        throw new Error('Ano de publicação é obrigatório');
      }
      const payload = {
        title: bookData.title,
        publishedYear: Number(bookData.publishedYear),
        authorId: Number(bookData.authorId),
        category: bookData.category,
      };
      const response = await api.post('/books', payload);
      set(state => ({ 
        books: [...state.books, response.data],
        loading: false 
      }));
      return response.data;
    } catch (error) {
      set({ error: 'Falha ao adicionar livro', loading: false });
      throw error;
    }
  },

  updateBook: async (id, bookData) => {
    set({ loading: true, error: null });
    try {
      const payload = {
        title: bookData.title,
        publishedYear: Number(bookData.publishedYear),
        authorId: Number(bookData.authorId),
        category: bookData.category,
      };
      const response = await api.put(`/books/${id}`, payload);
      set(state => ({
        books: state.books.map(book =>
          book.id === id ? response.data : book
        ),
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({ error: 'Falha ao atualizar livro', loading: false });
      throw error;
    }
  },

  deleteBook: async (id) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`/books/${id}`);
      set(state => ({
        books: state.books.filter(book => book.id !== id),
        loading: false
      }));
      return true;
    } catch (error) {
      set({ error: 'Falha ao excluir livro', loading: false });
      return false;
    }
  },

  getBook: (id) => {
    return get().books.find(book => book.id === id);
  }
}));