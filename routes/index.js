
/*
 * GET home page.
 */

var server   = '192.168.1.192';
var port     = 3000;

exports.index = function(req, res){
  res.render('index', { 
    title: 'LogCatcher',
    server: server,
    port:   port
   });
};

