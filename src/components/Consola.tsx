import { useState } from "react";

interface Props {
  vistaActual: string;
  setVistaActual: (v: string) => void;
}

export function Consola({ vistaActual, setVistaActual }: Props) {
  // Este estado solo controla si la consola está visible
  const [visible, setVisible] = useState(true);

  return (
    <div className="mb-3">

      {/* Botón para abrir/cerrar */}
      <button 
        className="btn btn-secondary mb-2"
        onClick={() => setVisible(!visible)}
      >
        {visible ? "Ocultar consola" : "Mostrar consola"}
      </button>

      {/* Contenedor colapsable */}
      <div className={visible ? "collapse show" : "collapse"}>
        <div className="card card-body bg-dark text-light">

          <h5>Consola</h5>
          <p className="text-muted mb-2">
            Seleccioná qué entidad querés ver:
          </p>

          <div className="btn-group flex-wrap">

            {["actividades", "scouts", "grupo", "sedes", "comunidades"].map((v) => (
              <button
                key={v}
                className={`btn btn-sm ${
                  vistaActual === v ? "btn-primary" : "btn-outline-light"
                }`}
                onClick={() => setVistaActual(v)}
              >
                {v}
              </button>
            ))}

          </div>

        </div>
      </div>
    </div>
  );
}


/*export function Consola({ isLateral = true }: { isLateral?: boolean }) {
  return (
    <div className={isLateral ? "d-none d-md-block" : "d-md-none"}>
      <aside className="input_datos">
        <div className="card" style={{ width: "90%" }}>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">Nuevo item</li>
            <li className="list-group-item"><input type="text" /></li>
            <li className="list-group-item"><input type="text" /></li>
            <li className="list-group-item">
              <button type="submit">Cargar item</button>
            </li>
          </ul>
        </div>
      </aside>
      <div className="segundo_logo">
        <img src="/images/logo_flordDeLiz.png" alt="logo scouts flr de liz" width="90%" />
      </div>
    </div>
  );
}*/

