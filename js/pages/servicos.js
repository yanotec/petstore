import { SERVICES } from "../data.js";
import { serviceCardHtml } from "../components.js";
import { renderShell } from "../layout.js";

document.getElementById("main").innerHTML = `
  <div class="wrap">
    <h1>Serviços</h1>
    <p style="color:var(--ink2);font-size:14px;margin-top:4px">
      Banho, tosa, saúde e transporte para o seu pet.
    </p>
    <div class="grid grid-3" style="margin-top:24px">
      ${SERVICES.map(serviceCardHtml).join("")}
    </div>
  </div>`;

renderShell();
