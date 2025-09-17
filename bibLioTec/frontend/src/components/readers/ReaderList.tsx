import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useReaderStore } from '../../store/readerStore';
import { formatDate } from '../../lib/utils';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useAuthStore } from '../../store/authStore';

const ReaderList: React.FC = () => {
  const { readers, fetchReaders, loading, deleteReader } = useReaderStore();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuthStore();
  
  useEffect(() => {
    fetchReaders();
  }, [fetchReaders]);
  
  const filteredReaders = readers.filter(reader =>
    reader.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reader.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este leitor?')) {
      setIsDeleting(true);
      await deleteReader(id);
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Leitores</h1>
        {user?.role === 'admin' && (
        <Button 
          onClick={() => navigate('/readers/new')}
          className="flex items-center"
        >
          <Plus size={18} className="mr-1" />
          Novo Leitor
        </Button>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar leitores..."
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
            {filteredReaders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-6 py-3">Nome</th>
                      <th className="px-6 py-3">Email</th>
                      <th className="px-6 py-3">Telefone</th>
                      <th className="px-6 py-3">Cadastro</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReaders.map((reader) => (
                      <tr key={reader.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{reader.name}</td>
                        <td className="px-6 py-4">{reader.email}</td>
                        <td className="px-6 py-4">{reader.phone}</td>
                        <td className="px-6 py-4">{formatDate(reader.createdAt)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${reader.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {reader.active ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {user?.role === 'admin' && (
                            <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/readers/${reader.id}`)}
                            className="mr-1"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(reader.id)}
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
                  {searchTerm ? 'Nenhum leitor encontrado para a busca' : 'Nenhum leitor cadastrado'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReaderList;