# build-plugin-fusion-material

## 功能

本插件能够使用户运行`npm run build`时，自动生成区块或模板的截图与html文件，并保存于`build/views`文件夹下，同时在`package.json`中更新截图与html文件的路径地址。

## 使用方式

首先在`build.json`中引入`build-plugin-fusion-material`；

然后在`package.json`下对`blockConfig`或`scaffoldConfig`的`views`字段进行配置

```
// package.json的blockConfig例子
{
  "blockConfig": {
    "name": "",      // 名称
    "title": "",     // 标题
    "category": "",  // 分类 
    "screenshot": "", // 截图
    "views": [{       // 区块视图，配置此项后会进入fusion cool
        title: "",    // 视图标题
        props: {      // 传入区块上的 参数
        },
        screenshot: "",     // 视图截图，会在build时自动生成
        html: "",      // 视图渲染后html 结构，会在build时自动生成
    }]
  }
}
```

```
// package.json的scaffoldConfig例子
{
  "scaffoldConfig": {
    "name": "",      // 名称
    "title": "",     // 标题
    "category": "",  // 分类 
    "screenshot": "", // 截图
    "views": [{       // 页面，配置此项后会进入fusion cool
      title: "首页",
      path: "#/dashboard/monitor", // 读取路由列表生成，hash路由必须加#
      screenshot: "",             // 页面截图，会在build时自动生成
      html: "",      // 视图渲染后html 结构，会在build时自动生成
    }],      
  }
}
```
