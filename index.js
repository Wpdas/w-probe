const exec = require('child_process').exec;
const getIP = require('external-ip')();
const createFolder = require('./functions/create-folder');
const getSystemTemperature = require('./functions/get-system-temperature');
const getSimpleDate = require('./functions/get-simple-date');
const getTime = require('./functions/get-time');
const writeFile = require('./functions/write-file');
//const SlackBot = require('./util/slack-bot');
const config = require('./config');

// Initial settings
console.info('Initializing WProbe System...');
config.SYSTEM_PATH = __dirname;
config.IMAGES_PATH = `${config.SYSTEM_PATH}/images`;
config.LOG_PATH = `${config.SYSTEM_PATH}/log`;
createFolder(config.IMAGES_PATH);
createFolder(config.LOG_PATH);

//const slackBotInstance = SlackBot();

temperatureRoutine();
photoRoutine();
checkExternalIp();
console.info('System is ready');

// Initialize Default Routines
setInterval(() => {
  temperatureRoutine();
}, config.SAVE_LOG_INTERVAL);

setInterval(() => {
  photoRoutine();
}, config.TAKE_PHOTO_INTERVAL);

setInterval(checkDefaultRoutines, config.CHECK_ROUTINES);

function temperatureRoutine() {
  console.info('Getting system temperature...');
  getSystemTemperature
    .getTemperature()
    .then(temperature => {
      // Send a warning in case of temperature is very high
      const simpleTemperature = parseInt(temperature.replace('°C', ''));
      if (simpleTemperature > 70) {
        slackBotInstance.sendResponse(
          `Warning: The system temperature is very high!`
        );
      }

      writeFile(
        `${config.LOG_PATH}/${config.LOG_FILE_NAMES.TEMPERATURE}`,
        temperature
      );
    })
    .catch(error => {
      writeFile(
        `${config.LOG_PATH}/${config.LOG_FILE_NAMES.TEMPERATURE}`,
        'N/A'
      );
      console.error('Error on get system temperature.');
    });
}

function photoRoutine() {
  // Check / Create path for current date
  console.info('Preparing to take a photo...');
  const currentDate = getSimpleDate();
  const currentTime = getTime();
  createFolder(`${config.IMAGES_PATH}/${currentDate}`);

  let currentExec = exec(
    config.PROBE_COMMANDS.TAKE_PHOTO_NIGHT_MODE(currentDate, currentTime),
    err => {
      currentExec.kill();
      if (err) return console.error('Error taking photo!');
      console.info('The new photo is done.');
    }
  );
}

function checkDefaultRoutines() {
  checkExternalIp();
}

function checkExternalIp() {
  console.info('Checking external IP...');
  getIP((err, ip) => {
    if (err) {
      return console.error('There was an error trying to get external IP.');
    }
    writeFile(
      `${config.LOG_PATH}/${config.LOG_FILE_NAMES.LAST_VALID_EXTERNAL_IP}`,
      ip
    );
  });
}
