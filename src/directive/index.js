const files = require.context('./', false, /^\.\/.*\.js$/)
files
    .keys()
    .filter((item) => item !== './index.js')
    .forEach((item) => files(item))
