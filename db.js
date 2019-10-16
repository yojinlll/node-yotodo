const homedir = require('os').homedir()
const home = process.env.HOME || homedir
const path = require('path')
const fs = require('fs')
const dbPath = path.join(home, '.todo')

const db = {
  read(path = dbPath) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, { flag: 'a+' }, (error, data) => {
        if (error) return reject(error)

        let list
        try {
          list = JSON.parse(data.toString())
        } catch (error2) {
          list = []
        }
        resolve(list)
      })
    })
  },
  write(list, path = dbPath) {
    const string = JSON.stringify(list)
    return new Promise((resolve, reject) => {
      fs.writeFile(path, string + '\n', (error) => {
        if (error) return reject(error)
        resolve()
      })
    })
  }
}

module.exports = db