const mysql = require('mysql2/promise');
const { db, Users } = require('./index.ts');
// import { db, Users } from './index.ts'
db.options.logging = false;

const seedSqlize = () => {
  mysql.createConnection({ user: 'root', password: '', host: '127.0.0.1'})
    .then((db) => db.query('CREATE DATABASE IF NOT EXISTS `theSpot`').then(() => db.end()))
    .then(() => console.log('\x1b[33m', '\nDatabase (MySQL): \'theSpot\' successfully created!'))
    .then(() => Users.sync({ force: true }))
    .then(() => console.log('\x1b[36m', '\nDatabase (MySQL): \'Users\' table successfully created!'))
    .then(process.exit);
};

seedSqlize();