# Desafio Pagamento — CI/CD com GitHub Actions

Projeto Node.js com testes automatizados e pipeline de integração contínua usando GitHub Actions.

---

## Estrutura do Projeto

```
desafio-pagamento/
├── .github/
│   └── workflows/
│       └── ci.yml          # Pipeline de CI/CD
├── src/
│   └── ServicoDePagamento.js   # Classe principal
├── test/
│   └── ServicoDePagamento.test.js  # Testes automatizados (Mocha)
├── package.json
└── README.md
```

---

## O que o Projeto Faz

`ServicoDePagamento` é uma classe JavaScript que representa um serviço de pagamentos com as seguintes responsabilidades:

- Registrar pagamentos com código de barras, empresa e valor
- Categorizar automaticamente pagamentos como **"cara"** (valor > R$ 100) ou **"padrão"** (valor ≤ R$ 100)
- Consultar o último pagamento realizado

### Executar Localmente

```bash
# Instalar dependências
npm install

# Rodar testes (saída no terminal)
npm test

# Rodar testes com geração de relatório HTML
npm run test:ci
```

O relatório HTML é gerado em `mochawesome-report/relatorio.html`.

---

## Pipeline de CI/CD

### Arquivo: `.github/workflows/ci.yml`

```yaml
name: CI - Testes Automatizados

on:
  push:
    branches: ["main"]
  workflow_dispatch:
  schedule:
    - cron: "0 8 * * 1"
```

### Gatilhos (Triggers)

| Gatilho | Quando Executa |
|---|---|
| `push` | A cada commit enviado para a branch `main` |
| `workflow_dispatch` | Manualmente, pelo botão "Run workflow" no GitHub |
| `schedule` | Automaticamente toda segunda-feira às 08h00 UTC |

### Etapas da Pipeline

```
1. Checkout do repositório
      ↓
2. Configurar Node.js 20
      ↓
3. Instalar dependências (npm ci)
      ↓
4. Executar testes + gerar relatório (npm run test:ci)
      ↓
5. Upload do relatório como artefato (sempre executa)
```

**Por que `npm ci` e não `npm install`?**  
`npm ci` instala exatamente as versões travadas no `package-lock.json`, garantindo builds reproduzíveis em CI — nenhuma dependência é atualizada por acidente.

**Por que `if: always()` no upload?**  
O relatório é publicado mesmo quando os testes falham. Isso permite investigar os erros lendo o relatório, em vez de precisar rodar a pipeline novamente.

---

## Relatório de Testes

A pipeline usa o reporter **[Mochawesome](https://github.com/adamgruber/mochawesome)** para gerar um relatório HTML interativo.

### Como Acessar o Relatório

1. Abra a aba **Actions** no repositório GitHub
2. Selecione a execução desejada
3. Na seção **Artifacts**, baixe `relatorio-testes-run-<número>`
4. Descompacte e abra `relatorio.html` no navegador

Os relatórios ficam disponíveis por **30 dias** após cada execução.

### Exemplo de Relatório

O relatório HTML exibe:
- Quantidade de testes passando / falhando
- Tempo de execução de cada teste
- Mensagem de erro detalhada em caso de falha
- Estatísticas gerais da suíte

---

## Testes Automatizados

Framework: **[Mocha](https://mochajs.org/)** com módulo nativo `assert` do Node.js.

### Casos de Teste

| # | Descrição | Tipo |
|---|---|---|
| 1 | Inicia com lista de pagamentos vazia | Inicialização |
| 2 | Salva pagamento com as informações corretas | Funcional |
| 3 | Marca como "cara" quando valor > 100 | Categorização |
| 4 | Marca como "padrão" quando valor ≤ 100 | Categorização |
| 5 | Guarda todos os pagamentos realizados | Estado |
| 6 | Retorna `null` se nenhum pagamento foi feito | Consulta |
| 7 | Retorna o último pagamento realizado | Consulta |

---

## Conceitos Aplicados

### Integração Contínua (CI)
Prática de integrar código frequentemente ao repositório principal, com execução automática de testes a cada mudança. Detecta erros cedo, antes que cheguem à produção.

### GitHub Actions
Plataforma de automação integrada ao GitHub. Os workflows são definidos em arquivos YAML dentro de `.github/workflows/`. Cada workflow possui:
- **Triggers** (`on`): eventos que disparam a execução
- **Jobs**: grupos de steps que rodam em um runner (máquina virtual)
- **Steps**: comandos ou actions individuais dentro de um job

### Execução Agendada (`schedule`)
Usa sintaxe cron para definir horários recorrentes. O formato é:
```
┌───── minuto (0-59)
│ ┌───── hora (0-23)
│ │ ┌───── dia do mês (1-31)
│ │ │ ┌───── mês (1-12)
│ │ │ │ ┌───── dia da semana (0-7, 0=Dom)
│ │ │ │ │
0 8 * * 1   →  toda segunda-feira às 08h00 UTC
```

### Execução Manual (`workflow_dispatch`)
Permite disparar a pipeline pelo botão "Run workflow" na aba Actions, útil para validar o estado atual sem precisar fazer um commit.

### Artefatos de Build
Arquivos gerados durante a pipeline e armazenados no GitHub para consulta posterior. Usados aqui para preservar o relatório HTML dos testes por 30 dias.

---

## Dependências de Desenvolvimento

| Pacote | Versão | Finalidade |
|---|---|---|
| `mocha` | ^11.7.6 | Framework de testes |
| `mochawesome` | ^7.1.3 | Reporter HTML para relatórios visuais |
