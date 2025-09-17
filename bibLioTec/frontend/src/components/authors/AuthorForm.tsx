import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { useAuthorStore } from '../../store/authorStore';
import { Author } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';

type AuthorFormData = Omit<Author, 'id'>;

const AuthorForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAuthor, addAuthor, updateAuthor } = useAuthorStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AuthorFormData>();
  
  const isEditMode = !!id;
  
  useEffect(() => {
    if (isEditMode) {
      const author = getAuthor(id);
      if (author) {
        reset({
          name: author.name,
          nationality: author.nationality,
          birthDate: author.birthDate,
          biography: author.biography
        });
      }
    }
  }, [isEditMode, id, getAuthor, reset]);
  
  const onSubmit = async (data: AuthorFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (isEditMode) {
        await updateAuthor(id, data);
      } else {
        await addAuthor(data);
      }
      navigate('/authors');
    } catch (err) {
      setError('Ocorreu um erro ao salvar o autor');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/authors')} className="mr-4">
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Editar Autor' : 'Novo Autor'}
        </h1>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Informações do Autor</CardTitle>
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
                label="Nacionalidade"
                {...register('nationality', { required: 'Nacionalidade é obrigatória' })}
                error={errors.nationality?.message}
                fullWidth
              />
            </div>
            
            <Input
              label="Data de Nascimento"
              type="date"
              {...register('birthDate')}
              fullWidth
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Biografia
              </label>
              <textarea
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md"
                {...register('biography')}
              ></textarea>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/authors')}
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

export default AuthorForm;