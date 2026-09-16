import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import ProductManagement from './ProductManagement';
import ProductCreation from './ProductCreation';

const ProductsDashboard = () => {
  const [vistaActiva, setVistaActiva] = useState('tabla');
  const [productoEditando, setProductoEditando] = useState(null);

  const handleCrear = () => {
    setProductoEditando(null);
    setVistaActiva('crear');
  };

  const handleEditar = (id) => {
    setProductoEditando(id);
    setVistaActiva('crear');
  };

  const handleVolver = () => {
    setProductoEditando(null);
    setVistaActiva('tabla');
  };

  return (
    <div className="min-h-screen flex flex-col font-space bg-[#fcfdfe]">
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 overflow-y-auto">
          {vistaActiva === 'tabla' ? (
            <ProductManagement onCrear={handleCrear} onEditar={handleEditar} />
          ) : (
            <ProductCreation
              productoId={productoEditando}
              setVistaActiva={handleVolver}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsDashboard;