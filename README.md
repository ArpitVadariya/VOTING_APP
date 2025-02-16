# VOTING\_APP Backend

This is a **backend-only** project for a Voting Application, built using **Node.js**. The primary focus of this project is to **learn and implement** backend concepts such as API development, routing, middleware, and authentication.

## 🚀 Features

- User sign-up and login with Aadhar Card Number and password
- User can view the list of candidates
- User can vote for a candidate (only once)
- Admin can manage candidates (add, update, delete)
- Admin cannot vote

## 🛠️ Technologies Used

- **Node.js**
- **Express.js**
- **MongoDB**
- **JSON Web Tokens (JWT)** for authentication

## 📌 Installation & Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/ArpitVadariya/VOTING_APP.git
   ```
2. Install dependencies:
   ```sh
   cd VOTING_APP
   npm install
   ```
3. Set up environment variables (`.env` file).
4. Start the development server:
   ```sh
   npm run dev
   ```

## 📬 API Endpoints

### 🔐 Authentication
- **Sign Up**: `POST /signup` - Register a new user
- **Login**: `POST /login` - Authenticate a user

### 🏛️ Candidates
- **Get Candidates**: `GET /candidates` - Retrieve the list of candidates
- **Add Candidate**: `POST /candidates` - Add a new candidate (Admin only)
- **Update Candidate**: `PUT /candidates/:id` - Modify a candidate by ID (Admin only)
- **Delete Candidate**: `DELETE /candidates/:id` - Remove a candidate by ID (Admin only)

### 🗳️ Voting
- **Get Vote Count**: `GET /candidates/vote/count` - Retrieve vote counts for each candidate
- **Vote for Candidate**: `POST /candidates/vote/:id` - Vote for a candidate (User only)

### 👤 User Profile
- **Get Profile**: `GET /users/profile` - Retrieve user profile information
- **Change Password**: `PUT /users/profile/password` - Update user password

## 📢 Contributing
This project is for **learning purposes**. Feel free to fork and modify it as needed.



