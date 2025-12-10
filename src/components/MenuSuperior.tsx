
type Props = {
  setVistaActual: (v: string) => void;
};

export default function MenuLateral({ setVistaActual }: Props) {

  return (
     <div className="d-md-none">
    <ul className="list-group">

      <li className="list-group-item" onClick={() => setVistaActual("sedes")}>
        Sedes
      </li>

      <li className="list-group-item" onClick={() => setVistaActual("comunidades")}>
        Comunidades
      </li>

      <li className="list-group-item" onClick={() => setVistaActual("grupos")}>
        Grupos
      </li>

      <li className="list-group-item" onClick={() => setVistaActual("actividades")}>
        Actividades
      </li>

      <li className="list-group-item" onClick={() => setVistaActual("scouts")}>
        Scouts
      </li>

    </ul>
  </div>
  );
}
