# Deployment
1. Install Git, Node, NPM and MySQL server
   - `sudo apt install git-all npm mariadb-server`

2. Remove Apache2
   - `sudo apt remove apache2`

3. Clone the repository
   - `git clone https://github.com/The-POWERON-foundation/POWERON`
   - `cd POWERON`
  
4. Install required Node packages
   - `npm install`
   
5. Configure database
   - `sudo mysql_secure_installation`
   - `sudo mysql -u root`
   - MySQL: `CREATE DATABASE poweron;`
   - MySQL: `CREATE USER 'poweron'@'localhost' IDENTIFIED BY 'password';`
   - MySQL: `GRANT SELECT, INSERT, UPDATE, DELETE ON poweron.* TO 'poweron'@'localhost' WITH GRANT OPTION;`
   - MySQL: `USE poweron;`
   - MySQL: `SOURCE setup/mysql-setup.sql;`

6. Rename `template.env` to `.env` and modify the variables accordingly
  
7. Start the server
   - `sudo npm start`
   
8. Forward port 80 to web
   
9.  Forward port 3000 to sandbox