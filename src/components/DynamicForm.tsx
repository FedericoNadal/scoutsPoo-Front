import { useEffect, useState } from "react";
import { api } from "./api/axiosConfig";

// =====================================================
// SCHEMA QUE EL BACKEND ESPERA PARA CADA CREATE
// =====================================================
const schemaPost: Record<string, string[]> = {
  sedes: ["nombre", "direccion", "provincia", "localidad"],
  comunidades: ["actividadPrincipal"],
  grupo: ["denominacion"],
  actividades: ["descripcion"],
  scouts: ["apodo", "nombre", "apellido", "graduacion", "idSede", "idGrupo", "idComunidad"]
};

// =====================================================
// CAMPOS QUE USAN SELECT (según backend)
// =====================================================
const camposSelect: Record<string, string | null> = {
  graduacion: "/graduaciones",
  idSede: "/sedes",
  idGrupo: "/grupo",
  idComunidad: "/comunidades"
};

// =====================================================
// PARA CADA ENDPOINT: qué propiedad usar como texto
// =====================================================
const selectLabel: Record<string, string> = {
  sedes: "nombre",
  grupo: "denominacion",
  comunidades: "actividadPrincipal"
};

interface Props {
  vistaActual: string;     // "sedes", "comunidades", "grupo", "actividades", "scouts"
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
}

export function DynamicForm({
  vistaActual,
  initialData = {},
  onSubmit
}: Props) {

  const [form, setForm] = useState<Record<string, any>>(initialData);
  const [opciones, setOpciones] = useState<Record<string, any[]>>({});

  // =====================================================
  // Cargar opciones de cada select
  // =====================================================
  useEffect(() => {
    async function loadOptions() {
      const entries = Object.entries(camposSelect);

      const results = await Promise.all(
        entries.map(async ([campo, url]) => {
          if (!url) return [campo, []];
          const res = await api.get(url);
          return [campo, res.data];
        })
      );

      setOpciones(Object.fromEntries(results));
    }

    loadOptions();
  }, [vistaActual]);

  // =====================================================
  // handleChange
  // =====================================================
 function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
  const { name, value } = e.target;

  // solo campos que son selects de entidades relacionadas
  const parsedValue = ["idSede", "idGrupo", "idComunidad"].includes(name) 
    ? Number(value) 
    : value;

  setForm(prev => ({ ...prev, [name]: parsedValue }));
}

  // =====================================================
  // handleSubmit → payload EXACTO
  // =====================================================
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const fields = schemaPost[vistaActual];
    if (!fields) {
      console.error("Schema POST no definido para:", vistaActual);
      return;
    }

    const payload: Record<string, any> = {};

    fields.forEach(campo => {
      payload[campo] = form[campo] ?? null;
    });

    //console.log(" Payload enviado:", payload);  

    onSubmit(payload);
  }

  // =====================================================
  // Render
  // =====================================================
  const campos = schemaPost[vistaActual];

  return (
    <form onSubmit={handleSubmit}>
      {campos.map(campo => (
        <div key={campo} className="mb-3">
          <label className="form-label">{campo}</label>

          {/* Si el campo es SELECT */}
          {camposSelect[campo] ? (
            <select
              className="form-select"
              name={campo}
              value={form[campo] ?? ""}
              onChange={handleChange}
            >
              <option value="">...</option>

              {campo === "graduacion"
                ? (
                    opciones[campo]?.map((g: string) => (
                      <option key={g} value={g}>{g}</option>
                    ))
                  )
                : (
                    opciones[campo]?.map((opt: any) => {
                     const id = opt.codigo || opt.id || opt.numero; // según lo que use el backend
  const texto = opt.nombre || opt.denominacion || opt.actividadPrincipal;
  return <option key={id} value={id}>{texto}</option>
                    }
                  )
                  )}

            </select>
          ) : (
            <input
              type="text"
              className="form-control"
              name={campo}
              value={form[campo] ?? ""}
              onChange={handleChange}
            />
          )}

        </div>
      ))}

      <button type="submit" className="btn btn-primary">
        Guardar
      </button>
    </form>
  );
}
