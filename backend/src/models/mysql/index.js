const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.MYSQL_DB,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASS,
  {
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT || 3306),
    dialect: "mysql",
    logging: false,
  }
);

const User = require("./User")(sequelize, DataTypes);
const Booking = require("./Booking")(sequelize, DataTypes);

User.hasMany(Booking, { foreignKey: { name: "userId", allowNull: false } });
Booking.belongsTo(User, { foreignKey: { name: "userId", allowNull: false } });

module.exports = { sequelize, User, Booking };
