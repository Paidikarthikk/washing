const cartitem = document.getElementById("cartitems");
const cartArray = []; 
let serialNo = 1; 
const addButtons = document.querySelectorAll(".add-to-cart");
addButtons.forEach(function(btn) {
    btn.addEventListener("click", function() {
        const listItem = btn.closest("li");
        const serviceDiv = listItem.querySelector("div");
        const fullText = serviceDiv.innerText; 
        const pricePart = serviceDiv.querySelector("span").innerText;
        const serviceName = fullText.replace(pricePart, "").trim().replace(" - ", "");
        const price = parseFloat(pricePart.replace("$", "")); 
        if (btn.innerText.includes("Add Item")) {
           
            const item = {
                id: btn.id,
                name: serviceName,
                price: price,
                serialNo: serialNo
            };
            cartArray.push(item);
            serialNo++;
            btn.innerHTML = 'Remove Item <ion-icon name="remove-circle-outline"></ion-icon>';
            btn.style.backgroundColor = "rgb(220, 53, 69)";
            addRowToTable(item);
            updateTotal();
        } else {
            const itemToRemove = cartArray.find(item => item.id === btn.id);
            if (itemToRemove) { 
                const rowIndex = cartArray.indexOf(itemToRemove);
                cartArray.splice(rowIndex, 1);
                serialNo--;
                removeRowFromTable(btn.id);
                updateSerialNumbers(); 
            }
            btn.innerHTML = 'Add Item <ion-icon name="add-circle-outline"></ion-icon>';
            btn.style.backgroundColor = "";

            updateTotal();
        }
    });
});


function addRowToTable(item) {
    const newRow = document.createElement("tr");
    newRow.setAttribute("data-id", item.id);
    newRow.innerHTML = `
        <td>${item.serialNo}</td>
        <td>${item.name}</td>
        <td>$${item.price.toFixed(2)}</td>
    `;
    cartitem.appendChild(newRow);
}


function removeRowFromTable(id) {
    const row = cartitem.querySelector(`tr[data-id="${id}"]`);
    if (row) {
        row.remove();
    }
}

function updateSerialNumbers() {
    const rows = cartitem.querySelectorAll("tr");
    rows.forEach((row, index) => {
        row.cells[0].innerText = index + 1;
    });
}

function updateTotal() {
    let total = 0;
    cartArray.forEach(item => {
        total += item.price;
    });
    const totalElements = document.querySelectorAll(".col2 ~ div h3");
    if (totalElements.length >= 2) {
        totalElements[1].innerText = `$${total.toFixed(2)}`;
    }
}


function clearCart() {
    cartArray.length = 0;
    serialNo = 1;
    cartitem.innerHTML = '';
    updateTotal();
    addButtons.forEach(btn => {
        btn.innerHTML = 'Add Item <ion-icon name="add-circle-outline"></ion-icon>';
        btn.style.backgroundColor = '';
    });
}

const booknow = document.getElementById("button");

booknow.addEventListener("click", function(event) {
    event.preventDefault();
    const para = document.getElementById("booked");
    if (cartArray.length > 0) {
        para.innerText = 'Email has been sent successfully';
        clearCart();
    } else {
        para.innerText = 'Your cart is already empty';
    }
});
