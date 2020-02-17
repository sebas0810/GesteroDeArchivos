// Espera a que el documento se cargue para ejecutar el callback
window.addEventListener("load", () => {
  cambioDirectorio("home");
});

// Funciones
function traerArchivos(directorio) {
  return fetch(`http://localhost:8000/files?directory=${directorio}`)
    .then(response => response.json())
    .then(data => data);
}

function crearArchivo(directorio, nombreArchivo) {
  fetch(
    `http://localhost:8000/createFile?directory=${directorio}&name=${nombreArchivo}`
  )
    .then(response => response.json())
    .then(data => data);
}

function crearCarpeta(directorio, nombreCarpeta) {
  fetch(
    `http://localhost:8000/createFolder?directory=${directorio}&name=${nombreCarpeta}`
  )
    .then(response => response.json())
    .then(data => data);
}

// Escuchadores de eventos

// Evento click que activa la opción de crear un archivo
document.querySelector(".create-file").addEventListener("click", event => {
  const directorio = document.querySelector(".folder-name").textContent;
  const nombreArchivo = document.querySelector(".filename").value;

  crearArchivo(directorio, nombreArchivo);
});

document.querySelector(".create-folder").addEventListener("click", event => {
  const directorio = document.querySelector(".folder-name").textContent;
  const nombreCarpeta = document.querySelector(".foldername").value;

  crearCarpeta(directorio, nombreCarpeta);
});

// Evento click cambio de directorios
document.querySelector(".info-table").addEventListener("click", event => {
  const clase = event.target.className;
  const proximaRuta = event.target.textContent;
  const directorioRaiz = document.querySelector(".folder-name").textContent;

  if (clase === "move-dir") {
    const ruta = `${directorioRaiz}/${proximaRuta}`;

    cambioDirectorio(ruta);
  }
});

// Evento click para ir hacia el directorio padre
document.querySelector(".go-back").addEventListener("click", () => {
  const directorioRaiz = document.querySelector(".folder-name").textContent;

  irHaciaAtras(directorioRaiz);
});

// Recibe la ruta y renderiza la ruta ingresada
function cambioDirectorio(ruta) {
  traerArchivos(ruta).then(archivos => {
    // Borra toda la info residual
    const tabla = document.querySelector(".info-table");
    tabla.innerHTML = "";

    // Cambiamos el titulo de la carpeta actual
    const tituloCarpeta = document.querySelector(".folder-name");
    tituloCarpeta.innerText = ruta;

    // Renderiza tantas filas como archivos hayan
    archivos.map(archivo => {
      renderizarInfo(archivo);
    });
  });
}

function irHaciaAtras(ruta) {
  const ultimo = ruta.lastIndexOf("/");
  const rutaAnterior = ruta.substring(0, ultimo);
  cambioDirectorio(rutaAnterior);
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
