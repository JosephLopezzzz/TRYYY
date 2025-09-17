import { Sequelize } from 'sequelize-typescript';
import { sequelize } from '../config/database';

// Import models
import User from './User';
import Role from './Role';
import Guest from './Guest';
import Room from './Room';
import RoomType from './RoomType';
import Reservation from './Reservation';
import Payment from './Payment';

// Add models to Sequelize
const models = {
  User,
  Role,
  Guest,
  Room,
  RoomType,
  Reservation,
  Payment,
};

// Initialize models
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

// Set up associations
Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

Guest.hasMany(Reservation, { foreignKey: 'guestId' });
Reservation.belongsTo(Guest, { foreignKey: 'guestId' });

RoomType.hasMany(Room, { foreignKey: 'roomTypeId' });
Room.belongsTo(RoomType, { foreignKey: 'roomTypeId' });

Room.hasMany(Reservation, { foreignKey: 'roomId' });
Reservation.belongsTo(Room, { foreignKey: 'roomId' });

Reservation.hasMany(Payment, { foreignKey: 'reservationId' });
Payment.belongsTo(Reservation, { foreignKey: 'reservationId' });

export {
  sequelize,
  Sequelize,
  User,
  Role,
  Guest,
  Room,
  RoomType,
  Reservation,
  Payment,
};
