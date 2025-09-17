import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save, BookOpen } from 'lucide-react';
import { useBookStore } from '../../store/bookStore';
import { useAuthorStore } from '../../store/authorStore';
import { Book } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';

type BookFormData = Omit<Book, 'id' | 'author'> & { authorId: string };

const BookForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBook, addBook, updateBook } = useBookStore();
  const { authors, fetchAuthors } = useAuthorStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<BookFormData>();
  
  const isEditMode = !!id;
  const publishedYear = watch('publishedYear');
  
  useEffect(() => {
    fetchAuthors();
    
    if (isEditMode) {
      const book = getBook(id);
      if (book) {
        reset({
          ...book,
          authorId: book.authorId ? String(book.authorId) : '',
        });
      }
    }
  }, [isEditMode, id, getBook, reset, fetchAuthors]);
  
  const onSubmit = async (data: BookFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (isEditMode) {
        await updateBook(id, data);
      } else {
        await addBook(data);
      }
      navigate('/books');
    } catch (err) {
      setError('Ocorreu um erro ao salvar o livro');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/books')} className="mr-4">
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Editar Livro' : 'Novo Livro'}
        </h1>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Informações do Livro</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <Input
                  label="Título"
                  {...register('title', { required: 'Título é obrigatório' })}
                  error={errors.title?.message}
                  fullWidth
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  
                  <Input
                    label="Ano de Publicação"
                    type="number"
                    {...register('publishedYear', { 
                      required: 'Ano é obrigatório',
                      min: { value: 1000, message: 'Ano inválido' },
                      max: { value: new Date().getFullYear(), message: 'Ano não pode ser futuro' }
                    })}
                    error={errors.publishedYear?.message}
                    fullWidth
                  />
                </div>
              </div>
              
              
                
                
              
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Autor
                </label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                  {...register('authorId', { required: 'Selecione um autor' })}
                >
                  <option value="">Selecione...</option>
                  {authors.map(author => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
                {errors.authorId && (
                  <p className="mt-1 text-sm text-red-600">{errors.authorId.message}</p>
                )}
              </div>
              
                <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
                </label>
              <select
                  className="w-full p-2 border border-gray-300 rounded-md"
                {...register('category', { required: 'Selecione uma categoria' })}
              >
                <option value="">Selecione...</option>
                <option value="romance">Romance</option>
                <option value="ficcao">Ficção</option>
                <option value="aventura">Aventura</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/books')}
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

export default BookForm;