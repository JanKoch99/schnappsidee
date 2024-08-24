const clientsById = require('../middleware/clients');

// General event creation stream
const getNewCreation = async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Add the new client to the general clients array
    if (!clientsById['general']) {
        clientsById['general'] = [];
    }
    clientsById['general'].push(res);

    // Clean up when the client disconnects
    req.on('close', () => {
        clientsById['general'] = clientsById['general'].filter(client => client !== res);
        if (clientsById['general'].length === 0) {
            delete clientsById['general']; // Clean up if no more clients are subscribed
        }
    });
};

// Updates stream for a specific ID
const getUpdates = async (req, res) => {
    const { id } = req.params;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Add the new client to the clientsById object
    if (!clientsById[id]) {
        clientsById[id] = [];
    }
    clientsById[id].push(res);

    // Clean up when the client disconnects
    req.on('close', () => {
        clientsById[id] = clientsById[id].filter(client => client !== res);
        if (clientsById[id].length === 0) {
            delete clientsById[id]; // Clean up if no more clients are subscribed to this ID
        }
    });
};

module.exports = {
    getNewCreation,
    getUpdates,
};
