# 🍳 RecipeBlog Mobile

A premium, full-stack recipe sharing application built with **React Native (Expo)** and **TypeScript**. This app allows users to discover, create, rate, and manage culinary recipes with a modern, high-performance UI.

---

## 🚀 Features

### 👤 User Experience

- **Authentication**
  - Secure JWT-based login & registration  
  - Persistent sessions using Zustand + AsyncStorage  

- **Dynamic Feed**
  - Browse a rich collection of recipes  
  - Real-time likes and interaction counts  

- **Recipe Management**
  - Create, edit, and delete your own recipes  
  - Multi-step recipe creation form  

- **Interactions**
  - Rate recipes using a star rating system  
  - Comment and engage with other users  

- **Interactive Recipe Details**
  - Tabbed layout:
    - Ingredients (with checklist)
    - Step-by-step cooking instructions  

---

### ⚙️ Technical Highlights

- **State Management**  
  Scalable global state using **Zustand**

- **Data Fetching**  
  Server state synchronization, caching, and background refetching using **TanStack Query (v5)**

- **Navigation**  
  File-based routing using **Expo Router** with protected route middleware

- **Validation**  
  Strict schema validation using **Zod** for:
  - Authentication forms  
  - Recipe forms  

- **Theming & UI**  
  Clean **Slate/Zinc-inspired design system** focused on:
  - Accessibility  
  - Performance  
  - Consistency  

---

## 🛠 Tech Stack

| Category        | Technology |
|-----------------|------------|
| **Framework**   | [React Native](https://reactnative.dev/) via [Expo](https://expo.dev/) |
| **Language**    | [TypeScript](https://www.typescriptlang.org/) |
| **Navigation**  | [Expo Router](https://docs.expo.dev/router/introduction/) |
| **Data Fetching** | [TanStack Query](https://tanstack.com/query/latest) |
| **State**       | [Zustand](https://github.com/pmndrs/zustand) |
| **Styling**     | React Native StyleSheet (Flexbox) |
| **Validation**  | [Zod](https://zod.dev/) |
| **Icons**       | Expo Vector Icons (Ionicons, FontAwesome) |

---

## 📁 Project Structure

```text
├── app/                  # Expo Router (Pages & Layouts)
│   ├── (auth)/           # Authentication Group (Login/Register)
│   ├── (tabs)/           # Main App Navigation (Home, Search, Profile)
│   ├── recipe-detail/    # Dynamic recipe routes [id].tsx
│   └── _layout.tsx       # Root Layout & Auth Guard Logic
├── src/
│   ├── components/       # Atomic & Modular UI Components
│   ├── service/          # API Request Layer (Axios)
│   ├── store/            # Global State (Zustand)
│   └── hooks/            # Custom React Hooks
├── assets/               # Images, Fonts, and Branding
└── shared/               # Cross-platform logic (Validators/Types)
```

---

## ⚙️ Getting Started

### 1️⃣ Prerequisites

Make sure you have:

- **Node.js** (v18+)
- **npm** or **yarn**
- **Expo Go** app on your phone (for testing)

---

### 2️⃣ Installation

```bash
# Clone the repository
git clone https://github.com/your-username/recipe-blog.git

# Navigate to the frontend directory
cd recipe-blog/frontend

# Install dependencies
npm install
```

---

### 3️⃣ Environment Setup

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_URL=http://your-backend-api-url.com
```

---

### 4️⃣ Run the App

```bash
# Start Expo and clear cache
npx expo start -c
```

- Scan the QR code using **Expo Go**
- Press:
  - `i` for iOS simulator  
  - `a` for Android emulator  

---

## 🛡 Authentication Flow

The app uses a **Protected Route Pattern** inside `app/_layout.tsx`.

- **Hydration**
  - On app startup, Zustand checks AsyncStorage for an existing JWT token.

- **Route Guard**
  - If no token is found → user is redirected to `/(auth)/login`.

- **Smart Redirection**
  - Authenticated users cannot access Login/Register screens.
  - They are automatically redirected to `/(tabs)/home`.

---

## 🤝 Contributing

1. Fork the project  
2. Create your feature branch  
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes  
   ```bash
   git commit -m "Add some AmazingFeature"
   ```
4. Push to the branch  
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request 🎉  

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

Built with ❤️ using React Native, Expo, and TypeScript.
