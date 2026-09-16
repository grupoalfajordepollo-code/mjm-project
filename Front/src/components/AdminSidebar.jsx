import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Archive, 
  ShoppingBag, 
  BarChart2, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/panel-secured', label: 'Productos', icon: Archive },
    { path: '/panel-secured/pedidos', label: 'Pedidos', icon: ShoppingBag },
    { path: '/panel-secured/metricas', label: 'Métricas', icon: BarChart2 },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-[#24272c] flex flex-col font-space border-r border-[#31353b]">
      
      <div className="p-6 flex items-center gap-3 mb-2">
        <div className="bg-[#ff5a2c] text-white p-2.5 rounded-xl shadow-lg">
          <Box size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white leading-tight tracking-wide">
            Admin Panel
          </h1>
          <p className="text-[#899fb5] text-xs font-bold mt-0.5">
            Operator Mode
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`cursor-pointer w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-bold transition-all duration-200 ${
                isActive 
                  ? 'bg-[#B02F00] text-white shadow-md'
                  : 'text-[#899fb5] hover:bg-[#2d3137] hover:text-white'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-4 mb-4 space-y-1.5">
        <button 
          className="cursor-pointer w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-bold text-[#899fb5] hover:bg-[#2d3137] hover:text-white transition-all duration-200"
        >
          <Settings size={20} strokeWidth={2} />
          <span className="text-sm">Configuración</span>
        </button>
        
        <button 
          onClick={handleLogout}
          className="cursor-pointer w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-bold text-[#899fb5] hover:bg-[#2d3137] hover:text-white transition-all duration-200"
        >
          <LogOut size={20} strokeWidth={2} />
          <span className="text-sm">Cerrar Sesión</span>
        </button>
      </div>

      <div className="p-5 border-t border-[#31353b] flex items-center gap-3 bg-[#202327]/50 mt-auto">
        <div className="w-10 h-10 rounded-full bg-[#B02F00] flex items-center justify-center text-white font-bold text-sm">
          {user?.nombre?.charAt(0)}{user?.apellido?.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-bold text-white">{user?.nombre} {user?.apellido}</p>
          <p className="text-[#899fb5] text-[11px] font-medium mt-0.5">{user?.email}</p>
        </div>
      </div>

    </aside>
  );
};

export default AdminSidebar;