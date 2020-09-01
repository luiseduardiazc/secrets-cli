'use strict'

const crypto = require('crypto')
const bcrypt = require('bcrypt')

const saltRounds = 5

async function hashPassword (pass) {
  const securePass = await bcrypt.hash(pass, saltRounds)
  return securePass
}

async function comparePassword (hash, pass) {
  return bcrypt.compare(pass, hash)
}

async function encrypt () {

}

async function decrypt () {

}

async function generateRandomKey () {
  return crypto.randomBytes(16).toString('hex')
}

async function generateKey (pass) {
  return crypto.createHash('sha256').update(pass).digest('hex')
}

module.exports = {
  hashPassword,
  comparePassword,
  encrypt,
  decrypt,
  generateRandomKey,
  generateKey
}
