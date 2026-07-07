const cartitem = document.getElementById("cartitems");
const cartTotalElement = document.getElementById("cart-total");
const bookingForm = document.getElementById("booking-form");
const bookingStatus = document.getElementById("booking-status");
const newsletterForm = document.getElementById("newsletter-form");
const newsletterStatus = document.getElementById("newsletter-status");
const heroButton = document.querySelector(".header__btn");
const cartArray = [];
let serialNo = 1;
const addButtons = document.querySelectorAll(".add-to-cart");

const emailConfig = window.EMAILJS_CONFIG || {};
const EMAILJS_PUBLIC_KEY = emailConfig.publicKey || "YOUR_PUBLIC_KEY";
const EMAILJS_SERVICE_ID = emailConfig.serviceId || "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = emailConfig.templateId || "YOUR_TEMPLATE_ID";

function setButtonState(button, isActive) {
    if (!button) return;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));

    if (isActive) {
        button.innerHTML = 'Remove Item <ion-icon name="remove-circle-outline"></ion-icon>';
        button.style.backgroundColor = "rgb(220, 53, 69)";
    } else {
        button.innerHTML = 'Add Item <ion-icon name="add-circle-outline"></ion-icon>';
        button.style.backgroundColor = "";
    }
}

function isEmailJSConfigured() {
    return EMAILJS_PUBLIC_KEY && !EMAILJS_PUBLIC_KEY.includes("YOUR_") && EMAILJS_SERVICE_ID && !EMAILJS_SERVICE_ID.includes("YOUR_") && EMAILJS_TEMPLATE_ID && !EMAILJS_TEMPLATE_ID.includes("YOUR_");
}

function setStatus(element, message, type) {
    if (!element) return;
    element.textContent = message;
    element.className = `form-status ${type}`.trim();
}

function validateBookingForm() {
    const name = document.getElementById("customer-name").value.trim();
    const email = document.getElementById("customer-email").value.trim();
    const phone = document.getElementById("customer-phone").value.trim();

    if (!name || !email || !phone) {
        return { valid: false, message: "Please complete all required fields before booking." };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { valid: false, message: "Please enter a valid email address." };
    }

    if (phone.length < 7) {
        return { valid: false, message: "Please enter a valid phone number." };
    }

    return { valid: true };
}

function validateNewsletterForm() {
    const name = document.getElementById("newsletter-name").value.trim();
    const email = document.getElementById("newsletter-email").value.trim();

    if (!name || !email) {
        return { valid: false, message: "Please enter your name and email address." };
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { valid: false, message: "Please enter a valid email address." };
    }

    return { valid: true };
}

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
    if (cartTotalElement) {
        cartTotalElement.textContent = `$${total.toFixed(2)}`;
    }
}

function clearCart() {
    cartArray.length = 0;
    serialNo = 1;
    cartitem.innerHTML = "";
    updateTotal();
    addButtons.forEach(btn => {
        setButtonState(btn, false);
    });
}

function initEmailJS() {
    if (window.emailjs) {
        window.emailjs.init(EMAILJS_PUBLIC_KEY);
    }
}

async function sendBookingEmail(bookingDetails) {
    if (!isEmailJSConfigured()) {
        console.warn("EmailJS is not configured. Please add your public key, service ID, and template ID.");
        return { success: true, skipped: true };
    }

    if (!window.emailjs) {
        throw new Error("EmailJS script failed to load.");
    }

    return window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        user_name: bookingDetails.name,
        user_email: bookingDetails.email,
        user_phone: bookingDetails.phone,
        services: bookingDetails.services,
        total: bookingDetails.total,
        message: "Laundry booking request"
    });
}

addButtons.forEach(function(btn) {
    btn.addEventListener("click", function() {
        const listItem = btn.closest("li");
        const serviceDiv = listItem.querySelector("div");
        const fullText = serviceDiv.innerText;
        const pricePart = serviceDiv.querySelector("span").innerText;
        const serviceName = fullText.replace(pricePart, "").trim().replace(" - ", "");
        const price = parseFloat(pricePart.replace("$", ""));
        const isActive = btn.classList.contains("is-active");

        if (!isActive) {
            const item = {
                id: btn.id,
                name: serviceName,
                price: price,
                serialNo: serialNo
            };
            cartArray.push(item);
            serialNo++;
            setButtonState(btn, true);
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
            setButtonState(btn, false);
            updateTotal();
        }
    });
});

if (bookingForm) {
    bookingForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const validation = validateBookingForm();
        if (!validation.valid) {
            setStatus(bookingStatus, validation.message, "error");
            return;
        }

        if (cartArray.length === 0) {
            setStatus(bookingStatus, "Please add at least one service before booking.", "error");
            return;
        }

        const submitButton = bookingForm.querySelector("button[type='submit']");
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        try {
            const bookingDetails = {
                name: document.getElementById("customer-name").value.trim(),
                email: document.getElementById("customer-email").value.trim(),
                phone: document.getElementById("customer-phone").value.trim(),
                services: cartArray.map(item => `${item.name} ($${item.price.toFixed(2)})`).join(", "),
                total: cartArray.reduce((sum, item) => sum + item.price, 0).toFixed(2)
            };

            const result = await sendBookingEmail(bookingDetails);
            const successMessage = result && result.skipped
                ? `Thank you, ${bookingDetails.name}! Your booking request has been received. EmailJS is not configured yet, so the confirmation email will be sent once you add your credentials.`
                : `Thank you, ${bookingDetails.name}! Your booking request has been received and a confirmation email is on its way.`;
            setStatus(bookingStatus, successMessage, "success");
            bookingForm.reset();
            clearCart();
        } catch (error) {
            console.error(error);
            setStatus(bookingStatus, "We could not send your booking right now. Please try again later.", "error");
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
}

if (newsletterForm) {
    newsletterForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const validation = validateNewsletterForm();
        if (!validation.valid) {
            setStatus(newsletterStatus, validation.message, "error");
            return;
        }

        const subscriberName = document.getElementById("newsletter-name").value.trim();
        setStatus(newsletterStatus, `Thanks for subscribing, ${subscriberName}! Updates are on the way.`, "success");
        newsletterForm.reset();
    });
}

if (heroButton) {
    heroButton.addEventListener("click", function(event) {
        const bookingSection = document.getElementById("bookaserve");
        if (bookingSection) {
            event.preventDefault();
            bookingSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
}

initEmailJS();
