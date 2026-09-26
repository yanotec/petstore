# PetHub — Loja (site estático)

Site estático (HTML + CSS + JS puro, sem build/bundler) da loja online do PetHub, feito para publicar no
**GitHub Pages** em `https://petstore.yanotec.com.br`.

> Este é um scaffold visual: as telas são navegáveis e usam dados mockados (`js/data.js`). Não há banco de
> dados, autenticação real nem pagamento — ver [`../design_handoff_pethub/`](../design_handoff_pethub/)
> para a especificação completa caso o projeto evolua para uma aplicação real (Next.js + Prisma, conforme
> `docs/01-arquitetura.md`).

## Rodar localmente

Como as páginas usam ES Modules (`<script type="module">`), é preciso servir os arquivos por HTTP (abrir
o `index.html` direto pelo `file://` não funciona por causa do CORS do navegador). Qualquer servidor
estático simples resolve:

```bash
# Python (já vem instalado na maioria dos sistemas)
python3 -m http.server 5500

# ou Node, sem instalar nada
npx serve .
```

Depois abra `http://localhost:5500`.

## Publicar no GitHub Pages

### 1. Criar o repositório

No GitHub, crie o repositório **`yanotec/petstore`** (público — GitHub Pages com domínio próprio exige
repositório público, a menos que a organização tenha GitHub Pro/Team).

### 2. Enviar este conteúdo como raiz do repositório

A partir de uma cópia **apenas desta pasta** (`loja/`), não do monorepo inteiro:

```bash
cd loja
git init
git add .
git commit -m "Primeira versão do site da loja"
git branch -M main
git remote add origin git@github.com:yanotec/petstore.git
git push -u origin main
```

### 3. Ativar o GitHub Pages

No repositório, vá em **Settings → Pages**:
- **Source**: "Deploy from a branch"
- **Branch**: `main` / `(root)`
- Salve.

### 4. Configurar o domínio próprio

Ainda em **Settings → Pages → Custom domain**, digite `petstore.yanotec.com.br` e salve. Isso confirma o
arquivo [`CNAME`](CNAME) que já está neste repositório (o GitHub Pages lê esse arquivo para saber qual
domínio servir).

Se o GitHub pedir **verificação de domínio** (comum em repositórios de organização): vá em
**Organization settings → Pages → Verified domains**, siga o fluxo para adicionar um registro **TXT**
temporário no DNS confirmando que você é dono do domínio, e clique em verificar.

### 5. Configurar o DNS no registro.br

No painel do registro.br, na área de **DNS** do domínio `yanotec.com.br`, adicione um registro:

| Tipo | Nome (host) | Valor / Destino |
|---|---|---|
| CNAME | `petstore` | `yanotec.github.io` |

Isso faz `petstore.yanotec.com.br` apontar para o GitHub Pages da organização `yanotec`, que por sua vez
serve o conteúdo deste repositório por causa do arquivo `CNAME`. **Não mexa** no registro que já aponta
`yanotec.com.br` (raiz) para o GitHub Pages de vocês — só está sendo adicionado o subdomínio `petstore`.

A propagação do DNS pode levar de minutos a algumas horas. Depois que propagar, volte em
**Settings → Pages** do repositório e marque **Enforce HTTPS** (o certificado HTTPS é emitido
automaticamente pelo GitHub via Let's Encrypt assim que o domínio resolve corretamente).

## Estrutura

```
loja/
├── index.html            home
├── busca.html            resultados (?q=&cat=)
├── servicos.html         lista de serviços
├── produto.html          detalhe do produto (?slug=)
├── servico.html          agendamento de serviço (?slug=)
├── conta.html            hub da conta (cliente sempre "logado" — ver js/data.js)
├── conta-pedidos.html    meus pedidos
├── entrar.html           login/cadastro (tela existe, mas não bloqueia navegação)
├── finalizar.html        checkout (itens · entrega · pagamento)
├── css/
│   ├── themes.css        tokens de cor dos 6 temas × claro/escuro
│   └── styles.css        layout e componentes
└── js/
    ├── data.js           produtos, serviços, cliente e pedidos mockados
    ├── pricing.js        cálculo de preço de serviço (regra de negócio)
    ├── theme.js          troca de tema/modo (localStorage)
    ├── cart.js           carrinho (localStorage)
    ├── layout.js         monta header, barra de categorias, rodapé e carrinho
    └── pages/            script de cada página
```
