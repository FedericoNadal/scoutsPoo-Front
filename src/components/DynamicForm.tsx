import { useEffect, useState } from "react";
import { api } from "./api/axiosConfig";

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

  useEffect(() => {
    api.get(`/${vistaActual}`)
      .then(res => {
        const ejemplo = res.data[0];
        if (ejemplo) {
          setSchema(Object.keys(ejemplo));
        }
      })
      .catch(err => console.error("Error cargando schema:", err));
  }, [vistaActual]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      {schema.map((campo) =>
        campo === "id" ? null : (
          <div key={campo} className="mb-3">
            <label className="form-label">{campo}</label>
            <input
              type="text"
              className="form-control"
              name={campo}
              value={form[campo] ?? ""}
              onChange={handleChange}
            />
          
          </div>
          
        )
      )}

      <button className="btn btn-primary" type="submit">
        Guardar
      </button>
    </form>
  );
}
