(function() {
  var app, express;

  express = require('express');

  app = express();

  app.use(express["static"](__dirname + '/app'));

  app.listen("3000");

  console.log('Server started at http://localhost:3000');

}).call(this);
