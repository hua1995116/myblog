const fs = require('fs');

const filesMap = JSON.parse(fs.readFileSync('./2.json').toString());

const keys = Object.keys(filesMap);

keys.map(item => {
  const replaceList = filesMap[item];
  let context = fs.readFileSync(item).toString();

  Object.keys(replaceList).map(before => {
    context = context.replace(before, replaceList[before]);
  })

  fs.writeFileSync(item, context);
})