import { useState, useEffect, useCallback } from 'react';
import {
  CloudUpload,
  Info,
  Bold,
  Italic,
  List,
  Link2,
  X,
  Star,
  ChevronLeft,
  ChevronRight,
  Check,
  XCircle,
} from 'lucide-react';
import { crearProducto, actualizarProducto, obtenerProducto, obtenerCategorias } from '../services/productoService';
import { subirImagen } from '../services/uploadService';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getAsset } from '../utils/getAssetsUrl';

const ProductCreation = ({ productoId, setVistaActiva }) => {
  const { user } = useAuth();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProducto, setLoadingProducto] = useState(!!productoId);
  const [imagenesActuales, setImagenesActuales] = useState([]);
  const [archivosNuevos, setArchivosNuevos] = useState([]);
  const [idsAEliminar, setIdsAEliminar] = useState([]);
  const [arrastrando, setArrastrando] = useState(false);
  const [portadaElegida, setPortadaElegida] = useState(null); // {tipo:'actual', id} | {tipo:'nuevo', file}
  const [fotoAmpliada, setFotoAmpliada] = useState(null); // posición global en la galería combinada (actuales + nuevas)
  const [modal, setModal] = useState(null); // {tipo:'exito'|'error'|'aviso', titulo, mensaje, onCerrar?}

  const cerrarModal = useCallback(() => {
    const cb = modal?.onCerrar;
    setModal(null);
    if (cb) cb();
  }, [modal]);

  useEffect(() => {
    if (fotoAmpliada == null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setFotoAmpliada(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fotoAmpliada]);

  useEffect(() => {
    if (!modal || fotoAmpliada != null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') cerrarModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modal, fotoAmpliada, cerrarModal]);

  // Vista actual del modal derivada del estado vivo (sigue reorders y bajas)
  const totalFotosGaleria = imagenesActuales.length + archivosNuevos.length;
  const fotoVista = fotoAmpliada == null || totalFotosGaleria === 0 ? null : (
    fotoAmpliada < imagenesActuales.length
      ? { tipo: 'actual', index: fotoAmpliada, item: imagenesActuales[fotoAmpliada] }
      : { tipo: 'nuevo', index: fotoAmpliada - imagenesActuales.length, item: archivosNuevos[fotoAmpliada - imagenesActuales.length] }
  );
  const fotoVisible = fotoVista?.item ? fotoVista : null;

  const irFoto = (dir) => {
    if (totalFotosGaleria === 0) return;
    setFotoAmpliada((p) => (p + dir + totalFotosGaleria) % totalFotosGaleria);
  };
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    stock: '',
    idCategoria: '',
    descripcion: '',
  });

  const esEdicion = !!productoId;

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await obtenerCategorias();
        setCategorias(res.data);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    if (!productoId) return;

    const fetchProducto = async () => {
      setLoadingProducto(true);
      try {
        const res = await obtenerProducto(productoId);
        const prod = res.data;
        setFormData({
          nombre: prod.nombre || '',
          precio: prod.precio || '',
          stock: prod.stock ?? '',
          idCategoria: prod.idCategoria || '',
          descripcion: prod.descripcion || '',
        });
        if (prod.imagenes) {
          setImagenesActuales(prod.imagenes);
        }
      } catch (err) {
        console.error('Error al cargar producto:', err);
        setModal({
          tipo: 'error',
          titulo: 'No se pudo cargar',
          mensaje: 'No se pudo cargar el producto. Volvé al listado e intentá de nuevo.',
          onCerrar: () => setVistaActiva(),
        });
      } finally {
        setLoadingProducto(false);
      }
    };
    fetchProducto();
  }, [productoId, setVistaActiva]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    // Evita agregar dos veces el mismo archivo en la misma tanda
    // (mismo contenido re-subido = error 409 o thumbs duplicados)
    const firma = (f) => `${f.name}|${f.size}|${f.lastModified}`;
    const yaElegidos = new Set(archivosNuevos.map((n) => firma(n.file)));
    const nuevos = [];
    for (const file of files) {
      if (yaElegidos.has(firma(file))) continue;
      yaElegidos.add(firma(file));
      nuevos.push({ file, preview: URL.createObjectURL(file) });
    }
    if (nuevos.length > 0) setArchivosNuevos((prev) => [...prev, ...nuevos]);
    e.target.value = null;
  };

  const quitarArchivoNuevo = (index) => {
    const target = archivosNuevos[index];
    if (target?.preview) URL.revokeObjectURL(target.preview);
    setArchivosNuevos((prev) => prev.filter((_, i) => i !== index));
    if (portadaElegida?.tipo === 'nuevo' && portadaElegida.file === target?.file) {
      setPortadaElegida(null);
    }
  };

  const quitarImagenActual = (id) => {
    setImagenesActuales((prev) => prev.filter((img) => img.id !== id));
    setIdsAEliminar((prev) => [...prev, id]);
    if (portadaElegida?.tipo === 'actual' && portadaElegida.id === id) {
      setPortadaElegida(null);
    }
  };

  // Portada resuelta para mostrar y guardar (vale para listas mixtas).
  // Se define ANTES de los movers porque los guards la usan: el "ya es
  // portada" no es el índice 0 de cada lista, sino la portada resuelta
  // (una nueva puede ser portada aunque haya actuales, y viceversa).
  const coverActualId = portadaElegida?.tipo === 'actual'
    ? portadaElegida.id
    : (!portadaElegida && imagenesActuales.length > 0 ? imagenesActuales[0]?.id : null);
  const coverNuevoFile = portadaElegida?.tipo === 'nuevo'
    ? portadaElegida.file
    : (!portadaElegida && imagenesActuales.length === 0 ? archivosNuevos[0]?.file : null);

  const moverActualAlFrente = (index) => {
    const item = imagenesActuales[index];
    if (!item || item.id === coverActualId) return;
    setImagenesActuales((prev) => {
      const copia = [...prev];
      const [m] = copia.splice(index, 1);
      return [m, ...copia];
    });
    setPortadaElegida({ tipo: 'actual', id: item.id });
  };

  const moverNuevoAlFrente = (index) => {
    const item = archivosNuevos[index];
    if (!item || item.file === coverNuevoFile) return;
    setArchivosNuevos((prev) => {
      const copia = [...prev];
      const [m] = copia.splice(index, 1);
      return [m, ...copia];
    });
    setPortadaElegida({ tipo: 'nuevo', file: item.file });
  };

  const handleSave = async () => {
    if (!formData.nombre || !formData.precio || !formData.stock || !formData.idCategoria) {
      setModal({
        tipo: 'aviso',
        titulo: 'Faltan datos',
        mensaje: 'Por favor completá todos los campos obligatorios: nombre, precio, stock y categoría.',
      });
      return;
    }

    setLoading(true);
    try {
      // 1. Guardar el producto primero (la galería necesita su id)
      const payload = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: Number(formData.precio),
        stock: Number(formData.stock),
        idCategoria: Number(formData.idCategoria),
        idAdministrador: user?.id,
      };

      let productId = productoId;
      if (esEdicion) {
        await actualizarProducto(productoId, payload);
      } else {
        const res = await crearProducto(payload);
        productId = res.data.id;
      }

      // 2. Subir las fotos nuevas asociadas al producto
      const idsCreados = [];
      for (const nuevo of archivosNuevos) {
        const creada = await subirImagen(nuevo.file, '', productId);
        idsCreados.push(creada.id);
      }

      // 3. Borrar las fotos quitadas en edición
      for (const id of idsAEliminar) {
        await api.delete(`/imagenes/${id}`);
      }

      // 4. Fijar la portada elegida (vale para listas mixtas). Idempotente.
      const totalFotos = imagenesActuales.length + idsCreados.length;
      if (totalFotos > 0) {
        let coverId = coverActualId;
        if (!coverId && coverNuevoFile) {
          const idx = archivosNuevos.findIndex((n) => n.file === coverNuevoFile);
          coverId = idx >= 0 ? idsCreados[idx] : null;
        }
        if (coverId) await api.put(`/imagenes/${coverId}/portada`);
      }

      if (esEdicion) {
        setModal({
          tipo: 'exito',
          titulo: 'Producto actualizado',
          mensaje: `"${formData.nombre}" se actualizó correctamente con su galería.`,
          onCerrar: () => setVistaActiva(),
        });
      } else {
        setModal({
          tipo: 'exito',
          titulo: 'Producto guardado',
          mensaje: `"${formData.nombre}" se guardó correctamente con su galería.`,
          onCerrar: () => setVistaActiva(),
        });
      }
    } catch (err) {
      console.error('Error al guardar producto:', err);
      setModal({
        tipo: 'error',
        titulo: 'No se pudo guardar',
        mensaje: 'No se pudo guardar el producto. Revisá los datos e intentá de nuevo.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingProducto) {
    return (
      <main className="flex-1 bg-[#fcfdfe] overflow-y-auto font-space flex items-center justify-center">
        <p className="text-gray-500 text-sm">Cargando producto...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-[#fcfdfe] overflow-y-auto font-space">
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold text-gray-500 mb-1">
              Productos / <span className="text-[#B02F00]">{esEdicion ? 'Editar Producto' : 'Nuevo Producto'}</span>
            </p>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {esEdicion ? 'Editar Producto' : 'Gestión de Inventario'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => setVistaActiva()} className="cursor-pointer px-6 py-2.5 bg-white border-2 border-[#e6d5cc] text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors">
              Descartar
            </button>
            <button 
              onClick={handleSave}
              disabled={loading}
              className="cursor-pointer px-6 py-2.5 bg-[#B02F00] hover:bg-[#8a2500] text-white text-sm font-bold rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : esEdicion ? 'Actualizar Producto' : 'Guardar Cambios'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="space-y-6">
            
            <div className="bg-white border border-[#e6d5cc] rounded-2xl p-6 md:p-8 h-full flex flex-col">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Información General</h2>
              
              <div className="space-y-5 flex-1 flex flex-col">
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
                    name="idCategoria"
                    value={formData.idCategoria}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-[#e6d5cc] rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#B02F00] focus:border-transparent transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-no-repeat bg-position-[right_1rem_center] bg-size-[1.2em_1.2em]"
                  >
                    <option value="" disabled>Seleccionar categoría</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="flex-1 flex flex-col">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Descripción</label>
                  <div className="border border-[#e6d5cc] rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#B02F00] transition-all bg-white flex-1 flex flex-col">
                    <div className="flex items-center gap-1 bg-gray-50 border-b border-[#e6d5cc] px-3 py-2">
                      <button type="button" className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors"><Bold size={16} strokeWidth={2.5}/></button>
                      <button type="button" className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors"><Italic size={16} strokeWidth={2.5}/></button>
                      <button type="button" className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors"><List size={16} strokeWidth={2.5}/></button>
                      <button type="button" className="p-1.5 text-gray-600 hover:bg-gray-200 rounded transition-colors"><Link2 size={16} strokeWidth={2.5}/></button>
                    </div>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      rows="5"
                      placeholder="Detalla las especificaciones técnicas, materiales y uso recomendado..."
                      className="w-full px-4 py-3 bg-white focus:outline-none resize-y min-h-30 flex-1"
                    ></textarea>
                  </div>
                </div>

              </div>
            </div>

          </div>

          <div className="space-y-6">
            
            <div className="bg-[#FDF6EE] border border-[#e6d5cc] rounded-2xl p-6 md:p-8 h-full flex flex-col">
              <p className="text-[11px] font-bold text-[#B02F00] uppercase tracking-widest mb-1">Media</p>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Fotos del producto</h2>
              <p className="text-sm text-gray-500 mt-1 mb-6">Sube las mejores tomas de tu modelo 3D impreso.</p>
              
              <div
                role="button"
                tabIndex={0}
                aria-label="Agregar fotos: hacé click o arrastrá imágenes"
                className={`border-2 border-dashed rounded-xl transition-colors flex flex-col items-center justify-center p-6 sm:p-8 text-center cursor-pointer mb-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B02F00] ${arrastrando ? 'border-[#B02F00] bg-[#fff5f2]' : 'border-[#e6d5cc] bg-[#fcfdfe] hover:bg-[#fff9f7]'}`}
                onClick={() => document.getElementById('fileInput').click()}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); document.getElementById('fileInput').click(); } }}
                onDragOver={(e) => { e.preventDefault(); setArrastrando(true); }}
                onDragLeave={() => setArrastrando(false)}
                onDrop={(e) => { e.preventDefault(); setArrastrando(false); handleFileChange({ target: { files: e.dataTransfer.files } }); }}
              >
                <input
                  id="fileInput"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="w-12 h-12 bg-gray-100 group-hover:bg-[#ffece6] rounded-full flex items-center justify-center mb-3 transition-colors">
                  <CloudUpload className="text-[#B02F00]" size={24} strokeWidth={2} />
                </div>
                <p className="text-base font-bold text-gray-900 mb-1">
                  {arrastrando ? 'Soltá para agregar' : 'Agregá fotos — podés subir varias a la vez'}
                </p>
                <div className="flex items-center gap-1.5 justify-center">
                  {['JPG', 'PNG', 'WEBP'].map((f) => (
                    <span key={f} className="px-1.5 py-0.5 text-[11px] font-bold text-gray-500 bg-gray-100 rounded">{f}</span>
                  ))}
                  <span className="px-1.5 py-0.5 text-[11px] font-bold text-gray-500 bg-gray-100 rounded">máx 10MB c/u</span>
                </div>
              </div>

              {(imagenesActuales.length > 0 || archivosNuevos.length > 0) && (
                <div className="mb-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                      Galería
                      <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-full tabular-nums">
                        {imagenesActuales.length + archivosNuevos.length}
                      </span>
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 mb-3">
                    Tocá una foto para <strong className="text-gray-900">ampliarla</strong>
                    {' · '}tocá <Star size={13} strokeWidth={2.5} className="inline-block -mt-0.5 text-[#B02F00]" /> para <strong className="text-[#B02F00]">hacerla portada</strong>
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {imagenesActuales.map((img, i) => {
                      const pos = `Foto ${i + 1} de ${imagenesActuales.length + archivosNuevos.length}`;
                      const esPortada = img.id === coverActualId;
                      return (
                      <div key={img.id} className="relative group/img">
                        <img
                          src={getAsset(img.imagen)}
                          alt={pos}
                          onClick={() => setFotoAmpliada(i)}
                          className="w-full h-24 sm:h-28 object-cover rounded-lg border border-[#e6d5cc] cursor-zoom-in"
                        />
                        {esPortada ? (
                          <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 px-2 py-0.5 bg-[#B02F00] text-white text-xs font-bold rounded">
                            <Star size={11} strokeWidth={2.5} fill="currentColor" />
                            Portada
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => moverActualAlFrente(i)}
                            title={`Hacer portada a ${pos}`}
                            aria-label={`Hacer portada a ${pos}`}
                            className="cursor-pointer absolute top-1.5 left-1.5 p-1.5 bg-white/90 text-gray-400 hover:text-[#B02F00] rounded-full shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B02F00]"
                          >
                            <Star size={16} strokeWidth={2.5} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => quitarImagenActual(img.id)}
                          title={`Quitar ${pos}`}
                          aria-label={`Quitar ${pos}`}
                          className="cursor-pointer absolute top-1.5 right-1.5 p-1.5 bg-white/90 text-gray-500 hover:text-red-600 rounded-full shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                        >
                          <X size={16} strokeWidth={2.5} />
                        </button>
                      </div>
                      );
                    })}
                    {archivosNuevos.map((nuevo, i) => {
                      const pos = `Foto ${imagenesActuales.length + i + 1} de ${imagenesActuales.length + archivosNuevos.length}`;
                      const esPortada = nuevo.file === coverNuevoFile;
                      return (
                      <div key={`nuevo-${i}`} className="relative group/img">
                        <img
                          src={nuevo.preview}
                          alt={`${pos} (nueva)`}
                          onClick={() => setFotoAmpliada(imagenesActuales.length + i)}
                          className="w-full h-24 sm:h-28 object-cover rounded-lg border border-dashed border-[#B02F00]/50 cursor-zoom-in"
                        />
                        {esPortada ? (
                          <span className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 px-2 py-0.5 bg-[#B02F00] text-white text-xs font-bold rounded">
                            <Star size={11} strokeWidth={2.5} fill="currentColor" />
                            Portada
                          </span>
                        ) : (
                          <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-green-600 text-white text-xs font-bold rounded">
                            Nueva
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => quitarArchivoNuevo(i)}
                          title={`Quitar ${pos}`}
                          aria-label={`Quitar ${pos}`}
                          className="cursor-pointer absolute top-1.5 right-1.5 p-1.5 bg-white/90 text-gray-500 hover:text-red-600 rounded-full shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                        >
                          <X size={16} strokeWidth={2.5} />
                        </button>
                        {!esPortada && (
                          <button
                            type="button"
                            onClick={() => moverNuevoAlFrente(i)}
                            title={`Hacer portada a ${pos}`}
                            aria-label={`Hacer portada a ${pos}`}
                            className="cursor-pointer absolute top-1.5 left-1.5 p-1.5 bg-white/90 text-gray-400 hover:text-[#B02F00] rounded-full shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B02F00]"
                          >
                            <Star size={16} strokeWidth={2.5} />
                          </button>
                        )}
                      </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {fotoVisible && (() => {
                const { tipo, index, item } = fotoVisible;
                const src = tipo === 'actual' ? getAsset(item.imagen) : item.preview;
                const alt = `Foto ${fotoAmpliada + 1} de ${totalFotosGaleria}${tipo === 'nuevo' ? ' (nueva)' : ''}`;
                const esPortada = tipo === 'actual' ? item.id === coverActualId : item.file === coverNuevoFile;
                const hacerPortada = () => {
                  if (tipo === 'actual') {
                    moverActualAlFrente(index);
                    setFotoAmpliada(0);
                  } else {
                    moverNuevoAlFrente(index);
                    setFotoAmpliada(imagenesActuales.length);
                  }
                };
                const quitarVista = () => {
                  if (tipo === 'actual') quitarImagenActual(item.id);
                  else quitarArchivoNuevo(index);
                  setFotoAmpliada(null);
                };
                const miniatura = (pos) => {
                  const esActual = pos < imagenesActuales.length;
                  const it = esActual ? imagenesActuales[pos] : archivosNuevos[pos - imagenesActuales.length];
                  if (!it) return null;
                  const portada = esActual ? it.id === coverActualId : it.file === coverNuevoFile;
                  return (
                    <button
                      key={esActual ? it.id : `n-${pos}`}
                      type="button"
                      onClick={() => setFotoAmpliada(pos)}
                      title={`Ver foto ${pos + 1}`}
                      aria-label={`Ver foto ${pos + 1} de ${totalFotosGaleria}`}
                      className={`relative shrink-0 rounded-md overflow-hidden border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B02F00] ${pos === fotoAmpliada ? 'border-[#B02F00]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img
                        src={esActual ? getAsset(it.imagen) : it.preview}
                        alt=""
                        className="w-16 h-16 object-cover"
                      />
                      {portada && (
                        <span className="absolute bottom-0.5 left-0.5 p-0.5 bg-[#B02F00] text-white rounded">
                          <Star size={9} strokeWidth={2.5} fill="currentColor" />
                        </span>
                      )}
                    </button>
                  );
                };
                return (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
                  onClick={() => setFotoAmpliada(null)}
                  role="dialog"
                  aria-modal="true"
                  aria-label={`Galería: ${alt}`}
                >
                  <div
                    className="relative w-full max-w-3xl bg-white rounded-xl overflow-hidden shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="relative h-[50vh] sm:h-[60vh] flex items-center justify-center bg-[#FDF6EE]">
                      <img
                        src={src}
                        alt={alt}
                        className="h-full w-full object-contain"
                      />
                      {totalFotosGaleria > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={() => irFoto(-1)}
                            title="Foto anterior"
                            aria-label="Foto anterior"
                            className="cursor-pointer absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 text-white hover:bg-black/80 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                          >
                            <ChevronLeft size={20} strokeWidth={2.5} />
                          </button>
                          <button
                            type="button"
                            onClick={() => irFoto(1)}
                            title="Foto siguiente"
                            aria-label="Foto siguiente"
                            className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 text-white hover:bg-black/80 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                          >
                            <ChevronRight size={20} strokeWidth={2.5} />
                          </button>
                        </>
                      )}
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 text-white text-xs font-bold tabular-nums rounded">
                        {fotoAmpliada + 1} / {totalFotosGaleria}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFotoAmpliada(null)}
                        title="Cerrar (Escape)"
                        aria-label="Cerrar vista ampliada"
                        className="cursor-pointer absolute top-2 right-2 p-1.5 bg-black/60 text-white hover:bg-black/80 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        <X size={18} strokeWidth={2.5} />
                      </button>
                    </div>
                    <div className="flex gap-2 overflow-x-auto p-3 bg-white" role="listbox" aria-label="Cinta de fotos">
                      {Array.from({ length: totalFotosGaleria }, (_, pos) => miniatura(pos))}
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-t border-[#e6d5cc] bg-[#fcfdfe]">
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-700">
                        {esPortada && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#B02F00] text-white text-xs font-bold rounded">
                            <Star size={11} strokeWidth={2.5} fill="currentColor" />
                            Portada
                          </span>
                        )}
                        {alt}
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        {!esPortada && (
                          <button
                            type="button"
                            onClick={hacerPortada}
                            className="cursor-pointer px-4 py-2 bg-[#B02F00] hover:bg-[#8a2500] text-white text-sm font-bold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B02F00] focus-visible:ring-offset-2"
                          >
                            Hacer portada
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={quitarVista}
                          className="cursor-pointer px-4 py-2 bg-white border border-red-300 text-red-600 text-sm font-bold rounded-lg hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                        >
                          Quitar
                        </button>
                        <button
                          type="button"
                          onClick={() => setFotoAmpliada(null)}
                          className="cursor-pointer px-4 py-2 bg-white border border-[#e6d5cc] text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B02F00]"
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                );
              })()}

              <div className="bg-[#fff5f2] border border-[#ffdbcc] rounded-xl p-4 flex gap-3 mt-auto">
                <Info className="text-[#B02F00] shrink-0 mt-0.5" size={20} strokeWidth={2} />
                <p className="text-sm text-[#B02F00] font-medium leading-relaxed pr-2">
                  Se recomienda utilizar fondos neutros para resaltar la precisión de las piezas impresas.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>

      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={cerrarModal}
          role="dialog"
          aria-modal="true"
          aria-label={modal.titulo}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${
                  modal.tipo === 'exito' ? 'bg-emerald-50 text-emerald-600'
                  : modal.tipo === 'error' ? 'bg-red-50 text-red-600'
                  : 'bg-[#FFF1EA] text-[#B02F00]'
                }`}>
                  {modal.tipo === 'exito'
                    ? <Check size={22} strokeWidth={2.5} />
                    : modal.tipo === 'error'
                      ? <XCircle size={22} strokeWidth={2} />
                      : <Info size={22} strokeWidth={2} />}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-gray-900">{modal.titulo}</h3>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{modal.mensaje}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 bg-[#fcfdfe] border-t border-[#e6d5cc]">
              <button
                type="button"
                onClick={cerrarModal}
                className="cursor-pointer px-4 py-2 bg-[#B02F00] hover:bg-[#8a2500] text-white text-sm font-bold rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B02F00] focus-visible:ring-offset-2"
              >
                {modal.tipo === 'exito' ? 'Volver al listado' : 'Entendido'}
              </button>
            </div>
            <button
              type="button"
              onClick={cerrarModal}
              title="Cerrar (Escape)"
              aria-label="Cerrar diálogo"
              className="cursor-pointer absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B02F00]"
            >
              <X size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProductCreation;
