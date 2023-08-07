const mysql = require('mysql2/promise');
const { db, Users, Places, Events, Reels, Rsvp, Likes, Notifications, Friendship } = require('./index.ts');
// import { db, Users } from './index.ts'
db.options.logging = false;

const seedSqlize = () => {
  mysql.createConnection({ user: 'root', password: '', host: '127.0.0.1' })
    .then((db) => db.query('CREATE DATABASE IF NOT EXISTS `theSpot`').then(() => db.end()))
    .then(() => console.log('\x1b[33m', '\nDatabase (MySQL): \'theSpot\' successfully created!'))
    .then(() => Users.sync({ force: true }))
    .then(() => console.log('\x1b[36m', '\nDatabase (MySQL): \'Users\' table successfully created!'))
    .then(() => Places.sync({ force: true }))
    .then(() => console.log('\x1b[36m', '\nDatabase (MySQL): \'Places\' table successfully created!'))
    .then(() => Events.sync({ force: true }))
    .then(() => console.log('\x1b[36m', '\nDatabase (MySQL): \'Events\' table successfully created!'))
    .then(() => Reels.sync({ force: true }))
    .then(() => console.log('\x1b[36m', '\nDatabase (MySQL): \'Reels\' table successfully created!'))
    .then(() => Rsvp.sync({ force: true }))
    .then(() => console.log('\x1b[36m', '\nDatabase (MySQL): \'Rsvp\' table successfully created!'))
    .then(() => Likes.sync({ force: true }))
    .then(() => console.log('\x1b[36m', '\nDatabase (MySQL): \'Likes\' table successfully created!'))
    .then(() => Notifications.sync({ force: true }))
    .then(() => console.log('\x1b[36m', '\nDatabase (MySQL): \'Notifications\' table successfully created!'))
    .then(() => Friendship.sync({ force: true }))
    .then(() => console.log('\x1b[36m', '\nDatabase (MySQL): \'Friendship\' table successfully created!'))
    .then(process.exit);
};

seedSqlize();
