import { MY_ORDERS, formatBRL } from "../data.js";
import { renderShell } from "../layout.js";

const STATUS_BADGE = {
  "Saiu para entrega": "badge-warn",
  Concluído: "badge-ok",
  Cancelado: "badge-info",
};

document.getElementById("main").innerHTML = `
  <div class="wrap" style="max-width:720px">
    <a href="./conta.html" style="font-size:13px">← minha conta</a>
    <h1 style="margin-top:8px">Meus pedidos</h1>

    <div style="margin-top:20px">
      ${MY_ORDERS.map(
        (o) => `
        <div class="order-row">
          <div class="top-row">
            <span>${o.number} · ${o.createdAt}</span>
            <span class="badge ${STATUS_BADGE[o.status] || "badge-info"}">${o.status}</span>
          </div>
          <ul style="list-style:none;padding:0;margin:10px 0 0;font-size:14px">
            ${o.items
              .map(
                (it) =>
                  `<li style="display:flex;justify-content:space-between;padding:4px 0">
                    <span>${it.qty}× ${it.name}</span>
                    <span class="num">${formatBRL(it.unitPrice * it.qty)}</span>
                  </li>`
              )
              .join("")}
          </ul>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;border-top:1px solid var(--line);padding-top:10px">
            <span class="num" style="font-weight:600">Total ${formatBRL(o.total)}</span>
            <button type="button" class="btn btn-outline" style="padding:6px 14px">Comprar novamente</button>
          </div>
        </div>`
      ).join("")}
    </div>
  </div>`;

renderShell();
