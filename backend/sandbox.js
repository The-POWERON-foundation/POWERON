/* This is the server that will serve user programs */

const path = require("path"); 
const process = require("process");
const express = require("express"); 

const root = process.cwd(); // Get the current working directory

const server = express(); // Start the sandbox server

server.use(express.static(path.join(root, "programs"))); // Serve the programs directory

server.get("^/[^/]+/[^/]+/thumbnail.png", (req, res) => {
    res.status(404).sendFile(path.join(root, "backend/assets/404.png"));
});

server.listen(3000, () => {
    console.log("Sandbox server started on port 3000");
}); 