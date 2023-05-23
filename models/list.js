const {Sequelize, DataTypes} = require("sequelize");
const sequelize = new Sequelize('sqlite::memory:');

const List = sequelize.define("List", {
  isMark:{
    type: Sequelize.BOOLEAN,
  },
  isComplete:{
    type: Sequelize.BOOLEAN,
  },
  title:{
    type: Sequelize.STRING,
  },
  description:{
    type: Sequelize.STRING
  }
},
);

module.exports = List;
