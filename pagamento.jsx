import { useState } from "react";

export default function Pagamento() {
  const [carrinho, setCarrinho] = useState([]);
  const [produto, setProduto] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [preco, setPreco] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const adicionarItem = () => {
    if (!produto || !quantidade || !preco)
      return alert("Preencha todos os campos do item.");
    setCarrinho([
      ...carrinho,
      {
        nome: produto,
        quantidade: parseInt(quantidade),
        preco: parseFloat(preco),
      },
    ]);
    setProduto("");
    setQuantidade(1);
    setPreco("");
  };

  const pagar = async () => {
    const items = carrinho.map((item) => ({
      title: item.nome,
      quantity: item.quantidade,
      unit_price: item.preco,
      currency_id: "BRL",
    }));

    const res = await fetch("/api/pagamento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        payer: { name: nome, email },
        back_urls: {
          success: "https://sualoja.com/sucesso",
          pending: "https://sualoja.com/pendente",
          failure: "https://sualoja.com/erro",
        },
        external_reference: email,
      }),
    });

    const data = await res.json();
    if (data.init_point) {
      window.location.href = data.init_point;
    } else {
      alert("Erro ao iniciar pagamento");
    }
  };

  return (
    <div className="p-4 max-w-screen-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Pagamento</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Produto"
          value={produto}
          onChange={(e) => setProduto(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Quantidade"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Preço"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={adicionarItem} className="bg-blue-500 text-white p-2">
          Adicionar
        </button>
      </div>

      <ul className="mb-4">
        {carrinho.map((item, idx) => (
          <li key={idx}>
            {item.quantidade}x {item.nome} - R$ {item.preco.toFixed(2)}
          </li>
        ))}
      </ul>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2"
        />
      </div>

      <button onClick={pagar} className="bg-green-600 text-white p-2">
        Pagar
      </button>
    </div>
  );
}