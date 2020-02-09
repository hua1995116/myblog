const fs = require('fs');

const template = fs.readFileSync('./template/template.md').toString();

const date = new Date();

const year = date.getFullYear();

const month = date.getMonth();

const day = date.getDate();

fs.writeFileSync(`./notes/${year}-${(month+1) > 10 ? (month + 1) : '0' + month }-${day > 10 ? day : '0' + day}.md`, template);