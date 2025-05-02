# Deployment
1. Install Node, NPM and MySQL server
   - `sudo apt install npm mariadb-server`
  
2. Install required Node packages
   - `npm install`
   
3. Configure database
   - `sudo mysql_secure_installation`
   - `sudo mysql -u root`
   - MySQL: `CREATE DATABASE poweron;`
   - MySQL: `CREATE USER 'poweron'@'localhost' IDENTIFIED BY 'password';`
   - MySQL: `GRANT SELECT, INSERT, UPDATE, DELETE ON poweron.* TO 'poweron'@'localhost' WITH GRANT OPTION;`
   - MySQL: `USE poweron;`
   - MySQL: `SOURCE setup/mysql-setup.sql;`

4. Rename `template.env` to `.env` and modify the variables accordingly
  
5. Start the server
   - `npm start`
   
6. Forward port 80 to web
   
7. Forward port 3000 to sandbox