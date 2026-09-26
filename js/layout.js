import { CATEGORIES, CURRENT_CUSTOMER } from "./data.js";
import { initTheme, renderThemeSwitcher, renderModeToggle } from "./theme.js";
import { initCart } from "./cart.js";

function currentCategory() {
  return new URLSearchParams(location.search).get("cat");
}

function renderAnnouncement() {
  const el = document.getElementById("announcement");
  if (!el) return;
  el.innerHTML = `
    <span>Frete grátis acima de R$ 199</span>
    <span class="sep">·</span>
    <span>Taxi dog para banho &amp; tosa</span>
    <span class="sep">·</span>
    <span>Retire em 2h</span>`;
}

function renderHeader() {
  const el = document.getElementById("site-header");
  if (!el) return;
  el.innerHTML = `
    <a href="./index.html" class="logo">Pet<span>Hub</span></a>
    <form class="search-form" id="search-form">
      <input type="text" name="q" placeholder="Buscar produtos e serviços…" />
    </form>
    <div class="header-actions">
      <span id="mode-toggle-slot" class="icon-btn"></span>
      <a href="./conta.html" class="pill-link">
        <span class="avatar">${CURRENT_CUSTOMER.initials}</span> Minha conta
      </a>
      <a href="./conta-pedidos.html" class="pill-link">Meus pedidos</a>
    </div>`;

  el.querySelector("#search-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q");
    location.href = `./busca.html?q=${encodeURIComponent(q || "")}`;
  });
  renderModeToggle(el.querySelector("#mode-toggle-slot"));
}

function renderCategoryBar() {
  const el = document.getElementById("category-bar");
  if (!el) return;
  const activeCat = currentCategory();
  const onHome = location.pathname.endsWith("index.html") || location.pathname.endsWith("/");

  el.innerHTML = `
    <div class="cat-scroll">
      <a href="./index.html" class="cat-pill ${onHome && !activeCat ? "active" : ""}">🏠 Início</a>
      ${CATEGORIES.map(
        (c) => `<a href="./busca.html?cat=${c.slug}" class="cat-pill ${
          activeCat === c.slug ? "active" : ""
        }"><span class="cat-dot"><img src="${c.image}" alt="" /></span>${c.name}</a>`
      ).join("")}
    </div>
    <div style="flex:none" id="theme-switcher-slot"></div>`;

  renderThemeSwitcher(el.querySelector("#theme-switcher-slot"));
}

function renderFooter() {
  const main = document.getElementById("main");
  if (!main) return;
  const footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = `
    <div class="footer-grid">
      <div style="display:flex;gap:14px;align-items:flex-start">
        <img src="./images/loja.png" alt="" style="width:56px;height:56px;border-radius:12px;object-fit:cover;flex:none" />
        <div>
          <h4>PetHub</h4>
          <p style="font-size:14px;color:rgba(255,255,255,.7);margin-top:8px">
            Rua das Flores, 123 — Centro<br />Seg a sáb, 8h às 20h
          </p>
        </div>
      </div>
      <div>
        <p class="micro" style="color:rgba(255,255,255,.6)">Categorias</p>
        <ul><li>Ração</li><li>Gatos</li><li>Higiene</li><li>Banho &amp; tosa</li></ul>
      </div>
      <div>
        <p class="micro" style="color:rgba(255,255,255,.6)">Minha conta</p>
        <ul><li>Meus pedidos</li><li>Endereços</li><li>Atendimento</li></ul>
      </div>
    </div>`;
  main.appendChild(footer);
}

export function renderShell() {
  initTheme();
  renderAnnouncement();
  renderHeader();
  renderCategoryBar();
  initCart();
  renderFooter();
}
