let locked = [];

function getRandomColor() {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.innerText = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function generateColors() {
  const palette = document.getElementById("palette");
  const count = parseInt(document.getElementById("color-count").value);
  palette.innerHTML = "";
  locked = locked.slice(0, count);

  for (let i = 0; i < count; i++) {
    if (locked[i] === undefined) locked[i] = false;

    const color = locked[i] && palette.children[i]
      ? palette.children[i].dataset.color
      : getRandomColor();

    const box = document.createElement("div");
    box.className = "color-box";
    box.style.backgroundColor = color;
    box.dataset.color = color;

    box.innerHTML = `
      <span>${color}</span>
      <button onclick="event.stopPropagation(); toggleLock(${i})">
        ${locked[i] ? "🔒" : "🔓"}
      </button>
    `;

    box.onclick = () => {
      navigator.clipboard.writeText(color);
      showToast(`${color} copied`);
    };

    palette.appendChild(box);
  }
}

function toggleLock(index) {
  locked[index] = !locked[index];
  generateColors();
}

function copyAllColors() {
  const boxes = document.querySelectorAll(".color-box");
  const colors = Array.from(boxes).map(b => b.dataset.color).join(", ");
  navigator.clipboard.writeText(colors);
  showToast("All colors copied");
}

function savePalette() {
  const boxes = document.querySelectorAll(".color-box");
  const colors = Array.from(boxes).map(b => b.dataset.color);
  const saved = JSON.parse(localStorage.getItem("palettes") || "[]");
  saved.push(colors);
  localStorage.setItem("palettes", JSON.stringify(saved));
  showToast("Palette saved");
}

function showSavedPalettes() {
  const saved = JSON.parse(localStorage.getItem("palettes") || "[]");
  const container = document.getElementById("saved-palettes");
  container.innerHTML = "";

  saved.forEach(palette => {
    const row = document.createElement("div");
    row.className = "palette-row";

    palette.forEach(color => {
      const box = document.createElement("div");
      box.className = "color-box small";
      box.style.background = color;
      box.innerText = color;
      row.appendChild(box);
    });

    container.appendChild(row);
  });
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

window.onload = generateColors;

