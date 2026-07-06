# Laundry Service Website

This project is a responsive landing page for a laundry service with a shopping cart, booking form, and newsletter signup.

## Features
- Responsive layout for desktop and mobile devices
- Add/remove services from the cart
- Booking form with client-side validation
- Newsletter signup with client-side validation
- Smooth scrolling for the hero call-to-action
- EmailJS-ready booking confirmation flow

## Setup
1. Open the project folder in your browser, or use a simple static server such as Live Server in VS Code.
2. If you want booking emails to work, update the EmailJS configuration in [script.js](script.js) with your public key, service ID, and template ID.
3. For local preview, open [index.html](index.html) in a browser or run a local static server.

## Notes
- The booking form will still work locally without EmailJS configured, but the confirmation email will be skipped with a console warning.
- Replace the placeholder EmailJS values in [script.js](script.js) before using the booking flow in production.
