// Carrinho — estado em localStorage (nesta versão estática não há sessão/servidor).
import { formatBRL, findProduct, findService, productImage, serviceImage } from "./data.js";

function lineImage(l) {
  if (l.kind === "product") {
    const product = findProduct(l.id);
    return product ? productImage(product) : null;
  }
  const slug = l.id.slice(0, l.id.lastIndexOf("-"));
  const service = findService(slug);
  return service ? serviceImage(service) : null;
}

const CART_KEY = "pethub.cart.loja";

function read() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function write(lines) {
  localStorage.setItem(CART_KEY, JSON.stringify(lines));
  document.dispatchEvent(new CustomEvent("pethub:cart-change"));
}

export function getLines() {
  return read();
}

export function getTotal() {
  return read().reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
}

export function addProduct({ id, name, unitPrice, qty = 1 }) {
  const lines = read();
  const existing = lines.find((l) => l.id === id);
  if (existing) existing.qty += qty;
  else lines.push({ id, kind: "product", name, unitPrice, qty });
  write(lines);
}

export function addService({ id, name, unitPrice, meta }) {
  const lines = read();
  lines.push({ id, kind: "service", name, unitPrice, qty: 1, meta });
  write(lines);
}

export function setQty(id, qty) {
  let lines = read();
  if (qty <= 0) lines = lines.filter((l) => l.id !== id);
  else lines = lines.map((l) => (l.id === id ? { ...l, qty } : l));
  write(lines);
}

export function remove(id) {
  write(read().filter((l) => l.id !== id));
}

export function clear() {
  write([]);
}

let drawerOpen = true;

export function renderCart() {
  const drawer = document.getElementById("cart-drawer");
  const fab = document.getElementById("cart-fab");
  if (!drawer || !fab) return;

  const lines = read();
  const total = getTotal();

  if (lines.length === 0) {
    drawer.classList.remove("open");
    fab.classList.remove("show");
    drawer.innerHTML = "";
    return;
  }

  if (!drawerOpen) {
    drawer.classList.remove("open");
    drawer.innerHTML = "";
    fab.classList.add("show");
    fab.innerHTML = `🛒 <span class="num">${formatBRL(total)}</span>`;
    fab.onclick = () => {
      drawerOpen = true;
      renderCart();
    };
    return;
  }

  fab.classList.remove("show");
  drawer.classList.add("open");
  drawer.innerHTML = `
    <div class="cart-header">
      <span>Carrinho</span>
      <button type="button" id="cart-close" aria-label="Fechar carrinho">×</button>
    </div>
    <div class="cart-lines">
      ${lines
        .map(
          (l) => `
        <div class="cart-line" data-id="${l.id}">
          <div class="thumb ${lineImage(l) ? "" : "img-placeholder"}">${
            lineImage(l) ? `<img src="${lineImage(l)}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:10px" />` : ""
          }</div>
          <div class="info">
            <p class="name">${l.name}</p>
            ${l.meta ? `<p class="micro">${l.meta}</p>` : ""}
            <div class="row">
              ${
                l.kind === "product"
                  ? `<div class="qty-stepper" data-id="${l.id}">
                      <button type="button" data-action="dec">−</button>
                      <span>${l.qty}</span>
                      <button type="button" data-action="inc">+</button>
                    </div>`
                  : `<span style="font-size:12px;color:var(--ink2)">qtd. ${l.qty}</span>`
              }
              <span class="num" style="font-size:14px;font-weight:600">${formatBRL(l.unitPrice * l.qty)}</span>
            </div>
          </div>
          <button type="button" class="remove" data-id="${l.id}" aria-label="Remover item">🗑</button>
        </div>`
        )
        .join("")}
    </div>
    <div class="cart-footer">
      <div class="cart-total-row">
        <span style="color:var(--ink2);font-size:14px">Total</span>
        <span class="num total">${formatBRL(total)}</span>
      </div>
      <a href="./finalizar.html" class="btn btn-brand btn-block pill">Finalizar compra</a>
    </div>`;

  drawer.querySelector("#cart-close").addEventListener("click", () => {
    drawerOpen = false;
    renderCart();
  });
  drawer.querySelectorAll(".qty-stepper").forEach((stepper) => {
    const id = stepper.dataset.id;
    const line = lines.find((l) => l.id === id);
    stepper.querySelector('[data-action="dec"]').addEventListener("click", () => setQty(id, line.qty - 1));
    stepper.querySelector('[data-action="inc"]').addEventListener("click", () => setQty(id, line.qty + 1));
  });
  drawer.querySelectorAll(".remove").forEach((btn) => {
    btn.addEventListener("click", () => remove(btn.dataset.id));
  });
}

export function initCart() {
  renderCart();
  document.addEventListener("pethub:cart-change", renderCart);
}
