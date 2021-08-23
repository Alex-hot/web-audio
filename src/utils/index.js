/*
 * @Descripttion:
 * @Author: Alex
 * @Date: 2021-08-15 21:34:34
 */
export function getRandomNumberByRange(start, end) {
  return Math.floor(Math.random() * (end - start) + start);
}

export function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
//16进制颜色转为RGB格式,传入16进制颜色代码与透明度
export function colorRgb(color, opacity) {
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/; //十六进制颜色值的正则表达式
  opacity = opacity < 0 ? 0 : opacity; //颜色范围控制
  opacity = opacity > 1 ? 1 : opacity;
  if (color && reg.test(color)) {
    if (color.length === 4) {
      var sColorNew = "#";
      for (var i = 1; i < 4; i += 1) {
        sColorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
      }
      color = sColorNew;
    }
    //处理六位的颜色值
    var sColorChange = [];
    for (var j = 1; j < 7; j += 2) {
      sColorChange.push(parseInt("0x" + color.slice(j, j + 2)));
    }
    return "rgba(" + sColorChange.join(",") + "," + opacity + ")";
  } else {
    return color;
  }
}
