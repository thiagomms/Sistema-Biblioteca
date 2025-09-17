import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ArrowUpRight, CheckCircle } from 'lucide-react';
import { useLoanStore, updateOverdueLoans } from '../../store/loanStore';
import { useBookStore } from '../../store/bookStore';
import { useReaderStore } from '../../store/readerStore';
import { formatDate, isOverdue } from '../../lib/utils';
import Button from '../ui/Button';
import Input from '../ui/Input';

const LoanList: React.FC = () => {
  const { loans, fetchLoans, loading, returnBook } = useLoanStore();
  const { books, fetchBooks } = useBookStore();
  const { readers, fetchReaders } = useReaderStore();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchLoans(),
        fetchBooks(),
        fetchReaders()
      ]);
      
      // Atualizar status de empréstimos atrasados
      updateOverdueLoans();
    };
    
    loadData();
  }, [fetchLoans, fetchBooks, fetchReaders]);
  
  const filteredLoans = loans.filter(loan => {
    const book = books.find(b => b.id === loan.bookId);
    const reader = readers.find(r => r.id === loan.readerId);
    
    return (
      (book && book.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (reader && reader.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      loan.status.includes(searchTerm.toLowerCase())
    );
  });
  
  const handleReturn = async (id: string) => {
    if (window.confirm('Confirmar a devolução do livro?')) {
      setIsProcessing(true);
      await returnBook(id);
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Empréstimos</h1>
        <Button 
          onClick={() => navigate('/loans/new')}
          className="flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Novo Empréstimo
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar empréstimos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              fullWidth
            />
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {filteredLoans.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">Livro</th>
                      <th className="px-6 py-3">Leitor</th>
                      <th className="px-6 py-3">Data de Empréstimo</th>
                      <th className="px-6 py-3">Data de Devolução</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLoans.map((loan) => {
                      const book = books.find(b => b.id === loan.bookId);
                      const reader = readers.find(r => r.id === loan.readerId);
                      const isLate = loan.status === 'active' && isOverdue(loan.dueDate);
                      
                      return (
                        <tr key={loan.id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 font-medium">
                            {book?.title || 'Livro desconhecido'}
                          </td>
                          <td className="px-6 py-4">
                            {reader?.name || 'Leitor desconhecido'}
                          </td>
                          <td className="px-6 py-4">
                            {formatDate(loan.loanDate)}
                          </td>
                          <td className="px-6 py-4">
                            {loan.returnDate ? formatDate(loan.returnDate) : formatDate(loan.dueDate)}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${loan.status === 'active' && !isLate
                                ? 'bg-green-100 text-green-800' 
                                : loan.status === 'active' && isLate 
                                ? 'bg-yellow-100 text-yellow-800'
                                : loan.status === 'overdue' 
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {loan.status === 'active' && !isLate && 'Ativo'}
                              {loan.status === 'active' && isLate && 'Em atraso'}
                              {loan.status === 'overdue' && 'Atrasado'}
                              {loan.status === 'returned' && 'Devolvido'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {loan.status !== 'returned' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleReturn(loan.id)}
                                disabled={isProcessing}
                                className="mr-1"
                              >
                                <CheckCircle size={16} className="text-green-500 mr-1" />
                                Devolver
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/loans/${loan.id}`)}
                            >
                              <ArrowUpRight size={16} />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">
                  {searchTerm ? 'Nenhum empréstimo encontrado para a busca' : 'Nenhum empréstimo registrado'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LoanList;