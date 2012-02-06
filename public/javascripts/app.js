!function(window, document, $, undefined) {

  var socket = io.connect()
    , getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.MozGetUserMedia ||
    navigator.oGetUserMedia ||
    navigator.msGetUserMedia;
    
  $(function() {
    var video = document.getElementById('monitor')
      , canvas = document.getElementById('capture')
      , receive = document.getElementById('receive')
      , filter = new Worker('/javascripts/filters/edge.js');

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
      video.addEventListener('error', function () {
        stream.stop();
      });
    });
    
    $(video).on('timeupdate', function(e) {
      var ctx = canvas.getContext('2d')
        , imageData, edge, quant = [];
      
      ctx.drawImage(video, 0, 0);
      filter.postMessage(Array.prototype.slice.call(ctx.getImageData(0, 0, 320, 240).data, 0));
    });
    
    filter.addEventListener('message', function(e) {
      var ctx = canvas.getContext('2d')
        , data = e.data
        , imageData = ctx.createImageData(320, 240);
      
      for (var i = 0; i < data.length; ++i) {
        imageData.data[i] = data[i];
      }
      
      ctx.putImageData(imageData, 0, 0);
      socket.emit('capture', canvas.toDataURL());
    });
  });
  
}(window, document, jQuery);
