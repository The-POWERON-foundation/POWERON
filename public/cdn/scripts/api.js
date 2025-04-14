/**
 * The PowerAPI
 */

function PowerAPI() {
    this.queue = 0; 
    this.onQueueEmpty = () => {}; 
}

PowerAPI.prototype.query = function(url, method, headers, cache, body, callback) {
    this.queue ++;

    let queryParameters = {}; 
    if (method === "GET") {
        queryParameters = { method: method, headers: headers };
    }
    if (method === "POST") {
        queryParameters = { method: method, headers: headers, body: JSON.stringify(body) };
    }
    queryParameters.cache = cache;

    fetch("/api/" + url, queryParameters)
        .then(response => response.json())
        .then(data => {
            callback(data);
            this.queue --;
            if (this.queue === 0) {
                this.onQueueEmpty();
            }
        });
};

PowerAPI.prototype.page = function(page, callback) {
    this.query("pages/" + page, "GET", {}, "no-store", {}, callback);
}

PowerAPI.prototype.profile = function(identifier, callback) {
    if (identifier.indexOf("Bearer ") === 0) {
        this.query("profile", "GET", { "Authorization": identifier }, "no-store", {}, callback);
    }
    else {
        this.query("profile/" + identifier, "GET", {}, "no-store", {}, callback);
    }
};

PowerAPI.prototype.login = function(username, password, callback) {
    this.query("login", "POST", { "Content-Type": "application/json" }, "no-store", { username, password }, callback);
}

PowerAPI.prototype.signup = function(email, username, password, callback) {
    this.query("signup", "POST", { "Content-Type": "application/json" }, "no-store", { email, username, password }, callback);
}

PowerAPI.prototype.recentList = function(page, callback) {
    this.query("browse/recent?page=" + page, "GET", {}, "no-store", {}, callback);
} 

PowerAPI.prototype.programList = function(params, callback) {
    this.query("program-list", "POST", { "Content-Type": "application/json" }, "no-store", params, callback);
}