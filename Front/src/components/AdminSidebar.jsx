import { useState } from 'react';
import { 
  Box, 
  Archive, 
  ShoppingBag, 
  BarChart2, 
  Settings, 
  LogOut 
} from 'lucide-react';

const AdminSidebar = () => {
  const [activeTab, setActiveTab] = useState('productos');

  const navItems = [
    { id: 'productos', label: 'Productos', icon: Archive },
    { id: 'pedidos', label: 'Pedidos', icon: ShoppingBag },
    { id: 'metricas', label: 'Métricas', icon: BarChart2 },
  ];

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
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-bold transition-all duration-200 ${
                isActive 
                  ? 'bg-[#B02F00] text-white shadow-md' // TU MODIFICACIÓN: Fondo naranja, letra blanca
                  : 'text-[#899fb5] hover:bg-[#2d3137] hover:text-white' // Estado inactivo
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
          className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-bold text-[#899fb5] hover:bg-[#2d3137] hover:text-white transition-all duration-200"
        >
          <Settings size={20} strokeWidth={2} />
          <span className="text-sm">Configuración</span>
        </button>
        
        <button 
          className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-bold text-[#899fb5] hover:bg-[#2d3137] hover:text-white transition-all duration-200"
        >
          <LogOut size={20} strokeWidth={2} />
          <span className="text-sm">Cerrar Sesión</span>
        </button>
      </div>

      <div className="p-5 border-t border-[#31353b] flex items-center gap-3 bg-[#202327]/50 mt-auto">
        <img 
          src="/avatar-operator.jpg" 
          alt="MJM Operator" 
          className="w-10 h-10 rounded-full bg-slate-700 object-cover border-2 border-[#31353b]"
        />
        <div>
          <p className="text-sm font-bold text-white">MJM Operator</p>
          <p className="text-[#899fb5] text-[11px] font-medium mt-0.5">ID: 8829-01</p>
        </div>
      </div>

    </aside>
  );
};

export default AdminSidebar;