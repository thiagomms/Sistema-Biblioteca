import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { BookOpen, Users, BookMarked, Home, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const Layout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuItems = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <BookOpen size={20} />, label: 'Livros', path: '/books' },
    { icon: <Users size={20} />, label: 'Leitores', path: '/readers' },
    { icon: <BookMarked size={20} />, label: 'Autores', path: '/authors' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar para desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-blue-800 text-white">
        <div className="p-5 border-b border-blue-700">
          <h1 className="text-xl font-bold flex items-center">
            <BookOpen className="mr-2" /> 
            <span>BiblioTech</span>
          </h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className="flex items-center px-6 py-3 text-sm hover:bg-blue-700 transition-colors"
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            ))}
            {/* Menus exclusivos do admin */}
            {user?.role === 'admin' && (
              <>
                <li>
                  <Link to="/books/new" className="flex items-center px-6 py-3 text-sm hover:bg-blue-700 transition-colors">
                    <span className="ml-3">Novo Livro</span>
                  </Link>
                </li>
                <li>
                  <Link to="/authors/new" className="flex items-center px-6 py-3 text-sm hover:bg-blue-700 transition-colors">
                    <span className="ml-3">Novo Autor</span>
                  </Link>
                </li>
                <li>
                  <Link to="/readers/new" className="flex items-center px-6 py-3 text-sm hover:bg-blue-700 transition-colors">
                    <span className="ml-3">Novo Leitor</span>
                  </Link>
                </li>
                {/* Adicione outros menus de admin aqui */}
              </>
            )}
          </ul>
        </nav>
        <div className="p-4 border-t border-blue-700">
          <div className="flex items-center mb-3">
            <div className="flex-1">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-blue-300">{user?.role === 'admin' ? 'Administrador' : 'Bibliotecário'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm rounded bg-blue-700 hover:bg-blue-600 transition-colors"
          >
            <LogOut size={16} className="mr-2" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header para mobile */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              {/* Botão do menu mobile */}
              <button 
                className="md:hidden mr-3 text-gray-700"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="text-lg font-semibold text-gray-800 flex items-center">
                <BookOpen className="mr-2 text-blue-600" /> 
                <span>BiblioTech</span>
              </h1>
            </div>
            {/* Perfil no header apenas para mobile */}
            <div className="md:hidden flex items-center">
              <div className="text-sm mr-4">
                <span className="font-medium text-gray-700">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-blue-800 text-white absolute inset-x-0 z-20">
            <nav className="py-3">
              <ul>
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.path}
                      className="flex items-center px-4 py-3 text-sm hover:bg-blue-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        )}

        {/* Conteúdo da página */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;