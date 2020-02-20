// Espera a que el documento se cargue para ejecutar el callback
window.addEventListener("load", () => {
  cambioDirectorio("home");
});

// Funciones
function traerArchivos(directorio) {
  return fetch(`/api/files?directory=${directorio}`)
    .then(response => response.json())
    .then(data => data);
}

function crearArchivo(directorio, nombreArchivo) {
  fetch(`/api/createFile?directory=${directorio}&name=${nombreArchivo}`)
    .then(response => response.json())
    .then(data => data);
}

function crearCarpeta(directorio, nombreCarpeta) {
  fetch(`/api/createFolder?directory=${directorio}&name=${nombreCarpeta}`)
    .then(response => response.json())
    .then(data => data);
}

// Escuchadores de eventos

// Evento click que activa la opción de crear un archivo
document.querySelector(".create-file").addEventListener("click", event => {
  const directorio = document.querySelector(".folder-name").textContent;
  const nombreArchivo = document.querySelector(".filename").value;
  document.querySelector(".filename").value = "";

  crearArchivo(directorio, nombreArchivo);
  cambioDirectorio(directorio);
});

document.querySelector(".create-folder").addEventListener("click", event => {
  const directorio = document.querySelector(".folder-name").textContent;
  const nombreCarpeta = document.querySelector(".foldername").value;
  document.querySelector(".foldername").value = "";

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
  } else if (clase === "change-mode" && event.target.checked) {
    const nombreArchivo =
      event.target.parentElement.parentElement.children[0].lastChild;

    const archivoSeleccionado = document.querySelector(".selected-file");
    archivoSeleccionado.textContent = nombreArchivo.textContent;
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

document.querySelector(".submit").addEventListener("click", event => {
  const nombreArchivo = document.querySelector(".selected-file").textContent;
  const ruta = document.querySelector(".folder-name").textContent;

  const modoUsuario = document.querySelector(".user-mode");
  const modoGrupo = document.querySelector(".group-mode");
  const modoOtros = document.querySelector(".others-mode");

  const modo = {
    usuario: {
      read: modoUsuario.children[0].className.includes("active") ? 4 : 0,
      write: modoUsuario.children[1].className.includes("active") ? 2 : 0,
      execute: modoUsuario.children[2].className.includes("active") ? 1 : 0
    },
    grupo: {
      read: modoGrupo.children[0].className.includes("active") ? 4 : 0,
      write: modoGrupo.children[1].className.includes("active") ? 2 : 0,
      execute: modoGrupo.children[2].className.includes("active") ? 1 : 0
    },
    otros: {
      read: modoOtros.children[0].className.includes("active") ? 4 : 0,
      write: modoOtros.children[1].className.includes("active") ? 2 : 0,
      execute: modoOtros.children[2].className.includes("active") ? 1 : 0
    }
  };

  const { usuario, grupo, otros } = modo;

  const permiso = parseInt(
    `${usuario.read + usuario.write + usuario.execute}${grupo.read +
      grupo.write +
      grupo.execute}${otros.read + otros.write + otros.execute}`
  );

  const directorio = `${ruta}/${nombreArchivo}`;
  cambiarPermisosArchivo(directorio, permiso);
});

document.querySelector(".mode-buttons").addEventListener("click", event => {
  const clase = Array.from(event.target.classList);

  if (event.target.id === "btn" && clase.includes("active")) {
    event.target.classList.remove("active");
    event.target.style.background = "white";
  } else if (event.target.id === "btn") {
    event.target.classList.add("active");
    event.target.style.background = "#fffa";
  }
});

document.querySelector(".cop").addEventListener("click", event => {
  const directorioRaiz = document.querySelector(".folder-name").textContent;
  const listCheck = document.getElementsByClassName("check");
  var ElementChecked;

  for (var i = 0; i < listCheck.length; i++) {
    if (listCheck[i].checked) {
      ElementChecked = listCheck[i];
    }
  }

  if (ElementChecked) {
    console.log("Uno seleccionado");
    const name =
      ElementChecked.parentElement.parentElement.firstElementChild.lastChild
        .textContent;
    console.log(name);
    document.getElementsByClassName("ruta-FD").placeholder =
      directorioRaiz + "/" + name;
  }
});

document.querySelector(".pas").addEventListener("click", event => {
  const ruta = document.querySelector(".folder-name").textContent;
  const FD = document.getElementsByClassName("ruta-FD").placeholder;
  console.log("pas " + document.getElementsByClassName("ruta-FD").placeholder);

  copiarPegar(FD, ruta);
  cambioDirectorio2(FD, ruta);
});
//accion de mover y cortar
document.querySelector(".mov-cut").addEventListener("click", event => {
  const directorioRaiz = document.querySelector(".folder-name").textContent;
  const listCheck = document.getElementsByClassName("check");
  var ElementChecked;

  for (var i = 0; i < listCheck.length; i++) {
    if (listCheck[i].checked) {
      ElementChecked = listCheck[i];
    }
  }
  //console.dir(ElementChecked);
  if (ElementChecked) {
    console.log("Uno seleccionado");
    if (event.target.textContent == "Mover/Cortar") {
      event.target.textContent = "Moviendo/Cortando";
      const name =
        ElementChecked.parentElement.parentElement.firstElementChild.lastChild
          .textContent;
      document.getElementsByClassName("ruta-FD").value =
        directorioRaiz + "/" + name;
    } else {
      event.target.textContent = "Mover/Cortar";
      const FD = document.getElementsByClassName("ruta-FD").value;
      document.getElementsByClassName("ruta-FD").value = "";
      console.log("FD: " + FD);
      const ruta = document.querySelector(".folder-name").textContent;

      moverCortar(FD, ruta);
      cambioDirectorio(ruta);
    }
  } else {
    if (document.getElementsByClassName("ruta-FD").value != "") {
      event.target.textContent = "Mover/Cortar";
      const FD = document.getElementsByClassName("ruta-FD").value;
      document.getElementsByClassName("ruta-FD").value = "";
      const ruta = document.querySelector(".folder-name").textContent;

      moverCortar(FD, ruta);
      cambioDirectorio(ruta);
    }
  }
});

function cambioDirectorio2(FD, ruta) {
  cambioDirectorio(ruta);
  console.log("Pasara " + FD);
  document.getElementsByClassName("ruta-FD").placeholder = FD;
  console.log(
    "EntroCambio2 " + document.getElementsByClassName("ruta-FD").placeholder
  );
}

function copiarPegar(FD, ruta) {
  return fetch(`/api/copiarpegar?directory=${ruta}
    &FD=${FD}`)
    .then(response => response.json())
    .then(data => data);
}

//FD= file/Directory y es la ruta completa del archivo
function moverCortar(FD, ruta) {
  return fetch(`/api/movercortar?directory=${ruta}
    &FD=${FD}`)
    .then(response => response.json())
    .then(data => data);
}

function eliminarFD(nombreFD, ruta) {
  return fetch(`/api/eliminar?directory=${ruta}
    &nameFD=${nombreFD}`)
    .then(response => response.json())
    .then(data => data);
}

function cambioNombre(nombreNuevo, nombreViejo, ruta) {
  return fetch(`/api/changeName?directory=${ruta}
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

function cambiarPermisosArchivo(archivo, modo) {
  fetch(
    `http://localhost:8000/api/changeFilePermissions?file=${archivo}&mode=${modo}`
  )
    .then(response => response.json())
    .then(data => data);
}
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
  if (ruta === "/home") {
    cambioDirectorio(ruta);
  } else {
    const ultimo = ruta.lastIndexOf("/");
    const rutaAnterior = ruta.substring(0, ultimo);
    cambioDirectorio(rutaAnterior);
  }
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
    <td><input type="radio" class="change-mode" name="chmod">${permisos}</td>
    <td><button class="delete">Eliminar</button></td>
    <td><input type="radio" name="radio1" class="check" /></td>
    `;

  fila.innerHTML = info;

  tabla.appendChild(fila);
}
