import React, { useState } from 'react';
import axios from 'axios';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validatePassword = (pwd: string) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\d]).{8,}$/.test(pwd);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!name || !email || !password) {
      setError('Preencha todos os campos');
      return;
    }
    if (!validatePassword(password)) {
      setError('Senha fraca. Use letras maiúsculas, minúsculas, números e especiais.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/register', { name, email, password });
      setSuccess('Usuário cadastrado com sucesso!');
      setName(''); setEmail(''); setPassword('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao cadastrar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Auto-cadastro</h2>
        {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
        {success && <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Nome</label>
            <input type="text" className="w-full border p-2 rounded" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="block mb-1 font-medium">E-mail</label>
            <input type="email" className="w-full border p-2 rounded" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Senha</label>
            <input type="password" className="w-full border p-2 rounded" value={password} onChange={e => setPassword(e.target.value)} />
            <span className="text-xs text-gray-500">Mínimo 8 caracteres, letras maiúsculas, minúsculas, números e especiais.</span>
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage; 