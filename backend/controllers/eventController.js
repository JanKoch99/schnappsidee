const clientsById = require("../middleware/clients");
const Donation = require("../models/donationModel");
const mongoose = require("mongoose");

// General event creation stream
const getNewCreation = async (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // flush the headers to establish SSE with client

  // Add the new client to the general clients array
  if (!clientsById["general"]) {
    console.log("Creating new clients array for general events");
    clientsById["general"] = [];
  }
  console.log("Adding client to general clients array");
  clientsById["general"].push(res);
  console.log("Client connected");

  // Clean up when the client disconnects
  req.on("close", () => {
    console.log("Client disconnected");
    clientsById["general"] = clientsById["general"].filter(
      (client) => client !== res
    );
    if (clientsById["general"].length === 0) {
      delete clientsById["general"]; // Clean up if no more clients are subscribed
    }
  });
};

// Updates stream for a specific ID
const getUpdates = async (req, res) => {
  const { id } = req.params;
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // flush the headers to establish SSE with client

  // Add the new client to the clientsById object
  if (!clientsById[id]) {
    console.log("Creating new clients array for ID", id);
    clientsById[id] = [];
  }

  console.log("Adding client to clients array for ID", id);
  clientsById[id].push(res);
  console.log("Client connected", id);

  console.log("Prepare history for client");
  const donation = await Donation.findById(id).populate("challengeID");
  res.write(`data: ${JSON.stringify(donation)}\n\n`);

  // Clean up when the client disconnects
  req.on("close", () => {
    console.log("Client disconnected");
    clientsById[id] = clientsById[id].filter((client) => client !== res);
    if (clientsById[id].length === 0) {
      delete clientsById[id]; // Clean up if no more clients are subscribed to this ID
    }
  });
};

module.exports = {
  getNewCreation,
  getUpdates,
};
