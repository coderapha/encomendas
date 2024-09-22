// src/pages/Produtos.jsx
import { useState, useEffect } from 'react';
import { database, ref, set, get } from '../firebase';

function Produtos() {
  const [titulo, setTitulo] = useState('');
  const [valor, setValor] = useState('');
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const fetchProdutos = async () => {
      const produtosRef = ref(database, 'produtos');
      const snapshot = await get(produtosRef);
      if (snapshot.exists()) {
        setProdutos(Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data })));
      } else {
        console.log('Nenhum produto encontrado');
      }
    };

    fetchProdutos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const produtoId = Date.now(); // Usando timestamp como ID único
    try {
      await set(ref(database, 'produtos/' + produtoId), { titulo, valor });
      console.log('Produto cadastrado com sucesso');
      setTitulo('');
      setValor('');
      // Atualize a lista de produtos após a inserção
      const produtosRef = ref(database, 'produtos');
      const snapshot = await get(produtosRef);
      if (snapshot.exists()) {
        setProdutos(Object.entries(snapshot.val()).map(([id, data]) => ({ id, ...data })));
      }
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Gestão de Produtos</h1>
      </header>
      <main>
        <div className="form-container">
          <h2>Cadastro de Produtos</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="titulo">Título:</label>
            <input
              type="text"
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título do produto"
              required
            />

            <label htmlFor="valor">Valor:</label>
            <input
              type="number"
              id="valor"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="Valor do produto"
              required
            />

            <button type="submit">Cadastrar</button>
          </form>
        </div>
        <div className="table-container">
          <h2>Produtos Cadastrados</h2>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {produtos.map(produto => (
                <tr key={produto.id}>
                  <td>{produto.titulo}</td>
                  <td>{produto.valor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Produtos;
