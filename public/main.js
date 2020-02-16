// Espera a que el documento se cargue para ejecutar el callback
window.addEventListener("load", () => {
  traerArchivos("home/").then(archivos => {
    // Borra toda la info residual
    const tabla = document.querySelector(".info-table");
    tabla.innerHTML = "";

    // Cambiamos el titulo de la carpeta actual
    const tituloCarpeta = document.querySelector(".folder-name");
    tituloCarpeta.innerText = "home/";

    // Renderiza tantas filas como archivos hayan
    archivos.map(archivo => {
      renderizarInfo(archivo);
    });
  });
});

function traerArchivos(directorio) {
  return fetch(`http://localhost:8000/files?directory=${directorio}`)
    .then(response => response.json())
    .then(data => data);
}

function renderizarInfo(archivo) {
  const tabla = document.querySelector(".info-table");
  let { permisos, tipo, propietario, nombre } = archivo;

  const fila = document.createElement("tr");

  // Si el archivo es de tipo directorio lo coloca como un boton
  nombre =
    tipo === "d" ? `<button class="move-dir">${nombre}</button>` : nombre;

  const info = `
    <td>${nombre}</td>
    <td>${tipo}</td>
    <td>${propietario}</td>
    <td>${permisos}</td>`;

  fila.innerHTML = info;

  tabla.appendChild(fila);
}
