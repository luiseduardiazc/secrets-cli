'user strict'

const { hashPassword, comparePassword, generateRandomKey } = require('./crypto')
const { Client } = require('pg')

const dbUrl = process.env.DB_URL

const client = new Client({
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false
  }
})

const queries = {
  tableUsers: `
      CREATE TABLE IF NOT EXISTS users (
          username text PRIMARY KEY,
          password text NOT NULL,
          randomkey text NOT NULL
      );
      `,
  tableSecrets: `
      CREATE TABLE IF NOT EXISTS secrets (
          username text REFERENCES users (username),
          name  text NOT NULL,
          value text NOT NULL,
          PRIMARY KEY (username, name)
      );
      `
}

async function createDb () {
  await client.connect()
  await client.query(queries.tableUsers)
  await client.query(queries.tableSecrets)

  return {
    client,
    createUser,
    listUsers,
    createSecret,
    listSecrets,
    getSecret,
    updateSecret,
    deleteSecret,
    authenticate
  }
}
async function authenticate (username, password) {
  const user = await getAutenticatedUser(username, password)
  return user !== null
}

async function getAutenticatedUser (username, password) {
  const resp = await client.query(`
    SELECT username, password, randomkey FROM users WHERE username = $1
    `, [
    username
  ])
  if (!resp || !resp.rows || !resp.rows[0]) return null

  const user = resp.rows[0]
  const savedPassword = user.password
  delete user.password
  const isEqualPassword = await comparePassword(savedPassword, password)
  if (isEqualPassword) {
    return user
  }
  return null
}

async function createUser (username, password) {
  const securePass = await hashPassword(password)
  const randomKey = await generateRandomKey()
  await client.query('INSERT INTO users (username, password, randomkey) VALUES ($1, $2, $3)',
    [username, securePass, randomKey]
  )
  await client.end()
}

async function listUsers () {
  const resp = await client.query('SELECT username AS user FROM users')
  await client.end()
  return {
    count: resp.rowCount,
    users: resp.rows
  }
}

async function createSecret (username, name, value) {
  await client.query('INSERT INTO secrets (username, name, value) VALUES ($1, $2, $3)',
    [username, name, value])
  await client.end()
}

async function listSecrets (username) {
  const resp = await client.query('SELECT name FROM secrets where username= $1', [username])
  await client.end()
  return resp.rows
}

async function getSecret (username, name) {
  const resp = await client.query('SELECT name, value FROM secrets where username= $1 and name = $2',
    [username, name]
  )
  await client.end()
  return resp.rows[0]
}

async function updateSecret (username, name, value) {
  await client.query('UPDATE secrets SET value=$3 WHERE username = $1 AND name = $2', [username,
    name,
    value])
  client.end()
}

async function deleteSecret (username, name) {
  await client.query('DELETE FROM secrets WHERE username = $1 AND name = $2', [username, name])
  await client.end()
}

module.exports = {
  createDb
}
