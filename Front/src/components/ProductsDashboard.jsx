import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import ProductManagement from './ProductManagement';
import ProductCreation from './ProductCreation';

const ProductsDashboard = () => {
  const [vistaActiva, setVistaActiva] = useState('tabla');
  return (
    <div className="min-h-screen flex flex-col font-space bg-[#fcfdfe]">
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 overflow-y-auto">
          {vistaActiva === 'tabla' ? (
            <ProductManagement setVistaActiva={setVistaActiva} />
          ) : (
            <ProductCreation setVistaActiva={setVistaActiva} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsDashboard;