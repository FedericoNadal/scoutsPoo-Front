import { useEffect, useState, type SetStateAction } from "react";
import { fetchWithAuth } from "./api/api.ts";


interface ScoutParticipacionesProps {
  scoutId: number;
  setVistaActual: React.Dispatch<React.SetStateAction<string>>;
}

/* DTO que viene del back */
interface ParticipacionDetalleDto {
  participacionId: number;
  scoutId: number;
  scoutNombre: string;
  scoutApellido: string;
  scoutApodo: string;
  scoutSede: string;
  scoutGrupo: string;
  scoutComunidad: string;

  actividadId: number;
  actividadDescripcion: string;
  actividadFecha: string;
  observaciones: string;
}

export function ScoutParticipaciones({
  scoutId,
  setVistaActual
}: ScoutParticipacionesProps) {

  const [participaciones, setParticipaciones] =
    useState<ParticipacionDetalleDto[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/participaciones/scout/${scoutId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Error al obtener participaciones");
        }
        return res.json();
      })
      .then(data => {
        setParticipaciones(data);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [scoutId]);
  const scout = participaciones[0];


  return (
    <div className="container mt-4">

      {/* Header */}
      {participaciones.length > 0 && (
        <>
          <h3>
            "{scout.scoutApodo}"
          </h3>
          <h5>
            {scout.scoutNombre}  {scout.scoutApellido}
          </h5>
          <p className="text-muted">
            Grupo: {scout.scoutGrupo} | Comunidad: {scout.scoutComunidad} | Sede: {scout.scoutSede}
          </p>
        </>
      )}
     

      {/* Estados */}
      {loading && <p>Cargando participaciones...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && participaciones.length === 0 && (
        <div className="alert alert-info">
          No hay participaciones registradas.
        </div>
      )}

      {/* Cards */}
      {!loading && !error && participaciones.length > 0 && (
        <div className="row g-3">
          {participaciones.map((p) => (
            <div key={p.participacionId} className="col-md-6">
              <div className="card shadow-sm h-100">
                <div className="card-body">

                  <h5 className="card-title">
                    {p.actividadDescripcion}
                  </h5>

                  <h6 className="card-subtitle mb-2 text-muted">
                    {new Date(p.actividadFecha).toLocaleDateString()}
                  </h6>

                  <p className="card-text">
                    <strong>Observaciones:</strong><br />
                    {p.observaciones || "Sin observaciones"}
                  </p>

                  <div className="mt-3">
                    <small className="text-muted">
                      Actividad ID: {p.actividadId}
                    </small>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}