const createOrder = document.querySelector("#guardar-cliente");
const platillosContainer = document.querySelector("#platillos");
const consumoContainer = document.querySelector("#resumen");
const lista = document.querySelector("#meals-list")
const calcularTotal = document.querySelector("#total-btn");
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
calcularTotal.addEventListener("click", displayTotals)


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
        quantity.value = 0;
        quantity.type = "number";
        quantity.classList.add("quantity", `in-${id}`);

        quantity.onchange = (e)=>{
            quantityChange(e, nombre, precio);
            gastoTotal()
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
            const mealCardQSpan = document.createElement("SPAN");
            const mealCardPSpan = document.createElement("SPAN");
            const mealCardSTSpan = document.createElement("SPAN");
            const mealCardQDiv = document.createElement("DIV");
            const mealCardPDiv = document.createElement("DIV");
            const mealCardSTDiv = document.createElement("DIV");

            mealCard.classList.add("meal-card")
            mealCard.id = `div-${id}`;
            mealCardName.textContent = nombre;
            mealCardQSpan.textContent = "Cantidad:  ";
            mealCardQuantity.textContent  = quantity;
            mealCardQuantity.id = `q-${id}`;
            mealCardPSpan.textContent = "Precio:  ";
            mealCardPrice.textContent = `$${precio}`;
            mealCardPrice.id = `p-${id}`
            mealCardSTSpan.textContent = "SubTotal:  "
            mealCardSubTotal.textContent = `$${subTotal}`;
            mealCardSubTotal.id = `st-${id}`
            mealCardDeleteBtn.textContent = "Delete"
            mealCardInfo.classList.add("meal-card__info")
            mealCardDeleteBtn.onclick = ()=>{
                client.order = client.order.filter(meal => meal.id !== id)
                removeMealOrder(id)
            }

            mealCardQDiv.appendChild(mealCardQSpan);
            mealCardQDiv.appendChild(mealCardQuantity);
            mealCardInfo.appendChild(mealCardQDiv);
            mealCardPDiv.appendChild(mealCardPSpan);
            mealCardPDiv.appendChild(mealCardPrice);
            mealCardInfo.appendChild(mealCardPDiv);
            mealCardSTDiv.appendChild(mealCardSTSpan);
            mealCardSTDiv.appendChild(mealCardSubTotal);
            mealCardInfo.appendChild(mealCardSTDiv);

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
    const casilla = document.querySelector(`.in-${id}`);
    casilla.value = 0;
    casilla.checkValidity();
    /* casilla.dispatchEvent(new Event('input')); */
    mealTarget.remove()
}

function gastoTotal(){
    let Total = 0;
    client.order.forEach(meal =>{
        const totalMeal = meal.precio*meal.quantity
        Total+=totalMeal;
    })
    return Total;
}

function displayTotals(){
    const subTotal = gastoTotal();
    const percentajeTip = document.querySelector('[name="percentage-tip"]:checked');

    if(percentajeTip){
        const propina = (subTotal*percentajeTip.value)/100;
        const total = subTotal+propina;
        printTotals(subTotal, propina, total)
    }
}

function printTotals(subTotal, propina, total){
    const totalsHTML = document.querySelector("#totals");

    const subTotalDiv = document.createElement("DIV");
    const subTotalSpan = document.createElement("SPAN");
    const subTotalP = document.createElement("P");
    subTotalSpan.textContent = "SubTotal: ";
    subTotalP.textContent = subTotal;

    subTotalDiv.appendChild(subTotalSpan);
    subTotalDiv.appendChild(subTotalP);


    const propinaDiv = document.createElement("DIV");
    const propinaSpan = document.createElement("SPAN");
    const propinaP = document.createElement("P");
    propinaP.textContent = propina;
    propinaSpan.textContent = "Propina: ";

    propinaDiv.appendChild(propinaSpan);
    propinaDiv.appendChild(propinaP);


    const totalDiv = document.createElement("DIV");
    const totalSpan = document.createElement("SPAN");
    const totalP = document.createElement("P");
    totalSpan.textContent = "Total: ";
    totalP.textContent = total;
    totalDiv.appendChild(totalSpan);
    totalDiv.appendChild(totalP);

    totalsHTML.appendChild(subTotalDiv);
    totalsHTML.appendChild(propinaDiv);
    totalsHTML.appendChild(totalDiv);
} 