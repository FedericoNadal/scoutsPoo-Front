import React, { useState, useEffect } from 'react';

interface Props {
  valorInicial?: string;
  onChange?: (valor: string) => void;
}
const BotoneraObservaciones: React.FC<Props> = ({
   valorInicial = "",
    onChange }) => {
  
  const opciones = [
    { valor: "ausente", label: "\u{274C}", title: "Sin observación" },
    { valor: "tarde", label: "\u{23F0}", title: "Tarde" },
    { valor: "presente", label: "\u{1F17F}", title: "Presente" },
    { valor: "participa satisfactoriamente", label: "\u{2705}", title: "Participa" },
    { valor: "destaca entre sus compañerxs", label: "\u{1F3C5}", title: "Destaca" }
  ];

  const [seleccionado, setSeleccionado] = useState(valorInicial);

  useEffect(() => {
    setSeleccionado(valorInicial);
  }, [valorInicial]);

  const manejarCambio = (valor: string) => {
    setSeleccionado(valor);
     onChange?.(valor);
  };

  return (
    <div style={{ 
      display: 'flex', 
      border: '1px solid #e2e8f0', 
      borderRadius: '4px',
      overflow: 'hidden',
      width: 'fit-content'
    }}>
      {opciones.map((opcion) => (
        <button
          key={opcion.valor}
          type="button"
          title={opcion.title}
          onClick={() => manejarCambio(opcion.valor)}
          style={{
            padding: '4px 8px',
            border: 'none',
            borderRight: '1px solid #e2e8f0',
            backgroundColor: seleccionado === opcion.valor ? '#4299e1' : 'white',
            color: seleccionado === opcion.valor ? 'white' : '#4a5568',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: seleccionado === opcion.valor ? '600' : '400',
            transition: 'all 0.2s',
            minWidth: '32px',
            textAlign: 'center'
          }}
          onMouseOver={(e) => {
            if (seleccionado !== opcion.valor) {
              e.currentTarget.style.backgroundColor = '#edf2f7';
            }
          }}
          onMouseOut={(e) => {
            if (seleccionado !== opcion.valor) {
              e.currentTarget.style.backgroundColor = 'white';
            }
          }}
        >
          {opcion.label}
        </button>
      ))}
    </div>
  );
};

export default BotoneraObservaciones;