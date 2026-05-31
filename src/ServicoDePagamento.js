class ServicoDePagamento {
  constructor() {
    this.pagamentos = [];
  }

  pagar(codigoBarras, empresa, valor) {
    const categoria = valor > 100 ? "cara" : "padrão";

    this.pagamentos.push({
      codigoBarras: codigoBarras,
      empresa: empresa,
      valor: valor,
      categoria: categoria,
    });
  }

  consultarUltimoPagamento() {
    if (this.pagamentos.length === 0) {
      return null;
    }
    return this.pagamentos[this.pagamentos.length - 1];
  }
}

module.exports = ServicoDePagamento;
