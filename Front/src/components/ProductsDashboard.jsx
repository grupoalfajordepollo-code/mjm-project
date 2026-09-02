import { useState } from 'react';

// Importamos todos los módulos reutilizables
import Header from './Header';
import Footer from './Footer';
import AdminSidebar from './AdminSidebar';
import ProductManagement from './ProductManagement';
import ProductCreation from './ProductCreation';

const ProductsDashboard = () => {
  const [vistaActiva, setVistaActiva] = useState('tabla');

  return (
    // min-h-screen asegura que la página tome al menos el alto del monitor
    // flex-col apila el Header, el contenido central y el Footer verticalmente
    <div className="min-h-screen flex flex-col font-space bg-[#fcfdfe]">
      
      {/* 1. HEADER REUTILIZABLE (Arriba de todo) */}
      <Header />

      {/* 2. ZONA CENTRAL (Flex para poner Sidebar y Contenido lado a lado) */}
      {/* flex-1 hace que esta zona empuje al footer hacia abajo si hay poco contenido */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Barra Lateral Izquierda */}
        <AdminSidebar />

        {/* Contenido Dinámico Derecho (Tabla o Formulario) */}
        {/* overflow-y-auto permite que esta sección tenga su propio scroll si la tabla es muy larga */}
        <div className="flex-1 overflow-y-auto">
          {vistaActiva === 'tabla' ? (
            <ProductManagement setVistaActiva={setVistaActiva} />
          ) : (
            <ProductCreation setVistaActiva={setVistaActiva} />
          )}
        </div>

      </div>

      {/* 3. FOOTER REUTILIZABLE (Abajo de todo) */}
      <Footer />

    </div>
  );
};

export default ProductsDashboard;