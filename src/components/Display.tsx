import { useEffect, useState, type SetStateAction } from "react";
import { api } from "./api/axiosConfig";
import { FormModal } from "./FormModal";
import { DynamicForm } from "./DynamicForm";
import BotoneraObservaciones from './BotoneraObservaciones';
import { useAuth } from "../auth/AuthContext";
import {ScoutParticipaciones} from "./ScoutParticipaciones";

type Fila = Record<string, any>;

interface Props {
  vistaActual: string;
  setVistaActual: React.Dispatch<React.SetStateAction<string>>;

}

export function Display({ vistaActual,setVistaActual}: Props) {
  const [data, setData] = useState<Fila[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [initialValues, setInitialValues] = useState<Record<string, any>>({});
  const [vistaModal, setVistaModal] = useState<string | null>(null);
  const [actividadSeleccionada, setActividadSeleccionada] = useState<number | null>(null);
  const [modoAsistencia, setModoAsistencia] = useState(false);

  const handleCambioObservacion = async (
    participacionId: number,
    observacion: string
  ) => {
    try {
      await api.put(`/participaciones/${participacionId}`, {
        observaciones: observacion
      });

        // update optimista
      setData(prev =>
        prev.map(p =>
          p.id === participacionId
            ? { ...p, observaciones: observacion }
            : p
        )
      );
    } catch (e) {
      console.error("Error actualizando observación", e);
    }
  };

  const handleCancelarInscripcion = async (participacionId: number) => {
  if (!confirm("¿Cancelar la inscripción de este scout?")) return;
  try {
    await api.delete(`/participaciones/${participacionId}`);
    setData(prev => prev.filter(p => p.id !== participacionId));
  } catch (e) {
    console.error("Error cancelando inscripción", e);
    alert("No se pudo cancelar la inscripción.");
  }
};
  const editableFieldsMap: Record<string, string[]> = {
    actividades: ["descripcion"],
    comunidades: ["actividadPrincipal"],
    grupo: ["denominacion"],
    sedes: ["nombre", "direccion", "provincia", "localidad"],
    scouts: ["nombre", "apellido", "graduacion"],
    participaciones: ["observaciones"],

  };

  const cargarDatos = async () => {
    if (vistaActual.startsWith("scoutParticipaciones-")) {
    return; 
  }
  setLoading(true);

    setLoading(true);
    try {
      let res;
    if (vistaActual === "misActividades") {
      res = await api.get("/actividades/misActividades");
      console.log("misActividades:", res.data);
    } else if (modoAsistencia && actividadSeleccionada) {
        res = await api.get(
          `/actividades/${actividadSeleccionada}/participaciones`
        );
      } else {
        res = await api.get("/" + vistaActual);
      }

      setData(res.data);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    cargarDatos();
  }, [vistaActual, modoAsistencia, actividadSeleccionada]);

  // Eliminar fila
  function handleDelete(fila: Record<string, any>) {
    if (!confirm("¿Seguro que querés eliminar el registro?")) return;

    // Tomamos el primer campo de la fila como ID dinámico
    const keys = Object.keys(fila);
    const idKey = keys[0];       // 'id', 'codigo', 'numero', etc.
    const id = fila[idKey];

    api.delete(`/${vistaActual}/${id}`)
      .then(() => {
        // Filtramos la fila eliminada del estado para forzar re-render
        setData(prev => prev.filter(f => f[idKey] !== id));
      })
      .catch(err => {
        console.error("Error eliminando elemento:", err);
        alert("No se pudo eliminar el elemento.");
      });
  }


  // Cabecera dinámica
  const renderHead = () => {
    if (modoAsistencia) {
      return (
        <tr>
          <th>Scout</th>
          <th>Observaciones</th>
          <th>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => {
                setModoAsistencia(false);
                setActividadSeleccionada(null);
              }}
            >
              ← Volver
            </button>

            <button className="btn btn-outline-primary btn-sm"> 
             {"\u{1F5A8}"}   imprimir</button>
          </th>
        </tr>
      );


    }
    const columnasMap: Record<string, string[]> = {
      misActividades: ["ID", "Descripcion", "Fecha", "Observaciones"],
      actividades: ["ID", "Descripcion", "Fecha", "Inscriptos"],
      sedes: ["COD", "Nombre", "Dirección"],
      comunidades: ["Num", "Act. Principal"],
      grupo: ["Cod.", "Denominación"],
      scouts: ["Id", "Apodo", "Nombre", "Graduación"],
    };

    const columnas = columnasMap[vistaActual] || ["Dato"];

    return (
      <tr>
        {columnas.map((col, i) => (
          <th key={i}>{col}</th>
        ))}
        <th>
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-success btn-sm"
              onClick={() => {
                setFormMode("create");
                setVistaModal(vistaActual); // formulario normal
                setInitialValues({});
                setShowModal(true);
              }}
            >
              NUEVA +
            </button>
          </div>
        </th>
      </tr>
    );
  };

  // Fila dinámica
  const renderFila = (fila: Fila) => {
    if (modoAsistencia) {
      return (
        <>
          <td>{fila.scout?.apodo ?? "—"}</td>

          <td>{fila.observaciones}</td>
        </>
      );
    }
    switch (vistaActual) {
      case "misActividades":
        return (
          <>
            <td>{fila.id}</td>
            <td>{fila.descripcionActividad}</td>
            <td>{fila.fechaActividad}</td>
            <td>{fila.observaciones}</td>
          </>
        );
      case "actividades":
        return (
          <>
            <td>{fila.id}</td>
            <td>{fila.descripcion}</td>
            <td>{fila.fecha}</td>
            <td>{fila.participaciones?.length ?? 0}</td>
          </>
        );
      case "sedes":
        return (
          <>
            <td>{fila.codigo}</td>
            <td>{fila.nombre}</td>
            <td>{fila.direccion}</td>
          </>
        );
      case "comunidades":
        return (
          <>
            <td>{fila.numero}</td>
            <td>{fila.actividadPrincipal}</td>
          </>
        );
      case "grupo":
        return (
          <>
            <td>{fila.codigo}</td>
            <td>{fila.denominacion}</td>
          </>
        );
      case "scouts":
        return (
           <>
            <td><button className="btn btn-outline-info btn-sm"
    onClick={() => setVistaActual(`scoutParticipaciones-${fila.id}`)}>{fila.id}</button></td>
            <td>{fila.apodo}</td>
            <td>{fila.nombre + " " + fila.apellido}</td>
            <td>{fila.graduacion}</td>
          </>
        );
      default:
        return <td>Sin formato</td>;
    }
  };
if (vistaActual.startsWith("scoutParticipaciones-")) {
  const scoutId = Number(vistaActual.split("-")[1]);
  return <ScoutParticipaciones scoutId={scoutId} setVistaActual={function (value: SetStateAction<string>): void {
    throw new Error("Function not implemented.");
  } } />;
}

  //fitrar payload del update
  const buildUpdatePayload = (vista: string, data: any) => {
    const allowed = editableFieldsMap[vista] ?? [];
    return Object.fromEntries(
      Object.entries(data)
        .filter(([key]) => allowed.includes(key))
        .filter(([_, v]) => v !== undefined && v !== "")
    );
  };


  const { user } = useAuth();
  if (loading) return <p className="text-light">Cargando...</p>;
  
  if (!user) return null;
 
  return (
    <>
      <table className="table table-dark table-striped">
        <thead>{renderHead()}</thead>
        <tbody>
          {data.map((fila, i) => (
            <tr key={i}>
              {renderFila(fila)}
              <td>
                {!modoAsistencia && vistaActual === "actividades" && user.role !== "SCOUT" && (
                  <>
                    <button
                      className="btn btn-primary btn-sm me-1"
                      onClick={() => {
                        setActividadSeleccionada(fila.id);
                        setModoAsistencia(true);
                      }}
                    >
                      {'\u{1F9CD}'}{/* ASISTENCIAS - emoji lista */}


                      {'\u{1F9CD}'}{/* ASISTENCIAS - emoji lista */}
                      {'\u{200D}'}{/* ASISTENCIAS - emoji lista */}
                      {'\u{2640}'}{/* ASISTENCIAS - emoji lista */}
                      {'\u{FE0F}'}{/* ASISTENCIAS - emoji lista */}

                      {'\u{1F9CD}'}{/* ASISTENCIAS - emoji lista */}

                      {'\u{1F9CD}'}{/* ASISTENCIAS - emoji lista */}
                      {'\u{200D}'}{/* ASISTENCIAS - emoji lista */}
                      {'\u{2642}'}{/* ASISTENCIAS - emoji lista */}
                      {'\u{FE0F}'}{/* ASISTENCIAS - emoji lista */}

                      {'\u{1F4DD}'}{/* ASISTENCIAS - emoji lista */}
                    </button>


                    <button
                      className="btn btn-secondary btn-sm me-1"
                      onClick={() => {
                        setFormMode("create");
                        setVistaModal("participaciones");
                        setInitialValues({
                          actividadId: fila.id,
                          observaciones: "pendiente"
                        });
                        setShowModal(true);
                      }}
                    >
                      + {'\u{1F464}'}{/* INSCRIPCIONES - emoji +personita */}


                    </button>
                  </>
                )}


                {!modoAsistencia && vistaActual !== "misActividades" && user.role !== "SCOUT" &&(
                  <>
                    <button
                      className="btn btn-warning btn-sm me-1"
                      onClick={() => {
                        setFormMode("edit");
                        setVistaModal(null);
                        setInitialValues(fila);
                        setShowModal(true);
                      }}
                    >
                      {'\u270E'}{/* EDITAR - emoji lapiz */}
                    </button>


                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(fila)}
                    >
                      {'\u{1F5D1}'} {/* BORRAR - emoji cesto */}
                    </button>
                  </>
                )}

              {modoAsistencia && (
  <div className="d-flex align-items-center gap-3">
    <BotoneraObservaciones
      valorInicial={fila.observaciones ?? ""}
      onChange={(valor) =>
        handleCambioObservacion(fila.id, valor)
      }
    />
    <button
      className="btn btn-outline-danger btn-sm ms-2"
      title="Cancelar inscripción"
      onClick={() => handleCancelarInscripcion(fila.id)}
    >
      🚫baja
    </button>
  </div>
)}
                 
             </td>
                    
                </tr>
          ))}
        </tbody>
      </table>





      {/* MODAL ÚNICO */}
      {showModal && (
        <
          FormModal
          show={showModal}
          onClose={() => {
            setShowModal(false);
            setVistaModal(null);
          }}
          title={
            formMode === "create"
              ? `+ ${vistaModal ?? vistaActual}`
              : `Editar ${vistaModal ?? vistaActual}`
          }
        >


          <DynamicForm
            vistaActual={vistaModal ?? vistaActual}
            initialData={initialValues}
            onSubmit={async (formData) => {
              try {
                const endpoint = vistaModal ?? vistaActual;

                if (formMode === "create") {
                  await api.post(`/${endpoint}`, formData);
                } else {
                  const payload = buildUpdatePayload(endpoint, formData);
                  console.log(payload);
                  console.log(initialValues.id || initialValues.numero || initialValues.codigo);
                  await api.put(`/${endpoint}/${initialValues.id || initialValues.numero || initialValues.codigo}`, payload);
                }

                await cargarDatos();
                setShowModal(false);
                setVistaModal(null);
              } catch (err) {
                console.error("Error guardando formulario:", err);
              }
            }}
          />
        </FormModal>
      )}
    </>
  );
}

//campos EDITABLES
//[
//"actvidad":{"descripcion":string},
// "comunidad":"actividadPrincipal" :string},
// "grupo":{"descripcion":Sting},
// "sede":{"nombre" : "Bibilioteca Sta.Esterlita de Galilea", "direccion": "calle falsa 123", "provincia" : "bsas","localidad":"Merlo"}
//
//"scout":{"graduacion" : string (select) ERROR! recibe multiples campos que no deberian ser editables!Corregir desde back:
//"sede":{"nombre" : "Bibilioteca Sta.Esterlita de Galilea", "direccion": "calle falsa 123", "provincia" : "bsas","localidad":"Merlo"}
//"participacion":{"scoutId": id, "actividadId": id,"fecha":date, "observaciones": string}
//"usuario": not yet implemented
//]