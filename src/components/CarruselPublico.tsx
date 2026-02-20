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
         <h3>LEY SCOUT</h3>
         <p>El/La Scout ama a Dios y vive plenamente su Fe.<br />
          El/La Scout es leal y digno/a de toda confianza.<br />
         </p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100 h-80"
          src="src/components/Images/foto1Scouts.webp"
          alt="Segunda slide"
        />
        <Carousel.Caption>
         <h3>LEY SCOUT</h3>
          <p> El/La Scout es generoso/a, cortés y solidario/a.<br />
    El/La Scout es respetuoso/a y hermano/a de todos.</p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
        src="src/components/Images/foto3Scouts.jpg"
          alt="Tercera slide"
        />
        <Carousel.Caption>
          <h3>LEY SCOUT</h3>
          <p> El/La Scout defiende y valora la familia.<br />
            El/La Scout ama y defiende la vida y la naturaleza.</p>
        </Carousel.Caption>
      </Carousel.Item>

       <Carousel.Item>
        <img
          className="d-block w-100"
        src="src/components/Images/foto4Scouts.jpg"
          alt="Tercera slide"
        />
        <Carousel.Caption>
           <h3>LEY SCOUT</h3>
          <p> El/La Scout sabe obedecer, elige y actúa con responsabilidad.<br />
    El/La Scout es optimista aún en las dificultades.</p>
        </Carousel.Caption>
      </Carousel.Item>

<Carousel.Item>
        <img
          className="d-block w-100"
        src="src/components/Images/foto5Scouts.png"
          alt="Tercera slide"
        />
        <Carousel.Caption>
           <h3>LEY SCOUT</h3>
          <p>  El/La Scout es económico/a, trabajador/a y respetuoso/a del bien ajeno.<br />
    El/La Scout es puro/a y lleva una vida sana.</p>
        </Carousel.Caption>
      </Carousel.Item>

    </Carousel>
  );
}

   
   
  