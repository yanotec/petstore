import { formatBRL, productImage, serviceImage } from "./data.js";
import { addProduct } from "./cart.js";

export function productCardHtml(p) {
  const outOfStock = p.stock <= 0;
  const discountPct = p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : null;
  return `
    <div class="card product-card" data-product-card="${p.slug}">
      <a href="./produto.html?slug=${p.slug}" class="thumb">
        <img src="${productImage(p)}" alt="${p.name}" loading="lazy" />
        ${discountPct ? `<span class="tag tag-accent">−${discountPct}%</span>` : ""}
        ${outOfStock ? `<span class="tag tag-dark">Sem estoque</span>` : ""}
      </a>
      <div class="body">
        <a href="./produto.html?slug=${p.slug}" style="font-size:14px;font-weight:500;color:var(--ink)">${p.name}</a>
        <div class="price-row">
          <span class="num price">${formatBRL(p.price)}</span>
          ${p.compareAt ? `<span class="num price-strike">${formatBRL(p.compareAt)}</span>` : ""}
        </div>
        <div style="margin-top:auto;padding-top:8px">
          ${
            outOfStock
              ? `<button type="button" class="btn btn-soft btn-block" disabled>Sem estoque · avise-me</button>`
              : `<button type="button" class="btn btn-brand btn-block" data-add-product="${p.slug}">Adicionar</button>`
          }
        </div>
      </div>
    </div>`;
}

export function serviceCardHtml(s) {
  const image = serviceImage(s);
  return `
    <a href="./servico.html?slug=${s.slug}" class="card service-card">
      <div class="thumb ${image ? "" : "img-placeholder"}">
        ${image ? `<img src="${image}" alt="${s.name}" loading="lazy" />` : `<span class="micro">foto do serviço</span>`}
      </div>
      <div class="body">
        <span style="font-size:14px;font-weight:500">${s.name}</span>
        <p class="desc">${s.description}</p>
        <span class="num from-price">a partir de ${formatBRL(s.basePrice)}</span>
      </div>
    </a>`;
}

/** Liga os botões "Adicionar" renderizados via productCardHtml. Chamar após inserir o HTML no DOM. */
export function wireProductCards(root, products) {
  root.querySelectorAll("[data-add-product]").forEach((btn) => {
    const product = products.find((p) => p.slug === btn.dataset.addProduct);
    btn.addEventListener("click", () => {
      addProduct({ id: product.slug, name: product.name, unitPrice: product.price, qty: 1 });
      btn.textContent = "Adicionado ✓";
      setTimeout(() => (btn.textContent = "Adicionar"), 1200);
    });
  });
}
