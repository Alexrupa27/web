// src/components/ProductosList.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase_settings/firebase';

const ProductosList = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const productosRef = collection(db, 'productos');
        const snapshot = await getDocs(productosRef);
        const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProductos(lista);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>📦 Lista de Productos</h1>
      {loading ? (
        <p>Cargando productos...</p>
      ) : productos.length === 0 ? (
        <p>No hay productos disponibles.</p>
      ) : (
        <ul>
          {productos.map(producto => (
    <li key={producto.id} style={{ marginBottom: '10px' }}>
    <strong>{producto.nombre || 'Sin nombre'}</strong> - ${producto.precio ?? 'N/A'}
    </li>
))}
        </ul>
      )}
    </div>
  );
};

export default ProductosList;
