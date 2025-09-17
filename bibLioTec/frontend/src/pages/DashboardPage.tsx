import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, BookMarked, BookCheck, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useBookStore } from '../store/bookStore';
import { useReaderStore } from '../store/readerStore';
import { useAuthorStore } from '../store/authorStore';
import { useLoanStore } from '../store/loanStore';
import { formatDate, isOverdue } from '../lib/utils';

const DashboardPage: React.FC = () => {
  const { books, fetchBooks } = useBookStore();
  const { readers, fetchReaders } = useReaderStore();
  const { authors, fetchAuthors } = useAuthorStore();
  const { loans, fetchLoans } = useLoanStore();
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchBooks(),
        fetchReaders(),
        fetchAuthors(),
        fetchLoans()
      ]);
      setIsLoading(false);
    };
    
    loadData();
  }, [fetchBooks, fetchReaders, fetchAuthors, fetchLoans]);
  
  // Calcular estatísticas
  const totalBooks = books.reduce((sum, book) => sum + book.quantity, 0);
  const availableBooks = books.reduce((sum, book) => sum + book.available, 0);
  const activeReaders = readers.filter(reader => reader.active).length;
  const activeLoans = loans.filter(loan => loan.status === 'active').length;
  const overdueLoans = loans.filter(loan => loan.status === 'overdue' || 
    (loan.status === 'active' && isOverdue(loan.dueDate))).length;
  
  // Últimos empréstimos
  const recentLoans = [...loans]
    .sort((a, b) => new Date(b.loanDate).getTime() - new Date(a.loanDate).getTime())
    .slice(0, 5);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Bem-vindo ao sistema de gerenciamento da biblioteca</p>
      </div>
      
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="py-5 flex justify-between items-center">
            <div>
              <p className="text-blue-100">Total de Livros</p>
              <h3 className="text-3xl font-bold">{totalBooks}</h3>
              <p className="text-sm text-blue-100 mt-1">{availableBooks} disponíveis</p>
            </div>
            <BookOpen size={40} className="text-blue-100 opacity-80" />
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="py-5 flex justify-between items-center">
            <div>
              <p className="text-green-100">Leitores Ativos</p>
              <h3 className="text-3xl font-bold">{activeReaders}</h3>
              <p className="text-sm text-green-100 mt-1">de {readers.length} cadastrados</p>
            </div>
            <Users size={40} className="text-green-100 opacity-80" />
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="py-5 flex justify-between items-center">
            <div>
              <p className="text-purple-100">Autores</p>
              <h3 className="text-3xl font-bold">{authors.length}</h3>
              <p className="text-sm text-purple-100 mt-1">cadastrados no sistema</p>
            </div>
            <BookMarked size={40} className="text-purple-100 opacity-80" />
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
          <CardContent className="py-5 flex justify-between items-center">
            <div>
              <p className="text-amber-100">Empréstimos Ativos</p>
              <h3 className="text-3xl font-bold">{activeLoans}</h3>
              <p className="text-sm text-amber-100 mt-1">{overdueLoans} em atraso</p>
            </div>
            <BookCheck size={40} className="text-amber-100 opacity-80" />
          </CardContent>
        </Card>
      </div>
      
      {/* Últimos empréstimos */}
      <Card>
        <CardHeader>
          <CardTitle>Empréstimos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {recentLoans.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">Livro</th>
                    <th className="px-4 py-3">Leitor</th>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3">Vencimento</th>
                    <th className="px-4 py-3 rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLoans.map(loan => {
                    const book = books.find(b => b.id === loan.bookId);
                    const reader = readers.find(r => r.id === loan.readerId);
                    
                    return (
                      <tr 
                        key={loan.id} 
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/loans/${loan.id}`)}
                      >
                        <td className="px-4 py-3">{book?.title || 'Livro desconhecido'}</td>
                        <td className="px-4 py-3">{reader?.name || 'Leitor desconhecido'}</td>
                        <td className="px-4 py-3">{formatDate(loan.loanDate)}</td>
                        <td className="px-4 py-3">{formatDate(loan.dueDate)}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${loan.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : loan.status === 'overdue' 
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {loan.status === 'active' && <Clock size={12} className="mr-1" />}
                            {loan.status === 'active' ? 'Ativo' : 
                             loan.status === 'overdue' ? 'Atrasado' : 'Devolvido'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Nenhum empréstimo registrado</p>
          )}
        </CardContent>
      </Card>
      
      {/* Ações rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button 
          onClick={() => navigate('/books/new')}
          className="p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center"
        >
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-3">
            <BookOpen size={20} />
          </div>
          <span className="font-medium">Adicionar Livro</span>
        </button>
        
        <button 
          onClick={() => navigate('/readers/new')}
          className="p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center"
        >
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-3">
            <Users size={20} />
          </div>
          <span className="font-medium">Novo Leitor</span>
        </button>
        
        <button 
          onClick={() => navigate('/authors/new')}
          className="p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center"
        >
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-3">
            <BookMarked size={20} />
          </div>
          <span className="font-medium">Cadastrar Autor</span>
        </button>
        
        <button 
          onClick={() => navigate('/loans/new')}
          className="p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center"
        >
          <div className="p-3 rounded-full bg-amber-100 text-amber-600 mr-3">
            <BookCheck size={20} />
          </div>
          <span className="font-medium">Registrar Empréstimo</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;