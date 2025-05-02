# Deployment
1. Install Git, Node, NPM and MySQL server
   - `sudo apt install git-all npm mariadb-server`

2. Clone the repository
   - `git clone https://github.com/The-POWERON-foundation/POWERON`
  
3. Install required Node packages
   - `npm install`
   
4. Configure database
   - `sudo mysql_secure_installation`
   - `sudo mysql -u root`
   - MySQL: `CREATE DATABASE poweron;`
   - MySQL: `CREATE USER 'poweron'@'localhost' IDENTIFIED BY 'password';`
   - MySQL: `GRANT SELECT, INSERT, UPDATE, DELETE ON poweron.* TO 'poweron'@'localhost' WITH GRANT OPTION;`
   - MySQL: `USE poweron;`
   - MySQL: `SOURCE setup/mysql-setup.sql;`

5. Rename `template.env` to `.env` and modify the variables accordingly
  
6. Start the server
   - `sudo npm start`
   
7. Forward port 80 to web
   
8.  Forward port 3000 to sandbox