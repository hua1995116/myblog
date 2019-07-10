const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const marked = require('marked');
const beautify_html = require('js-beautify').html;
const pinyin = require("pinyin");
const moment = require('moment');
const { getColorForString, ColorConverter } = require('./color');

const json = {};
const arr = [];
const tagjson = {};
const url = [];
const pageSize = 10;

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

        genPage(json, tagjson);

        genTagPage(tagjson);

        // console.log(url); // seo
        // fs.writeFile('./json/url.txt', url.join('\n'), err => {
        //   if (err) {
        //     throw err;
        //   } else {
        //     console.log(`txt success`);
        //   }
        // });  
      })
    }
  });
}

function genTagPage(tagjson) {
  const keys = Object.keys(tagjson);
  let html = '';
  const sum = arr.length;
  const tagLength = keys.length;
  keys.forEach((key, index) => {
    const item = tagjson[key];
    singleTag(key, item);
    const length = item.length;
    const percent = +(length / sum).toFixed(2) * 3;
    const fontSize = handleText(percent);
    const rgbaColor = getColorForString(`rgba(76, 0, 255, ${percent})`);
    const backgroundColor = getColorForString( '#5badf0' );
    const result = ColorConverter.convertToHex( rgbaColor,  backgroundColor);
    const color = result.toHex();
    html += `<a href="/blog/tags/${key}" style="font-size: ${fontSize}px; color: #${color}">${key}</a>`;
  });
  const tagTemplate = fs.readFileSync('./html/tag.html').toString();
  fs.writeFileSync('./blog/tags/index.html', tagTemplate.replace('@tag-count', tagLength).replace('@tag-context', html));
}

function singleTag(key, tagItem) {
  fsExtra.mkdirpSync(`./blog/tags/${key}`);
  let html = '';
  tagItem.forEach(item => {
    html += `<div class="article-item"><time class="article-item__time">${moment(item.time).format('YYYY-MM-DD')}</time><a class="article-item__title" href="/blog/article/${item.fileName}">${item.title}</a></div>`
  });
  const singltTemplate = fs.readFileSync('./html/singleTag.html').toString();
  fs.writeFileSync(`./blog/tags/${key}/index.html`, singltTemplate.replace('@tag-type', key).replace('@tag-context', html));
}

function handleText(value) {
  const size = 12 +  2 * value * 1 * 24;
  if(size > 36) {
    return 36;
  }
  return size;
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
    if (json[`list${i}`].length === pageSize) {
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
            title = lines[0] && lines[0].replace('name:', '');
            tag = lines[1] && lines[1].split(':')[1];
            description = lines[2] && lines[2].replace('description:', '');
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
            // console.log(title);
            const pinyinResult = pinyin(title, {
              style: pinyin.STYLE_NORMAL
            });
            const pinyinTitle = pinyinResult.map(item => item[0]).filter(item => item!== ' ').join('-').replace(/\s/g, '');

            const articleDir = `./blog/article/${pinyinTitle}`;
            fsExtra.mkdirp(articleDir);
            fs.writeFile(`${articleDir}/index.html`, beautify_html(template, {indent_size: 2}), err => {
              if (err) {
                throw err;
              } else {
                // console.log(`${title} success`);
                handleToJson(pinyinTitle, title, tag, description, date);
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
  const time = new Date(date).getTime();
  // url.push(`http://yifenghua.win/html/${fileName}.html`);
  arr.push({
    fileName,
    title,
    tag,
    description,
    date,
    time
  });
}



function genPage(pageData) {
  const pagelist = Object.keys(pageData);

  const context = handleHhtml(pageData[pagelist[0]]);
  const pageTemplate = fs.readFileSync('./html/index.html').toString();
  const [prev, next] = handlePageSize(1, pagelist.length);
  const pageItem = pageTemplate.replace('@context', context).replace('@prev', prev).replace('@next', next);
  const pageDir = `./blog`
  fs.writeFileSync(`${pageDir}/index.html`, pageItem);

  for(let i = 0; i < pagelist.length; i++) {
    const context = handleHhtml(pageData[pagelist[i]]);
    // const tags = handletag(tagData);
    const pageTemplate = fs.readFileSync('./html/index.html').toString();
    const [prev, next] = handlePageSize(i + 1, pagelist.length);
    const pageItem = pageTemplate.replace('@context', context).replace('@prev', prev).replace('@next', next);
    const pageDir = `./blog/page/${i + 1}`
    fsExtra.mkdirpSync(pageDir);
    fs.writeFileSync(`${pageDir}/index.html`, pageItem);
  }

  // function handletag(taglist) {
  //   var html = '';
  //   for(var i in taglist) {
  //     html += '<div class="person-tag-list">'+i+'</div>';
  //   }
  //   return html;
  // }

  function handlePageSize(current, total) {
    let prev = -1;
    let next = 0;
    if(current !== 1) {
      prev = current - 1;
    }
    if(total - current > 0) {
      next = current + 1;
    } 
    return [prev, next];
  }

  function handleHhtml(data) {
    function handleTag(tag) {
      var html = '';
      tag = tag.split(',')
      for(var i = 0; i < tag.length; i++) {
        html += '<span class="span_button">'+tag[i]+'</span>'
      }
      return html;
    }
    
    let html = '';
    for(let i = 0; i < data.length; i ++) {
      html += '<div class="list" data-scroll-reveal="enter bottom">'+
                '<div class="header"><a href="/blog/article/'+data[i].fileName+'"><h1>'+data[i].title+'</h1></a></div>'+
                '<div class="timer">'+data[i].date+'</div>'+
                '<div class="type clear">'+
                  handleTag(data[i].tag)+
                '</div>'+
                '<div class="content">'+data[i].description+'</div>'+
              '</div>';
    }
    return html;
  }
  
}