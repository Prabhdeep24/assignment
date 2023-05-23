const {Sequelize, DataTypes} = require("sequelize");
const sequelize = new Sequelize('sqlite::memory:');

const User = sequelize.define("User", {
  email:{
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
},
);

module.exports = User;
