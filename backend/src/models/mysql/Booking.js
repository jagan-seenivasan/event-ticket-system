module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define("Booking", {
    eventId: { type: DataTypes.STRING(40), allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  });

  return Booking;
};
