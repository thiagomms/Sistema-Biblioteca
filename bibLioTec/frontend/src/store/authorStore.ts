import { create } from 'zustand';
import { AuthorState, Author } from '../types';
import { generateId } from '../lib/utils';

// Dados mockados para demonstração
const mockAuthors: Author[] = [
  {
    id: '1',
    name: 'Machado de Assis',
    nationality: 'Brasil',
    birthDate: '1839-06-21',
    biography: 'Joaquim Maria Machado de Assis foi um escritor brasileiro, considerado por muitos críticos o maior nome da literatura brasileira.'
  },
  {
    id: '2',
    name: 'George Orwell',
    nationality: 'Reino Unido',
    birthDate: '1903-06-25',
    biography: 'Eric Arthur Blair, mais conhecido pelo pseudônimo George Orwell, foi um escritor, jornalista e crítico inglês.'
  },
  {
    id: '3',
    name: 'Gabriel García Márquez',
    nationality: 'Colômbia',
    birthDate: '1927-03-06',
    biography: 'Gabriel José García Márquez foi um escritor, jornalista, editor, ativista e político colombiano.'
  }
];

export const useAuthorStore = create<AuthorState>((set, get) => ({
  authors: [...mockAuthors],
  loading: false,
  error: null,

  fetchAuthors: async () => {
    set({ loading: true, error: null });
    
    // Simulando uma chamada de API
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ authors: [...mockAuthors], loading: false });
    } catch (error) {
      set({ error: 'Falha ao carregar autores', loading: false });
    }
  },

  addAuthor: async (authorData) => {
    set({ loading: true, error: null });
    
    // Simulando uma chamada de API
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newAuthor: Author = {
        ...authorData,
        id: generateId(),
      };
      
      set(state => ({ 
        authors: [...state.authors, newAuthor],
        loading: false 
      }));
      
      return newAuthor;
    } catch (error) {
      set({ error: 'Falha ao adicionar autor', loading: false });
      throw error;
    }
  },

  updateAuthor: async (id, authorData) => {
    set({ loading: true, error: null });
    
    // Simulando uma chamada de API
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedAuthors = get().authors.map(author => 
        author.id === id ? { ...author, ...authorData } : author
      );
      
      set({ authors: updatedAuthors, loading: false });
      
      return updatedAuthors.find(a => a.id === id) as Author;
    } catch (error) {
      set({ error: 'Falha ao atualizar autor', loading: false });
      throw error;
    }
  },

  deleteAuthor: async (id) => {
    set({ loading: true, error: null });
    
    // Simulando uma chamada de API
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        authors: state.authors.filter(author => author.id !== id),
        loading: false
      }));
      
      return true;
    } catch (error) {
      set({ error: 'Falha ao excluir autor', loading: false });
      return false;
    }
  },

  getAuthor: (id) => {
    return get().authors.find(author => author.id === id);
  }
}));