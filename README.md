# 🖼️ Image Management Application

The **Image Management Application** allows users to register, log in, and manage their images efficiently. Users can add titles to images, edit or delete them, and rearrange their image gallery using a user-friendly drag-and-drop interface.

This project is built with a **React (TypeScript)** frontend and a **Node.js (TypeScript)** backend using a **layered architecture**. It uses **MongoDB** for database management and supports **bulk image uploads** and **secure user-specific image handling**.

---

## 📚 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Usage](#-usage)
- [Technologies](#-technologies)
- [Folder Structure](#-folder-structure)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

This web application provides a robust platform for users to:

- Register and authenticate securely
- Upload and organize images with custom titles
- Edit and delete uploaded images
- Rearrange image order with drag-and-drop functionality

---

## 🚀 Features

### 👤 User Authentication
- **Register** using email, phone number, and password
- **Login** with email and password
- **Password reset** via email

### 📷 Image Management
- **Upload** multiple images in bulk, each with its own title
- **Edit** image file and its title
- **Delete** any image from the gallery

### 🧩 Rearrangement
- Rearrange image order using **drag-and-drop**
- Save the updated order for persistent layout

---

## 🧱 Architecture

The backend follows a **clean layered architecture**:

- **Presentation Layer**: Handles HTTP routing and controllers
- **Application Layer**: Business logic (image/user processing)
- **Domain Layer**: Core models and domain entities (User, Image)
- **Infrastructure Layer**: MongoDB configuration, data access logic

---

## ⚙️ Installation

### 🧩 Clone the Repository

```bash
git clone https://github.com/yourusername/image-management-app.git
cd image-management-app
