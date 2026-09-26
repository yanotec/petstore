import { CURRENT_CUSTOMER } from "../data.js";
import { renderShell } from "../layout.js";

const CARDS = [
  { href: "./conta-pedidos.html", icon: "📦", title: "Meus pedidos", subtitle: "Acompanhe e repita pedidos" },
  { href: "#", icon: "🧾", title: "Meu cadastro", subtitle: "Nome, e-mail, telefone" },
  { href: "#", icon: "💬", title: "Atendimento", subtitle: "Fale com a loja" },
  { href: "#", icon: "📍", title: "Endereços", subtitle: "Casa, trabalho…" },
  { href: "#", icon: "💳", title: "Formas de pagamento", subtitle: "Cartões salvos" },
  { href: "#", icon: "⚙️", title: "Preferências", subtitle: "Notificações e privacidade" },
  { href: "#", icon: "🐾", title: "Meus pets", subtitle: "Cadastre seus animais" },
];

document.getElementById("main").innerHTML = `
  <div class="wrap" style="max-width:720px">
    <div class="account-header">
      <span class="avatar-lg">${CURRENT_CUSTOMER.initials}</span>
      <div>
        <h1 style="font-size:20px">Olá, ${CURRENT_CUSTOMER.name.split(" ")[0]}</h1>
        <p style="font-size:14px;color:var(--ink2)">${CURRENT_CUSTOMER.email}</p>
      </div>
    </div>
    <div class="account-cards">
      ${CARDS.map(
        (c) => `<a href="${c.href}" class="account-card">
          <span class="emoji">${c.icon}</span>
          <span><span style="display:block;font-size:14px;font-weight:500">${c.title}</span>
          <span style="display:block;font-size:12px;color:var(--ink2)">${c.subtitle}</span></span>
        </a>`
      ).join("")}
    </div>
  </div>`;

renderShell();
