'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      models.User.hasMany(models.Secret, {
        sourceKey: 'username',
        foreignKey: 'username',
        as: 'secrets'
      })
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      fullName: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true
    }
  )
  return User
}
