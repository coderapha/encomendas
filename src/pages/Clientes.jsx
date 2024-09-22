// src/pages/Clientes.jsx
import { useState, useEffect } from 'react';
import { database, ref, set, get } from '../firebase';

function Clientes() {
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    const fetchClientes = async () => {
      const clientesRef = ref(database, 'clientes');
      const snapshot = await get(clientesRef);
      if (snapshot.exists()) {
        setClientes(Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data })));
      } else {
        console.log('Nenhum cliente encontrado');
      }
    };

    fetchClientes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clienteId = Date.now(); // Usando timestamp como ID único
    try {
      await set(ref(database, 'clientes/' + clienteId), { nome, whatsapp });
      console.log('Cliente cadastrado com sucesso');
      setNome('');
      setWhatsapp('');
      // Atualize a lista de clientes após a inserção
      const clientesRef = ref(database, 'clientes');
      const snapshot = await get(clientesRef);
      if (snapshot.exists()) {
        setClientes(Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data })));
      }
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Gestão de Clientes</h1>
      </header>
      <main>
        <div className="form-container">
          <h2>Cadastro de Clientes</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="nome">Nome:</label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do cliente"
              required
            />

            <label htmlFor="whatsapp">WhatsApp:</label>
            <input
              type="text"
              id="whatsapp"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Número do WhatsApp"
              required
            />

            <button type="submit">Cadastrar</button>
          </form>
        </div>
        <div className="table-container">
          <h2>Clientes Cadastrados</h2>
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>WhatsApp</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(cliente => (
                <tr key={cliente.id}>
                  <td>{cliente.nome}</td>
                  <td>{cliente.whatsapp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Clientes;
