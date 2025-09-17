import { create } from 'zustand';
import { LoanState, Loan } from '../types';
import { generateId, calculateDueDate } from '../lib/utils';
import { useBookStore } from './bookStore';

// Dados mockados para demonstração
const mockLoans: Loan[] = [
  {
    id: '1',
    bookId: '1',
    readerId: '1',
    loanDate: new Date('2023-04-01'),
    dueDate: new Date('2023-04-15'),
    status: 'active'
  },
  {
    id: '2',
    bookId: '2',
    readerId: '2',
    loanDate: new Date('2023-03-20'),
    dueDate: new Date('2023-04-03'),
    status: 'overdue'
  },
  {
    id: '3',
    bookId: '3',
    readerId: '1',
    loanDate: new Date('2023-03-10'),
    dueDate: new Date('2023-03-24'),
    returnDate: new Date('2023-03-22'),
    status: 'returned'
  }
];

export const useLoanStore = create<LoanState>((set, get) => ({
  loans: [...mockLoans],
  loading: false,
  error: null,

  fetchLoans: async () => {
    set({ loading: true, error: null });
    
    // Simulando uma chamada de API
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ loans: [...mockLoans], loading: false });
    } catch (error) {
      set({ error: 'Falha ao carregar empréstimos', loading: false });
    }
  },

  addLoan: async (bookId, readerId) => {
    set({ loading: true, error: null });
    
    // Simulando uma chamada de API
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verificar disponibilidade do livro
      const bookStore = useBookStore.getState();
      const book = bookStore.getBook(bookId);
      
      if (!book || book.available <= 0) {
        throw new Error('Livro indisponível para empréstimo');
      }
      
      // Criar novo empréstimo
      const loanDate = new Date();
      const dueDate = calculateDueDate(loanDate);
      
      const newLoan: Loan = {
        id: generateId(),
        bookId,
        readerId,
        loanDate,
        dueDate,
        status: 'active'
      };
      
      // Atualizar quantidade disponível do livro
      await bookStore.updateBook(bookId, {
        available: book.available - 1
      });
      
      set(state => ({ 
        loans: [...state.loans, newLoan],
        loading: false 
      }));
      
      return newLoan;
    } catch (error) {
      set({ error: 'Falha ao registrar empréstimo', loading: false });
      throw error;
    }
  },

  returnBook: async (id) => {
    set({ loading: true, error: null });
    
    // Simulando uma chamada de API
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const loan = get().loans.find(l => l.id === id);
      
      if (!loan) {
        throw new Error('Empréstimo não encontrado');
      }
      
      if (loan.status === 'returned') {
        throw new Error('Livro já foi devolvido');
      }
      
      // Atualizar empréstimo
      const returnDate = new Date();
      const updatedLoan: Loan = {
        ...loan,
        returnDate,
        status: 'returned'
      };
      
      // Atualizar disponibilidade do livro
      const bookStore = useBookStore.getState();
      const book = bookStore.getBook(loan.bookId);
      
      if (book) {
        await bookStore.updateBook(loan.bookId, {
          available: book.available + 1
        });
      }
      
      set(state => ({
        loans: state.loans.map(l => l.id === id ? updatedLoan : l),
        loading: false
      }));
      
      return updatedLoan;
    } catch (error) {
      set({ error: 'Falha ao registrar devolução', loading: false });
      throw error;
    }
  },

  getLoan: (id) => {
    return get().loans.find(loan => loan.id === id);
  }
}));

// Função para atualizar o status de empréstimos atrasados
export const updateOverdueLoans = () => {
  const { loans } = useLoanStore.getState();
  const today = new Date();
  
  const updatedLoans = loans.map(loan => {
    if (loan.status === 'active' && loan.dueDate < today) {
      return { ...loan, status: 'overdue' };
    }
    return loan;
  });
  
  useLoanStore.setState({ loans: updatedLoans });
};