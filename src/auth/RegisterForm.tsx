import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { api } from '../components/api/axiosConfig';

interface Props {
  onSuccess: () => void;
}

export default function RegisterForm({ onSuccess }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/usuarios/registro', {
        username,
        password,
      });

      onSuccess();

    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Error al registrar usuario'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Usuario</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Usuario'}
        </Button>
      </Form>
    </>
  );
}