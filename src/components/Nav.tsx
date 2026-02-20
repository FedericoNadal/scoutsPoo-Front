import { useState } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';
import LoginForm from '../auth/LoginForm';
import { useAuth } from '../auth/AuthContext';


export function Nav() {
  const [showLogin, setShowLogin] = useState(false);
  const { user, logout } = useAuth();

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

      {user ? (
        <Button
          className="nav-login-btn"
          onClick={logout}
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

      {!user && (
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
              }}
            />
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </nav>
  );
}
