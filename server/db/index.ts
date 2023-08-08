const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();
// import { Table, Column, Model, HasMany } from 'sequelize-typescript';
// const { DB_HOST } = process.env;
// Create sequelize connection to mysql database
const sequelize = new Sequelize({
  host: '127.0.0.1',
  dialect: 'mysql',
  username: 'root',
  password: '',
  database: 'theSpot'
});

const Users = sequelize.define('Users', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  displayName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  geolocation: {
    type: DataTypes.STRING(100)
  },
  mapIcon: DataTypes.STRING(100),
  birthday: DataTypes.DATE,
  privacy: DataTypes.STRING(100),
  accessibility: DataTypes.STRING(100)
}, { timestamps: true });

const Places = sequelize.define('Places', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  venue_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  coordinates: {
    type: DataTypes.STRING(100),
    allowNull: false,
  }
}, { timestamps: true });

const Events = sequelize.define('Events', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  rsvp_count: {
    type: DataTypes.INTEGER
  },
  date: {
    type: DataTypes.DATE
  },
  place_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Places,
      key: 'id'
    }
  },
  geolocation: {
    type: DataTypes.STRING(100)
  },
  twenty_one: {
    type: DataTypes.BOOLEAN
  }
}, { timestamps: true });

const Reels = sequelize.define('Reels', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  video: {
    type: DataTypes.STRING(100),
    unique: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Users,
      key: 'id'
    }
  },
  event_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Events,
      key: 'id'
    }
  },
  text: {
    type: DataTypes.STRING(100),
  },
  like_count: {
    type: DataTypes.INTEGER
  }
}, { timestamps: true });

const Rsvp = sequelize.define('Rsvp', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Users,
      key: 'id'
    }
  },
  event_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Events,
      key: 'id'
    }
  }
}, { timestamps: true });

const Likes = sequelize.define('Likes', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Users,
      key: 'id'
    }
  },
  reels_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Reels,
      key: 'id'
    }
  }
}, { timestamps: true });

const Notifications = sequelize.define('Notifications', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  type: {
    type: DataTypes.STRING(100),
  },
  sender_id: {
    type: DataTypes.STRING(100),
  },
  receiver_id: {
    type: DataTypes.STRING(100),
  }
}, { timestamps: true });

const Friendship = sequelize.define('Friendship', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  requester_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Users,
      key: 'id'
    }
  },
  accepter_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Users,
      key: 'id'
    }
  }
}, { timestamps: true });

module.exports = {
  db: sequelize,
  Users,
  Places,
  Events,
  Reels,
  Rsvp,
  Likes,
  Notifications,
  Friendship
};