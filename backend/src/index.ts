import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { protect } from './middleware/auth.js';
import userRoutes from './routes/userRoutes.js'
import recipeRoutes from './routes/recipeRoutes.js';
import commentRoutes from './routes/commentRoutes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.get('/', (req, res) => res.send('Recipe API Running'));
app.use('/api/auth', userRoutes)
app.use('/api/recipes', recipeRoutes);
app.use('/api/comments', commentRoutes);

// Database Connection
if (!MONGO_URI) {
    console.error("❌ Error: MONGO_URI is missing from .env");
    process.exit(1);
}

mongoose
    .connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB connected");
        app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
    })
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));