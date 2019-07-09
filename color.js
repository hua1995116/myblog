var Color = function( red, green, blue, alpha ) {
  var red, green, blue, alpha;
  return {
    red: red,
    green: green,
    blue: blue,
    alpha: alpha,
    toHex: function() {
      function getHexValue( intInput ) {
        var result = intInput.toString(16);
        if( result.length < 2 ) {
          result = '0' + result;
        }
        return result;
      }
      return getHexValue(red) + getHexValue(green) + getHexValue(blue);
    }
  };
};

// Converter which actually does the calculation from rgba to hex.
var ColorConverter = {

  // Converts the given color to a Color object, using the given gbColor in the calculation.
  convertToHex: function( color, bgColor ) {
    var alpha = color.alpha;

    function getTintValue(tint, bgTint) {
      var tmp = Math.floor((1 - alpha ) * bgTint + alpha * tint);
      if( tmp > 255 ) {
        return 255;
      }
      return tmp;
    }

    return new Color(
      getTintValue( color.red, bgColor.red ),
      getTintValue( color.green, bgColor.green ),
      getTintValue( color.blue, bgColor.blue )
    );
  }
};


var ColorStringParser = {

  // Converter for rgb(a) colors
  rgba: function( rgba ) {
    // Strip the rgba-definition off the string.
    rgba = rgba.replace('rgba(', '')
               .replace(')', '')
               .replace(' ', '');

    // Split the rgba string into an array.
    var splittedRgba = rgba.split(',');

    return new Color(
      parseInt( splittedRgba[0], 10 ),
      parseInt( splittedRgba[1], 10 ),
      parseInt( splittedRgba[2], 10 ),
      parseFloat( splittedRgba[3], 10 ) || 1
    );
  },

  // Converter for hex colors
  hex: function( hexString ) {
    hexString = hexString.replace('#', '');
    var rgbArr = [], hexPair;

    function getHexPartByIndex( index ) {
      switch( hexString.length ) {
        case 3:
          return hexString[index] + hexString[index];
        default:
          index *= 2;
          return hexString[index] + hexString[index+1];
      }
    }

    // String the "#" off the hex-string.
    hexString = hexString.replace('#', '');
    
    // Convert pairs of hex-characters into decimal numbers.
    for(var i=0; i < hexString.length; i++) {
      rgbArr.push( parseInt(getHexPartByIndex( i ), 16) );
    }

    return new Color(rgbArr[0], rgbArr[1], rgbArr[2], 1);
  },

  // Converter for hsl(a) colors.
  hsla: function hslToRgb(hsla) {
    hsla = hsla.replace('hsla(', '')
               .replace('hsl(', '')
               .replace(')', '')
               .replace(' ', '');
    // Split the hsla string into an array.
    hsla = hsla.split(',');

    var h = parseInt(hsla[0], 10) / 360;
    var s = parseInt(hsla[1], 10) / 100;
    var l = parseInt(hsla[2], 10) / 100;
    var a = parseFloat(hsla[3], 10) || 1;

    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return new Color(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), a );
  }

};


// Returns the type of color based on the given string.
function getColorType( colorString ) {
  if( colorString.indexOf('rgba') !== -1 || colorString.indexOf('rgb') !== -1 ) {
    return 'rgba';
  }
  if( colorString.indexOf('hsla') !== -1 || colorString.indexOf('hsl') !== -1 ) {
    return 'hsla';
  }
  return 'hex';
}

// Convenience function that returns the Color object for the given inputString.
function getColorForString( inputString ) {
  return ColorStringParser[ getColorType( inputString ) ]( inputString );
}

module.exports = {
  getColorForString,
  ColorConverter
};