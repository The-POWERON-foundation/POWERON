/* This is the web server that will serve the public directory to the user */
const path = require("path"); 
const process = require("process");
const express = require("express"); 
const fs = require("fs");
const bodyParser = require("body-parser");
const api = require("./api.js");
const cookieParser = require("cookie-parser");
const http = require("http");
const MonacoLiveEditor = require("monaco-live-editor");

const env = process.env;

const root = process.cwd(); // Get the current working directory

const server = express(); // Start the web server
const httpServer = http.createServer(server); // Create an HTTP server

const index = fs.readFileSync(path.join(root, "public/index.html"), "utf8");

const pages = {}; // Cache for pages

fs.readdirSync(path.join(root, "public/pages")).forEach(page => {
    let pageData = JSON.parse(fs.readFileSync(path.join(root, "public/pages", page, "config.json"), "utf8")); 
    pageData.content = fs.readFileSync(path.join(root, "public/pages", page, pageData.content), "utf8");

    /* Replace placeholders with the actual values */
    pageData.content = pageData.content.replaceAll("<?sandbox?>", env.SANDBOX_URL);

    pages[page] = pageData; 
});

server.use("/cdn", express.static(path.join(root, "public/cdn"), { maxAge: '7d' })); // Serve the cdn

/* Remove a trailing slash */
server.use((req, res, next) => {
    if (req.path.slice(-1) === '/' && req.path.length > 1) {
        const query = req.url.slice(req.path.length);
        const safepath = req.path.slice(0, -1).replace(/\/+/g, '/');
        res.redirect(301, safepath + query);
    } 
    else {
        next();
    }
}); 

/* REST API */
server.use(bodyParser.json());

/* Method not allowed function template */
function methodNotAllowed(req, res) {
    res.status(405).json({ status: 405, message: "Method not allowed" });
}

/* Get page */
server.get("/api/pages/:page", (req, res) => {
    const { page } = req.params;
    const response = pages[page]; 

    if (response) {
        res.json(response);
    }
    else {
        res.status(404).json(pages["404"]);
    }
}); 
server.post("/api/pages/:page", methodNotAllowed); 
server.put("/api/pages/:page", methodNotAllowed); 
server.delete("/api/pages/:page", methodNotAllowed); 

/* Get profile by username */
server.get("/api/profile/:username", (req, res) => {
    const { username } = req.params;
    api.profile(username, (user) => {
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ status: 404, message: "User not found" });
        }
    });
}); 
server.post("/api/profile/:username", methodNotAllowed); 
server.put("/api/profile/:username", methodNotAllowed); 
server.delete("/api/profile/:username", methodNotAllowed); 

/* Get profile by auth_token */
server.get("/api/profile", (req, res) => {
    const { authorization } = req.headers;
    
    if (!authorization) {
        res.status(401).json({ status: 401, message: "Unauthorized" });
        return;
    }

    api.profile(authorization, (user) => {
        if (user) {
            res.json(user);
        }
        else {
            res.status(401).json({ status: 401, message: "Unauthorized" });
        }
    });
});
server.post("/api/profile", methodNotAllowed); 
server.put("/api/profile", methodNotAllowed); 
server.delete("/api/profile", methodNotAllowed); 

/* Log in */
server.get("/api/login", methodNotAllowed); 
server.post("/api/login", (req, res) => {
    const { username, password } = req.body; 
    api.login(username, password, (auth_token) => {
        if (auth_token) {
            res.json({ auth_token });
        }
        else {
            res.status(401).json({ status: 401, message: "Unauthorized", hint: "Incorrect username or password" });
        }
    });
});
server.put("/api/login", methodNotAllowed); 
server.delete("/api/login", methodNotAllowed); 

/* Sign up */
server.get("/api/signup", methodNotAllowed); 
server.post("/api/signup", (req, res) => {
    const { email, username, password } = req.body; 
    api.signup(email, username, password, (response) => {
        if (response.auth_token) {
            res.json({ auth_token: response.auth_token });
        }
        else if (response.error === "Invalid e-mail address") {
            res.status(400).json({ status: 400, message: "Invalid e-mail address", hint: "Invalid e-mail address" });
        }
        else if (response.error === "Invalid username") {
            res.status(400).json({ status: 400, message: "Invalid username", hint: "Username may only contain lowercase letters, numbers and hyphens and must be between 4 and 32 characters long" });
        }
        else if (response.error === "Invalid password") {
            res.status(400).json({ status: 400, message: "Invalid password", hint: "Password must be between 4 and 32 characters long" });
        }
        else if (response.error === "E-mail already in use") {
            res.status(409).json({ status: 409, message: "E-mail already in use", hint: "E-mail already in use" });
        }
        else if (response.error === "Username already in use") {
            res.status(409).json({ status: 409, message: "Username already in use", hint: "Username already in use" });
        }
    });
});
server.put("/api/signup", methodNotAllowed); 
server.delete("/api/signup", methodNotAllowed); 

/* Recent list */
server.get("/api/browse/recent", (req, res) => {
    let { page } = req.query; 
    page = parseInt(page) || 0; 

    api.recentList(page, (response) => {
        res.json(response); 
    }); 
}); 
server.post("/api/browse/recent", methodNotAllowed); 
server.put("/api/browse/recent", methodNotAllowed); 
server.delete("/api/browse/recent", methodNotAllowed); 

/* Program list */
server.get("/api/program-list", methodNotAllowed); 
server.post("/api/program-list", (req, res) => {
    const params = req.body;
    api.programList(params, (response) => {
        res.json(response);
    });
});
server.put("/api/program-list", methodNotAllowed); 
server.delete("/api/program-list", methodNotAllowed); 

/* Edit profile */
server.get("/api/edit-profile", methodNotAllowed);
server.post("/api/edit-profile", (req, res) => {
    const { authorization } = req.headers;
    const { nickname, bio } = req.body; 

    api.editProfile(authorization, nickname, bio, (response) => {
        if (response) {
            res.json({});
        }
        else {
            res.status(401).json({ status: 401, message: "Unauthorized" });
        }
    });
});
server.put("/api/edit-profile", methodNotAllowed);
server.delete("/api/edit-profile", methodNotAllowed);

/* Monaco Live Editor */
let editor = new MonacoLiveEditor(); 
editor.setShowLog(true); // Show log
editor.setWorkspaceFolder(path.resolve(__dirname, "../programs")); 
editor.setTemplateFolder(path.resolve(__dirname, "../template-workspace"));
editor.requestConnect = (params) => {
    let workspace = path.resolve(params.workspace);
    console.log("Requesting connection to workspace: " + workspace);
}; 
editor.startServer(server, httpServer); 

/* Serve pages */
server.use(cookieParser());

/* Serve index */
server.get("*", function(req, res, next) {
    if (req.url.startsWith("/monaco-live-editor") || req.url.startsWith("/monaco-editor")) return next(); // Ignore monaco live editor requests
    res.send(index); 
});

/* Start server on port 80 */
httpServer.listen(80, () => {
    console.log("Web server started on port 80");
}); 