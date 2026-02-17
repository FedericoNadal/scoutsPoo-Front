import { useState, useEffect } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';
import LoginForm from '../auth/LoginForm';

export function Nav() {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.reload(); 
  };

  return (
    <nav className="Nav">
      <div className="nav-links">
        <a href="https://scouts.org.ar/" className="nav-item">
          Scouts Argentina
        </a>
        <a href="https://scouts.org.ar/biblioteca" className="nav-item">
          Biblioteca
        </a>
      </div>

      {isLoggedIn ? (
        <Button
          className="nav-login-btn"
          onClick={handleLogout}
        >
          Cerrar Sesión
        </Button>
      ) : (
        <Button
          className="nav-login-btn"
          onClick={() => setShowLogin(true)}
        >
          Iniciar Sesión
        </Button>
      )}

      <Offcanvas
        show={showLogin}
        onHide={() => setShowLogin(false)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Iniciar Sesión</Offcanvas.Title>
         </Offcanvas.Header>

        <Offcanvas.Body>
          <LoginForm
            onSuccess={() => {
              setShowLogin(false);
              window.location.reload();
              setIsLoggedIn(true);
            }}
          />
        </Offcanvas.Body>
      </Offcanvas>
    </nav>
  );
}
