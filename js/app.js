const createOrder = document.querySelector("#guardar-cliente");

createOrder.addEventListener("click",createOrderFunc);

function createOrderFunc(){
    const table = document.querySelector("#mesa").value;
    const timeOrder = document.querySelector("#hora").value;

    if(table=="" || timeOrder==""){
        printError("fill all fields", "error-alert")
        return;
    }

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
    platillos.forEach(plato=>{
        const {id, nombre, precio, categoria} = plato;
        console.log(plato)
    })
}