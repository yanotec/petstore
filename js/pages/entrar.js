import { renderShell } from "../layout.js";

document.getElementById("main").innerHTML = `
  <div class="wrap" style="max-width:380px">
    <h1>Entrar</h1>
    <p style="font-size:14px;color:var(--ink2);margin-top:4px">
      Esta tela é apenas ilustrativa — nesta versão de apresentação, a navegação já considera o cliente
      logado (<a href="./conta.html">ver minha conta</a>).
    </p>
    <form style="margin-top:20px;display:flex;flex-direction:column;gap:12px" onsubmit="return false">
      <label style="font-size:13px">E-mail
        <input type="email" placeholder="voce@email.com" style="display:block;width:100%;margin-top:4px" />
      </label>
      <label style="font-size:13px">Senha
        <input type="password" placeholder="••••••••" style="display:block;width:100%;margin-top:4px" />
      </label>
      <button type="submit" class="btn btn-brand btn-block">Entrar</button>
      <a href="./conta.html" class="btn btn-outline btn-block">Criar conta</a>
    </form>
  </div>`;

renderShell();
