const { aliasWebpack, aliasJest } = require('react-app-alias');

const aliasMap = {
  '@components': 'src/components',
  '@pages': 'src/pages',
  '@services': 'src/services',
  '@hooks': 'src/hooks',
  '@mocks': 'src/mocks',
  '@redux': 'src/redux-toolkit',
  '@assets': 'src/assets',
  '@colors': 'src/colors',
  '@root': 'src'
}


const options = {
  alias: aliasMap
}


module.exports = aliasWebpack(options);
module.exports.jest = aliasJest(options);
