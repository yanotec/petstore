import { PRODUCTS, CATEGORIES } from "../data.js";
import { productCardHtml, wireProductCards } from "../components.js";
import { renderShell } from "../layout.js";

const params = new URLSearchParams(location.search);
const q = (params.get("q") || "").trim();
const cat = params.get("cat") || "";
const query = q.toLowerCase();

const results = PRODUCTS.filter((p) => {
  const matchesCat = !cat || cat === "todos" || p.categorySlug === cat;
  const matchesQuery =
    !query ||
    p.name.toLowerCase().includes(query) ||
    p.sku.toLowerCase().includes(query) ||
    p.description.toLowerCase().includes(query);
  return matchesCat && matchesQuery;
});

const chips = [{ slug: "todos", name: "Tudo" }, ...CATEGORIES];

document.getElementById("main").innerHTML = `
  <div class="wrap">
    <h1>${q ? `Resultados para "${q}"` : "Todos os produtos"}</h1>
    <p style="color:var(--ink2);font-size:14px;margin-top:4px">${results.length} resultado(s)</p>

    <div class="chip-row" style="margin-top:16px">
      ${chips
        .map((c) => {
          const active = cat === c.slug || (!cat && c.slug === "todos");
          const href = c.slug === "todos" ? "./busca.html" : `./busca.html?cat=${c.slug}`;
          return `<a href="${href}" class="chip ${active ? "active" : ""}">${c.name}</a>`;
        })
        .join("")}
    </div>

    <div class="grid grid-4" id="results-grid" style="margin-top:24px"></div>
  </div>`;

document.getElementById("results-grid").innerHTML =
  results.map(productCardHtml).join("") ||
  `<p style="grid-column:1/-1;text-align:center;color:var(--ink2);padding:40px 0">Nenhum produto encontrado.</p>`;
wireProductCards(document, PRODUCTS);

renderShell();
