const raspiInfo = require('raspberry-info');
module.exports = {
  getTemperature: raspiInfo.getCPUTemperature
};
