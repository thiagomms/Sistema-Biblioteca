import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore, initAuth } from './store/authStore';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BooksPage from './pages/BooksPage';
import BookFormPage from './pages/BookFormPage';
import ReadersPage from './pages/ReadersPage';
import ReaderFormPage from './pages/ReaderFormPage';
import AuthorsPage from './pages/AuthorsPage';
import AuthorFormPage from './pages/AuthorFormPage';
import LoansPage from './pages/LoansPage';
import LoanFormPage from './pages/LoanFormPage';
import RegisterPage from './pages/RegisterPage';

// Components
import Layout from './components/layout/Layout';
import CategoryRoutes from './routes/categories';

// Componente para proteger rotas
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login\" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  useEffect(() => {
    initAuth();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }>
          <Route index element={<Navigate to="/dashboard\" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          
          <Route path="books" element={<BooksPage />} />
          <Route path="books/new" element={<BookFormPage />} />
          <Route path="books/:id" element={<BookFormPage />} />
          
          <Route path="readers" element={<ReadersPage />} />
          <Route path="readers/new" element={<ReaderFormPage />} />
          <Route path="readers/:id" element={<ReaderFormPage />} />
          
          <Route path="authors" element={<AuthorsPage />} />
          <Route path="authors/new" element={<AuthorFormPage />} />
          <Route path="authors/:id" element={<AuthorFormPage />} />
          
          <Route path="loans" element={<LoansPage />} />
          <Route path="loans/new" element={<LoanFormPage />} />
          <Route path="loans/:id" element={<LoanFormPage />} />

          <Route path="categories/*" element={<CategoryRoutes />} />
        </Route>

        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;