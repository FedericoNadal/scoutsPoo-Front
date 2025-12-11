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
  fields?: string[]; // opcional si querés derivarlas de initialData
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
    api.get(`/${vistaActual}`)
      .then(res => {
        const ejemplo = res.data[0];
        if (ejemplo) {

          const campos = Object.keys(ejemplo);
          setSchema(campos);
          campos.forEach(campo => {
            if (camposSelect[campo]) {
              api.get(camposSelect[campo]).then(r => {
                setOpciones(prev => ({
                  ...prev,
                  [campo]: r.data   // guardamos toda la lista
                }));
              });
            }
          });
        }
      })
      .catch(err => console.error("Error cargando schema:", err));
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

          {camposSelect[campo] ? (    //si debe ser select.. ( desplegable)
            <select
              className="form-select"
              name={campo}
              value={form[campo] ?? ""}
              onChange={handleChange}
            >
              <option value="">...</option>

              {opciones[campo]?.map((opt) => {
                const valor = Object.values(opt)[0] as number; // id
                const texto = Object.values(opt)[1] as string; // nombre

                return (
                  <option key={valor} value={valor}>
                    {texto}
                  </option>
                );
              })}
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
  </form>
);

}
