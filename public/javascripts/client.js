var warning = /(Warning)/;
var critical = /(Parse|Segmentation|Fatal)/;

$(document).ready(function() {
  var socket = io.connect('http://'+ server + ':'+ port);
  
    socket.on('connect', function() {
        console.log('connect');
    });

    socket.on('disconnect', function(){
        console.log('disconnect');
    });
    
    socket.on('change', function(log) {
      console.log('change:' + log);
      if (log.match(warning)) {
        $('pre#log').append(
          "<div class='alert'><p>" + log + "</p></div>"
        );
      } else if (log.match(critical)) {
        $('pre#log').append(
          "<div class='alert alert-error'><p>" + log + "</p></div>"
        );
      } else {
        $('pre#log').append(log);
      }
    });
});
