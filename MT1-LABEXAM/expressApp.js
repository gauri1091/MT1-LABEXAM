
const express = require('express');

const app = express();

app.use(express.json());

// Sample food records
let foods = [
    { id: 1, foodName: "Pizza", category: "Fast Food", price: 250, availability: true },
    { id: 2, foodName: "Burger", category: "Fast Food", price: 120, availability: true },
    { id: 3, foodName: "Pasta", category: "Italian", price: 180, availability: false }
];

// GET - Retrieve all foods
app.get('/foods', (req, res) => {
    res.status(200).json(foods);
});

// GET - Retrieve food by ID
app.get('/foods/:id', (req, res) => {
    const food = foods.find(f => f.id === Number(req.params.id));

    if (!food) {
        return res.status(404).json({ message: "Food not found" });
    }

    res.json(food);
});

// POST - Add new food
app.post('/foods', (req, res) => {
    const { id, foodName, category, price, availability } = req.body;

    if (id === undefined || !foodName || !category ||
        typeof price !== 'number' || price <= 0 ||
        typeof availability !== 'boolean') {
        return res.status(400).json({ message: "Invalid food details" });
    }

    if (foods.some(f => f.id === Number(id))) {
        return res.status(400).json({ message: "Food ID already exists" });
    }

    const newFood = { id: Number(id), foodName, category, price, availability };

    foods.push(newFood);

    res.status(201).json({
        message: "Food item added successfully",
        food: newFood
    });
});

// PUT - Update food
app.put('/foods/:id', (req, res) => {
    const food = foods.find(f => f.id === Number(req.params.id));

    if (!food) {
        return res.status(404).json({ message: "Food not found" });
    }

    const { foodName, category, price, availability } = req.body;

    if (!foodName || !category || typeof price !== 'number' ||
        price <= 0 || typeof availability !== 'boolean') {
        return res.status(400).json({ message: "Invalid food details" });
    }

    food.foodName = foodName;
    food.category = category;
    food.price = price;
    food.availability = availability;

    res.json({ message: "Food updated successfully", food });
});

// DELETE - Delete food
app.delete('/foods/:id', (req, res) => {
    const index = foods.findIndex(f => f.id === Number(req.params.id));

    if (index === -1) {
        return res.status(404).json({ message: "Food not found" });
    }

    const deletedFood = foods.splice(index, 1);

    res.json({
        message: "Food deleted successfully",
        food: deletedFood[0]
    });
});

// Start server
app.listen(4000, () => {
    console.log("Express Server running at http://localhost:4000");
});
