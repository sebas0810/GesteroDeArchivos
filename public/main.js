// Espera a que el documento se cargue para ejecutar el callback
window.addEventListener("load", () => {
  traerArchivos("http://localhost:8000/").then(archivos =>
    archivos.map(archivo => {
      console.log(archivo);
    })
  );
});

function traerArchivos(enlance) {
  return fetch(enlance)
    .then(response => response.json())
    .then(data => data);
}
