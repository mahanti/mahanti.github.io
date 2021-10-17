function hexerator(rgb) {
 var hexDigits = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
   function hex(x) {
     return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
   }
     return hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
   };
