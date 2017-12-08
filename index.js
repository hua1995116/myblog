const path = require('path');
const fs = require('fs');
const marked = require('marked');
const beautify_html = require('js-beautify').html;
const json = {};
const arr = [];
const tagjson = {};
const url = [];

// 解析目录
const filePath = path.resolve('./notes');
// 调用文件遍历方法
fileDisplay(filePath);

/**
 * 文件遍历方法
 * @param filePath 需要遍历的文件路径
 */
function fileDisplay(filePath) {
  //根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, function (err, files) {
    if (err) {
      console.warn(err);
    } else {
      //遍历读取到的文件列表
      Promise.all(files.map(handlePromise)).then(() => {
        
        handleTagJson();

        handlePagesJson();

        fs.writeFile('./json/tagdata.json', JSON.stringify(tagjson), err => {
          if(err) {
            throw err;
          } else {
            console.log('tagjson success');
          }
        });

        fs.writeFile(`./json/data.json`, JSON.stringify(json), err => {
          if (err) {
            throw err;
          } else {
            console.log(`json success`);
          }
        });
        console.log(url);
        fs.writeFile('./json/url.txt', url.join('\n'), err => {
          if (err) {
            throw err;
          } else {
            console.log(`txt success`);
          }
        });  
      })
    }
  });
}

function handleTagJson() {
  for(let i = 0; i < arr.length; i++) {
    if(!!arr[i]['tag']) {
      const tagList = arr[i]['tag'].split(',');
      for(let k = 0; k < tagList.length; k++) {
        tagList[k] = tagList[k].trim();
      }
      for(let j = 0; j < tagList.length; j++) {
        if(tagjson[tagList[j]]) {
          tagjson[tagList[j]].push(arr[i]);
        } else {
          tagjson[tagList[j]] = [];
          tagjson[tagList[j]].push(arr[i]);
        }    
      }
    }
  }
}

function handlePagesJson() {
  arr.sort(function (a, b) {
    return b.time - a.time;
  })
  let i = 0;
  for(var j = 0; j < arr.length; j++) {
    if (!json[`list${i}`]) {
      json[`list${i}`] = [];
    }
    json[`list${i}`].push(arr[j]);
    if (json[`list${i}`].length === 10) {
      i++;
    }
  }
}

/**
 * 
 * 
 * @param {any} filename 
 * @returns 
 */
function handlePromise(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile('./template.html', 'utf8', (err, template) => {
      if (err) {
        throw err;
      } else {
        fs.readFile(`./notes/${filename}`, 'utf8', (err, markContent) => {
          if (err) {
            throw err;
          } else {
            // 转化好的html字符串
            const lines = markContent.split('\n');
            let fileName, tag, description, date, title;

            fileName = filename.split('.')[0];
            title = lines[0] && lines[0].split(':')[1];
            tag = lines[1] && lines[1].split(':')[1];
            description = lines[2] && lines[2].split(':')[1];
            date = fileName;

            const tagintoHTML = handleTagLoop(tag);
            // 删除前面3行
            lines.shift();
            lines.shift();
            lines.shift();
            // 内容
            let htmlStr = marked(lines.join('\n').toString());
            // 将html模板文件中的 '@markdown' 替换为html字符串
            template = template.replace('@markdown', htmlStr);
            template = template.replace(/\@markname/g, title);
            template = template.replace('@marktag', tagintoHTML);
            template = template.replace('@marktime', date);

            // template = template.replace('<pre>', '<pre class="brush: js;">')
            // 将新生成的字符串template重新写入到文件中
            fs.writeFile(`./html/${fileName}.html`, beautify_html(template, {indent_size: 2}), err => {
              if (err) {
                throw err;
              } else {
                console.log(`${title} success`);
                handleToJson(fileName, title, tag, description, date);
                resolve();
              }
            });
          }
        })
      }
    })
  })
}


function handleTagLoop(tag) {
  let tagintoHTML = '';
  let tagList = tag.split(',');
  for (let i = 0; i < tagList.length; i++) {
    tagintoHTML += `<span class="span_button">${tagList[i]}</span>`;
  }
  return tagintoHTML;
}

function handleToJson(fileName, title, tag, description, date) {
  const time = new Date(fileName).getTime();
  url.push(`http://yifenghua.win/html/${fileName}.html`);
  arr.push({
    fileName: `${fileName}.html`,
    title,
    tag,
    description,
    date,
    time
  });
}




