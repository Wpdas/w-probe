const config = require('../../../config');
const readFile = require('../../../functions/read-file');

const STATUS = 'status';
const TEMPERATURE = 'temperature';
const IP = 'ip';
const CONFIG = 'config';
const TAKE_PHOTO_NIGHT_MODE = 'take photo night mode';
const TAKE_PHOTO_SOLAR_MODE = 'take photo solar mode';
const TAKE_PHOTO_DAY_MODE = 'take photo day mode';

function status() {
  return `
  ===================== WProbe Status =====================
  ${temperature()}
  ${ip()}
  `;
}

function temperature() {
  const file = `${config.LOG_PATH}/${config.LOG_FILE_NAMES.TEMPERATURE}`;
  return `System temperature: ${readFile(file)}`;
}

function ip() {
  const file = `${config.LOG_PATH}/${
    config.LOG_FILE_NAMES.LAST_VALID_EXTERNAL_IP
  }`;
  return `External IP: ${readFile(file)}`;
}

function configResponse() {
  return `\`\`\`${JSON.stringify(
    { ...config, BOT_TOKEN: 'xxxxx' },
    false,
    2
  )}\`\`\``;
}

function commandsAvailable() {
  return `
Here is the actual supported commands:
\`take photo night mode\` : Request Probe to take photo to scan stars;
\`take photo solar mode\` : Request Probe to take photo scanning the Sun;
\`take photo day mode\` : Request Probe to take a normal photo;
\`status\` : Show all important details of the Probe;
\`temperature\` : Show the current system temperature;
\`ip\` : Show external IP that can be used to access the Probe system;
\`config\` : Show the current configuration structure file of the system.`;
}

module.exports = (
  takePhotoNightSolarModeFunction,
  takePhotoDayModeFunction
) => {
  return {
    process: text => {
      text = text.toLowerCase();
      let response =
        'Sorry, but I can not understand this command. \n' +
        commandsAvailable();
      if (text.indexOf(STATUS) != -1) response = status();
      if (text.indexOf(TEMPERATURE) != -1) response = temperature();
      if (text.indexOf(IP) != -1) response = ip();
      if (text.indexOf(CONFIG) != -1) response = configResponse();
      if (
        text.indexOf(TAKE_PHOTO_NIGHT_MODE) != -1 ||
        text.indexOf(TAKE_PHOTO_SOLAR_MODE) != -1
      ) {
        if (takePhotoNightSolarModeFunction) takePhotoNightSolarModeFunction();
        response = 'Request in progress...';
      }
      if (text.indexOf(TAKE_PHOTO_DAY_MODE) != -1) {
        if (takePhotoDayModeFunction) takePhotoDayModeFunction();
        response = 'Request in progress...';
      }
      return response;
    }
  };
};
