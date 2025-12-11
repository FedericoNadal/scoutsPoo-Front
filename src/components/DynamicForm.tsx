import { useEffect, useState } from "react";
import { api } from "./api/axiosConfig";


//campos que requieren lista desplegables
const camposSelect: Record<string, string> = {
  sede: "/sedes",
  comunidad: "/comunidades",
  grupo: "/grupo",   ///AHHH singular! esta incoherencia es una pesadilla estructural, tengo q arregeglala pronto pero viene desde las entidades
  graduacion: "/graduaciones"
};


interface DynamicFormProps {
  vistaActual: string;
  fields?: string[]; // opcional si se quiere derivarlas de initialData
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
}

export function DynamicForm({
  vistaActual,
  fields,
  initialData = {},
  onSubmit
}: DynamicFormProps) {

  // si no vienen fields, se pueden derivar de initialData
  const formFields = fields || Object.keys(initialData);

  const [schema, setSchema] = useState<string[]>([]);
  const [form, setForm] = useState<Record<string, any>>(initialData);
  const [opciones, setOpciones] = useState<Record<string, any[]>>({});


  ///////////////////////////////////
//USE EFFECT
///////////////////////////////////////////
// 
useEffect(() => {
  let isMounted = true; // para evitar setState si el componente se desmonta

  async function fetchData() {
    try {
      const res = await api.get(`/${vistaActual}`);
      const ejemplo = res.data[0];

      if (!ejemplo || !isMounted) return;

      const campos = Object.keys(ejemplo);
      setSchema(campos);

      // Para cada campo que necesita select, hacemos GET paralelo
      const opts: Record<string, any[]> = {};
      await Promise.all(
        campos.map(async (campo) => {
          if (camposSelect[campo]) {
            const r = await api.get(camposSelect[campo]);
            opts[campo] = r.data;
          }
        })
      );

      if (isMounted) setOpciones(opts);
    } catch (err) {
      console.error("Error cargando schema:", err);
    }
  }

  fetchData();

  return () => {
    isMounted = false;
  };
}, [vistaActual]);



  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }


  //submit  
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }
  /////////////////////////////////////////
  //RETURN
  ///////////////////////////////////////////

 return (
  <form onSubmit={handleSubmit}>
    {schema
      .filter((_, index) => index !== 0) // ocultar primer campo
      .map((campo) => (
        <div key={campo} className="mb-3">
          <label className="form-label">{campo}</label>

         {camposSelect[campo] ? (
  campo === "graduacion" ? (
    // Select para graduaciones (array de strings)
    <select
      className="form-select"
      name={campo}
      value={form[campo] ?? ""}
      onChange={handleChange}
    >
      <option value="">...</option>
      {opciones[campo]?.map((g: string) => (
        <option key={g} value={g}>{g}</option>
      ))}
    </select>
  ) : (
    // Select para los demás (objetos con id/nombre)
    <select
      className="form-select"
      name={campo}
      value={form[campo] ?? ""}
      onChange={handleChange}
    >
      <option value="">...</option>
      {opciones[campo]?.map((opt: any) => {
        const valor = Object.values(opt)[0] as number; // id
        const texto = Object.values(opt)[1] as string; // nombre
        return <option key={valor} value={valor}>{texto}</option>;
      })}
    </select>
  )
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
  </form>
);

}
