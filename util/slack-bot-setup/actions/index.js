const config = require('../../../config');
const readFile = require('../../../functions/read-file');

const STATUS = 'status';
const TEMPERATURE = 'temperature';
const IP = 'ip';
const CONFIG = 'config';

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
\`status\` : Show all important details of the Probe;
\`temperature\` : Show the current system temperature;
\`ip\` : Show external IP tha can be used to access the Probe system;
\`config\` : Show the current configuration structure file of the system.`;
}

module.exports = text => {
  let response =
    'Sorry, but I can not understand this command. \n' + commandsAvailable();
  if (text.indexOf(STATUS) != -1) response = status();
  if (text.indexOf(TEMPERATURE) != -1) response = temperature();
  if (text.indexOf(IP) != -1) response = ip();
  if (text.indexOf(CONFIG) != -1) response = configResponse();
  return response;
};
