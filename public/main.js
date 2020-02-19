// Espera a que el documento se cargue para ejecutar el callback
window.addEventListener("load", () => {
  cambioDirectorio("home");
});

// Escuchadores de eventos

// Evento click que activa la opción de crear un archivo
document.querySelector(".create-file").addEventListener("click", event => {
  const directorio = document.querySelector(".folder-name").textContent;
  const nombreArchivo = document.querySelector(".filename").value;

  crearArchivo(directorio, nombreArchivo);
  cambioDirectorio(directorio);
});

document.querySelector(".create-folder").addEventListener("click", event => {
  const directorio = document.querySelector(".folder-name").textContent;
  const nombreCarpeta = document.querySelector(".foldername").value;

  crearCarpeta(directorio, nombreCarpeta);
  cambioDirectorio(directorio);
});

// Evento click para ir hacia el directorio padre
document.querySelector(".go-back").addEventListener("click", () => {
  const directorioRaiz = document.querySelector(".folder-name").textContent;

  irHaciaAtras(directorioRaiz);
});

// Evento click cambio de directorios
document.querySelector(".info-table").addEventListener("click", event => {
  const clase = event.target.className;
  const proximaRuta = event.target.textContent;
  const directorioRaiz = document.querySelector(".folder-name").textContent;

  if (clase === "move-dir") {
    const ruta = `${directorioRaiz}/${proximaRuta}`;

    cambioDirectorio(ruta);
  } else if (clase === "change-owner") {
    const nuevoHijo = document.createElement("input"); // entrada de texto
    nuevoHijo.className = "owner-name";
    nuevoHijo.setAttribute("type", "text");
    nuevoHijo.setAttribute("placeholder", "Nombre propietario");

    const nodoPadre = event.target.parentElement; // dato de la fila (td)
    const hijoAnterior = event.target.nextSibling; // texto, nodo posterior
    console.log(hijoAnterior);

    // Cambio de texto a entrada
    const hijoReemplazado = nodoPadre.replaceChild(nuevoHijo, hijoAnterior);

    // Cambio boton
    event.target.innerText = "Cambiar Propietario";
    event.target.className = "submit-owner";
  } else if (clase === "submit-owner") {
    const nombrePropietario = event.target.nextSibling.value;

    const nodoPadre = event.target.parentElement;
    const hijoAnterior = event.target.nextSibling;
    const nuevoHijo = document.createTextNode(nombrePropietario);

    // Cambio de entrada a texto
    nodoPadre.replaceChild(nuevoHijo, hijoAnterior);

    // Cambio del boton
    event.target.innerText = "Editar";
    event.target.className = "change-owner";

    const archivo = nodoPadre.parentElement.children[0].lastChild.textContent;

    cambiarPropietarioArchivo(nombrePropietario, archivo);
  }
  if (clase === "change-name") {
    //console.dir(event.target);
    let padre = event.target.parentElement;
    let viejo = event.target.nextSibling; //event.target.nextElementSibling;
    //console.dir(viejo);

    let nuevo = document.createElement("input");
    nuevo.className = "new-name";
    nuevo.setAttribute("type", "text");
    nuevo.setAttribute("placeholder", `${viejo.textContent}`);

    padre.replaceChild(nuevo, viejo);

    let viejoB = event.target;
    let nuevoB = document.createElement("button");
    nuevoB.setAttribute("class", "submit-nombre");
    nuevoB.innerText = "Cambiar";

    padre.replaceChild(nuevoB, viejoB);
  }
  if (clase === "submit-nombre") {
    let nombreNuevo = document.querySelector(".new-name").value;
    let nombreViejo = document.querySelector(".new-name").placeholder;
    const ruta = `${directorioRaiz}`;

    cambioNombre(nombreNuevo, nombreViejo, ruta);
    cambioDirectorio(ruta);
  }
  if (clase === "delete") {
    const name =
      event.target.parentElement.parentElement.firstElementChild.lastChild
        .textContent;

    eliminarFD(name, `${directorioRaiz}`);
    cambioDirectorio(`${directorioRaiz}`);
  }
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

function eliminarFD(nombreFD, ruta) {
  return fetch(`http://localhost:8000/eliminar?directory=${ruta}
    &nameFD=${nombreFD}`)
    .then(response => response.json())
    .then(data => data);
}

function cambioNombre(nombreNuevo, nombreViejo, ruta) {
  return fetch(`http://localhost:8000/changeName?directory=${ruta}
    &actualName=${nombreViejo}&newName=${nombreNuevo}`)
    .then(response => response.json())
    .then(data => data);
}

function cambiarPropietarioArchivo(nombrePropietario, archivo) {
  fetch(
    `http://localhost:8000/changeFileOwner?ownerName=${nombrePropietario}&file=${archivo}`
  )
    .then(response => response.json())
    .then(data => data);
}

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
    <td><button class="change-name">Editar</button>${nombre}</td>
    <td>${tipo}</td>
    <td><button class="change-owner">Editar</button>${propietario}</td>
    <td>${permisos}</td>
    <td><button class="delete">Eliminar</button></td>`;

  fila.innerHTML = info;

  tabla.appendChild(fila);
}
