const exec = require('child_process').exec;
const getIP = require('external-ip')();
const createFolder = require('./functions/create-folder');
const getSystemTemperature = require('./functions/get-system-temperature');
const getSimpleDate = require('./functions/get-simple-date');
const getTime = require('./functions/get-time');
const writeFile = require('./functions/write-file');
const SlackBot = require('slackbots');
const slackBotSetup = require('./util/slack-bot-setup');
const config = require('./config');

let botMessageController;
const slackBot = new SlackBot({
  token: config.BOT_TOKEN,
  name: 'W Probe'
});

// Ready
slackBot.on('start', function() {
  const takeNightSolarPhoto = () => {
    photoRoutine(config.PROBE_COMMANDS.TAKE_PHOTO_NIGHT_MODE);
  };

  const takeDayPhoto = () => {
    photoRoutine(config.PROBE_COMMANDS.TAKE_PHOTO_DAY_MODE);
  };

  botMessageController = slackBotSetup(
    slackBot,
    config,
    takeNightSolarPhoto,
    takeDayPhoto
  );
  initProbe();
});

// Initial settings
function initProbe() {
  botMessageController.sendMessage('Status 1: Initializing WProbe System...');
  config.SYSTEM_PATH = __dirname;
  config.IMAGES_PATH = `${config.SYSTEM_PATH}/images`;
  config.LOG_PATH = `${config.SYSTEM_PATH}/log`;
  createFolder(config.IMAGES_PATH);
  createFolder(config.LOG_PATH);
  botMessageController.sendMessage('Status 2: The system is ready!');

  setTimeout(startProcesses, config.DELAY_BEFORE_START_WORK);
}

function startProcesses() {
  temperatureRoutine();
  photoRoutine(config.PROBE_COMMANDS.TAKE_PHOTO_NIGHT_MODE);
  checkExternalIp();

  // Initialize Default Routines
  setInterval(() => {
    temperatureRoutine();
  }, config.SAVE_LOG_INTERVAL);

  setInterval(() => {
    //Check time
    let currentTime = new Date();
    if (
      (currentTime.getHours() >= config.TIME_HIGHT_ACTIVITY &&
        currentTime.getHours() <= 23) ||
      (currentTime.getHours() >= 0 &&
        currentTime.getHours() < config.TIME_LOW_ACTIVITY)
    ) {
      photoRoutine(config.PROBE_COMMANDS.TAKE_PHOTO_NIGHT_MODE);
    }
  }, config.TAKE_PHOTO_INTERVAL);

  setInterval(checkDefaultRoutines, config.CHECK_ROUTINES);
}

function temperatureRoutine() {
  getSystemTemperature
    .getTemperature()
    .then(temperature => {
      // Send a warning in case of temperature is very high
      const simpleTemperature = parseInt(temperature.replace('°C', ''));
      if (simpleTemperature > 70) {
        botMessageController.sendMessage(
          `:warning: The system temperature is very high!`
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
      botMessageController.sendMessage(
        ':red_circle: Error on get system temperature.'
      );
    });
}

function photoRoutine(mode) {
  // Check / Create path for current date
  const currentDate = getSimpleDate();
  const currentTime = getTime();
  createFolder(`${config.IMAGES_PATH}/${currentDate}`);

  let currentExec = exec(mode(currentDate, currentTime), err => {
    currentExec.kill();
    if (err)
      return botMessageController.sendMessage(
        ':red_circle: Error taking photo!'
      );
  });
}

function checkDefaultRoutines() {
  checkExternalIp();
}

function checkExternalIp() {
  console.info('Checking external IP...');
  getIP((err, ip) => {
    if (err) {
      return botMessageController.sendMessage(
        ':red_circle: There was an error trying to get external IP.'
      );
    }
    writeFile(
      `${config.LOG_PATH}/${config.LOG_FILE_NAMES.LAST_VALID_EXTERNAL_IP}`,
      ip
    );
  });
}
