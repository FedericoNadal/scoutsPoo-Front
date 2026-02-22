import { useAuth } from "../auth/AuthContext";

type Props = {
  setVistaActual: (v: string) => void;  // Permite cambiar la vista en el Display
  toggleMenu: (open: boolean) => void;  // Permite abrir/cerrar el menú lateral
};

export function MenuLateral({ setVistaActual, toggleMenu }: Props) {
  const { user } = useAuth();

  if (!user) return null;
  return (
    <ul className="list-group">

      {user.role !== "EDUCADOR" && (
        <li
          className="list-group-item text-center"
          onClick={() => setVistaActual("misActividades")}
        >
          Mis Actividades
        </li>
      )}
      <li className="list-group-item text-center" onClick={() => setVistaActual("actividades")}>
        Actividades
      </li>

      {user.role !== "SCOUT" && (
        <li className="list-group-item text-center" onClick={() => setVistaActual("scouts")}>
          Scouts
        </li>
      )}
      {user.role !== "SCOUT" && (
      <li className="list-group-item text-center" onClick={() => setVistaActual("sedes")}>
        Sedes
      </li>
      )}
      {user.role !== "SCOUT" && (
        <li className="list-group-item text-center" onClick={() => setVistaActual("comunidades")}>
          Comunidades
        </li>
      )}
      {user.role !== "SCOUT" && (
        <li className="list-group-item text-center" onClick={() => setVistaActual("grupo")}>
          Grupos
        </li>
      )}
      <li className="list-group-item text-center">


      </li>
    </ul>
  );
}
/*<button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => toggleMenu(false)}
        >
          Cerrar menú
        </button>
*/
