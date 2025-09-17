import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { useReaderStore } from '../../store/readerStore';
import { Reader } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';

type ReaderFormData = Omit<Reader, 'id' | 'createdAt'>;

const ReaderForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getReader, addReader, updateReader } = useReaderStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ReaderFormData>();
  
  const isEditMode = !!id;
  
  useEffect(() => {
    if (isEditMode) {
      const reader = getReader(id);
      if (reader) {
        reset({
          name: reader.name,
          email: reader.email,
          phone: reader.phone,
          address: reader.address,
          active: reader.active,
        });
      }
    }
  }, [isEditMode, id, getReader, reset]);
  
  const onSubmit = async (data: ReaderFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (isEditMode) {
        await updateReader(id, data);
      } else {
        await addReader(data);
      }
      navigate('/readers');
    } catch (err) {
      setError('Ocorreu um erro ao salvar o leitor');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/readers')} className="mr-4">
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Editar Leitor' : 'Novo Leitor'}
        </h1>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Informações do Leitor</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome"
                {...register('name', { required: 'Nome é obrigatório' })}
                error={errors.name?.message}
                fullWidth
              />
              
              <Input
                label="Email"
                type="email"
                {...register('email', { 
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                })}
                error={errors.email?.message}
                fullWidth
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Telefone"
                {...register('phone', { required: 'Telefone é obrigatório' })}
                error={errors.phone?.message}
                fullWidth
              />
              
              <div className="flex items-center space-x-2 h-full pt-6">
                <input
                  type="checkbox"
                  id="active"
                  className="h-4 w-4 text-blue-600 rounded"
                  {...register('active')}
                />
                <label htmlFor="active" className="text-sm font-medium text-gray-700">
                  Ativo
                </label>
              </div>
            </div>
            
            <Input
              label="Endereço"
              {...register('address', { required: 'Endereço é obrigatório' })}
              error={errors.address?.message}
              fullWidth
            />
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/readers')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              <Save size={18} className="mr-1" />
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ReaderForm;