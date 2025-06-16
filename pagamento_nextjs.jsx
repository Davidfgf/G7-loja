import { useState } from "react";

export default function Pagamento() {
  const [carrinho, setCarrinho] = useState([]);
  const [produto, setProduto] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [preco, setPreco] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");

  const adicionarItem = () => {
    if (!produto || !quantidade || !preco) return alert("Preencha todos os campos do item.");
    setCarrinho([...carrinho, { nome: produto, quantidade: parseInt(quantidade), preco: parseFloat(preco) }]);
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
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">G7 Materiais de Construção</h1>

      <input
        type="text"
        placeholder="Nome"
        className="border p-2 w-full mb-2"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <h2 className="text-xl font-semibold mt-4">Adicionar Produto</h2>
      <input
        type="text"
        placeholder="Produto"
        className="border p-2 w-full mb-2"
        value={produto}
        onChange={(e) => setProduto(e.target.value)}
      />
      <input
        type="number"
        placeholder="Quantidade"
        className="border p-2 w-full mb-2"
        value={quantidade}
        onChange={(e) => setQuantidade(e.target.value)}
      />
      <input
        type="number"
        placeholder="Preço"
        className="border p-2 w-full mb-2"
        value={preco}
        onChange={(e) => setPreco(e.target.value)}
      />
      <button onClick={adicionarItem} className="bg-blue-600 text-white p-2 rounded w-full">Adicionar ao Carrinho</button>

      <div className="mt-4">
        <h2 className="font-semibold">Carrinho</h2>
        {carrinho.map((item, idx) => (
          <div key={idx} className="border-b py-1">
            {item.quantidade}x {item.nome} - R$ {(item.preco * item.quantidade).toFixed(2)}
          </div>
        ))}
      </div>

      <button onClick={pagar} className="bg-green-600 text-white mt-4 p-2 rounded w-full">
        Pagar com Mercado Pago
      </button>
    </div>
  );
}
