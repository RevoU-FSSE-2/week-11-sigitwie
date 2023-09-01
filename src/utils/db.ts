import { Sequelize } from 'sequelize';
import { UserFactory } from '../models/UserModel';
import { PostFactory } from '../models/PostModel';
import { FriendshipFactory } from '../models/FriendshipModel';
import { CommentFactory } from '../models/CommentModel';
import dotenv from 'dotenv';



dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USER!, process.env.DB_PASSWORD!, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

sequelize.authenticate()
  .then(() => {
    console.log('Successfully connected to the database.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

UserFactory(sequelize);
PostFactory(sequelize);
CommentFactory(sequelize);
FriendshipFactory(sequelize);

export default sequelize;
