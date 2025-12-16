import { useEffect, useState } from "react";
import { api } from "./api/axiosConfig";
import { FormModal } from "./FormModal";
import { DynamicForm } from "./DynamicForm";

type Fila = Record<string, any>;

interface Props {
  vistaActual: string;
}

export function Display({ vistaActual }: Props) {
  const [data, setData] = useState<Fila[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [initialValues, setInitialValues] = useState<Record<string, any>>({});
  const [vistaModal, setVistaModal] = useState<string | null>(null);
  const [actividadSeleccionada, setActividadSeleccionada] = useState<number | null>(null);
  const [modoAsistencia, setModoAsistencia] = useState(false);


  const editableFieldsMap: Record<string, string[]> = {
    comunidades: ["actividadPrincipal"],

    grupo: ["descripcion"],
    sedes: ["nombre", "direccion", "provincia", "localidad"],
    scouts: ["nombre", "apellido", "graduacion"],
    actividades: ["descripcion"],
    participaciones: ["observaciones"],

  };

  const cargarDatos = async () => {
    setLoading(true);
    try {
      let res;

      if (modoAsistencia && actividadSeleccionada) {
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
          <th>Fecha</th>
          <th>Estado</th>
          <th>Observaciones</th>
          <th>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                setModoAsistencia(false);
                setActividadSeleccionada(null);
              }}
            >
              ← Volver
            </button>
          </th>
        </tr>
      );
    }
    const columnasMap: Record<string, string[]> = {
      actividades: ["ID", "Descripcion", "Inscriptos"],
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
          <td>{fila.fecha}</td>
          <td>{fila.estado ?? "pendiente"}</td>
          <td>{fila.observaciones}</td>
        </>
      );
    }
    switch (vistaActual) {
      case "actividades":
        return (
          <>
            <td>{fila.id}</td>
            <td>{fila.descripcion}</td>
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
            <td>{fila.id}</td>
            <td>{fila.apodo}</td>
            <td>{fila.nombre + " " + fila.apellido}</td>
            <td>{fila.graduacion}</td>
          </>
        );
      default:
        return <td>Sin formato</td>;
    }
  };


  //fitrar payload del update
  const buildUpdatePayload = (vista: string, data: any) => {
    const allowed = editableFieldsMap[vista] ?? [];
    return Object.fromEntries(
      Object.entries(data)
        .filter(([key]) => allowed.includes(key))
        .filter(([_, v]) => v !== undefined && v !== "")
    );
  };



  if (loading) return <p className="text-light">Cargando...</p>;

  return (
    <>
      <table className="table table-dark table-striped">
        <thead>{renderHead()}</thead>
        <tbody>
          {data.map((fila, i) => (
            <tr key={i}>
              {renderFila(fila)}
              <td>
                {!modoAsistencia && vistaActual === "actividades" && (
                  <>
                    <button
                      className="btn btn-primary btn-sm me-1"
                      onClick={() => {
                        setActividadSeleccionada(fila.id);
                        setModoAsistencia(true);
                      }}
                    >
                      TOMAR ASISTENCIAS
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
                      INSCRIPCIONES
                    </button>
                  </>
                )}


                {!modoAsistencia && (
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
                      Editar
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(fila)}
                    >
                      Eliminar
                    </button>
                  </>
                )}


                ///////////////////////////////////////////////
                    MODO ASISTENCIA
                ///////////////////////////////////////////////

                {modoAsistencia && (
                  <button className="btn btn-success btn-sm">
                    Marcar presente
                  </button>
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
              ? `Nueva ${vistaModal ?? vistaActual}`
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