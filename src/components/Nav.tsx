import { useState } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';
import LoginForm from '../auth/LoginForm';
import RegisterForm from '../auth/RegisterForm';
import { useAuth } from '../auth/AuthContext';

export function Nav() {
  const [showLogin, setShowLogin] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
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
          onClick={() => {
            setShowLogin(true);
            setIsRegistering(false);
          }}
        >
          Iniciar Sesión
        </Button>
      )}

      {!user && (
        <Offcanvas
          show={showLogin}
          onHide={() => {
            setShowLogin(false);
            setIsRegistering(false);
          }}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>
              {isRegistering ? 'Crear Usuario' : 'Iniciar Sesión'}
            </Offcanvas.Title>
          </Offcanvas.Header>

          <Offcanvas.Body>

            {isRegistering ? (
              <>
                <RegisterForm
                  onSuccess={() => {
                    setIsRegistering(false);
                  }}
                />
                <hr />
                <Button
                  variant="link"
                  onClick={() => setIsRegistering(false)}
                >
                  Ya tengo cuenta
                </Button>
              </>
            ) : (
              <>
                <LoginForm
                  onSuccess={() => {
                    setShowLogin(false);
                    window.location.reload();
                  }}
                />
                <hr />
                <Button
                  variant="link"
                  onClick={() => setIsRegistering(true)}
                >
                  Crear usuario nuevo
                </Button>
              </>
            )}

          </Offcanvas.Body>
        </Offcanvas>
      )}
    </nav>
  );
}