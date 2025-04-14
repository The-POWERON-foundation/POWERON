/* Main entry point for the backend */

const path = require("path"); 
const process = require("process");

const root = process.cwd(); // Get the current working directory

require(path.join(root, "backend/web.js"));     // Start the web server 
require(path.join(root, "backend/sandbox.js")); // Start the sandbox server