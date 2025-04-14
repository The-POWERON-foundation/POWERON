# Deployment
1. Install Node, NPM and MySQL server
   - `sudo apt install node npm mysql-server`
  
2. Install required Node packages
   - `npm install`
   
3. Configure database
   - `sudo mysql_secure_installation`
   - `mysql -u root –p`
   - MySQL: `CREATE DATABASE [DB_NAME];`
   - MySQL: `CREATE USER '[DB_USER]'@'[DB_HOST]' IDENTIFIED WITH mysql_native_password BY '[DB_PASS]';`
   - MySQL: `GRANT SELECT, INSERT, UPDATE, DELETE ON [DB_NAME].* TO '[DB_USER]'@'[DB_HOST]' WITH GRANT OPTION;`
   - MySQL: `USE [DB_NAME];`
   - MySQL: `SOURCE setup/mysql-setup.sql;`

4. Rename `template.env` to `.env` and modify the variables accordingly
  
5. Start the server
   - `npm start`
   
6. Forward port 80 to web
   
7. Forward port 3000 to sandbox