// Set up environment
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
app.use(express.json())

// initial data
let stock = {
    "ABC Traders": 44.51,
    "Trendy FinTech": 23.99,
    "SuperCorp": 126.91,
};

// Transmit initial data to web
io.on ('connection', (socket) => {
    io.emit('load', stock)
})

// Send the HTML to be execute in the client side
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Retrieve all stocks with updated values
app.get('/current', (req, res) => {
    res.status(200).json(stock)
});

/* Update a certain stock value and return a response in JSON format,
in case stock is not found return error 404*/
app.patch('/update', (req, res) =>{
    const {data} = req.body
    let stockExists = data.stockName in stock
    if (stockExists) {
        stock[data.stockName] = data.price
        res.status(200).json(data)
        io.emit('update_stocks',data)
    } else {
        res.status(404).send('Stock not found')
    }
})

// start server
server.listen(3000, () => {
    console.log('listening on *:3000');
})