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
      , audio = document.getElementById('microphone')
      , canvas = document.getElementById('capture')
      , receive = document.getElementById('receive');

    socket.emit('hello', { hello: 'world' });
    socket.on('capture', function(data) {
      receive.src = data;
    });

    if (!getUserMedia) {
      alert('your browser unsupported webrtc.');
      return false;
    }
        
    navigator.webkitGetUserMedia('video', function(stream) {
      video.src = webkitURL.createObjectURL(stream);
      video.onerror = function () {
        stream.stop();
      };
    });
    
    $(video).on('timeupdate', function(e) {
      var ctx = canvas.getContext('2d')
        , imageData;
      
      ctx.drawImage(video, 0, 0);
      socket.emit('capture', canvas.toDataURL());
      // imageData = ctx.getImageData(0, 0, 320, 240);
      // for (var i = 0; i < imageData.length; ++i) {
        // console.log(i);
      // }
    });
    
  });
  
}(window, document, jQuery);
