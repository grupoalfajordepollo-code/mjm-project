import { useState } from 'react';
import { 
  CloudUpload, 
  Info, 
  Bold, 
  Italic, 
  List, 
  Link2,
  Plus
} from 'lucide-react';

const ProductCreation = ({ setVistaActiva }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    stock: '',
    categoria: '',
    descripcion: '',
    visibilidad: true,
    destacado: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    console.log('JSON listo para enviar a la base de datos:', formData);
    alert('¡Producto guardado exitosamente!');
  };

  return (
    <main className="flex-1 bg-[#fcfdfe] overflow-y-auto font-space">
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold text-gray-500 mb-1">
              Productos / <span className="text-[#B02F00]">Nuevo Producto</span>
            </p>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Gestión de Inventario
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => setVistaActiva('tabla')} className="px-6 py-2.5 bg-white border-2 border-[#e6d5cc] text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors">
              Descartar
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2.5 bg-[#B02F00] hover:bg-[#8a2500] text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
            >
              Guardar Cambios
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white border border-[#e6d5cc] rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Información General</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Nombre del Producto</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Engranaje Helicoidal Pro-3"
                    className="w-full px-4 py-2.5 bg-white border border-[#e6d5cc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B02F00] focus:border-transparent transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Precio (ARS)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                      <input
                        type="number"
                        name="precio"
                        value={formData.precio}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="w-full pl-8 pr-4 py-2.5 bg-white border border-[#e6d5cc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B02F00] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Stock Disponible</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="100"
                      className="w-full px-4 py-2.5 bg-white border border-[#e6d5cc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B02F00] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Categoría</label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-[#e6d5cc] rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#B02F00] focus:border-transparent transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-position-[right_1rem_center] bg-size-[1.2em_1.2em]"
                  >
                    <option value="" disabled>Seleccionar categoría</option>
                    <option value="branding">Branding</option>
                    <option value="bazar">Bazar</option>
                    <option value="juguetes">Juguetes</option>
                    <option value="hobbie">Hobbie</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Descripción</label>
                  <div className="border border-[#e6d5cc] rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#B02F00] transition-all bg-white">
                    {/* Toolbar */}
                    <div className="flex items-center gap-1 bg-gray-50 border-b border-[#e6d5cc] px-3 py-2">
                      <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors"><Bold size={16} strokeWidth={2.5}/></button>
                      <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors"><Italic size={16} strokeWidth={2.5}/></button>
                      <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors"><List size={16} strokeWidth={2.5}/></button>
                      <button className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors"><Link2 size={16} strokeWidth={2.5}/></button>
                    </div>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      rows="5"
                      placeholder="Detalla las especificaciones técnicas, materiales y uso recomendado..."
                      className="w-full px-4 py-3 bg-white focus:outline-none resize-y min-h-30"
                    ></textarea>
                  </div>
                </div>

              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="bg-white border border-[#e6d5cc] rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:shadow-sm transition-shadow" onClick={() => setFormData(p => ({...p, visibilidad: !p.visibilidad}))}>
                <div>
                  <p className="text-sm font-bold text-gray-900">Visibilidad en Tienda</p>
                  <p className="text-xs text-gray-500 mt-0.5">Mostrar producto a los clientes.</p>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${formData.visibilidad ? 'bg-[#B02F00]' : 'bg-gray-200'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${formData.visibilidad ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </div>

              <div className="bg-white border border-[#e6d5cc] rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:shadow-sm transition-shadow" onClick={() => setFormData(p => ({...p, destacado: !p.destacado}))}>
                <div>
                  <p className="text-sm font-bold text-gray-900">Producto Destacado</p>
                  <p className="text-xs text-gray-500 mt-0.5">Resaltar en página principal.</p>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-1 ${formData.destacado ? 'bg-[#B02F00]' : 'bg-gray-200'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${formData.destacado ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </div>

            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            
            <div className="bg-white border border-[#e6d5cc] rounded-2xl p-6 md:p-8 h-full flex flex-col">
              <h2 className="text-xl font-bold text-gray-900 mb-1">Media</h2>
              <p className="text-xs text-gray-500 mb-6">Sube las mejores tomas de tu modelo 3D impreso.</p>
              
              <div className="border-2 border-dashed border-[#e6d5cc] rounded-xl bg-[#fcfdfe] hover:bg-[#fff9f7] transition-colors flex flex-col items-center justify-center p-8 text-center cursor-pointer mb-6 group">
                <div className="w-12 h-12 bg-gray-100 group-hover:bg-[#ffece6] rounded-full flex items-center justify-center mb-3 transition-colors">
                  <CloudUpload className="text-[#B02F00]" size={24} strokeWidth={2} />
                </div>
                <p className="text-sm font-bold text-gray-900 mb-1">Click o arrastra imágenes</p>
                <p className="text-xs text-gray-500">PNG, JPG hasta 10MB</p>
              </div>

              <div className="flex gap-3 mb-8">
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm relative group cursor-pointer">
                  {/* Reemplazá este img src con el que tengas */}
                  <img src="/ruta-engranaje.jpg" alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold">X</span>
                  </div>
                </div>
                <div className="w-20 h-20 rounded-lg bg-gray-100 border border-[#e6d5cc] border-dashed flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors text-gray-500">
                  <Plus size={24} />
                </div>
              </div>

              <div className="bg-[#fff5f2] border border-[#ffdbcc] rounded-xl p-4 flex gap-3 mt-auto">
                <Info className="text-[#B02F00] shrink-0 mt-0.5" size={20} strokeWidth={2} />
                <p className="text-[13px] text-[#B02F00] font-medium leading-relaxed pr-2">
                  Se recomienda utilizar fondos neutros para resaltar la precisión de las piezas impresas.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </main>
  );
};

export default ProductCreation;