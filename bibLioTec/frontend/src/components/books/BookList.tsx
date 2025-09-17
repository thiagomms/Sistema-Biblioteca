import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useBookStore } from '../../store/bookStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useAuthStore } from '../../store/authStore';

const BookList: React.FC = () => {
  const { books, fetchBooks, loading, deleteBook } = useBookStore();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuthStore();
  
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Filtro apenas pelos campos existentes
  const filteredBooks = (books || []).filter(book => {
    const titleMatch = book.title.toLowerCase().includes(searchTerm.toLowerCase());
    const authorMatch = (book.author ? book.author.toLowerCase() : '').includes(searchTerm.toLowerCase());
    const categoryMatch = (book.category ? book.category.toLowerCase() : '').includes(searchTerm.toLowerCase());
    return titleMatch || authorMatch || categoryMatch;
  });
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este livro?')) {
      setIsDeleting(true);
      await deleteBook(id);
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Livros</h1>
        {user?.role === 'admin' && (
          <Button 
            onClick={() => navigate('/books/new')}
            className="flex items-center"
          >
            <Plus size={18} className="mr-1" />
            Novo Livro
          </Button>
        )}
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar livros..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
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
            {filteredBooks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">Título</th>
                      <th className="px-6 py-3">Autor</th>
                      <th className="px-6 py-3">Ano</th>
                      <th className="px-6 py-3">Categoria</th>
                      <th className="px-6 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(filteredBooks).map((book) => (
                      <tr key={book.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{book.title}</td>
                        <td className="px-6 py-4">{book.author || 'Desconhecido'}</td>
                        <td className="px-6 py-4">{book.publishedYear}</td>
                        <td className="px-6 py-4">{book.category || '-'}</td>
                        <td className="px-6 py-4 text-right">
                          {user?.role === 'admin' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/books/${book.id}`)}
                                className="mr-1"
                              >
                                <Edit size={16} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(book.id)}
                                disabled={isDeleting}
                              >
                                <Trash2 size={16} className="text-red-500" />
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">
                  {searchTerm ? 'Nenhum livro encontrado para a busca' : 'Nenhum livro cadastrado'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BookList;