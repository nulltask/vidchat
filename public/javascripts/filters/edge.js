onmessage = function(e) {
  var data = e.data
    , quant = []
    , edge = [];
  
  for (var i = 0, n = data.length; i < n; i += 4) {
    var r = data[i] & 0xff
      , g = data[i+1] & 0xff
      , b = data[i+2] & 0xff
      , gray = (r + g + b) / 3;
    
    quant.push(gray & 0xc0);
  }
    
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
      
      edge[i*4] = c;
      edge[i*4+1] = c;
      edge[i*4+2] = c;
      edge[i*4+3] = 255;
    }
  }
  
  postMessage(edge);
};
