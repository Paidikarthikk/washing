let cart=[];
let itemcount=0;

const addbuttons=document.querySelectorAll('.toggle-button');
const cartitems=document.getElementById('cart-items');
const totalamt=document.getElementById('amount-total');
const bookbtn=document.getElementById('book-btn');
const bookingform=document.getElementById('booking-form');
const formInputs=bookingform.querySelectorAll('input[required]');

addbuttons.forEach(button=>{
    button.addEventListener('click',function(e){
        e.preventDefault();
        const serviceitem=this.closest('.service-item');
        const servicename=serviceitem.querySelector('h4').textContent.split('-')[0].trim();
        const price = parseFloat(serviceitem.querySelector('.text-blue-500').textContent.replace('$', ''));
        
        if(this.textContent.trim()==="Add item"){
            addtocart(servicename, price);
            this.textContent="Remove item";
            this.classList.add('bg-red-200');
            this.classList.remove('bg-gray-300');
            this.classList.add('text-red-600');
        } else {
            removefromcart(servicename);
            this.textContent="Add item";
            this.classList.remove('bg-red-200');
            this.classList.add('bg-gray-300');
            this.classList.remove('text-red-600');
        }
    })
})

function addtocart(servicename, price){
    const existingitem = cart.find(item=>item.name===servicename);
    if(existingitem){
        existingitem.quantity+=1;
    } else {
        itemcount++;
        cart.push({
            id: itemcount,
            name: servicename,
            price: price,
            quantity: 1
        });
    }
    updatecart();
}

function removefromcart(servicename){
    cart = cart.filter(item=>item.name!==servicename);
    updatecart();
}

function updatecart(){
    cartitems.innerHTML='';
    
    if(cart.length===0){
        cartitems.innerHTML='<tr><td colspan="3" class="text-center px-4 py-6">No items added yet</td></tr>';
        totalamt.textContent='$0.00';
        checkformvalidity();
        return;
    }
    
    let total=0;
    
    cart.forEach((item,index)=>{
        const row = document.createElement('tr');
        const itemtotal = item.price * item.quantity;
        total+=itemtotal;
        
        row.innerHTML=`
            <td>${index+1}</td>
            <td>${item.name}</td>
            <td>$${item.price.toFixed(2)}</td>
        `;
        
        cartitems.appendChild(row);
    });
    
    totalamt.textContent=`$${total.toFixed(2)}`;
    checkformvalidity();
}

function checkformvalidity(){
    const allfilled = Array.from(formInputs).every(input=>input.value.trim()!=='');
    const cartnotempty = cart.length>0;
    bookbtn.disabled=!(allfilled && cartnotempty);
}

formInputs.forEach(input=>{
    input.addEventListener('input',checkformvalidity);
});

bookingform.addEventListener('submit',function(e){
    e.preventDefault();
    
    const fullname=bookingform.querySelector('input[placeholder="Enter your name"]').value;
    const email=bookingform.querySelector('input[type="email"]').value;
    const phone=bookingform.querySelector('input[type="tel"]').value;
    
    if(!fullname || !email || !phone){
        alert('Please fill in all fields');
        return;
    }
    
    if(cart.length===0){
        alert('Please add items to your cart');
        return;
    }
    
    const bookingdata={
        customer:{
            fullname: fullname,
            email: email,
            phone: phone
        },
        services: cart,
        totalamount: totalamt.textContent,
        bookingdate: new Date().toLocaleString()
    };
    
    console.log('Booking Submitted:',bookingdata);
    alert(`Booking confirmed!\n\nName: ${fullname}\nEmail: ${email}\nPhone: ${phone}\nTotal: ${totalamt.textContent}\n\nThank you for booking with us!`);
    
    bookingform.reset();
    cart=[];
    itemcount=0;
    
    addbuttons.forEach(btn=>{
        btn.textContent="Add item";
        btn.classList.remove('bg-red-200');
        btn.classList.add('bg-gray-300');
        btn.classList.remove('text-red-600');
    });
    
    updatecart();
});


const newsletterform = document.getElementById('newsletter-form');
const newsletterstatus = document.getElementById('newsletter-status');

newsletterform.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('newsletter-name').value;
    const email = document.getElementById('newsletter-email').value;
    
    if(!name) {
        newsletterstatus.textContent = 'Please enter the detail';
        newsletterstatus.classList.add('text-red-500');
        return;
    }
    
    if(!email) {
        newsletterstatus.textContent = 'Please enter email';
        newsletterstatus.classList.add('text-red-500');
        return;
    }
    
    newsletterstatus.textContent = 'Thank you for subscribing!';
    newsletterstatus.classList.remove('text-red-500');
    newsletterstatus.classList.add('text-white', 'font-semibold', 'mt-3');
    
    console.log('Newsletter subscription:', { name, email, date: new Date().toLocaleString() });
    
    newsletterform.reset();
    
    setTimeout(() => {
        newsletterstatus.textContent = '';
        newsletterstatus.classList.remove('text-white', 'font-semibold', 'mt-3');
    }, 5000);
});