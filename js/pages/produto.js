import { findProduct, formatBRL, productImage } from "../data.js";
import { addProduct } from "../cart.js";
import { renderShell } from "../layout.js";

const slug = new URLSearchParams(location.search).get("slug");
const product = findProduct(slug);
const main = document.getElementById("main");

if (!product) {
  main.innerHTML = `<div class="wrap"><p>Produto não encontrado. <a href="./index.html">Voltar à loja</a></p></div>`;
  renderShell();
} else {
  const outOfStock = product.stock <= 0;
  const discountPct = product.compareAt
    ? Math.round((1 - product.price / product.compareAt) * 100)
    : null;
  let qty = 1;

  main.innerHTML = `
    <div class="wrap" style="max-width:900px">
      <div class="grid grid-2" style="align-items:start">
        <div style="aspect-ratio:1/1;border-radius:16px;overflow:hidden;background:var(--soft)">
          <img src="${productImage(product)}" alt="${product.name}" style="width:100%;height:100%;object-fit:cover" />
        </div>
        <div>
          <p class="micro">${product.categorySlug} · SKU ${product.sku}</p>
          <h1 style="margin-top:4px;font-size:26px">${product.name}</h1>
          <div style="display:flex;align-items:baseline;gap:12px;margin-top:12px">
            <span class="num" style="font-size:30px;font-weight:600">${formatBRL(product.price)}</span>
            ${
              product.compareAt
                ? `<span class="num price-strike" style="font-size:15px">${formatBRL(product.compareAt)}</span>`
                : ""
            }
            ${discountPct ? `<span class="badge" style="background:var(--accent);color:#fff">−${discountPct}%</span>` : ""}
          </div>
          <p style="margin-top:8px;font-size:14px" class="${
            outOfStock ? "status-danger" : product.stock <= product.minStock ? "status-warn" : "status-ok"
          }">
            ${outOfStock ? "Sem estoque" : product.stock <= product.minStock ? `Estoque baixo · ${product.stock} un.` : "Em estoque"}
          </p>
          <p style="margin-top:16px;font-size:14px;color:var(--ink2)">${product.description}</p>

          <div style="margin-top:24px;display:flex;gap:12px;flex-wrap:wrap;align-items:center">
            ${
              outOfStock
                ? ""
                : `<div class="qty-stepper" id="qty-stepper">
                    <button type="button" data-action="dec">−</button>
                    <span id="qty-value">1</span>
                    <button type="button" data-action="inc">+</button>
                  </div>`
            }
            ${
              outOfStock
                ? `<button type="button" class="btn btn-soft" style="flex:1" disabled>Sem estoque · avise-me</button>`
                : `<button type="button" id="btn-add" class="btn btn-brand" style="flex:1">Adicionar ao carrinho</button>
                   <button type="button" id="btn-buy" class="btn btn-accent" style="flex:1">Comprar agora</button>`
            }
          </div>
        </div>
      </div>
    </div>`;

  if (!outOfStock) {
    const qtyValue = document.getElementById("qty-value");
    document.querySelector('[data-action="dec"]').addEventListener("click", () => {
      qty = Math.max(1, qty - 1);
      qtyValue.textContent = qty;
    });
    document.querySelector('[data-action="inc"]').addEventListener("click", () => {
      qty = Math.min(product.stock, qty + 1);
      qtyValue.textContent = qty;
    });
    const btnAdd = document.getElementById("btn-add");
    btnAdd.addEventListener("click", () => {
      addProduct({ id: product.slug, name: product.name, unitPrice: product.price, qty });
      btnAdd.textContent = "Adicionado ✓";
      setTimeout(() => (btnAdd.textContent = "Adicionar ao carrinho"), 1200);
    });
    document.getElementById("btn-buy").addEventListener("click", () => {
      addProduct({ id: product.slug, name: product.name, unitPrice: product.price, qty });
      location.href = "./finalizar.html";
    });
  }

  renderShell();
}
