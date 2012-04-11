
/*
 * GET home page.
 */

var config   = require('config');
var server   = config.server.host;
var port     = config.server.port;
var title    = config.site.title;
var url      = config.site.url;

exports.index = function(req, res){
  res.render('index', { 
    title: title,
    url: url,
    server: server,
    port:   port
   });
};

