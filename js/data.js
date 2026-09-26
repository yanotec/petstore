// Dados mockados — ver design_handoff_pethub/docs/06-modelo-de-dados.md (seed)
export const CATEGORIES = [
  { slug: "racao", name: "Ração", image: "./images/racao.png" },
  { slug: "gatos", name: "Gatos", image: "./images/gato.png" },
  { slug: "higiene", name: "Higiene", image: "./images/higiene.png" },
  { slug: "petiscos", name: "Petiscos", image: "./images/petisco.png" },
  { slug: "acessorios", name: "Acessórios", image: "./images/acessorio.png" },
  { slug: "brinquedos", name: "Brinquedos", image: "./images/brinquedo.png" },
  { slug: "banho-tosa", name: "Banho & tosa", image: "./images/banho.png" },
];

const CATEGORY_IMAGE = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c.image]));

/** Ilustração provisória por categoria (ver assets/images) — foto real do produto entra via upload no backoffice. */
export function productImage(product) {
  return CATEGORY_IMAGE[product.categorySlug];
}

const SERVICE_IMAGE = { banho: "./images/banho.png", tosa: "./images/tosa.png" };

export function serviceImage(service) {
  return SERVICE_IMAGE[service.slug] ?? null;
}

export const PRODUCTS = [
  {
    slug: "racao-golden-15kg",
    sku: "RG-15KG",
    name: "Ração Golden Fórmula 15kg",
    categorySlug: "racao",
    description: "Ração completa para cães adultos de todas as raças, com carne e cereais selecionados.",
    price: 259.9,
    compareAt: 289.9,
    stock: 24,
    minStock: 5,
  },
  {
    slug: "premier-gatos-7-5kg",
    sku: "PG-7,5KG",
    name: "Premier Sabor Gatos 7,5kg",
    categorySlug: "gatos",
    description: "Ração para gatos adultos castrados, com controle de peso e bola de pelo.",
    price: 189.9,
    stock: 12,
    minStock: 4,
  },
  {
    slug: "areia-silica-4kg",
    sku: "AS-4KG",
    name: "Areia Sílica para Gatos 4kg",
    categorySlug: "gatos",
    description: "Alta absorção de odores, cristais de sílica de longa duração.",
    price: 39.9,
    stock: 0,
    minStock: 6,
  },
  {
    slug: "bifinho-petisco-500g",
    sku: "BF-500G",
    name: "Bifinho Petisco Carne 500g",
    categorySlug: "petiscos",
    description: "Petisco macio para recompensar e treinar seu cão.",
    price: 24.9,
    stock: 40,
    minStock: 10,
  },
  {
    slug: "coleira-peitoral-ajustavel",
    sku: "CP-AJ",
    name: "Coleira Peitoral Ajustável",
    categorySlug: "acessorios",
    description: "Peitoral acolchoado, tamanhos P ao GG, alça de condução reforçada.",
    price: 59.9,
    stock: 3,
    minStock: 5,
  },
  {
    slug: "shampoo-neutro-500ml",
    sku: "SH-500ML",
    name: "Shampoo Neutro 500ml",
    categorySlug: "higiene",
    description: "Fórmula hipoalergênica para cães e gatos de pele sensível.",
    price: 34.9,
    stock: 18,
    minStock: 5,
  },
  {
    slug: "corda-dental",
    sku: "CD-01",
    name: "Corda Dental Mordedor",
    categorySlug: "brinquedos",
    description: "Ajuda na limpeza dos dentes durante a brincadeira.",
    price: 19.9,
    stock: 25,
    minStock: 5,
  },
  {
    slug: "tapete-higienico-30un",
    sku: "TH-30UN",
    name: "Tapete Higiênico (pacote 30un)",
    categorySlug: "higiene",
    description: "Alta absorção com gel secante, tamanho padrão 60x60cm.",
    price: 44.9,
    stock: 8,
    minStock: 10,
  },
];

export const SERVICES = [
  {
    slug: "banho",
    name: "Banho",
    description: "Banho completo com shampoo hipoalergênico e secagem.",
    chargeType: "POR_ATENDIMENTO",
    durationMin: 60,
    basePrice: 60,
    sizeAdd: { P: 0, M: 15, G: 30, GG: 45 },
    species: ["CAO", "GATO"],
    tripFee: 24.9,
  },
  {
    slug: "tosa",
    name: "Tosa",
    description: "Tosa higiênica ou na tesoura, conforme o porte e o pelo.",
    chargeType: "POR_ATENDIMENTO",
    durationMin: 90,
    basePrice: 75,
    sizeAdd: { P: 0, M: 20, G: 40, GG: 60 },
    species: ["CAO", "GATO"],
    tripFee: 24.9,
  },
  {
    slug: "hidratacao",
    name: "Hidratação",
    description: "Hidratação profunda para pelos ressecados.",
    chargeType: "POR_ATENDIMENTO",
    durationMin: 40,
    basePrice: 45,
    sizeAdd: { P: 0, M: 10, G: 20, GG: 30 },
    species: ["CAO", "GATO"],
    tripFee: 24.9,
  },
  {
    slug: "consulta",
    name: "Consulta veterinária",
    description: "Avaliação clínica geral com veterinário responsável.",
    chargeType: "POR_ATENDIMENTO",
    durationMin: 30,
    basePrice: 120,
    sizeAdd: { P: 0, M: 0, G: 0, GG: 0 },
    species: ["CAO", "GATO"],
    tripFee: 24.9,
  },
  {
    slug: "vacinacao",
    name: "Vacinação",
    description: "Aplicação de vacinas com acompanhamento da carteira de vacinação.",
    chargeType: "POR_ATENDIMENTO",
    durationMin: 20,
    basePrice: 90,
    sizeAdd: { P: 0, M: 0, G: 0, GG: 0 },
    species: ["CAO", "GATO"],
    tripFee: 24.9,
  },
  {
    slug: "taxi-dog",
    name: "Taxi dog",
    description: "Busca e retorno do seu pet para qualquer serviço agendado.",
    chargeType: "POR_ATENDIMENTO",
    durationMin: 30,
    basePrice: 24.9,
    sizeAdd: { P: 0, M: 0, G: 0, GG: 0 },
    species: ["CAO", "GATO"],
    tripFee: 24.9,
  },
  {
    slug: "hospedagem",
    name: "Hospedagem",
    description: "Hospedagem com alimentação e recreação diária.",
    chargeType: "POR_DIARIA",
    basePrice: 89.9,
    sizeAdd: { P: 0, M: 15, G: 30, GG: 45 },
    species: ["CAO", "GATO"],
    tripFee: 24.9,
  },
  {
    slug: "adestramento",
    name: "Adestramento",
    description: "Sessão de adestramento comportamental básico.",
    chargeType: "POR_ATENDIMENTO",
    durationMin: 50,
    basePrice: 150,
    sizeAdd: { P: 0, M: 0, G: 0, GG: 0 },
    species: ["CAO"],
    tripFee: 24.9,
  },
];

// Cliente sempre "logado" nesta versão estática — ver README.md (apresentação).
export const CURRENT_CUSTOMER = {
  id: "cus_marina",
  name: "Marina Duarte",
  email: "marina.duarte@example.com",
  initials: "MD",
};

export const MY_ORDERS = [
  {
    number: "#1012",
    createdAt: "22/09/2026",
    status: "Saiu para entrega",
    items: [{ name: "Ração Golden Fórmula 15kg", qty: 1, unitPrice: 259.9 }],
    total: 259.9,
  },
  {
    number: "#1008",
    createdAt: "10/09/2026",
    status: "Concluído",
    items: [
      { name: "Bifinho Petisco Carne 500g", qty: 2, unitPrice: 24.9 },
      { name: "Banho", qty: 1, unitPrice: 60 },
    ],
    total: 109.7,
  },
  {
    number: "#0991",
    createdAt: "18/08/2026",
    status: "Concluído",
    items: [{ name: "Shampoo Neutro 500ml", qty: 1, unitPrice: 34.9 }],
    total: 34.9,
  },
];

export function formatBRL(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

export function findProduct(slug) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function findService(slug) {
  return SERVICES.find((s) => s.slug === slug);
}
