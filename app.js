
/**
 * Module dependencies.
 */

var express = require('express')
  , routes   = require('./routes')
  , socketio = require('socket.io')
  , path     = require('path')
  , os       = require('os')
  , fs       = require('fs')
  , server   = '192.168.1.192'
  , port     = 3000
  , hostname = os.hostname()
  , log = null
  , log_file = '/var/log/syslog';

var app = module.exports = express.createServer();
var io  = socketio.listen(app);

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);

app.get('/error', function(req, res){
  log_file = check_url(path.basename(req.url));
  res.render('logs', {
     title: 'LogWatcher',
     hostname: hostname,
     log: log_file,
     server: server,
     port:   port
  });
});

app.get('/access', function(req, res){
  log_file = check_url(path.basename(req.url));
  res.render('logs', {
     title: 'LogWatcher',
     hostname: hostname,
     log: log_file,
     server: server,
     port:   port
  });
});

function check_url(basename) {
  if (basename.match(/error/)) {
    log_file = '/var/log/apache2/error.log';
  } else if (basename.match(/access/)) {
    log_file = '/var/log/apache2/access.log';
  }

  return log_file;
};

io.sockets.on('connection', function(client) {
  fs.open(log_file, "r", "0666",function(err,fd) {
    console.log('log_file: %s', log_file);
    if (err) { throw err; }

    fs.watchFile(log_file, {interval:1000}, function(cur, prev) {
      if (cur.size !== prev.size) {
        var buf_size = 1024;
        for (var pos=prev.size; pos<cur.size; pos+=buf_size) {
          if (err) { throw err; }
          var buf = new Buffer(buf_size);
          fs.read(fd, buf, 0, buf_size, pos,
            function(err, bytesRead, buffer) {
              log = buffer.toString('utf8', 0, bytesRead);
              client.emit('change', log);
            }
          );
        }
      }
    });
  });
});

app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
