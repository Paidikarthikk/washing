# Laundry Service Website

This project is a responsive landing page for a laundry service with a shopping cart, booking form, and newsletter signup.

## Features
- Responsive layout for desktop and mobile devices
- Add/remove services from the cart with live totals
- Booking form with client-side validation and status feedback
- Newsletter signup with success messaging
- Smooth scrolling for the hero call-to-action and booking section
- EmailJS-ready booking confirmation flow with graceful fallback messaging

## Setup
1. Open the project folder in your browser, or use a simple static server such as Live Server in VS Code.
2. If you want booking emails to work, update the EmailJS configuration in [script.js](script.js) with your public key, service ID, and template ID.
3. For local preview, open [index.html](index.html) in a browser or run a local static server.

## Notes
- The booking form will still complete locally without EmailJS configured, but the confirmation message will explain that the email delivery is pending configuration.
- Replace the placeholder EmailJS values in [script.js](script.js) before using the booking flow in production.
