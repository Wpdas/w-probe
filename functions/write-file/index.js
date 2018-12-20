const fs = require('fs');

module.exports = (filename, content) => {
  console.log();

  fs.writeFile(filename, content, function(err) {
    if (err) {
      return console.log(err);
    }
  });
};
