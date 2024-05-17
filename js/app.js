const createOrder = document.querySelector("#guardar-cliente");
const platillosContainer = document.querySelector("#platillos");
const consumoContainer = document.querySelector("#resumen");
const categorias={
    1: "Comida",
    2: "Bebidas",
    3: "Postres"
}
let client = {
    table: "",
    time: "", 
    order: []
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

        quantity.id = id;
        quantity.min = 0;
        quantity.type = "number";
        quantity.classList.add("quantity");

        quantity.onchange = (e)=>{
            quantityChange(e, nombre, precio)
        }

        row.appendChild(mealName);
        row.appendChild(mealPrice);
        row.appendChild(mealCategoria);
        quantityDiv.appendChild(quantity);
        row.appendChild(quantityDiv);

        contenido.appendChild(row);
    })
}

function quantityChange(e, nombre, precio){
    const targetID = Number(e.target.id);
    const targetValue = Number(e.target.value);

    let listMeals = client.order
    const mealExist = client.order.some( meal => meal.id == targetID);
    
    if(targetValue == 0){
        client.order = listMeals.filter(meal => meal.id !== targetID)
        removeMealOrder(targetID)
        return;
    }

    if(mealExist){
        listMeals.forEach(meal => {
            if(meal.id == targetID){
                meal.quantity = targetValue
            }
            return;
        })
        modifyQuantityMealOrder(targetID, targetValue)
        return;
    }

    const meal = {
        id: targetID,
        nombre: nombre,
        precio: precio,
        quantity: targetValue
    }
    listMeals.push(meal)
    addMealOrder(targetID)
}

function addMealOrder(idM){
    listMeals = client.order;
    lista = consumoContainer.lastElementChild

    listMeals.forEach(meal => {
        if(meal.id == idM){
            const {id, nombre, precio, quantity} = meal

            const subTotal = precio*quantity
            const mealCard = document.createElement("DIV");
            const mealCardName = document.createElement("H2");
            const mealCardInfo = document.createElement("DIV");
            const mealCardQuantity = document.createElement("P");
            const mealCardPrice = document.createElement("P");
            const mealCardSubTotal = document.createElement("P");
            const mealCardDeleteBtn = document.createElement("BUTTON");

            mealCard.id = `div-${id}`;
            mealCardName.textContent = nombre;
            mealCardQuantity.textContent  = quantity;
            mealCardQuantity.id = `q-${id}`;
            mealCardPrice.textContent = precio;
            mealCardPrice.id = `p-${id}`
            mealCardSubTotal.textContent = `$ ${subTotal}`;
            mealCardSubTotal.id = `st-${id}`
            mealCardDeleteBtn.textContent = "Delete"

            mealCardInfo.appendChild(mealCardQuantity);
            mealCardInfo.appendChild(mealCardPrice);
            mealCardInfo.appendChild(mealCardSubTotal);

            mealCard.appendChild(mealCardName);
            mealCard.appendChild(mealCardInfo);
            mealCard.appendChild(mealCardDeleteBtn)

            lista.appendChild(mealCard)
        }
    })
}

function modifyQuantityMealOrder(idT, value){
    const listMeals = client.order

    listMeals.forEach( meal => {
        if(meal.id == idT){
            const {precio, quantity} = meal;

            const quantityTarget = document.querySelector(`#q-${idT}`);
            const subTotalTarget = document.querySelector(`#st-${idT}`);

            const subTotal = quantity*precio;

            quantityTarget.textContent = value;
            subTotalTarget.textContent = `$ ${subTotal}`
        }
    })
}

function removeMealOrder(id){
    const mealTarget = document.querySelector(`#div-${id}`);
    mealTarget.remove()
}