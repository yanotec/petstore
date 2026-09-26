// Troca de tema (6 temas) e modo (claro/escuro/sistema) — persistidos em localStorage
// e compartilhados entre loja e backoffice, conforme CLAUDE.md.
const THEME_KEY = "pethub.theme";
const MODE_KEY = "pethub.mode";
const MODE_ORDER = ["light", "dark", "system"];
const MODE_ICON = { light: "☀", dark: "☾", system: "🖥" };

export const THEME_META = [
  { key: "ambar", label: "Âmbar", colors: ["#C98A16", "#E1691E", "#3A2A18"] },
  { key: "aco", label: "Aço", colors: ["#2F6DB5", "#E0552B", "#1F2A35"] },
  { key: "papel", label: "Papel", colors: ["#3E8F7C", "#D8557F", "#25322F"] },
  { key: "capim", label: "Capim", colors: ["#6E9A1F", "#B8672A", "#3B2A1C"] },
  { key: "brasil", label: "Canarinho", colors: ["#F2C230", "#1E7A45", "#12452B"] },
  { key: "magenta", label: "Magenta", colors: ["#C2267A", "#23855A", "#3A1530"] },
];

function resolveMode(mode) {
  if (mode === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return mode;
}

function apply(theme, mode) {
  document.documentElement.setAttribute("data-theme", theme);
  document.documentElement.setAttribute("data-mode", resolveMode(mode));
}

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || "ambar";
}

export function getMode() {
  return localStorage.getItem(MODE_KEY) || "light";
}

export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  apply(theme, getMode());
  document.dispatchEvent(new CustomEvent("pethub:theme-change"));
}

export function cycleMode() {
  const next = MODE_ORDER[(MODE_ORDER.indexOf(getMode()) + 1) % MODE_ORDER.length];
  localStorage.setItem(MODE_KEY, next);
  apply(getTheme(), next);
  document.dispatchEvent(new CustomEvent("pethub:theme-change"));
}

export function initTheme() {
  apply(getTheme(), getMode());
}

export function renderModeToggle(el) {
  function paint() {
    el.textContent = MODE_ICON[getMode()];
    el.title = `Modo: ${getMode()}`;
  }
  paint();
  el.addEventListener("click", () => {
    cycleMode();
    paint();
  });
}

function swatchHtml(colors) {
  return `<span class="theme-swatch-trio">${colors
    .map((c) => `<span style="background:${c}"></span>`)
    .join("")}</span>`;
}

export function renderThemeSwitcher(root) {
  root.innerHTML = `
    <div class="theme-switcher">
      <button type="button" class="theme-trigger" id="theme-trigger">
        <span class="swatch-dot"></span> Cores
      </button>
      <div class="theme-popover" id="theme-popover">
        <p class="micro" style="margin-bottom:8px">Tema</p>
        <div class="theme-grid">
          ${THEME_META.map(
            (t) => `<button type="button" class="theme-option" data-theme-key="${t.key}">
              ${swatchHtml(t.colors)}<span>${t.label}</span>
            </button>`
          ).join("")}
        </div>
        <div class="mode-row">
          <span class="micro">Modo</span>
          <button type="button" class="icon-btn" id="theme-mode-toggle"></button>
        </div>
      </div>
    </div>`;

  const trigger = root.querySelector("#theme-trigger");
  const popover = root.querySelector("#theme-popover");
  const modeBtn = root.querySelector("#theme-mode-toggle");

  function paintActive() {
    root.querySelectorAll(".theme-option").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.themeKey === getTheme());
    });
  }
  paintActive();
  renderModeToggle(modeBtn);

  trigger.addEventListener("click", () => popover.classList.toggle("open"));
  document.addEventListener("click", (e) => {
    if (!root.contains(e.target)) popover.classList.remove("open");
  });
  root.querySelectorAll(".theme-option").forEach((btn) => {
    btn.addEventListener("click", () => {
      setTheme(btn.dataset.themeKey);
      paintActive();
      popover.classList.remove("open");
    });
  });
}
