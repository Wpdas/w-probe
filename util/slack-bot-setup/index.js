const actions = require('./actions');

module.exports = function(
  slackInstance,
  config,
  takePhotoNightSolarModeFunction,
  takePhotoDayModeFunction
) {
  // Init Actions
  const actionsInstance = actions(
    takePhotoNightSolarModeFunction,
    takePhotoDayModeFunction
  );

  // Receive MSG
  slackInstance.on('message', function(data) {
    if (data.user !== 'UF10LCJRL' && data.type === 'message') {
      let response = actionsInstance.process(data.text);
      sendResponse(response);
    }
  });

  // Send response
  function sendResponse(response) {
    slackInstance.postMessageToChannel(config.SLACK_CHANNEL, response, {
      as_user: true,
      slackbot: true
    });
  }

  return {
    sendMessage: sendResponse
  };
};
