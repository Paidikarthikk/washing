const cartitem=document.getElementById("cart-items");
const cartarray=[];
let serialno=1;

const addtobtn=document.querySelectorAll(".add-to-cart");
const booknow=document.getElementById("book-now");

addtobtn.forEach((btn)=>{
    btn.addEventListener("click",function(e){
        const serviceName=e.target.parentElement.querySelector("h4").innerText;
        const servicePrice=e.target.parentElement.querySelector("span").innerText;
        if(btn.innerText.includes("Add item")){
            const cartobj={
                id:"item"+index,
                serial:serialno,
                name:serviceName,
                price:servicePrice
            };
            serialno++;
            cartarray.push(cartobj);
            btn.innerText="Remove item";
            btn.style.backgroundColor="rgba(255, 0, 0, 0.5)";
            addRowToTable(cartobj);
            amtupdate();
            booknoww();
        }
        else{
            const itemToRemove=cartarray.findIndex(cartobj => cartobj.id==="item"+index);
            if(itemToRemove!==-1){
                cartarray.splice(itemToRemove,1);
                serialno--;
                RemoveRowFromTable(btn.id);
                updateSerialNumbers();
            }
            btn.innerText="Add item";
            btn.style.backgroundColor="rgba(128, 128, 128, 0.5)";
            amtupdate();
            booknoww();
        }
    })
})

function addRowToTable(cartobj){
    const row=document.createElement("tr");
    row.setAttribute("id",cartobj.id);
    row.innerHTML=`
        <td class="border px-4 py-2">${cartobj.serial}</td>
        <td class="border px-4 py-2">${cartobj.name}</td>
        <td class="border px-4 py-2">${cartobj.price}</td>
    `;
    cartitem.appendChild(row);
}

function RemoveRowFromTable("item"+index){
    const row=document.getElementById(id);
    if(row){
        cartitem.removeChild(row);
    }
}

function updateSerialNumbers(){
    const rows=cartitem.querySelectorAll("tr");
    rows.forEach((row,index)=>{
        row.cells[0].innerText=index+1;
    });
}

function amtupdate(){
    let total=0;
    cartarray.forEach((cartobj)=>{
        total+=parseFloat(cartobj.price.replace("$",""));
    });
    console.log("Total Amount:", total);
}

function booknoww(){
    if(cartarray.length>0){
        booknow.disabled=false;
    }
    else{
        booknow.disabled=true;
    }
}
