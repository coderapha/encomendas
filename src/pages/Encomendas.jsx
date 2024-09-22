import React, { useState, useEffect } from 'react';
import { ref, set, onValue } from 'firebase/database';
import { database } from '../firebase';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const Encomendas = () => {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [dataEncomenda, setDataEncomenda] = useState('');
  const [cliente, setCliente] = useState('');
  const [itens, setItens] = useState([{ produto: '', quantidade: '' }]);
  const [descricao, setDescricao] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');
  const [encomendas, setEncomendas] = useState([]);

  useEffect(() => {
    const fetchClientes = async () => {
      const clientesRef = ref(database, 'clientes');
      onValue(clientesRef, (snapshot) => {
        const data = snapshot.val() || {};
        setClientes(Object.entries(data).map(([id, cliente]) => ({ id, ...cliente })));
      });
    };

    const fetchProdutos = async () => {
      const produtosRef = ref(database, 'produtos');
      onValue(produtosRef, (snapshot) => {
        const data = snapshot.val() || {};
        setProdutos(Object.entries(data).map(([id, produto]) => ({ id, ...produto })));
      });
    };

    const fetchEncomendas = async () => {
      const encomendasRef = ref(database, 'encomendas');
      onValue(encomendasRef, (snapshot) => {
        const data = snapshot.val() || {};
        setEncomendas(Object.entries(data).map(([id, encomenda]) => ({ id, ...encomenda })));
      });
    };

    fetchClientes();
    fetchProdutos();
    fetchEncomendas();
  }, []);

  const handleAddItem = () => {
    setItens([...itens, { produto: '', quantidade: '' }]);
  };

  const handleRemoveItem = (index) => {
    const newItems = itens.filter((_, i) => i !== index);
    setItens(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = itens.map((item, i) => (
      i === index ? { ...item, [field]: value } : item
    ));
    setItens(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEncomenda = {
      dataEncomenda,
      cliente,
      itens,
      descricao,
      dataEntrega
    };
    const newEncomendaRef = ref(database, 'encomendas/' + Date.now());
    await set(newEncomendaRef, newEncomenda);
    setDataEncomenda('');
    setCliente('');
    setItens([{ produto: '', quantidade: '' }]);
    setDescricao('');
    setDataEntrega('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const generatePDF = (encomenda) => {
    const doc = new jsPDF();
    doc.text(`Data da Encomenda: ${formatDate(encomenda.dataEncomenda)}`, 10, 10);
    doc.text(`Cliente: ${clientes.find(c => c.id === encomenda.cliente)?.nome || 'Desconhecido'}`, 10, 20);
    encomenda.itens.forEach((item, index) => {
      const produto = produtos.find(p => p.id === item.produto);
      doc.text(`Produto ${index + 1}: ${produto?.titulo || 'Desconhecido'}`, 10, 30 + (10 * index));
      doc.text(`Valor do Produto: R$ ${produto?.valor || '0.00'}`, 10, 40 + (10 * index));
      doc.text(`Quantidade: ${item.quantidade}`, 10, 50 + (10 * index));
    });
    doc.text(`Descrição: ${encomenda.descricao || 'Sem descrição'}`, 10, 60 + (10 * encomenda.itens.length));
    doc.text(`Data de Entrega: ${formatDate(encomenda.dataEntrega)}`, 10, 70 + (10 * encomenda.itens.length));
    doc.save('encomenda.pdf');
  };

  return (
    <div className="container">
      <h2>Cadastro de Encomendas</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Data da Encomenda:
          <input
            type="date"
            value={dataEncomenda}
            onChange={(e) => setDataEncomenda(e.target.value)}
            required
          />
        </label>
        <label>
          Cliente:
          <select
            value={cliente}
            onChange={(e) => setCliente(e.target.value)}
            required
          >
            <option value="">Selecione um cliente</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </label>
        {itens.map((item, index) => (
          <div key={index} className="item-form">
            <label>
              Produto:
              <select
                value={item.produto}
                onChange={(e) => handleItemChange(index, 'produto', e.target.value)}
                required
              >
                <option value="">Selecione um produto</option>
                {produtos.map((p) => (
                  <option key={p.id} value={p.id}>{p.titulo}</option>
                ))}
              </select>
            </label>
            <label>
              Quantidade:
              <input
                type="number"
                value={item.quantidade}
                onChange={(e) => handleItemChange(index, 'quantidade', e.target.value)}
                required
              />
            </label>
            {itens.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="icon-button remove-button"
              >
                <i className="fas fa-minus"></i>
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddItem}
          className="icon-button add-button"
        >
          <i className="fas fa-plus"></i>
        </button>
        <div style={{ marginTop: '10px' }}>
          <label>
            Descrição:
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </label>
        </div>
        <label>
          Data de Entrega:
          <input
            type="date"
            value={dataEntrega}
            onChange={(e) => setDataEntrega(e.target.value)}
            required
          />
        </label>
        <button type="submit">Cadastrar Encomenda</button>
      </form>
      <h2>Encomendas Cadastradas</h2>
      <table>
        <thead>
          <tr>
            <th>Data da Encomenda</th>
            <th>Cliente</th>
            <th>Produto</th>
            <th>Valor do Produto</th>
            <th>Quantidade</th>
            <th>Descrição</th>
            <th>Data de Entrega</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {encomendas.map((encomenda) => (
            <React.Fragment key={encomenda.id}>
              {encomenda.itens.map((item, index) => (
                <tr key={`${encomenda.id}-${index}`}>
                  {index === 0 && (
                    <td rowSpan={encomenda.itens.length}>{formatDate(encomenda.dataEncomenda)}</td>
                  )}
                  {index === 0 && (
                    <td rowSpan={encomenda.itens.length}>{clientes.find(c => c.id === encomenda.cliente)?.nome || 'Desconhecido'}</td>
                  )}
                  <td>{produtos.find(p => p.id === item.produto)?.titulo || 'Desconhecido'}</td>
                  <td>R$ {produtos.find(p => p.id === item.produto)?.valor || '0.00'}</td>
                  <td>{item.quantidade}</td>
                  {index === 0 && (
                    <td rowSpan={encomenda.itens.length}>{encomenda.descricao || 'Sem descrição'}</td>
                  )}
                  {index === 0 && (
                    <td rowSpan={encomenda.itens.length}>{formatDate(encomenda.dataEntrega)}</td>
                  )}
                  {index === 0 && (
                    <td rowSpan={encomenda.itens.length}>
                      <button
                        type="button"
                        onClick={() => generatePDF(encomenda)}
                        className="icon-button pdf-button"
                      >
                        <i className="fas fa-file-alt"></i>
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Encomendas;
