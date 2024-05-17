const createOrder = document.querySelector("#guardar-cliente");
const platillosContainer = document.querySelector("#platillos");
const consumoContainer = document.querySelector("#resumen");

let client = {
    table: "",
    time: "", 
    order: []
}

const categorias={
    1: "Comida",
    2: "Bebidas",
    3: "Postres"
}

createOrder.addEventListener("click",createOrderFunc);

function createOrderFunc(){
    const table = document.querySelector("#mesa").value;
    const timeOrder = document.querySelector("#hora").value;

    if(table=="" || timeOrder==""){
        printError("fill all fields", "error-alert")
        return;
    }

    client.table = table;
    client.time = timeOrder;

    showContainers()
    hideModal()

    extractPlatillos()
}

function printError(message, type){
    const modalBody = document.querySelector(".modal-body");
    const error = document.createElement("DIV");
    const errorP = document.createElement("P");
    console.log(message)

    error.classList.add(type);
    errorP.textContent = message;
    error.appendChild(errorP);

    modalBody.appendChild(error);
    setTimeout(() => {
        error.remove()
    }, 1500);
}

function showContainers(){
    platillosContainer.classList.remove("d-none");
    consumoContainer.classList.remove("d-none");
}

function hideModal(){
    const modal = document.querySelector(".modal");
    const modalB = bootstrap.Modal.getInstance(modal)
    modalB.hide()

    
}

function extractPlatillos(){
    const url = "http://localhost:4000/platillos"

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => showPlatillos(resultado))
}

function showPlatillos(platillos){
    const contenido = document.querySelector("#platillos-list")
    console.log(contenido)
    console.log(platillos)

    platillos.forEach(plato=>{
        const {id, nombre, precio, categoria} = plato;
        
        const row = document.createElement("DIV");
        row.classList.add("fila-platos")
        row.id = id

        const mealName =  document.createElement("DIV");
        const mealPrice = document.createElement("DIV");
        const mealCategoria = document.createElement("DIV");
        const quantityDiv = document.createElement("DIV");
        const quantity = document.createElement("INPUT");

        mealName.textContent = nombre;
        mealPrice.textContent = precio;
        mealCategoria.textContent = categorias[categoria];
        quantity.id - id;
        quantity.type = "number";

        row.appendChild(mealName);
        row.appendChild(mealPrice);
        row.appendChild(mealCategoria);
        quantityDiv.appendChild(quantity);
        row.appendChild(quantityDiv);

        contenido.appendChild(row);
    })
}
