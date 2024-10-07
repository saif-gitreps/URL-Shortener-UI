# UI for URL Shortener Web Application

A modern, simple, and easy-to-use UI utilizing all the API features.

## Features

🎨 **Clean UI and simple UX**
- 🛠 Clean, modern design and effective UI built with **React** and **Tailwind CSS**.

🛒 **Integrated crucial functionality from the APIs**
- Users can:
  - Create ShortId URLs without needing to register.
  - Authenticated users can:
    - Create custom ShortIds.
    - Keep track of their URLs and view detailed analytics for each ShortId.
    - Delete ShortIds.

🔐 **Authentication and security**
- JWT authentication using HTTP-only cookies.
- CSRF protection with the **Double-submit cookie** pattern, using **Axios** API request interceptors for each POST request.

💻 **Tech Stack**
- 🖥 Fully written in **TypeScript** for type safety and scalability.
- 📜 Utilizes **React Hook Form** for strict frontend input validation and error handling.
- 📁 Seamless integration of data fetching and mutations using **Tanstack React Query** and **Axios**.
- 🚀 Efficient cache system and cache invalidation using **Tanstack React Query**.
- 🛠 Smooth handling of JWT access token refresh for authenticated users using **Axios** API response interceptors.
- 📁 Simple Auth state management using **Zustand**. 

🎁 **Additional Features**
- 🔄 Highly customizable and extendable, with more features planned for future updates.
