const fs = jest.genMockFromModule('fs')
const _fs = jest.requireActual('fs')

Object.assign(fs, _fs)

let readMocks = {}

fs.setReadFileMock = (path, error, data) => {
  readMocks[path] = [error, data]
}

fs.readFile = (path, options, callback) => {
  if (callback === undefined) { callback = options }
  if (path in readMocks) {
    callback(...readMocks[path])
  } else {
    console.log('readMock');
    // _fs.readFile(path, options, callback)
  }
}

let writeMocks = {}

fs.setWriteFileMock = (path, fn) => {
  writeMocks[path] = fn
}
fs.writeFile = (path, data, options, callback) => {
  if(path in writeMocks){
    writeMocks[path](path,data,options,callback)
  }else{
    console.log('writeMock');
    // _fs.writeFile(file,data,options,callback)
  }
}

fs.clearMocks = ()=>{
  readMocks = {}
  writeMocks = {}
}


module.exports = fs