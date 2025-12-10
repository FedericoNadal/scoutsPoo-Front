import { useState } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';


export function Nav() {
  const [show, setShow] = useState(false);

  return (
    <nav className="Nav">
      <div className="nav-links">
        <a href="https://scouts.org.ar/" className="nav-item">Scouts Argentina</a>
        <a href="https://scouts.org.ar/biblioteca" className="nav-item">Biblioteca</a>
      </div>

      <Button className="nav-login-btn" onClick={() => setShow(true)}>
        Iniciar Sesión
      </Button>

      <Offcanvas show={show} onHide={() => setShow(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Iniciar Sesión</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* formulario aquí */}
        </Offcanvas.Body>
      </Offcanvas>
    </nav>
  );
}

