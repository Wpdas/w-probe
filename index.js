const exec = require('child_process').exec;
const createFolder = require('./functions/create-folder');
const getSystemTemperature = require('./functions/get-system-temperature');
const getSimpleDate = require('./functions/get-simple-date');
const writeFile = require('./functions/write-file');
const config = require('./config');

// Initial settings
config.SYSTEM_PATH = __dirname;
config.IMAGES_PATH = `${config.SYSTEM_PATH}/images`;
config.LOG_PATH = `${config.SYSTEM_PATH}/log`;
createFolder(config.IMAGES_PATH);
createFolder(config.LOG_PATH);
// temperatureRoutine();
// photoRoutine();

const currentDate = getSimpleDate();
console.log(config.PROBE_COMMANDS.TAKE_PHOTO_NIGHT_MODE(currentDate));

// Initialize Default Routines
setInterval(() => {
  temperatureRoutine();
}, config.SAVE_LOG_INTERVAL);

setInterval(() => {
  photoRoutine();
}, config.TAKE_PHOTO_INTERVAL * 12); // 1 hora (remover esse 12)

function temperatureRoutine() {
  getSystemTemperature
    .getTemperature()
    .then(temperature => {
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
      console.info('Error on get system temperature.');
    });
}

function photoRoutine() {
  // Check / Create path for current date
  const currentDate = getSimpleDate();
  createFolder(`${config.IMAGES_PATH}/${currentDate}`);

  let currentExec = exec(
    config.PROBE_COMMANDS.TAKE_PHOTO_NIGHT_MODE(currentDate),
    (err, stdout) => {
      currentExec.kill();
      if (err) return console.error('Error taking photo!');
      console.info('The photo is done: ', stdout);
    }
  );
}
