import { useState } from "react";
import './App.css';
import { MenuLateral } from "./components/MenuLateral";
import { Display } from "./components/Display";
import { Nav } from "./components/Nav";
import { Header } from "./components/Header";
import MenuSuperior from "./components/MenuSuperior";

export default function App() {
  const [vistaActual, setVistaActual] = useState("actividades");
  const [menuOpen, setMenuOpen] = useState(true); // estado del menú

  return (
    <div className="container-fluid">
      <Nav />
      <Header />
   
      <button
          className="btn btn-outline-secondary btn-sm"
          onClick={menuOpen ?
            () => setMenuOpen(false):
            () => setMenuOpen(true)
          }
        >
          . . .
        </button>
      <div className="row">
        {menuOpen && (
          <div className="col-2">
            <MenuLateral setVistaActual={setVistaActual} toggleMenu={setMenuOpen} />
          </div>
        )}

        <div className={menuOpen? "col-md-10" : "col-12"}>
          <Display vistaActual={vistaActual} />
        </div>
      </div>
    </div>
  );
}

   /////////////// 
  /*return (
    <div className="container-fluid">
      <Nav />
          <Header />
       <MenuSuperior setVistaActual={setVistaActual}  />
        <div className="container-fluid p-3">
      <div className="row">
        <div className="col-2"><MenuLateral setVistaActual={setVistaActual} /></div>
        <div className="col-9"><Display vistaActual={vistaActual} /></div>
      </div>
       </div>
     
      
    </div>
  );
*/
  
