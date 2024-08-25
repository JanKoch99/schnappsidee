require('dotenv').config()

const express = require('express')
const cors = require('cors');
const {mongoose} = require("mongoose");
const eventRoutes = require('./routes/events')
const donationRoutes = require('./routes/donations')
const challengeRoutes = require('./routes/challenges')
// express app
const app = express()
const clientsById = require('./middleware/clients');

app.use(cors());

//middleware
app.use(express.json())

app.use((req,res,next) =>  {
    console.log(req.path, req.method)
    next()
})


// Broadcast function
const broadcastEventById = (id, event) => {
    console.log("Broadcasting event", event);
    if (clientsById[id]) {
        console.log(`Broadcasting event to ${clientsById[id].length} clients`);
        clientsById[id].forEach(client => {
            console.log("sending event to client");
            client.write(`data: ${JSON.stringify(event)}\n\n`);
        });
    }
};
app.use((req, res, next) => {
    req.broadcastEventById = broadcastEventById;
    next();
});
app.use('/events', eventRoutes)
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
