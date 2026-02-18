import { Carousel } from "react-bootstrap";
import { useAuth } from "../auth/AuthContext";

export default function CarouselPublico() {
  const { user } = useAuth();

  // Si el usuario está logueado, no mostramos nada
  if (user) return null;

  return (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100 h-80"
         src="src/components/Images/foto2Scouts.webp"
          alt="Primera slide"
        />
        <Carousel.Caption>
          <h3>Bienvenido</h3>
          <p>Sistema de gestión scout</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100 h-80"
          src="src/components/Images/foto1Scouts.webp"
          alt="Segunda slide"
        />
        <Carousel.Caption>
          <h3>Organizá tus actividades</h3>
          <p>Gestioná comunidades y sedes fácilmente</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
        src="src/components/Images/foto3Scouts.jpg"
          alt="Tercera slide"
        />
        <Carousel.Caption>
          <h3>Acceso por roles</h3>
          <p>Permisos diferenciados según perfil</p>
        </Carousel.Caption>
      </Carousel.Item>

       <Carousel.Item>
        <img
          className="d-block w-100"
        src="src/components/Images/foto4Scouts.jpg"
          alt="Tercera slide"
        />
        <Carousel.Caption>
          <h3>Trabajo final para Programacion 2 - INSPT-UTN</h3>
          <p>:)</p>
        </Carousel.Caption>
      </Carousel.Item>


    </Carousel>
  );
}
