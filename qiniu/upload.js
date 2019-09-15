const qiniuNode= require('qiniu-node');
const fs = require('fs');

const qiniu = new qiniuNode({
    accessKey: '',  
    secretKey: '',  // key
    zone: 'Zone_z2', 
    bucket: 'chat',   // bucket name
    dir: 'blog/',     // 
    url: '',
})

const fileList = fs.readdirSync('./qiniu/imgs').map(item => {
  return './qiniu/imgs/' + item;
})

qiniu.upload(fileList); // fileList is a list of local url