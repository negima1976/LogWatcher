
/*
 * GET home page.
 */

var config   = require('config');
var server   = config.server.host;
var port     = config.server.port;
var title    = config.site.title;

exports.index = function(req, res){
  res.render('index', { 
    title: title,
    server: server,
    port:   port
   });
};

