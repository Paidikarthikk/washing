# Laundry Booking Website

This project is a responsive laundry service booking page with cart management, booking form validation, mobile navigation, and EmailJS-powered email delivery.

## Features

- Service list with add/remove cart behavior
- Booking form with name, email, and phone validation
- Total price display for selected services
- Mobile hamburger navigation for small screens
- Booking confirmation and newsletter subscription via EmailJS
- Status messages shown after booking and newsletter submission

## Setup

1. Open the project folder in VS Code.
2. Replace the placeholder values in `script.js` with your EmailJS configuration:
   - `YOUR_SERVICE_ID`
   - `YOUR_BOOKING_TEMPLATE_ID`
   - `YOUR_NEWSLETTER_TEMPLATE_ID`
   - `YOUR_PUBLIC_KEY`
3. Make sure `index.html` includes the EmailJS script before `script.js`:

```html
<script src="https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js"></script>
<script src="script.js"></script>
```

## How to Run

1. Open `index.html` in your browser.
2. Toggle services into the cart.
3. Fill in the booking form with valid name, email, and phone.
4. Submit the booking to trigger EmailJS and see a confirmation message.
5. Enter the newsletter name and email, then submit to send a subscription email via EmailJS.

## Notes

- EmailJS requires an account and templates configured in the EmailJS dashboard.
- Use a valid email format and a phone number with digits only (optionally starting with `+`).
- This project is intentionally built with handwritten JavaScript to demonstrate understanding of client-side logic and integration.
