# myblog

一个自动化构建的博客。

```Git
git clone https://github.com/hua1995116/myblog
```

将需要写的.md文件放到notes目录下，

```

// 安装依赖
npm install
// 编译
node index.js
// 本地查看
node http.js
```

发版编译只需要运行
```

node index.js
```


.md文件格式如下
前三行

name: // 文章的标题

tag:  // 标签 | 用 , 分割

description:  // 描述 



