const getSimpleDate = require('./../get-simple-date');
const getTime = require('./../get-time');

module.exports = () => {
  return `${getSimpleDate()}-${getTime()}`;
};
