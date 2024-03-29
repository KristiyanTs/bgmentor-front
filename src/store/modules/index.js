import camelCase from 'lodash/camelCase'
// Storing in variable a context with all files in this folder
// ending with `.js`.
const requireModule = require.context('.', false, /\.js$/)
const modules = {}

requireModule.keys().forEach((fileName) => {
  // filter fullstops and extension
  if (fileName === './index.js') return
  // and return a camel-case name for the file
  const moduleName = camelCase(fileName.replace(/(\.\/|\.js)/g, ''))
  // create a dynamic object with all modules
  modules[moduleName] = {
    namespaced: false,
    ...requireModule(fileName).default
  }
})

export default modules
