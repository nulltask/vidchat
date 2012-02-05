!function(window, document, $, undefined) {

  var getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.MozGetUserMedia ||
    navigator.oGetUserMedia ||
    navigator.msGetUserMedia
   , socket = io.connect();
    
  $(function() {
    var video = document.getElementById('monitor')
      , canvas = document.getElementById('capture')
      , receive = document.getElementById('receive');

    socket.emit('hello', { hello: 'world' });
    socket.on('capture', function(data) {
      receive.src = data;
    });

    if (!getUserMedia) {
      // alert('your browser unsupported webrtc.');
      return false;
    }
        
    navigator.webkitGetUserMedia('video audio', function(stream) {
      video.src = webkitURL.createObjectURL(stream);
      video.onerror = function () {
        stream.stop();
      };
    });
    
    $(video).on('timeupdate', function(e) {
      var ctx = canvas.getContext('2d')
        , imageData, edge, quant = [];
      
      ctx.drawImage(video, 0, 0);
      imageData = ctx.getImageData(0, 0, 320, 240);
      
      for (var i = 0, n = imageData.data.length; i < n; i += 4) {
        var r = imageData.data[i] & 0xff
          , g = imageData.data[i+1] & 0xff
          , b = imageData.data[i+2] & 0xff
          , gray = (r + g + b) / 3;
        
        quant.push(gray & 0xc0);
      }
      
      edge = ctx.createImageData(320, 240);
      
      for (var y = 1; y < 240 - 1; ++y) {
        for (var x = 1; x < 320 - 1; ++x) {
          var i = y * 320 + x
            , c
            , around = (quant[i-320] + quant[i-1] + quant[i+1] + quant[i+320]) / 4;

          if (around < quant[i]) {
            c = 0;
          } else {
            c = 255;
          }
          
          edge.data[i*4] = c;
          edge.data[i*4+1] = c;
          edge.data[i*4+2] = c;
          edge.data[i*4+3] = 255;
        }
      }
      
      ctx.putImageData(edge, 0, 0);
      socket.emit('capture', canvas.toDataURL());
    });
    
  });
  
}(window, document, jQuery);
