### To run locally
```
git clone git@github.com:Andrewsooter442/BackendAssignment.git
cd BackendAssignment
npm install
npm run dev
```

I am leaving the .env file for ease of use.

Then start a mysql server and
```
source config/db_setup.sql
```

Then create two new user with the name "admin" and "cheff". By default the server runs of port 3000
```
source config/db_menu.sql
```