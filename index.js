'use strinct'
require('dotenv').config()

const minimist = require('minimist')
const { createDb } = require('./lib')
const promptly = require('promptly')

const argv = minimist(process.argv.slice(2))

const prompt = () => promptly.password('Type a password: ', { replace: '*' })


async function main () {
  const db = await createDb(process.env.DB_TYPE)
  const command = argv._.shift()
  switch (command) {
    case 'users:create':
      try {
        const { user} = argv
        const pass = await prompt()
        await db.createUser(user, pass)
        console.log(`${user} created`)
      } catch (error) {
        throw new Error('Cannot create user')
      }

      break
    case 'users:list':
      try {
        const results = await db.listUsers()
        if (!results || !results.users || !results.users.length) return console.log('No users Found')
        results.users.forEach(user => {
          console.log(`user ${user.user}`)
        })
        console.log(`\tTotal ${results.count}`)
      } catch (error) {
        throw new Error('Cannot list users')
      }
      break
    case 'secrets:create':
      try {
        const { user, name, value } = argv
        const pass = await prompt()
        await db.createSecret(user, name, value)
        console.log(`Secret ${name} created`)
      } catch (error) {
        throw new Error('Cannot create secret')
      }
      break
    case 'secrets:list':
      try {
        const { user } = argv
        const pass = await prompt()
        const secrets = await db.listSecrets(user)
        console.log(`Secrets for ${user}`)
        secrets.forEach((secret) => {
          console.log(secret.name)
        })
      } catch (error) {
        throw new Error(`Cannot list secrets ${error}`)
      }
      break
    case 'secrets:get':
      try {
        const { user, name } = argv
        const pass = await prompt()
        const secret = await db.getSecret(user, name)
        if (!secret) return console.log(`secret ${name} not found`)
        console.log(`${secret.name} = ${secret.value}`)
      } catch (error) {
        throw new Error('Cannot get secrtet')
      }
      break

    case 'secrets:update':
      try {
        const { user, name, value } = argv
        const pass = await prompt()
        await db.updateSecret(user, name, value)
        console.log(`secrtet ${name} updated`)
      } catch (error) {
        throw new Error('Cannot update secrtet')
      }
      break
    case 'secrets:delete':
      try {
        const { user, name } = argv
        const pass = await prompt()
        await db.deleteSecret(user, name)
        console.log(`secret ${name} deleted`)
      } catch (error) {
        throw new Error('Cannot Delete secret')
      }
      break
    default:
      console.log(`commnad ${command} not found`)
  }
}

main().catch(err => console.log(err))