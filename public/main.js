// Espera a que el documento se cargue para ejecutar el callback
window.addEventListener("load", () => {
  traerArchivos("http://localhost:8000/").then(archivos =>
    archivos.map(archivo => {
      renderizarInfo(archivo);
    })
  );
});

function traerArchivos(enlance) {
  return fetch(enlance)
    .then(response => response.json())
    .then(data => data);
}

function renderizarInfo(archivo) {
  const tabla = document.querySelector(".info-table");
  const { permisos, tipo, propietario, nombre } = archivo;

  const fila = document.createElement("tr");

  const info = `
    <td>${nombre}</td>
    <td>${tipo}</td>
    <td>${propietario}</td>
    <td>${permisos}</td>`;

  fila.innerHTML = info;

  tabla.appendChild(fila);
}
