# StudyNotion - Ed-Tech Platform

StudyNotion is a fully functional ed-tech platform built using the MERN stack (MongoDB, ExpressJS, ReactJS, NodeJS) that enables users to create, consume, and rate educational content. The platform provides an interactive learning experience for students and an intuitive portal for instructors to publish courses and track performance.

---

## 🚀 Features

### 🎓 For Students
- **Homepage:** Overview of platform features, top courses, and quick links.
- **Course Catalog:** Browse and filter available courses with descriptions and ratings.
- **Wishlist & Cart:** Save courses to wishlist and complete purchases via cart checkout.
- **Course Content Player:** Access video lessons, documents, and related lecture materials.
- **Profile Management:** View and edit account details.

### 👨‍🏫 For Instructors
- **Dashboard & Insights:** Track course ratings, feedback, views, clicks, and performance metrics.
- **Course Management:** Create, update, and delete courses, manage sections and sub-sections, and set pricing.
- **Profile Management:** View and edit instructor profile details.

### 🛡️ For Administrators (Future Scope)
- **Dashboard & Insights:** Monitor platform metrics including registered users, courses, and revenue.
- **Management Tools:** Manage instructors, users, and platform course listings.

### 🔐 Technical & Security Features
- **User Authentication:** Email/password login, OTP verification, forgot password functionality, JWT authentication, and Bcrypt password hashing.
- **Payment Integration:** Razorpay integration for course checkout.
- **Cloud Media Management:** Cloudinary integration for scalable hosting of videos, images, and documents.
- **Markdown Formatting:** Course documents stored and rendered using Markdown.

---

## 🏗️ System Architecture

StudyNotion follows a client-server monolithic architecture:
- **Front-End:** ReactJS client interfacing with the back-end via RESTful API calls.
- **Back-End:** Node.js and Express.js server providing RESTful endpoints and processing business logic.
- **Database:** MongoDB NoSQL database managed via Mongoose ODM.

---

## 🛠️ Tech Stack

- **Front-End:** ReactJS, Redux, Tailwind CSS, HTML5, CSS3, JavaScript (ES6+), Figma
- **Back-End:** Node.js, Express.js, JSON Web Tokens (JWT), Bcrypt, Mongoose
- **Database:** MongoDB
- **Third-Party Services:** Razorpay, Cloudinary
- **Deployment & Hosting:** Vercel (Front-End), Render / Railway (Back-End), MongoDB Atlas (Database)

---

## 📊 Database Schema Summary

- **Users (Student / Instructor):** Name, Email, Password, AccountType, Profile, Courses, CourseProgress
- **Courses:** courseName, courseDescription, Instructor, WhatYouWillLearn, courseContent (Sections & Sub-Sections), RatingAndReviews, price, thumbnail, Tag, StudentsEnrolled
- **Section & Sub-Section:** Module structure with titles, duration, video URLs, and materials
- **RatingAndReviews:** User, rating (out of 5), review text
- **Invoices:** User, courseName, price, address, pincode, courseID
- **CourseProgress:** Course ID and completed video tracking

---

## 🔌 API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/signup` - Register a new student or instructor account
- `POST /api/auth/login` - Authenticate user & generate JWT token
- `POST /api/auth/verify-otp` - Verify email OTP
- `POST /api/auth/forgot-password` - Send password reset link

### Courses (`/api/courses`)
- `GET /api/courses` - List all available courses
- `GET /api/courses/:id` - Get details of a specific course
- `POST /api/courses` - Create a new course
- `PUT /api/courses/:id` - Update an existing course
- `DELETE /api/courses/:id` - Delete a course by ID
- `POST /api/courses/:id/rate` - Add course rating and review

---

## 🚀 Deployment

- **Front-End:** Vercel
- **Back-End:** Render or Railway
- **Database:** MongoDB Atlas
- **Media Asset Storage:** Cloudinary

---

## 🔮 Future Enhancements

1. **Personalized Learning Paths** *(High Priority)* - Tailored learning paths based on student preferences.
2. **Mobile Application** *(High Priority)* - Native mobile app for iOS and Android.
3. **Machine Learning Recommendations** *(Medium-High Priority)* - AI-driven course recommendations.
4. **Gamification Features** *(Medium Priority)* - Badges, points, and leaderboards.
5. **Social Learning Features** *(Medium Priority)* - Group discussions and peer review.
6. **VR/AR Integration** *(Low-Medium Priority)* - Immersive learning modules.

