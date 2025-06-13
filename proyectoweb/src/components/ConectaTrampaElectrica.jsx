import React, { useEffect, useState, useRef, useCallback } from 'react';
import '../styles/components/ConectaTrampaElectrica.css';

const TrampaElectrica = () => {
  const [traps, setTraps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTrapName, setNewTrapName] = useState('');
  const [newTrapId, setNewTrapId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [trapToEdit, setTrapToEdit] = useState(null);

  const modalRef = useRef(null);

  const loadTraps = useCallback(() => {
    // Datos simulados de trampas eléctricas
    const initialTraps = [
      { id: 'TE001', name: 'Trampa Principal Entrada' },
      { id: 'TE002', name: 'Trampa Jardín Norte' },
      { id: 'TE003', name: 'Trampa Perímetro Sur' },
      { id: 'TE004', name: 'Trampa Ventana Lateral' }
    ];

    setLoading(true);
    // Simular carga de datos
    setTimeout(() => {
      const sortedTraps = [...initialTraps].sort((a, b) => b.activat - a.activat);
      setTraps(sortedTraps);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    loadTraps();
  }, [loadTraps]);

  useEffect(() => {
    const handleClickOutsideModal = (event) => {
      if (showModal && modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
        setTrapToEdit(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideModal);
    return () => document.removeEventListener('mousedown', handleClickOutsideModal);
  }, [showModal]);

  const generateTrapId = () => {
    const existingIds = traps.map(trap => trap.id);
    let counter = 1;
    let newId;
    do {
      newId = `TE${String(counter).padStart(3, '0')}`;
      counter++;
    } while (existingIds.includes(newId));
    return newId;
  };

  const handleAddTrap = () => {
    if (!newTrapName) {
      alert("Por favor, ingresa el nombre de la trampa eléctrica.");
      return;
    }

    const trapId = newTrapId || generateTrapId();

    if (traps.some(trap => trap.id === trapId)) {
      alert("Ya existe una trampa con esa ID.");
      return;
    }

    const newTrap = {
      id: trapId,
      name: newTrapName,
      activat: 1,
    };

    setTraps((prev) => [...prev, newTrap]);
    setNewTrapName('');
    setNewTrapId('');
    setShowModal(false);
  };

  const handleUpdateTrap = () => {
    if (!newTrapName) {
      alert("Por favor, ingresa el nombre de la trampa.");
      return;
    }

    const updatedTrap = traps.find(t => t.id === trapToEdit);
    if (!updatedTrap) return;

    if (trapToEdit !== newTrapId && traps.some(trap => trap.id === newTrapId)) {
      alert("Ya existe una trampa con esta nueva ID.");
      return;
    }

    setTraps((prev) =>
      prev.map((t) =>
        t.id === trapToEdit
          ? { ...t, id: newTrapId, name: newTrapName }
          : t
      )
    );

    setTrapToEdit(null);
    setShowModal(false);
    setNewTrapName('');
    setNewTrapId('');
  };

  const handleDeleteConfirmation = () => {
    const confirm = window.confirm("¿Estás seguro de que deseas eliminar esta trampa eléctrica? Esta acción no se puede deshacer.");
    if (confirm) {
      handleDeleteTrap(trapToEdit);
    }
  };

  const handleDeleteTrap = (trapId) => {
    setTraps((prev) => prev.filter(trap => trap.id !== trapId));
    setTrapToEdit(null);
    setShowModal(false);
  };

  const handleOpenEditModal = (trapId) => {
    const trap = traps.find((t) => t.id === trapId);
    if (trap) {
      setTrapToEdit(trapId);
      setNewTrapName(trap.name);
      setNewTrapId(trap.id);
      setShowModal(true);
    }
  };

  const handleCancelEdit = () => {
    setTrapToEdit(null);
    setShowModal(false);
    setNewTrapName('');
    setNewTrapId('');
  };

  const handleToggleTrap = (trapId) => {
    const trap = traps.find(t => t.id === trapId);
    if (!trap) return;

    const action = trap.activat === 1 ? 'desactivar' : 'activar';
    const confirmed = window.confirm(`¿Estás seguro de que deseas ${action} la trampa "${trap.name}"?`);

    if (confirmed) {
      setTraps((prev) =>
        prev.map((t) =>
          t.id === trapId ? { ...t, activat: t.activat === 1 ? 0 : 1 } : t
        )
      );
    }
  };

  return (
    <div className="te-container">
      <div className="te-content">
        <div className="te-header">
          <div className="te-title-section">
            <span className="te-icon">⚡</span>
            <h1 className="te-title">Trampa Eléctrica</h1>
          </div>
          <p className="te-subtitle">Sistema de gestión de trampas eléctricas de seguridad</p>
        </div>

        <div className="te-add-button-container">
          <button
            className="te-add-button"
            onClick={() => {
              setNewTrapName('');
              setNewTrapId('');
              setTrapToEdit(null);
              setShowModal(true);
            }}
          >
            <span className="te-button-icon">➕</span>
            Añadir Trampa Eléctrica
          </button>
        </div>

        {loading ? (
          <div className="te-loading">
            <div className="te-spinner"></div>
            <p>Cargando trampas eléctricas...</p>
          </div>
        ) : traps.length > 0 ? (
          <>
            <h2 className="te-devices-title">
              Trampas Eléctricas Registradas: {traps.length}
            </h2>
            <div className="te-grid">
              {traps.map((trap) => (
                <div
                  key={trap.id}
                  className={`te-card ${trap.activat === 1 ? 'te-card-active' : ''}`}
                >
                  <button
                    onClick={() => handleOpenEditModal(trap.id)}
                    className="te-edit-button"
                  >
                    <span>✏️</span>
                  </button>

                  <div className="te-card-header">
                    <h3 className="te-card-title">{trap.name}</h3>
                  </div>

                  <div className="te-card-info">
                    <p><span className="te-info-label">ID:</span> {trap.id}</p>
                  </div>

                  {trap.activat === 1 && (
                    <button
                      onClick={() => handleToggleTrap(trap.id)}
                      className="te-toggle-button te-deactivate"
                    >
                      <span>🔴</span>
                      Desactivar
                    </button>
                  )}

                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="te-no-devices">
            <span className="te-no-devices-icon">⚡</span>
            <p>No tienes trampas eléctricas registradas.</p>
          </div>
        )}

        {/* Modal para añadir/editar trampa */}
        {showModal && (
          <div className="te-modal-overlay">
            <div ref={modalRef} className="te-modal">
              <h2 className="te-modal-title">
                {trapToEdit ? 'Editar Trampa Eléctrica' : 'Añadir Nueva Trampa'}
              </h2>

              <div className="te-modal-inputs">
                <input
                  type="text"
                  value={newTrapName}
                  onChange={(e) => setNewTrapName(e.target.value)}
                  placeholder="Nombre de la trampa eléctrica"
                  className="te-input"
                />

                <input
                  type="text"
                  value={newTrapId}
                  onChange={(e) => setNewTrapId(e.target.value)}
                  placeholder={trapToEdit ? "ID de la trampa" : "ID de la trampa (opcional)"}
                  className="te-input"
                />
              </div>

              <div className="te-modal-buttons">
                {trapToEdit ? (
                  <>
                    <button
                      onClick={handleUpdateTrap}
                      className="te-modal-button te-save-button"
                    >
                      Guardar Cambios
                    </button>
                    <button
                      onClick={handleDeleteConfirmation}
                      className="te-modal-button te-delete-button"
                    >
                      <span>🗑️</span>
                      Eliminar
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="te-modal-button te-cancel-button"
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleAddTrap}
                      className="te-modal-button te-add-modal-button"
                    >
                      Añadir Trampa
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="te-modal-button te-cancel-button"
                    >
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrampaElectrica;