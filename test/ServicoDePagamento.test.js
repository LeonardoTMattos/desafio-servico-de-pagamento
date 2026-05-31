const assert = require("assert");
const ServicoDePagamento = require("../src/ServicoDePagamento");

describe("ServicoDePagamento", () => {
  it("deve iniciar com lista de pagamentos vazia", () => {
    const servico = new ServicoDePagamento();
    assert.deepStrictEqual(servico.pagamentos, []);
  });

  it("deve salvar um pagamento com as informações corretas", () => {
    const servico = new ServicoDePagamento();
    servico.pagar("1234-5678", "Stormwind Bank", 80.0);

    assert.strictEqual(servico.pagamentos[0].codigoBarras, "1234-5678");
    assert.strictEqual(servico.pagamentos[0].empresa, "Stormwind Bank");
    assert.strictEqual(servico.pagamentos[0].valor, 80.0);
  });

  it("deve marcar como cara quando o valor passar de 100", () => {
    const servico = new ServicoDePagamento();
    servico.pagar("9999-0001", "Gadgetzan Finance", 250.0);
    assert.strictEqual(servico.pagamentos[0].categoria, "cara");
  });

  it("deve marcar como padrão quando o valor for até 100", () => {
    const servico = new ServicoDePagamento();
    servico.pagar("9999-0002", "Ironforge Supplies", 99.99);
    assert.strictEqual(servico.pagamentos[0].categoria, "padrão");
  });

  it("deve guardar todos os pagamentos feitos", () => {
    const servico = new ServicoDePagamento();
    servico.pagar("0001", "Stormwind Bank", 80.0);
    servico.pagar("0002", "Gadgetzan Finance", 250.0);
    servico.pagar("0003", "Ironforge Supplies", 99.99);
    assert.strictEqual(servico.pagamentos.length, 3);
  });

  it("deve retornar null se nenhum pagamento foi feito", () => {
    const servico = new ServicoDePagamento();
    assert.strictEqual(servico.consultarUltimoPagamento(), null);
  });

  it("deve retornar o ultimo pagamento feito", () => {
    const servico = new ServicoDePagamento();
    servico.pagar("0001", "Stormwind Bank", 80.0);
    servico.pagar("0002", "Undercity Exports", 320.5);

    const ultimo = servico.consultarUltimoPagamento();
    assert.strictEqual(ultimo.codigoBarras, "0002");
    assert.strictEqual(ultimo.empresa, "Undercity Exports");
    assert.strictEqual(ultimo.valor, 320.5);
    assert.strictEqual(ultimo.categoria, "cara");
  });
});
