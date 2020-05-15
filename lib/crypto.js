'use strict'

const crypto = require('crypto')
const bcrypt = require('bcrypt')

const saltRounds = 5

async function hashPassword (pass) {
  const securePass = await bcrypt.hash(pass, saltRounds)
  return securePass
}

module.exports = {
  hashPassword
}
