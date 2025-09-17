import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useAuthorStore } from '../../store/authorStore';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { formatDate } from '../../lib/utils';
import { useAuthStore } from '../../store/authStore';

const AuthorList: React.FC = () => {
  const { authors, fetchAuthors, loading, deleteAuthor } = useAuthorStore();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuthStore();
  
  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);
  
  const filteredAuthors = authors.filter(author =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    author.nationality.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este autor?')) {
      setIsDeleting(true);
      await deleteAuthor(id);
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Autores</h1>
        {user?.role === 'admin' && (
        <Button 
          onClick={() => navigate('/authors/new')}
          className="flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Novo Autor
        </Button>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar autores..."
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
            {filteredAuthors.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">Nome</th>
                      <th className="px-6 py-3">Nacionalidade</th>
                      <th className="px-6 py-3">Data de Nascimento</th>
                      <th className="px-6 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAuthors.map((author) => (
                      <tr key={author.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{author.name}</td>
                        <td className="px-6 py-4">{author.nationality}</td>
                        <td className="px-6 py-4">
                          {author.birthDate ? formatDate(author.birthDate) : '-'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {user?.role === 'admin' && (
                            <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/authors/${author.id}`)}
                            className="mr-1"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(author.id)}
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
                  {searchTerm ? 'Nenhum autor encontrado para a busca' : 'Nenhum autor cadastrado'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AuthorList;