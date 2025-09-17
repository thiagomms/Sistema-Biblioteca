import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, BookOpen, Calendar, User } from 'lucide-react';
import { useLoanStore } from '../../store/loanStore';
import { useBookStore } from '../../store/bookStore';
import { useReaderStore } from '../../store/readerStore';
import { calculateDueDate, formatDate } from '../../lib/utils';
import Button from '../ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';

type LoanFormData = {
  bookId: string;
  readerId: string;
  loanDate: string;
  dueDate: string;
};

const LoanForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getLoan, addLoan } = useLoanStore();
  const { books, fetchBooks } = useBookStore();
  const { readers, fetchReaders } = useReaderStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableBooks, setAvailableBooks] = useState<typeof books>([]);
  const [activeReaders, setActiveReaders] = useState<typeof readers>([]);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<LoanFormData>({
    defaultValues: {
      loanDate: new Date().toISOString().split('T')[0],
      dueDate: calculateDueDate(new Date()).toISOString().split('T')[0]
    }
  });
  
  const isEditMode = !!id;
  const selectedBookId = watch('bookId');
  const selectedBook = books.find(book => book.id === selectedBookId);
  
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchBooks(),
        fetchReaders()
      ]);
    };
    
    loadData();
  }, [fetchBooks, fetchReaders]);
  
  useEffect(() => {
    // Filtrar livros disponíveis
    setAvailableBooks(books.filter(book => book.available > 0));
    
    // Filtrar leitores ativos
    setActiveReaders(readers.filter(reader => reader.active));
    
    // Preencher formulário se estiver no modo edição
    if (isEditMode) {
      const loan = getLoan(id);
      if (loan) {
        reset({
          bookId: loan.bookId,
          readerId: loan.readerId,
          loanDate: new Date(loan.loanDate).toISOString().split('T')[0],
          dueDate: new Date(loan.dueDate).toISOString().split('T')[0]
        });
      }
    }
  }, [books, readers, isEditMode, id, getLoan, reset]);
  
  // Atualizar data de devolução automaticamente quando a data de empréstimo mudar
  const loanDate = watch('loanDate');
  useEffect(() => {
    if (loanDate) {
      const dueDate = calculateDueDate(new Date(loanDate));
      setValue('dueDate', dueDate.toISOString().split('T')[0]);
    }
  }, [loanDate, setValue]);
  
  const onSubmit = async (data: LoanFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!selectedBook || selectedBook.available <= 0) {
        throw new Error('Este livro não está disponível para empréstimo');
      }
      
      await addLoan(data.bookId, data.readerId);
      navigate('/loans');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao registrar o empréstimo');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/loans')} className="mr-4">
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Editar Empréstimo' : 'Novo Empréstimo'}
        </h1>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Informações do Empréstimo</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <BookOpen size={16} className="mr-1" /> Livro
                </label>
                <select
                  className={`w-full p-2 border rounded-md ${errors.bookId ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('bookId', { required: 'Selecione um livro' })}
                >
                  <option value="">Selecione um livro</option>
                  {availableBooks.map(book => (
                    <option key={book.id} value={book.id}>
                      {book.title} ({book.available} disponíveis)
                    </option>
                  ))}
                </select>
                {errors.bookId && (
                  <p className="mt-1 text-sm text-red-600">{errors.bookId.message}</p>
                )}
              </div>
              
              {selectedBook && (
                <div className="p-3 bg-blue-50 rounded-md flex items-start">
                  {selectedBook.coverUrl ? (
                    <img 
                      src={selectedBook.coverUrl} 
                      alt={selectedBook.title} 
                      className="w-12 h-16 object-cover rounded mr-3"
                    />
                  ) : (
                    <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center mr-3">
                      <BookOpen size={20} className="text-gray-500" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium">{selectedBook.title}</h4>
                    <p className="text-sm text-gray-600">ISBN: {selectedBook.isbn}</p>
                    <p className="text-sm text-gray-600">Disponíveis: {selectedBook.available} de {selectedBook.quantity}</p>
                  </div>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <User size={16} className="mr-1" /> Leitor
                </label>
                <select
                  className={`w-full p-2 border rounded-md ${errors.readerId ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('readerId', { required: 'Selecione um leitor' })}
                >
                  <option value="">Selecione um leitor</option>
                  {activeReaders.map(reader => (
                    <option key={reader.id} value={reader.id}>
                      {reader.name} ({reader.email})
                    </option>
                  ))}
                </select>
                {errors.readerId && (
                  <p className="mt-1 text-sm text-red-600">{errors.readerId.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Calendar size={16} className="mr-1" /> Data de Empréstimo
                  </label>
                  <input
                    type="date"
                    className={`w-full p-2 border rounded-md ${errors.loanDate ? 'border-red-500' : 'border-gray-300'}`}
                    {...register('loanDate', { required: 'Data de empréstimo é obrigatória' })}
                  />
                  {errors.loanDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.loanDate.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Calendar size={16} className="mr-1" /> Data de Devolução Prevista
                  </label>
                  <input
                    type="date"
                    className={`w-full p-2 border rounded-md ${errors.dueDate ? 'border-red-500' : 'border-gray-300'}`}
                    {...register('dueDate', { required: 'Data de devolução é obrigatória' })}
                  />
                  {errors.dueDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 rounded-md text-sm text-yellow-800">
                <p className="font-medium">Informações importantes:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>O empréstimo padrão é de 14 dias</li>
                  <li>Ao registrar um empréstimo, a disponibilidade do livro será atualizada automaticamente</li>
                  <li>Certifique-se de que o leitor não possui empréstimos em atraso</li>
                </ul>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/loans')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              <Save size={18} className="mr-1" />
              {isLoading ? 'Registrando...' : 'Registrar Empréstimo'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoanForm;