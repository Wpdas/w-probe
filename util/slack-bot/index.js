const SlackBot = require('slackbots');
const actions = require('./actions');
const config = require('../../config');

module.exports = function() {
  // Create a bot
  const bot = new SlackBot({
    token: config.BOT_TOKEN,
    name: 'W Probe'
  });

  // Ready
  bot.on('start', function() {
    bot.postMessageToChannel(
      config.SLACK_CHANNEL,
      'The probe has just woken up.',
      {
        slackbot: true,
        as_user: true
      }
    );
    console.info('WProbe Slack profile activated.');
  });

  // Receive MSG
  bot.on('message', function(data) {
    if (data.type === 'message') {
      console.log('A:', data.text);
      let response = actions(data.text);
      sendResponse(response);
    }
  });

  // Send response
  function sendResponse(response) {
    console.log('sendResponse:', response);
    bot.postMessageToChannel(config.SLACK_CHANNEL, response, {
      as_user: true,
      slackbot: true
    });
  }

  return {
    sendResponse
  };
};
