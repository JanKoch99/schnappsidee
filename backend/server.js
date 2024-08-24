require('dotenv').config()

const express = require('express')
const cors = require('cors');
const {mongoose} = require("mongoose");
const donationRoutes = require('./routes/donations')
const challengeRoutes = require('./routes/challenges')
// express app
const app = express()

app.use(cors());

//middleware
app.use(express.json())

app.use((req,res,next) =>  {
    console.log(req.path, req.method)
    next()
})


// Array zum Speichern der verbundenen Clients
let clients = [];

const broadcastEvent = (event) => {
    clients.forEach(client => {
        client.write(`data: ${JSON.stringify(event)}\n\n`);
    });
};
app.use((req, res, next) => {
    req.broadcastEvent = broadcastEvent;
    next();
});
// SSE-Route
app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Einen neuen Client hinzufügen
    clients.push(res);

    // Verbindung wird geschlossen, wenn der Client abbricht
    req.on('close', () => {
        clients = clients.filter(client => client !== res);
    });
});


// routes
app.use('/api/donations', donationRoutes)
app.use('/api/challenges', challengeRoutes)

// connect to db
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            // listen for requests
            app.listen(process.env.PORT, () => {
                console.log('connected to db & listening on port ', process.env.PORT)
            })


        })
        .catch((error) => {
            console.log(error)
        })
