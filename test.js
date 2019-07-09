function handleText(value) {
  const size = 12 +  value * 1 * 24;
  if(size > 36) {
    return 36;
  }
  return size;
}


console.log(handleText(0.1))

var colorcode = "rgba(0, 0, 0, 0.74)";

var finalCode = rgba2hex(colorcode)

function rgba2hex(orig) {
  var a,
    rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
    alpha = (rgb && rgb[4] || "").trim(),
    hex = rgb ? 
    (rgb[1] | 1 << 8).toString(16).slice(1) +
    (rgb[2] | 1 << 8).toString(16).slice(1) +
    (rgb[3] | 1 << 8).toString(16).slice(1) : orig;
      if (alpha !== "") {
        a = alpha;
      } else {
        a = 01;
      }

      a = Math.round(a * 100) / 100;
        var alpha = Math.round(a * 255);
        var hexAlpha = (alpha + 0x10000).toString(16).substr(-2).toUpperCase();
        hex = hex + hexAlpha;

  return hex;
}

console.log(finalCode);