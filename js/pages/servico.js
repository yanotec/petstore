import { findService, formatBRL } from "../data.js";
import { quoteService } from "../pricing.js";
import { addService } from "../cart.js";
import { renderShell } from "../layout.js";

const TIME_SLOTS = ["08:00", "09:30", "11:00", "14:00", "15:30", "17:00"];
const slug = new URLSearchParams(location.search).get("slug");
const service = findService(slug);
const main = document.getElementById("main");

if (!service) {
  main.innerHTML = `<div class="wrap"><p>Serviço não encontrado. <a href="./servicos.html">Voltar aos serviços</a></p></div>`;
  renderShell();
} else {
  const isDaily = service.chargeType === "POR_DIARIA";
  const state = {
    species: service.species[0],
    size: "M",
    animals: 1,
    days: 1,
    time: TIME_SLOTS[0],
    sendBy: "CLIENTE",
    returnBy: "CLIENTE",
  };
  const booked = [];

  main.innerHTML = `
    <div class="wrap" style="max-width:1040px">
      <div style="display:grid;gap:32px;grid-template-columns:260px 1fr 280px" id="service-grid">
        <div>
          <div class="img-placeholder" style="aspect-ratio:1/1;border-radius:16px">
            <span class="micro">foto do serviço</span>
          </div>
          <h1 style="margin-top:12px;font-size:22px">${service.name}</h1>
          <p class="num" style="margin-top:4px;font-weight:600;color:var(--accent)">a partir de ${formatBRL(service.basePrice)}</p>
          <p style="margin-top:8px;font-size:14px;color:var(--ink2)">${service.description}</p>
        </div>

        <div style="display:flex;flex-direction:column;gap:20px">
          <div>
            <p class="field-label">1. Animal</p>
            <div class="chip-row" id="species-chips">
              ${service.species
                .map((sp) => `<button type="button" class="chip" data-species="${sp}">${sp === "CAO" ? "Cão" : "Gato"}</button>`)
                .join("")}
            </div>
          </div>

          <div id="size-block">
            <p class="field-label">2. Porte</p>
            <div class="chip-row" id="size-chips">
              ${Object.entries(service.sizeAdd)
                .map(([s, add]) => `<button type="button" class="chip" data-size="${s}">${s}${add > 0 ? ` +${formatBRL(add)}` : ""}</button>`)
                .join("")}
            </div>
          </div>

          <div>
            <p class="field-label">3. Quantidade de animais</p>
            <div class="qty-stepper" id="animals-stepper">
              <button type="button" data-action="dec">−</button><span id="animals-value">1</span><button type="button" data-action="inc">+</button>
            </div>
          </div>

          <div>
            <p class="field-label">4. Data${isDaily ? " (diárias)" : ""}</p>
            <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
              <input type="date" />
              ${
                isDaily
                  ? `<span style="font-size:14px;color:var(--ink2)">por</span>
                     <div class="qty-stepper" id="days-stepper">
                       <button type="button" data-action="dec">−</button><span id="days-value">1</span><button type="button" data-action="inc">+</button>
                     </div>
                     <span style="font-size:14px;color:var(--ink2)">diária(s)</span>`
                  : ""
              }
            </div>
          </div>

          ${
            isDaily
              ? ""
              : `<div>
                  <p class="field-label">5. Horário</p>
                  <div class="chip-row" id="time-chips">
                    ${TIME_SLOTS.map((t) => `<button type="button" class="chip" data-time="${t}">${t}</button>`).join("")}
                  </div>
                  <p class="micro" style="margin-top:4px">duração média ${service.durationMin} min</p>
                </div>`
          }

          <div>
            <p class="field-label">6. Transporte</p>
            ${transportRowHtml("Envio do animal", "sendBy", service.tripFee)}
            ${transportRowHtml("Retorno do animal", "returnBy", service.tripFee)}
          </div>

          <div class="quote-box">
            <p id="quote-line" style="color:var(--ink2)"></p>
            <p class="num" id="quote-total" style="margin-top:4px;font-size:18px;font-weight:600"></p>
            <button type="button" id="btn-agendar" class="btn btn-brand btn-block" style="margin-top:12px">Agendar</button>
          </div>
        </div>

        <div>
          <p class="field-label">Agendamentos desta sessão</p>
          <ul id="booked-list" style="list-style:none;padding:0;margin-top:8px;font-size:14px;display:flex;flex-direction:column;gap:8px"></ul>
          <p id="booked-empty" style="font-size:14px;color:var(--ink2)">Nenhum agendamento ainda.</p>
        </div>
      </div>
    </div>
    <style>
      @media (max-width: 900px) { #service-grid { grid-template-columns: 1fr !important; } }
    </style>`;

  function transportRowHtml(label, key, tripFee) {
    return `
      <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;font-size:14px;margin-top:8px">
        <span>${label}</span>
        <div style="display:flex;gap:12px">
          <label style="display:flex;align-items:center;gap:6px">
            <input type="radio" name="${key}" value="CLIENTE" checked /> por mim
          </label>
          <label style="display:flex;align-items:center;gap:6px">
            <input type="radio" name="${key}" value="LOJA" /> pela loja (+${formatBRL(tripFee)})
          </label>
        </div>
      </div>`;
  }

  function paintChips(containerId, attr, value) {
    document.querySelectorAll(`#${containerId} .chip`).forEach((btn) => {
      btn.classList.toggle("active", btn.dataset[attr] === value);
    });
  }

  function updateQuote() {
    const quote = quoteService(service, {
      size: state.species === "CAO" ? state.size : undefined,
      animals: state.animals,
      days: state.days,
      sendBy: state.sendBy,
      returnBy: state.returnBy,
    });
    const parts = [`${state.animals}x ${formatBRL(quote.perAnimal)}`];
    if (isDaily) parts.push(`× ${state.days} diária(s)`);
    if (quote.freight > 0) parts.push(`+ transporte ${formatBRL(quote.freight)}`);
    document.getElementById("quote-line").textContent = parts.join(" ");
    document.getElementById("quote-total").textContent = `Total ${formatBRL(quote.total)}`;
    return quote;
  }

  document.getElementById("size-block").style.display = state.species === "CAO" ? "" : "none";
  paintChips("species-chips", "species", state.species);
  paintChips("size-chips", "size", state.size);
  if (!isDaily) paintChips("time-chips", "time", state.time);

  document.querySelectorAll("#species-chips .chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.species = btn.dataset.species;
      document.getElementById("size-block").style.display = state.species === "CAO" ? "" : "none";
      paintChips("species-chips", "species", state.species);
      updateQuote();
    });
  });
  document.querySelectorAll("#size-chips .chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.size = btn.dataset.size;
      paintChips("size-chips", "size", state.size);
      updateQuote();
    });
  });
  if (!isDaily) {
    document.querySelectorAll("#time-chips .chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.time = btn.dataset.time;
        paintChips("time-chips", "time", state.time);
      });
    });
  }
  document.querySelectorAll('input[name="sendBy"]').forEach((r) =>
    r.addEventListener("change", (e) => {
      state.sendBy = e.target.value;
      updateQuote();
    })
  );
  document.querySelectorAll('input[name="returnBy"]').forEach((r) =>
    r.addEventListener("change", (e) => {
      state.returnBy = e.target.value;
      updateQuote();
    })
  );

  const animalsValue = document.getElementById("animals-value");
  document.querySelector("#animals-stepper [data-action='dec']").addEventListener("click", () => {
    state.animals = Math.max(1, state.animals - 1);
    animalsValue.textContent = state.animals;
    updateQuote();
  });
  document.querySelector("#animals-stepper [data-action='inc']").addEventListener("click", () => {
    state.animals = Math.min(10, state.animals + 1);
    animalsValue.textContent = state.animals;
    updateQuote();
  });

  if (isDaily) {
    const daysValue = document.getElementById("days-value");
    document.querySelector("#days-stepper [data-action='dec']").addEventListener("click", () => {
      state.days = Math.max(1, state.days - 1);
      daysValue.textContent = state.days;
      updateQuote();
    });
    document.querySelector("#days-stepper [data-action='inc']").addEventListener("click", () => {
      state.days = Math.min(30, state.days + 1);
      daysValue.textContent = state.days;
      updateQuote();
    });
  }

  document.getElementById("btn-agendar").addEventListener("click", () => {
    const quote = updateQuote();
    booked.push(`${service.name} #${booked.length + 1}`);
    addService({
      id: `${service.slug}-${Date.now()}`,
      name: service.name,
      unitPrice: quote.total,
      meta: `${state.species === "CAO" ? "Cão" : "Gato"} · ${isDaily ? `${state.days} diária(s)` : state.time}`,
    });
    renderBooked();
  });

  function renderBooked() {
    const list = document.getElementById("booked-list");
    const empty = document.getElementById("booked-empty");
    list.innerHTML = booked.map((b) => `<li class="badge badge-info" style="display:block;padding:8px 12px">${b}</li>`).join("");
    empty.style.display = booked.length ? "none" : "block";
  }

  updateQuote();
  renderBooked();
  renderShell();
}
