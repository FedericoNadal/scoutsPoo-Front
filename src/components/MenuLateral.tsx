type Props = {
  setVistaActual: (v: string) => void;  // Permite cambiar la vista en el Display
  toggleMenu: (open: boolean) => void;  // Permite abrir/cerrar el menú lateral
};

export function MenuLateral({ setVistaActual, toggleMenu }: Props) {
  return (
    <ul className="list-group">
   
      <li className="list-group-item text-center" onClick={() => setVistaActual("actividades")}>
        Actividades
      </li>
      <li className="list-group-item text-center" onClick={() => setVistaActual("scouts")}>
        Scouts
      </li>
         <li className="list-group-item text-center" onClick={() => setVistaActual("sedes")}>
        Sedes
      </li>
      <li className="list-group-item text-center" onClick={() => setVistaActual("comunidades")}>
        Comunidades
      </li>
      <li className="list-group-item text-center" onClick={() => setVistaActual("grupo")}>
        Grupos
      </li>
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
