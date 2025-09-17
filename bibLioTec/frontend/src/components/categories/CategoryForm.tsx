import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../ui/Button';
import { useAuthStore } from '../../store/authStore';

const API_URL = '/api/categories';

const useCategoryStore = () => {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const fetchCategory = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLoading(false);
      return data;
    } catch {
      setLoading(false);
      return null;
    }
  };
  const saveCategory = async (category: any) => {
    setLoading(true);
    try {
      const res = await fetch(
        category.id ? `${API_URL}/${category.id}` : API_URL,
        {
          method: category.id ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: category.name }),
        }
      );
      const data = await res.json();
      setLoading(false);
      return data;
    } catch {
      setLoading(false);
      throw new Error('Erro ao salvar categoria');
    }
  };
  return { fetchCategory, saveCategory, loading };
};

const CategoryForm: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { id } = useParams();
  const { fetchCategory, saveCategory, loading } = useCategoryStore();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCategory(id).then((cat) => setName(cat.name));
    }
  }, [id]);

  if (user?.role !== 'admin') {
    navigate('/categories');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!name) {
      setError('O nome da categoria é obrigatório');
      return;
    }
    setIsLoading(true);
    try {
      await saveCategory({ id, name });
      setSuccess('Categoria salva com sucesso!');
      setTimeout(() => navigate('/categories'), 1000);
    } catch (err) {
      setError('Erro ao salvar categoria');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">{id ? 'Editar' : 'Nova'} Categoria</h2>
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nome</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? 'Salvando...' : 'Salvar'}
        </Button>
      </form>
    </div>
  );
};

export default CategoryForm; 