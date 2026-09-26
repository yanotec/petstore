import { PRODUCTS, SERVICES } from "../data.js";
import { productCardHtml, serviceCardHtml, wireProductCards } from "../components.js";
import { renderShell } from "../layout.js";

const PROMISES = [
  { icon: "🚚", label: "Entrega no mesmo dia" },
  { icon: "🏬", label: "Retire em 2h" },
  { icon: "🐕", label: "Taxi dog" },
  { icon: "💳", label: "Pix com 5% de desconto" },
];

const destaques = PRODUCTS.filter((p) => p.compareAt);
const ofertas = [...destaques, ...PRODUCTS.filter((p) => !destaques.includes(p))].slice(0, 4);
const maisVendidos = PRODUCTS.slice(2, 6);

document.getElementById("main").innerHTML = `
  <div class="wrap">
    <section class="hero">
      <img src="./images/hero.png" alt="" class="hero-image" />
      <div class="hero-content">
        <p class="micro" style="color:rgba(255,255,255,.7)">cupom PET10 no primeiro pedido</p>
        <h1>Tudo para o seu pet, entregue hoje</h1>
        <div class="hero-actions">
          <a href="./busca.html?cat=racao" class="btn btn-brand pill">Comprar ração</a>
          <a href="./servicos.html" class="btn btn-outline-light pill">Agendar banho</a>
        </div>
      </div>
    </section>

    <section class="promises">
      ${PROMISES.map((p) => `<div class="promise">${p.icon} ${p.label}</div>`).join("")}
    </section>

    <section class="section">
      <h2>Ofertas da semana</h2>
      <div class="grid grid-4" id="ofertas-grid" style="margin-top:16px"></div>
    </section>

    <section class="section">
      <h2>Banho &amp; tosa</h2>
      <div class="grid grid-3" id="servicos-grid" style="margin-top:16px"></div>
    </section>

    <section class="section">
      <h2>Mais vendidos</h2>
      <div class="grid grid-4" id="vendidos-grid" style="margin-top:16px"></div>
    </section>

    <section class="subscribe-banner">
      <div>
        <h3>Assine sua ração</h3>
        <p style="font-size:14px;color:var(--ink2);margin-top:4px">
          Receba todo mês, sem pensar em nada. 10% de desconto fixo.
        </p>
      </div>
      <a href="./busca.html?cat=racao" class="btn btn-accent pill">Ver planos</a>
    </section>
  </div>`;

document.getElementById("ofertas-grid").innerHTML = ofertas.map(productCardHtml).join("");
document.getElementById("servicos-grid").innerHTML = SERVICES.slice(0, 3).map(serviceCardHtml).join("");
document.getElementById("vendidos-grid").innerHTML = maisVendidos.map(productCardHtml).join("");
wireProductCards(document, PRODUCTS);

renderShell();
