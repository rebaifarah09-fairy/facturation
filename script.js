function getTVARate() {
  const sel = document.getElementById("tva").value;
  if (sel === "autre") {
    const v = parseFloat(document.getElementById("tvaCustom").value);
    return isNaN(v) ? 0 : v;
  }
  return parseFloat(sel) || 0;
}

function getDevise() {
  const sel = document.getElementById("devise").value;
  if (sel === "Autre") {
    return (document.getElementById("deviseCustom").value || "").trim();
  }
  return sel;
}

function toggleCustomFields() {
  // TVA
  const tvaSel = document.getElementById("tva").value;
  const tvaCustom = document.getElementById("tvaCustom");
  tvaCustom.style.display = (tvaSel === "autre") ? "inline-block" : "none";

  // Devise
  const devSel = document.getElementById("devise").value;
  const devCustom = document.getElementById("deviseCustom");
  devCustom.style.display = (devSel === "Autre") ? "inline-block" : "none";
}

function updateTotals() {
  const rows = document.querySelectorAll("#product-body tr");
  let totalHT = 0;

  rows.forEach(row => {
    const qty = parseFloat(row.querySelector(".qty")?.value) || 0;
    const price = parseFloat(row.querySelector(".price")?.value) || 0;
    const line = qty * price;
    const cell = row.querySelector(".line-total");
    if (cell) cell.textContent = line.toFixed(2);
    totalHT += line;
  });

  const tvaRate = getTVARate();
  const devise = getDevise();
  const acompte = parseFloat(document.getElementById("acompte").value) || 0;

  const totalTVA = totalHT * (tvaRate / 100);
  const totalTTC = totalHT + totalTVA;
  const reste = totalTTC - acompte;

  document.getElementById("total-ht").textContent = totalHT.toFixed(2) + (devise ? " " + devise : "");
  document.getElementById("total-tva").textContent = totalTVA.toFixed(2) + (devise ? " " + devise : "");
  document.getElementById("total-ttc").textContent = totalTTC.toFixed(2) + (devise ? " " + devise : "");
  document.getElementById("reste").textContent    = (reste).toFixed(2) + (devise ? " " + devise : "");
}

function addRow() {
  const tbody = document.getElementById("product-body");
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><input type="text" placeholder="Produit ou service"></td>
    <td><input type="number" placeholder="1" min="0" step="0.01" class="qty"></td>
    <td><input type="number" placeholder="0.00" step="0.01" class="price"></td>
    <td class="line-total">0.00</td>
    <td><button class="btn-remove">X</button></td>
  `;
  tbody.appendChild(tr);
}

// === Listeners globaux ===
document.addEventListener("input", updateTotals);

document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "add-row") {
    addRow();
  }
  if (e.target && e.target.classList.contains("btn-remove")) {
    e.target.closest("tr").remove();
    updateTotals();
  }
});

document.addEventListener("change", (e) => {
  if (e.target && (e.target.id === "tva" || e.target.id === "devise")) {
    toggleCustomFields();
    updateTotals();
  }
});

// Init
document.addEventListener("DOMContentLoaded", () => {
  toggleCustomFields();
  updateTotals();
});
