/* The backend API */
let mysql = require("mysql");
let dotenv = require("dotenv");
let emailValidator = require("email-validator");

dotenv.config(); // Load environment variables

let env = process.env;

let mysqlConnection = mysql.createConnection({
    host: env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME,
    charset: 'utf8mb4',
});
  
mysqlConnection.connect((error) => {
    if (error) throw error;
    console.log("Successfully connected to the database");
});

/* function filterObject(object, allowedKeys) {
    if (!object) return;
    
    return Object.keys(object)
        .filter(key => allowedKeys.includes(key))
        .reduce((newObject, key) => {
            newObject[key] = object[key];
            return newObject;
        }, {});
} */

function generateToken(n) {
    var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var token = '';
    for(var i = 0; i < n; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
}

function isValidUsername(username) {
    return /^[a-z0-9-]+$/.test(username);
}

function profile(identifier, callback) {
    let query = ""; 

    if (identifier.indexOf("Bearer ") === 0) {
        let auth_token = identifier.slice(7);
        auth_token = mysql.escape(auth_token); 
        query = `SELECT id, username, nickname, bio, registration_date FROM users WHERE auth_token = ${auth_token}`; 
    } 
    else {
        let username = identifier;
        username = mysql.escape(username); 
        query = `SELECT id, username, nickname, bio, registration_date FROM users WHERE username = ${username}`;
    }

    mysqlConnection.query(query, (error, results) => {
        if (error) throw error;

        const result = results[0];
        callback(result);
    });
}

function login(username, password, callback) {
    /* Escaping inputs */
    username = mysql.escape(username); 
    password = mysql.escape(password); 

    mysqlConnection.query(`SELECT auth_token FROM users WHERE username = ${username} AND password = ${password}`, (error, results) => {
        if (error) throw error;

        if (!results[0]) {
            callback(null);
            return;
        }

        const result = results[0].auth_token;
        callback(result);
    });
}

function signup(email, username, password, callback) {
    email = email.toLowerCase(); 

    if (!emailValidator.validate(email)) { // If e-mail format is not valid
        callback({ error: "Invalid e-mail address" }); 
        return; 
    }

    if (!isValidUsername(username) || username.length < 4 || username.length > 32) {
        callback({ error: "Invalid username" }); 
        return;
    }

    if (password.length < 4 || password.length > 32) {
        callback({ error: "Invalid password" }); 
        return;
    }

    /* Escaping inputs */
    username = mysql.escape(username); 
    password = mysql.escape(password); 
    email = mysql.escape(email); 

    mysqlConnection.query(`SELECT email FROM users WHERE email = ${email}`, (error, results) => {
        if (error) throw error; 

        if (!results[0]) { // If the e-mail hasn't been used by anyone yet
            mysqlConnection.query(`SELECT username FROM users WHERE username = ${username}`, (error, results) => {
                if (error) throw error; 

                if (!results[0]) { // If the username hasn't been used by anyone yet
                    const auth_token = generateToken(32); 
                    const escaped_auth_token = mysql.escape(auth_token); 
                    mysqlConnection.query(`INSERT INTO users(email, username, nickname, password, auth_token) VALUES(${email}, ${username}, ${username}, ${password}, ${escaped_auth_token})`, (error, results) => {
                        if (error) throw error; 

                        callback({ auth_token }); 
                    }); 
                }
                else {
                    callback({ error: "Username already in use" }); 
                }
            }); 
        }
        else {
            callback({ error: "E-mail already in use" }); 
        }
    }); 
}

function programList(params, callback) {
    const programsPerPage = 30; 

    let page = parseInt(params.page) || 0; 
    page = Math.max(0, page);

    let conditions = ""; 
    let sort = ""; 

    if (params.authorUsername) {
        conditions += " AND "; 

        if (params.authorUsernameExactMatch) {
            conditions += `author = (SELECT id FROM users WHERE username=${mysql.escape(params.authorUsername)})`;
        }
        else {
            conditions += `author = (SELECT id FROM users WHERE username LIKE ${mysql.escape(`%${params.authorUsername}%`)})`;
        }
    }

    if (params.authorNickname) {
        conditions += " AND ";

        if (params.authorNicknameExactMatch) {
            conditions += `author = (SELECT id FROM users WHERE nickname=${mysql.escape(params.authorNickname)})`;
        }
        else {
            conditions += `author = (SELECT id FROM users WHERE nickname LIKE ${mysql.escape(`%${params.authorNickname}%`)})`;
        }
    }

    if (params.title) {
        conditions += " AND "; 

        if (params.titleExactMatch) {
            conditions += `title = ${mysql.escape(params.title)}`;
        }
        else {
            conditions += `title LIKE ${mysql.escape(`%${params.title}%`)}`;
        }
    }

    switch (params.sort) {
        case "date":
            sort = "creation_date"; 
            break;
            
        default:
            sort = "creation_date"; 
            break;
    }

    switch (params.sortOrder) {
        case "ascending":
            sort += " ASC";
            break;

        case "descending":
            sort += " DESC";
            break;

        default:
            sort += " DESC";
            break;
    }

    let query = `SELECT programs.id, title, username, nickname, language FROM users, programs WHERE users.id = programs.author${conditions} ORDER BY ${sort} LIMIT ${programsPerPage} OFFSET ${page * programsPerPage}`; 

    mysqlConnection.query(query, (error, programResults) => {
        if (error) throw error; 

        /* Move programResults.username and programsResults.nickname to programResults.author.username and programResults.author.nickname */
        programResults = programResults.map(program => {
            program.author = {}; 
            program.author.username = program.username;
            program.author.nickname = program.nickname; 
            delete program.username; 
            delete program.nickname; 
            return program; 
        });

        conditions = conditions.replace(" AND", "WHERE");

        mysqlConnection.query(`SELECT COUNT(*) AS total FROM programs ${conditions}`, (error, countResults) => {
            if (error) throw error; 

            const totalEntries = countResults[0].total; 
            const totalPages = Math.ceil(totalEntries / programsPerPage); 

            const results = { 
                totalEntries, 
                page, 
                totalPages, 
                programs: programResults
            };

            callback(results); 
        });
    });
}

function editProfile(authorization, nickname, bio, callback) {
    auth_token = authorization.slice(7);

    auth_token = mysql.escape(auth_token); 
    nickname = mysql.escape(nickname);
    bio = mysql.escape(bio);

    query = `SELECT id FROM users WHERE auth_token = ${auth_token}`;
    mysqlConnection.query(query, (error, results) => {
        if (error) throw error; 

        if (!results[0]) {
            callback(0); // No user found with the given auth_token
            return;
        }
    });

    query = `UPDATE users SET nickname = ${nickname}, bio = ${bio} WHERE auth_token = ${auth_token}`; 

    mysqlConnection.query(query, (error, results) => {
        if (error) throw error;
        callback(1); // Check if any rows were changed
    });
}

function programInfo(id, callback) {
    query = `SELECT * FROM programs WHERE id = ${id}`;

    mysqlConnection.query(query, (error, results) => {
        if (error) throw error;

        const result = results[0];
        callback(result);
    });
}

module.exports = { profile, login, signup, programList, editProfile, programInfo };