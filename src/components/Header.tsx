import { useAuth } from "../auth/AuthContext";


  export function Header() {

    const { user } = useAuth();

    return (
      <header className="Header container-fluid py-4">
        <div className="row align-items-center">

          {/* Imagen */}
          <div className="col-md-4 col-12 text-center">
            <img
              src="src/components/Images/logoScoutsArgentina.jpg"
              alt="Header"
              className="img-fluid rounded shadow"
            />
          </div>

          {/* Texto */}

          {!user && (
             <div className="col-md-8 col-12 mb-3 mb-md-0">
              <div className="user-card">
                <h2> SIGASA </h2>
                <p>
                  {"Sistema de Gestion de actividades para la asociacion se Scouts Argentina"}
                </p>
              </div>
            </div>
          )}

          {user && (
            <div className="col-md-8 col-12 mb-3 mb-md-0">
            <div className="user-card">
              <image>
                <source media="(min-width: )" />

              </image>
              <p>{user.username} </p>
              <p>Graduación: {user.role}</p>
            </div>
            </div>
          )}

        </div>

      </header>
    );
  }


/*  El/La Scout ama a Dios y vive plenamente su Fe.<br />
    El/La Scout es leal y digno/a de toda confianza.<br />
    El/La Scout es generoso/a, cortés y solidario/a.<br />
    El/La Scout es respetuoso/a y hermano/a de todos.<br />
    El/La Scout defiende y valora la familia.<br />
    El/La Scout ama y defiende la vida y la naturaleza.<br />
    El/La Scout sabe obedecer, elige y actúa con responsabilidad.<br />
    El/La Scout es optimista aún en las dificultades.<br />
    El/La Scout es económico/a, trabajador/a y respetuoso/a del bien ajeno.<br />
    El/La Scout es puro/a y lleva una vida sana.<br />
 Yo (….), por mi honor PROMETO hacer cuanto de mí dependa para cumplir mis deberes para con Dios, la Patria, con los demás y conmigo mismo, ayudar al prójimo y vivir la Ley Scout.
    */