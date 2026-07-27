const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_BOOKING_TEMPLATE_ID = 'YOUR_BOOKING_TEMPLATE_ID';
const EMAILJS_NEWSLETTER_TEMPLATE_ID = 'YOUR_NEWSLETTER_TEMPLATE_ID';
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

emailjs.init(EMAILJS_PUBLIC_KEY);

const cart = [];
const serviceButtons = document.querySelectorAll('.toggle-button');
const cartItemsBody = document.getElementById('cart-items');
const totalAmountLabel = document.getElementById('amount-total');
const bookButton = document.getElementById('book-btn');
const bookingForm = document.getElementById('booking-form');
const bookingNameInput = document.getElementById('booking-name');
const bookingEmailInput = document.getElementById('booking-email');
const bookingPhoneInput = document.getElementById('booking-phone');
const bookingMessage = document.getElementById('booking-message');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuLinks = mobileMenu.querySelectorAll('a');
const newsletterForm = document.getElementById('newsletter-form');
const newsletterNameInput = document.getElementById('newsletter-name');
const newsletterEmailInput = document.getElementById('newsletter-email');
const newsletterStatus = document.getElementById('newsletter-status');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9]{7,15}$/;

function setNotification(element, message, isSuccess) {
  element.textContent = message;
  element.classList.toggle('text-green-600', isSuccess);
  element.classList.toggle('text-red-600', !isSuccess);
  element.classList.toggle('font-semibold', !!message);
}

function clearBookingMessage() {
  bookingMessage.textContent = '';
  bookingMessage.classList.remove('text-green-600', 'text-red-600', 'font-semibold');
}

function clearNewsletterMessage() {
  newsletterStatus.textContent = '';
  newsletterStatus.classList.remove('text-green-600', 'text-red-600', 'font-semibold');
}

function renderCartItems() {
  cartItemsBody.innerHTML = '';

  if (!cart.length) {
    cartItemsBody.innerHTML = '<tr><td colspan="3" class="text-center px-4 py-6">No items added yet</td></tr>';
    totalAmountLabel.textContent = '$0.00';
    updateBookButtonState();
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="px-2 py-3">${index + 1}</td>
      <td class="px-2 py-3">${item.name}${item.quantity > 1 ? ` x${item.quantity}` : ''}</td>
      <td class="px-2 py-3">$${(item.price * item.quantity).toFixed(2)}</td>
    `;
    cartItemsBody.appendChild(row);
  });

  totalAmountLabel.textContent = `$${total.toFixed(2)}`;
  updateBookButtonState();
}

function updateBookButtonState() {
  const nameValue = bookingNameInput.value.trim();
  const emailValue = bookingEmailInput.value.trim();
  const phoneValue = bookingPhoneInput.value.trim();
  const isFormValid = nameValue && emailPattern.test(emailValue) && phonePattern.test(phoneValue);
  bookButton.disabled = !(isFormValid && cart.length > 0);
}

function getServiceNameFromButton(button) {
  const serviceItem = button.closest('.service-item');
  return serviceItem.querySelector('h4').textContent.split('-')[0].trim();
}

function getServicePriceFromButton(button) {
  const serviceItem = button.closest('.service-item');
  const amountText = serviceItem.querySelector('.text-blue-500').textContent.replace('$', '').trim();
  return Number(amountText);
}

function addOrRemoveService(button) {
  const serviceName = getServiceNameFromButton(button);
  const price = getServicePriceFromButton(button);
  const existingItem = cart.find((item) => item.name === serviceName);

  if (existingItem) {
    cart.splice(cart.indexOf(existingItem), 1);
    button.textContent = 'Add item';
    button.classList.remove('bg-red-200', 'text-red-600');
    button.classList.add('bg-gray-300');
  } else {
    cart.push({ name: serviceName, price, quantity: 1 });
    button.textContent = 'Remove item';
    button.classList.remove('bg-gray-300');
    button.classList.add('bg-red-200', 'text-red-600');
  }

  renderCartItems();
}

serviceButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    clearBookingMessage();
    addOrRemoveService(button);
  });
});

[bookingNameInput, bookingEmailInput, bookingPhoneInput].forEach((input) => {
  input.addEventListener('input', () => {
    clearBookingMessage();
    updateBookButtonState();
  });
});

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  clearBookingMessage();

  const name = bookingNameInput.value.trim();
  const email = bookingEmailInput.value.trim();
  const phone = bookingPhoneInput.value.trim();

  if (!name || !email || !phone) {
    setNotification(bookingMessage, 'Please complete all booking details.', false);
    return;
  }

  if (!emailPattern.test(email)) {
    setNotification(bookingMessage, 'Please enter a valid email address.', false);
    return;
  }

  if (!phonePattern.test(phone)) {
    setNotification(bookingMessage, 'Please enter a valid phone number.', false);
    return;
  }

  if (!cart.length) {
    setNotification(bookingMessage, 'Add at least one service before booking.', false);
    return;
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const serviceSummary = cart.map((item) => `${item.name} (${item.quantity}×$${item.price.toFixed(2)})`).join(', ');

  const templateParams = {
    customer_name: name,
    customer_email: email,
    customer_phone: phone,
    booking_total: `$${totalAmount.toFixed(2)}`,
    booking_services: serviceSummary,
    booking_date: new Date().toLocaleString(),
  };

  setNotification(bookingMessage, 'Sending booking confirmation email…', true);
  bookButton.disabled = true;

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_BOOKING_TEMPLATE_ID, templateParams)
    .then(() => {
      setNotification(bookingMessage, 'Booking confirmed. A confirmation email has been sent.', true);
      bookingForm.reset();
      cart.length = 0;
      serviceButtons.forEach((button) => {
        button.textContent = 'Add item';
        button.classList.remove('bg-red-200', 'text-red-600');
        button.classList.add('bg-gray-300');
      });
      renderCartItems();
    })
    .catch((error) => {
      console.error('EmailJS booking error:', error);
      setNotification(bookingMessage, 'Booking email failed. Please try again later.', false);
    })
    .finally(() => {
      updateBookButtonState();
    });
});

newsletterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  clearNewsletterMessage();

  const name = newsletterNameInput.value.trim();
  const email = newsletterEmailInput.value.trim();

  if (!name || !email) {
    setNotification(newsletterStatus, 'Name and email are required for newsletter signup.', false);
    return;
  }

  if (!emailPattern.test(email)) {
    setNotification(newsletterStatus, 'Enter a valid email address.', false);
    return;
  }

  const templateParams = {
    subscriber_name: name,
    subscriber_email: email,
    subscriber_date: new Date().toLocaleString(),
  };

  setNotification(newsletterStatus, 'Sending newsletter signup…', true);

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_NEWSLETTER_TEMPLATE_ID, templateParams)
    .then(() => {
      setNotification(newsletterStatus, 'Subscription received. Check your inbox soon.', true);
      newsletterForm.reset();
    })
    .catch((error) => {
      console.error('EmailJS newsletter error:', error);
      setNotification(newsletterStatus, 'Subscription failed. Please try again shortly.', false);
    });
});

mobileMenuButton.addEventListener('click', () => {
  const isHidden = mobileMenu.classList.toggle('hidden');
  mobileMenuButton.setAttribute('aria-expanded', String(!isHidden));
});

mobileMenuLinks.forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    mobileMenuButton.setAttribute('aria-expanded', 'false');
  });
});

renderCartItems();
updateBookButtonState();
