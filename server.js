const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Health Check Endpoint
app.get('/', (req, res) => {
    res.send('Whisk n Whip backend is alive and well!');
});

// 2. Endpoint: Get Featured Items
app.get('/api/featured', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.*, c.name as category_name 
            FROM products p 
            JOIN categories c ON p.category_id = c.id 
            WHERE p.is_featured = TRUE
        `);
        res.json(rows);
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: 'Failed to fetch featured products' });
    }
});

// 3. Endpoint: Get the Full Menu 
app.get('/api/menu', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT p.*, c.name as category_name 
            FROM products p 
            JOIN categories c ON p.category_id = c.id
            ORDER BY c.id, p.id
        `);
        res.json(rows);
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: 'Failed to fetch menu' });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Whisk n Whip server is running smoothly on port ${PORT}`);
});