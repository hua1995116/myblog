const pinyin = require("pinyin");

const pinyinResult = pinyin('教你如何搭建一个自动化构建的博客', {
  style: pinyin.STYLE_NORMAL
});

const pinyinTitle = pinyinResult.map(item => item[0]).filter(item => item!== '').join('-');

console.log(pinyinTitle);