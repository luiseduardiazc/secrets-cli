'use strict'

const crypto = require('crypto')
const bcrypt = require('bcrypt')

const saltRounds = 5
const algorithm = 'aes-256-cbc'

async function hashPassword (pass) {
  const securePass = await bcrypt.hash(pass, saltRounds)
  return securePass
}

async function comparePassword (hash, pass) {
  return bcrypt.compare(pass, hash)
}

async function encrypt (value, secretKey, randomKey) {
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(secretKey, 'hex'),
    Buffer.from(randomKey, 'hex')
  )
  let encrypted = cipher.update(value)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return encrypted.toString('hex')
}

async function decrypt (value, secretKey, randomKey) {
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(secretKey, 'hex'),
    Buffer.from(randomKey, 'hex')
  )
  let decripted = decipher.update(Buffer.from(value, 'hex'))
  decripted = Buffer.concat([decripted, decipher.final()])
  return decripted.toString()
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
