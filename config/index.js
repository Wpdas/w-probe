module.exports = {
  BOT_TOKEN: '---------------',
  SLACK_CHANNEL: 'wprobe_activity',
  SAVE_LOG_INTERVAL: 315000, // 5 minutes 15 seconds
  TAKE_PHOTO_INTERVAL: 1500000, // 25 minutes
  CHECK_ROUTINES: 43200000, // 12 Hours (used to check other routines such as backup for example)
  TIME_LOW_ACTIVITY: 5, // 5:00hs low activity this time on
  TIME_HIGHT_ACTIVITY: 20, // 20:00hs hight activity this time on
  SYSTEM_PATH: '',
  IMAGES_PATH: '',
  LOG_PATH: '',
  LOG_FILE_NAMES: {
    TEMPERATURE: 'temperature.dat',
    LAST_BACKUP: 'last-backup.dat',
    LIST_FILES_AVAILABLE: 'list-files-available.dat',
    LAST_VALID_EXTERNAL_IP: 'last-valid-external-ip.dat'
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
