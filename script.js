let locked = [];

function getRandomColor() {
  const hex = Math.floor(Math.random() * 0xffffff).toString(16);
  return "#" + hex.padStart(6, "0");
}

function generateColors() {
  const palette = document.getElementById("palette");
  const count = parseInt(document.getElementById("color-count").value);
  palette.innerHTML = "";
  locked = locked.slice(0, count);

  for (let i = 0; i < count; i++) {
    if (!locked[i]) locked[i] = false;

    const color = locked[i] ? palette.children[i].dataset.color : getRandomColor();
    const box = document.createElement("div");
    box.className = "color-box";
    box.style.backgroundColor = color;
    box.dataset.color = color;
    box.innerHTML = `
      <div style="width:100%; text-shadow:1px 1px 2px #000;">
        ${color} <br>
        <button onclick="event.stopPropagation(); toggleLock(${i})">
          ${locked[i] ? "🔒" : "🔓"}
        </button>
      </div>
    `;

    box.onclick = () => {
      navigator.clipboard.writeText(color);
      alert(`Copied ${color} to clipboard!`);
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
  const codes = Array.from(boxes).map(box => box.dataset.color).join(", ");
  navigator.clipboard.writeText(codes);
  alert("All colors copied!");
}

function savePalette() {
  const boxes = document.querySelectorAll(".color-box");
  const codes = Array.from(boxes).map(box => box.dataset.color);
  let saved = JSON.parse(localStorage.getItem("palettes") || "[]");
  saved.push(codes);
  localStorage.setItem("palettes", JSON.stringify(saved));
  alert("Palette saved!");
}

function showSavedPalettes() {
  const saved = JSON.parse(localStorage.getItem("palettes") || "[]");
  const list = document.getElementById("saved-palettes");
  list.innerHTML = "";
  saved.forEach(palette => {
    const row = document.createElement("div");
    row.className = "palette-row";
    palette.forEach(color => {
      const colorBox = document.createElement("div");
      colorBox.style.background = color;
      colorBox.className = "color-box";
      colorBox.innerText = color;
      row.appendChild(colorBox);
    });
    list.appendChild(row);
  });
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

window.onload = generateColors;

