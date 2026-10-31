# 🚆 RailConnect — Full-Stack Railway Management Application

**Live Application:** https://railconnect-ujjwal.netlify.app/

RailConnect is a full-stack railway management web application built using the MEAN Stack. It provides a responsive user interface, user authentication, railway information management, and administrative functionality through a modular frontend and RESTful backend architecture.

## ✨ Key Features

- 🚆 Responsive Angular-based user interface
- 🔐 User authentication using JWT
- 👤 User account management
- 🔎 Railway and travel information
- 🎫 Train booking and booking management
- 🚉 Train and station management
- 📊 Administrative dashboard
- 🌐 RESTful API integration
- 🗄️ Persistent data storage using MongoDB Atlas
- 🔒 Password hashing using bcryptjs
- 🧩 Modular and maintainable project structure

## 🛠️ Technology Stack

**Frontend**
- Angular
- TypeScript
- HTML5 and CSS3
- Angular Router
- Angular HTTP Client

**Backend**
- Node.js
- Express.js
- REST APIs
- JSON Web Tokens (JWT)
- bcryptjs
- CORS

**Database**
- MongoDB
- MongoDB Atlas
- Mongoose

**Tools and Platforms**
- Visual Studio Code
- Git and GitHub
- npm
- Postman
- Netlify — frontend deployment
- Render — backend deployment

## 🏗️ Project Architecture

RailConnect follows a three-layer full-stack architecture, separating the presentation layer, backend application logic, and database layer.

```text
Angular Frontend (Netlify)
          |
          | HTTP / REST API
          ▼
Node.js + Express.js Backend (Render)
          |
          | Mongoose ODM
          ▼
MongoDB Atlas
```

This separation improves maintainability and supports future enhancements.

## 🔄 Application Workflow

1. Users interact with the Angular frontend.
2. The frontend sends HTTP requests to the Express.js REST API.
3. The backend processes requests and handles authentication and application logic.
4. Mongoose communicates with MongoDB Atlas to read or update persistent data.
5. The backend returns responses to the frontend.
6. Angular updates the interface based on the response.

## 🎯 Project Objectives

- Develop a full-stack web application using the MEAN Stack.
- Build a responsive frontend using Angular.
- Create RESTful APIs with Node.js and Express.js.
- Integrate MongoDB for persistent data management.
- Implement token-based authentication and password hashing.
- Establish reliable frontend–backend communication.
- Maintain a modular and extensible software architecture.

## 🚀 Future Enhancements

- 📍 Live train status and real-time tracking
- 🗺️ Interactive railway maps
- 💳 Online payment gateway integration
- 🔔 Travel notifications and alerts
- 📧 Email notifications
- ⭐ User reviews and ratings
- 📱 Progressive Web App (PWA) support

## 🌐 Deployment

- **Frontend:** https://railconnect-ujjwal.netlify.app/
- **API Health Check:** https://railconnect-399k.onrender.com/api/health

## 📌 Project Summary

RailConnect demonstrates practical full-stack development skills, including Angular frontend development, REST API design, authentication, database integration, deployment, and administrative operations.
