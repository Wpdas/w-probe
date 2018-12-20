module.exports = {
  SAVE_LOG_INTERVAL: 315000, // 5 minutes 15 seconds
  TAKE_PHOTO_INTERVAL: 300000, // 5 minutes
  CHECK_ROUTINES: 43200000, // 12 Hours (used to check other routines such as backup for example)
  TIME_LOW_ACTIVITY: '05:30:00', // low activity this time on
  TIME_HIGHT_ACTIVITY: '19:00:00', // hight activity this time on
  SYSTEM_PATH: '',
  IMAGES_PATH: '',
  LOG_PATH: '',
  LOG_FILE_NAMES: {
    TEMPERATURE: 'temperature.dat',
    LAST_BACKUP: 'last-backup.dat',
    LIST_FILES_AVAILABLE: 'list-files-available.dat'
  },
  PROBE_COMMANDS: {
    TAKE_PHOTO_NIGHT_MODE: (path, filename) => {
      return `cd ${
        module.exports.IMAGES_PATH
      } && raspistill -ISO 800 -ss 6000000 -br 55 -co 45 -drc high -rot 180 -a 12 -a "WProbe:" -o ${path}/image${filename}.jpg`;
    },
    TAKE_PHOTO_DAY_MODE: (path, filename) => {
      return `cd ${
        module.exports.IMAGES_PATH
      } && raspistill -rot 180 -a 12 -a "WProbe:" -o ${path}/image${filename}.jpg`;
    }
  }
};
