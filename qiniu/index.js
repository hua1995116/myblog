const fs = require('fs');
const path = require('path');

const root = './notes';

const filesMap = {};

const files = fs.readdirSync(root);

files.map(item => {
  const current = path.join(root, item);
  const context = fs.readFileSync(current).toString();
  const reg = /(\((http:\/\/img\.blog\.csdn\.net\/.+)\))/g;
  let data = context.match(reg);
  if(data) {
    filesMap[current] = data.map(item => {
      return item.replace('(', '').replace(')', '');
    })
  }
});

fs.writeFileSync('./1.json', JSON.stringify(filesMap));