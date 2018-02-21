const Sequelize = require('sequelize')
const db = require('../db')

const Sample = db.define('sample', {
  name: Sequelize.STRING
})

module.exports = Sample
