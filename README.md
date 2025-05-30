# WeSwapCards

This platform aims to facilitate cards exchanges between users of the WeWard app.  
Users need to sign up first to access their account. Then they can log all the cards they have as well as their duplicates.  
They can also search for the cards they need and message users who have these cards in order to find an agreement.  
Users can keep track of all their conversations in a practical dashboard.

## Technologies Used
- React
- Node.js
- Express
- PostgreSQL database
- Clerk for authentication
- Bootstrap

## Features
- User authentication (Sign up, Login, Logout)
- User profile management with Clerk
- Responsive design
- Reporting of cards
- Search feature
- Search results with swap opportunities (the cards the user has in duplicates and the other user does not have)
- Overview of all logged cards
- Messaging feature
- Dashboard with all conversations and status of the swap

## What does it look like?
Landing page, sign in and menu:
https://github.com/user-attachments/assets/32107731-2b30-4ae9-96f1-444aa923fa22

## Installation

Clone the repository:

```bash
git clone https://github.com/AlexaDupin/WeSwapCards.git
```

## Back-End Setup

```bash
cd back
npm install
```
Create a .env based on .env.example.  
Start the Back-end server:
```bash
nodemon index.js
```

## Front-End Setup

```bash
cd front
npm install
```
Create a .env based on .env.example.  
Start the Front-end server:
```bash
npm run start
```

## Contact

For any questions, feel free to reach out at contact@weswapcards.com.
