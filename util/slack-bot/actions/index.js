const config = require('../../../config');
const readFile = require('../../../functions/read-file');

const STATUS = 'show status';

function status() {
  return `
  ===================== WProbe Status =====================
  System temperature: ${readFile(
    `${config.LOG_PATH}/${config.LOG_FILE_NAMES.TEMPERATURE}`
  )}
  External IP: ${readFile(
    `${config.LOG_PATH}/${config.LOG_FILE_NAMES.LAST_VALID_EXTERNAL_IP}`
  )}
  `;
}

module.exports = text => {
  console.log('receive text:', text);
  switch (text) {
    case STATUS:
      return status();
    default:
      return;
  }
};
