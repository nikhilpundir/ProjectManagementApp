# Project Management App with RBAC

## Overview  
This project demonstrates a *Role-Based Access Control (RBAC)* system with authentication and authorization. Users can register, log in, and access Projects,users,tasks,roles based on their roles (*Admin, Manager, or User*). The project implements secure authentication, private routing, role-specific features, and token expiry handling, providing a seamless and secure experience.

---

## Features  

### 1. Authentication System   
*Login:*  
- Authenticates users with email and password.  
- Generates a JWT token and stores it securely in cookies.  

*Logout:*  
- Clears token and user data from cookies and localstorage.  

---

### 2. Role-Based Access Control (RBAC)  
*Dynamic Role-Based Routes:*  
- Show users to their role-specific pages.  
- Prevents unauthorized access to other pages.  

*Private Routes:*  
- Ensures only logged-in users can access restricted pages.  
- Role validation enforced on route access.  

*API Access Control:*  
- Fetches user data based on role validation.  
- Ensures actions and resources are role-specific.  

---

### 3. Security Features  
*JWT Token:*  
- Used for stateless authentication.  
- Includes an expiry time to ensure the token is valid only for a limited period.  
- On expiry, the system prompts the user to log in again, removing the expired token from cookies.  

*Password Hashing:*  
- Passwords are hashed using bcrypt for secure storage.  

*Token Validation:*  
- Ensures expired or invalid tokens are removed from cookies.  

---

### 4. Additional Enhancements  
*State Management:*  
- Redux is used to manage authentication, user roles, and API states.  

*Loading Indicators:*  
- Enhances UX during API calls using toastify.  


---

## Technologies Used  

*Frontend:*  
- React (with Redux for state management).  
- React Router for navigation and private routes.  
- MUI, Modern CSS.  

*Backend:*  
- Node.js with Express for RESTful APIs.  
- MongoDB (or your preferred database) for storing user data.  
- bcrypt for password hashing.  
- jsonwebtoken (JWT) for authentication.  

*Other Tools:*  
- Postman for API testing.  

---
##Live Demo
*try login with these credentials
email: "admin@gmail.com" password:"Admin@123" for admin role
email: "manager@gmail.com" password:"Manager@123" for manager role
email: "user@gmail.com" password:"User@123" for user role
## Installation and Setup  

*Clone the Repository:*  
bash
git clone https://github.com/nikhilpundir/ProjectManagementApp.git

*Install Dependencies:*
- For Backend:
bash
cd backend
npm install]

- For Frontend:
bash
cd frontend
npm install]


*Run the Project:*
- Start Backend:
bash
cd backend
npm run server

- Start Frontend:
bash
cd frontend
npm run dev



### Access the Application:
Open your browser and navigate to http://localhost:5173.
