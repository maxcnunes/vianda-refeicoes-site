var Spreadsheet = require('edit-google-spreadsheet');

module.exports = {
  get: function (cb) {
    Spreadsheet.load({
      // debug: true,
      spreadsheetId: process.env.SPREADSHEET_ID,
      worksheetId: process.env.WORKSHEET_ID,
      oauth : {
        email: process.env.OAUTH_EMAIL,
        keyFile: process.env.OAUTH_KEYFILE
      }
    }, function sheetReady(err, spreadsheet) {
      if(err) return cb(err);

      spreadsheet.receive(cb);
    });
  }
};