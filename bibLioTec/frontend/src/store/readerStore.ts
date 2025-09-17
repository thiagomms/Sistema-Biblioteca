import { create } from 'zustand';
import { ReaderState, Reader } from '../types';
import { generateId } from '../lib/utils';

// Dados mockados para demonstração
const mockReaders: Reader[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(11) 98765-4321',
    address: 'Rua das Flores, 123',
    createdAt: new Date('2023-01-15'),
    active: true
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria@email.com',
    phone: '(11) 91234-5678',
    address: 'Av. Paulista, 1000',
    createdAt: new Date('2023-02-20'),
    active: true
  },
  {
    id: '3',
    name: 'Pedro Santos',
    email: 'pedro@email.com',
    phone: '(11) 99876-5432',
    address: 'Rua Augusta, 789',
    createdAt: new Date('2023-03-10'),
    active: false
  }
];

export const useReaderStore = create<ReaderState>((set, get) => ({
  readers: [...mockReaders],
  loading: false,
  error: null,

  fetchReaders: async () => {
    set({ loading: true, error: null });
    
    // Simulando uma chamada de API
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ readers: [...mockReaders], loading: false });
    } catch (error) {
      set({ error: 'Falha ao carregar leitores', loading: false });
    }
  },

  addReader: async (readerData) => {
    set({ loading: true, error: null });
    
    // Simulando uma chamada de API
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newReader: Reader = {
        ...readerData,
        id: generateId(),
        createdAt: new Date(),
      };
      
      set(state => ({ 
        readers: [...state.readers, newReader],
        loading: false 
      }));
      
      return newReader;
    } catch (error) {
      set({ error: 'Falha ao adicionar leitor', loading: false });
      throw error;
    }
  },

  updateReader: async (id, readerData) => {
    set({ loading: true, error: null });
    
    // Simulando uma chamada de API
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedReaders = get().readers.map(reader => 
        reader.id === id ? { ...reader, ...readerData } : reader
      );
      
      set({ readers: updatedReaders, loading: false });
      
      return updatedReaders.find(r => r.id === id) as Reader;
    } catch (error) {
      set({ error: 'Falha ao atualizar leitor', loading: false });
      throw error;
    }
  },

  deleteReader: async (id) => {
    set({ loading: true, error: null });
    
    // Simulando uma chamada de API
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => ({
        readers: state.readers.filter(reader => reader.id !== id),
        loading: false
      }));
      
      return true;
    } catch (error) {
      set({ error: 'Falha ao excluir leitor', loading: false });
      return false;
    }
  },

  getReader: (id) => {
    return get().readers.find(reader => reader.id === id);
  }
}));