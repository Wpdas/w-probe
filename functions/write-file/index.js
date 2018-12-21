const fs = require('fs');

module.exports = (filename, content) => {
  fs.writeFile(filename, content, err => {
    if (err) {
      return console.error(err);
    }
  });
};
