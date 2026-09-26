import { getLines, getTotal, clear } from "../cart.js";
import { formatBRL } from "../data.js";
import { renderShell } from "../layout.js";

const main = document.getElementById("main");
const lines = getLines();

if (lines.length === 0) {
  main.innerHTML = `
    <div class="wrap" style="max-width:480px;text-align:center;padding-top:60px">
      <h1>Seu carrinho está vazio</h1>
      <p style="margin-top:8px;color:var(--ink2)">Adicione produtos ou serviços antes de finalizar.</p>
      <a href="./index.html" class="btn btn-brand" style="margin-top:20px">Voltar à loja</a>
    </div>`;
  renderShell();
} else {
  const total = getTotal();
  const state = { itens: false, entrega: false, pagamento: false, method: null, delivery: "entrega" };

  main.innerHTML = `
    <div class="wrap" style="max-width:900px">
      <h1>Finalizar compra</h1>
      <div style="display:grid;gap:24px;grid-template-columns:1fr 320px;margin-top:20px" id="checkout-grid">
        <div>
          <div class="accordion-section open" id="acc-itens">
            <div class="accordion-head" data-toggle="acc-itens">1. Itens</div>
            <div class="accordion-body">
              ${lines
                .map(
                  (l) => `<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:14px">
                    <span>${l.qty}× ${l.name}</span>
                    <span class="num">${formatBRL(l.unitPrice * l.qty)}</span>
                  </div>`
                )
                .join("")}
              <button type="button" class="btn btn-brand" style="margin-top:12px" data-confirm="itens">Confirmar itens</button>
            </div>
          </div>

          <div class="accordion-section" id="acc-entrega">
            <div class="accordion-head" data-toggle="acc-entrega">2. Entrega e busca</div>
            <div class="accordion-body">
              <div style="display:flex;flex-direction:column;gap:8px;font-size:14px">
                <label><input type="radio" name="delivery" value="entrega" checked /> Entregar em casa · R$ 14,90</label>
                <label><input type="radio" name="delivery" value="retirada" /> Retirar na loja · grátis</label>
              </div>
              <button type="button" class="btn btn-brand" style="margin-top:12px" data-confirm="entrega">Confirmar entrega</button>
            </div>
          </div>

          <div class="accordion-section" id="acc-pagamento">
            <div class="accordion-head" data-toggle="acc-pagamento">3. Pagamento</div>
            <div class="accordion-body">
              <div style="display:flex;flex-direction:column;gap:8px;font-size:14px">
                <label><input type="radio" name="payment" value="pix" /> Pix (5% de desconto)</label>
                <label><input type="radio" name="payment" value="debito" /> Débito</label>
                <label><input type="radio" name="payment" value="credito" /> Crédito (até 3x)</label>
                <label><input type="radio" name="payment" value="dinheiro" /> Dinheiro</label>
              </div>
              <button type="button" class="btn btn-brand" style="margin-top:12px" data-confirm="pagamento" id="btn-confirm-payment" disabled>Confirmar pagamento</button>
            </div>
          </div>
        </div>

        <div class="summary-box">
          <p class="field-label">Checklist</p>
          <ul id="checklist" style="list-style:none;padding:0;font-size:14px;display:flex;flex-direction:column;gap:6px;margin:8px 0 16px"></ul>
          <div class="summary-row"><span>Subtotal</span><span class="num">${formatBRL(total)}</span></div>
          <div class="summary-row"><span>Frete</span><span class="num" id="summary-freight">${formatBRL(14.9)}</span></div>
          <div class="summary-row summary-total"><span>Total</span><span class="num" id="summary-total">${formatBRL(total + 14.9)}</span></div>
          <button type="button" id="btn-confirm-order" class="btn btn-accent btn-block" style="margin-top:16px" disabled>Confirmar pedido</button>
        </div>
      </div>

      <div id="success-box" style="display:none;text-align:center;padding:60px 0">
        <h2>Pedido confirmado! 🎉</h2>
        <div id="pix-box" style="display:none;margin-top:16px">
          <img src="./images/qrcode.png" alt="QR code Pix" style="width:200px;height:200px;margin:0 auto;border-radius:16px;border:1px solid var(--line);display:block" />
          <p style="margin-top:12px;font-size:14px;color:var(--ink2)">Valor congelado — código copia e cola:</p>
          <code style="display:block;margin-top:4px;font-size:12px;word-break:break-all">00020126360014BR.GOV.BCB.PIX0114PETHUB-DEMO520400005303986540${(total + 14.9).toFixed(2)}5802BR</code>
        </div>
        <a href="./index.html" class="btn btn-brand" style="margin-top:20px">Voltar à loja</a>
      </div>
    </div>
    <style>@media (max-width:760px){ #checkout-grid{ grid-template-columns:1fr !important; } }</style>`;

  document.querySelectorAll(".accordion-head").forEach((head) => {
    head.addEventListener("click", () => {
      document.getElementById(head.dataset.toggle).classList.toggle("open");
    });
  });

  document.querySelectorAll('input[name="delivery"]').forEach((r) =>
    r.addEventListener("change", (e) => {
      state.delivery = e.target.value;
      document.getElementById("summary-freight").textContent =
        state.delivery === "retirada" ? formatBRL(0) : formatBRL(14.9);
      document.getElementById("summary-total").textContent = formatBRL(
        total + (state.delivery === "retirada" ? 0 : 14.9)
      );
    })
  );

  document.querySelectorAll('input[name="payment"]').forEach((r) =>
    r.addEventListener("change", (e) => {
      state.method = e.target.value;
      document.getElementById("btn-confirm-payment").disabled = false;
    })
  );

  function updateChecklist() {
    const items = [
      ["itens", "Itens"],
      ["entrega", "Entrega e busca"],
      ["pagamento", "Pagamento"],
    ];
    document.getElementById("checklist").innerHTML = items
      .map(([key, label]) => `<li>${state[key] ? "✅" : "⬜️"} ${label}</li>`)
      .join("");
    document.getElementById("btn-confirm-order").disabled = !(state.itens && state.entrega && state.pagamento);
  }

  document.querySelectorAll("[data-confirm]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.confirm;
      state[key] = true;
      document.getElementById(`acc-${key}`).classList.add("done");
      document.getElementById(`acc-${key}`).classList.remove("open");
      const order = ["itens", "entrega", "pagamento"];
      const next = order[order.indexOf(key) + 1];
      if (next) document.getElementById(`acc-${next}`).classList.add("open");
      updateChecklist();
    });
  });

  document.getElementById("btn-confirm-order").addEventListener("click", () => {
    document.getElementById("checkout-grid").style.display = "none";
    document.getElementById("success-box").style.display = "block";
    if (state.method === "pix") document.getElementById("pix-box").style.display = "block";
    clear();
  });

  updateChecklist();
  renderShell();
}
