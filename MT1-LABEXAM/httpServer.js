
const http = require('http');
const fs = require('fs');

const foods = [
    {
        id: 1,
        foodName: "Pizza",
        category: "Fast Food",
        price: 250,
        availability: true
    },
    {
        id: 2,
        foodName: "Burger",
        category: "Fast Food",
        price: 120,
        availability: true
    },
    {
        id: 3,
        foodName: "Pasta",
        category: "Italian",
        price: 180,
        availability: false
    }
];

const server = http.createServer((req, res) => {

    // Route 1: Home
    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Welcome to Online Food Ordering</h1>');
        return;
    }

    // Route 2: Get available foods
    if (req.url === '/foods' && req.method === 'GET') {
        const availableFoods = foods.filter(food => food.availability === true);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(availableFoods));
        return;
    }

    // Route 3: About
    if (req.url === '/about' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Online Food Ordering Application');
        return;
    }

    // Route 4: Static menu file
    if (req.url === '/menu' && req.method === 'GET') {
        fs.readFile('public/menu.html', 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Unable to read menu file');
                return;
            }

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
        return;
    }

    // Route 5: Add food
    if (req.url === '/add-food' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const newFood = JSON.parse(body);

                const requiredFields = ['id', 'foodName', 'category', 'price', 'availability'];

                const valid = requiredFields.every(field =>
                    Object.hasOwn(newFood, field)
                );

                if (!valid || typeof newFood.price !== 'number' || newFood.price <= 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Invalid food details' }));
                    return;
                }

                foods.push(newFood);

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Food added successfully', food: newFood }));

            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON' }));
            }
        });
        return;
    }

    // Invalid route
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 - Route Not Found');

});

server.listen(3000, () => {
    console.log('HTTP Server running at http://localhost:3000');
});
