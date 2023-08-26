const mysql = require('mysql2/promise');
const {
  db,
  Users,
  Places,
  Events,
  Reels,
  RSVPs,
  Likes,
  Notifications,
  Friendships,
  Followers,
} = require('./index.ts');
// import { db, Users } from './index.ts'
db.options.logging = false;

const seedSqlize = () => {
  mysql
    .createConnection({ user: 'root', password: '', host: '127.0.0.1' })
    .then((db) =>
      db.query('CREATE DATABASE IF NOT EXISTS `theSpot`').then(() => db.end())
    )
    .then(() =>
      console.log(
        '\x1b[33m',
        "\nDatabase (MySQL): 'theSpot' successfully created!"
      )
    )
    .then(() => Users.sync({ force: true }))
    .then(() =>
      console.log(
        '\x1b[36m',
        "\nDatabase (MySQL): 'Users' table successfully created!"
      )
    )
    .then(() => Places.sync({ force: true }))
    .then(() =>
      console.log(
        '\x1b[36m',
        "\nDatabase (MySQL): 'Places' table successfully created!"
      )
    )
    .then(() => Events.sync({ force: true }))
    .then(() =>
      console.log(
        '\x1b[36m',
        "\nDatabase (MySQL): 'Events' table successfully created!"
      )
    )
    .then(() => Reels.sync({ force: true }))
    .then(() =>
      console.log(
        '\x1b[36m',
        "\nDatabase (MySQL): 'Reels' table successfully created!"
      )
    )
    .then(() => RSVPs.sync({ force: true }))
    .then(() =>
      console.log(
        '\x1b[36m',
        "\nDatabase (MySQL): 'RSVPs' table successfully created!"
      )
    )
    .then(() => Likes.sync({ force: true }))
    .then(() =>
      console.log(
        '\x1b[36m',
        "\nDatabase (MySQL): 'Likes' table successfully created!"
      )
    )
    .then(() => Notifications.sync({ force: true }))
    .then(() =>
      console.log(
        '\x1b[36m',
        "\nDatabase (MySQL): 'Notifications' table successfully created!"
      )
    )
    .then(() => Friendships.sync({ force: true }))
    .then(() =>
      console.log(
        '\x1b[36m',
        "\nDatabase (MySQL): 'Friendships' table successfully created!"
      )
    )
    .then(() => Followers.sync({ force: true }))
    .then(() =>
      console.log(
        '\x1b[36m',
        "\nDatabase (MySQL): 'Followers' table successfully created!"
      )
    )
    .then(() =>
      Promise.all(
        require('./fakeUserData.json').map((txn) => Users.create(txn))
      )
    )
    .then(() =>
      Promise.all(
        require('./fakePlaceData.json').map((txn) => Places.create(txn))
      )
    )
    .then(() =>
      Promise.all(
        require('./fakeEventData.json').map((txn) => Events.create(txn))
      )
    )
    .then(() =>
      Promise.all(
        require('./fakeRsvpData.json').map((txn) => RSVPs.create(txn))
      )
    )
    .then(() =>
      Promise.all(
        require('./fakeFriendData.json').map((txn) => Friendships.create(txn))
      )
    )
    .then(() =>
      Promise.all(require('./fakeData.json').map((txn) => Reels.create(txn)))
    )
    .then(process.exit);
};

seedSqlize();
