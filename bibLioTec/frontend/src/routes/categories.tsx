import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CategoryList from '../components/categories/CategoryList';
import CategoryForm from '../components/categories/CategoryForm';
import { useAuthStore } from '../store/authStore';

const CategoryRoutes: React.FC = () => {
  const { user } = useAuthStore();
  return (
    <Routes>
      <Route path="/" element={<CategoryList />} />
      <Route
        path="/new"
        element={user?.role === 'admin' ? <CategoryForm /> : <Navigate to="/categories" />}
      />
      <Route
        path=":id"
        element={user?.role === 'admin' ? <CategoryForm /> : <Navigate to="/categories" />}
      />
    </Routes>
  );
};

export default CategoryRoutes; 