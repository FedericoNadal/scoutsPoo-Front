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

  // Cargar datos
  const cargarDatos = async () => {
    setLoading(true);
    try {
      const res = await api.get("/" + vistaActual);
      setData(res.data);
    } catch (err) {
      console.error("Error cargando datos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [vistaActual]);

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
                {vistaActual === "actividades" && (
                  <>
                    <button className="btn btn-primary btn-sm me-1">
                      TOMAR ASISTENCIAS
                    </button>
                    <button className="btn btn-secondary btn-sm me-1">
                      INSCRIPCIONES
                    </button>
                  </>
                )}
                <button
                  className="btn btn-warning btn-sm me-1"
                  onClick={() => {
                    setFormMode("edit");
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal dinámico */}
      {showModal && (
        <FormModal
          show={showModal}
          onClose={() => setShowModal(false)}
          title={formMode === "create" ? `Nueva ${vistaActual}` : `Editar ${vistaActual}`}
        >
          <DynamicForm
            vistaActual={vistaActual}
            initialData={initialValues}
            onSubmit={async (formData) => {
              try {
                if (formMode === "create") {
                  await api.post(`/${vistaActual}`, formData);
                } else {
                  await api.put(`/${vistaActual}/${initialValues.id}`, formData);
                }
                await cargarDatos();
                setShowModal(false);
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
