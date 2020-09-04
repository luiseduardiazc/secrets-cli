'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Secret extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      models.Secret.belongsTo(models.User, {
        targetKey: 'username',
        foreignKey: 'username',
        as: 'user'
      })
    }
  }
  Secret.init(
    {
      username: DataTypes.STRING,
      name: DataTypes.STRING,
      value: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Secret',
      tableName: 'secrets',
      underscored: true
    }
  )
  return Secret
}
