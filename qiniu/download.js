const request = require('request');

const fs = require('fs');

const context = fs.readFileSync('./1.json').toString();

const parseJson = JSON.parse(context);

const mapfiles = {}

const filesKeys = Object.keys(parseJson);


(async() => {
  for(let i = 0; i < filesKeys.length; i++) {
    const key = filesKeys[i];
    mapfiles[key] = {};
    const imglist = parseJson[key];

    for(let j = 0; j < imglist.length; j++) {
      const imgurl = imglist[j];
      request
        .get(imgurl)
        .on('response', function(response) {
          console.log(response.statusCode) // 200
          console.log(response.headers['content-type']) // 'image/png'
          let name = +new Date();
          if(response.headers['content-type'] === 'image/png') {
            name += '.png';
          } else if(response.headers['content-type'] === 'image/jpeg') {
            name += '.jpg';
          } else if(response.headers['content-type'] === 'image/gif') {
            name += '.gif';
          }
          mapfiles[key][imgurl] = 'https://s3.qiufengh.com/blog/' + name;
          request.get(imgurl).pipe(fs.createWriteStream(`./qiniu/imgs/${name}`));
        })
    }
    
  }
  setTimeout(() => {
    fs.writeFileSync('2.json',JSON.stringify(mapfiles));
  }, 5 * 1000);
})();