"use strict";(self.webpackChunkicepkg_site=self.webpackChunkicepkg_site||[]).push([[546],{8570:(e,n,t)=>{t.d(n,{Zo:()=>s,kt:()=>k});var l=t(79);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);n&&(l=l.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,l)}return t}function r(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function o(e,n){if(null==e)return{};var t,l,i=function(e,n){if(null==e)return{};var t,l,i={},a=Object.keys(e);for(l=0;l<a.length;l++)t=a[l],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(l=0;l<a.length;l++)t=a[l],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var p=l.createContext({}),m=function(e){var n=l.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):r(r({},n),e)),t},s=function(e){var n=m(e.components);return l.createElement(p.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return l.createElement(l.Fragment,{},n)}},u=l.forwardRef((function(e,n){var t=e.components,i=e.mdxType,a=e.originalType,p=e.parentName,s=o(e,["components","mdxType","originalType","parentName"]),u=m(t),k=i,c=u["".concat(p,".").concat(k)]||u[k]||d[k]||a;return t?l.createElement(c,r(r({ref:n},s),{},{components:t})):l.createElement(c,r({ref:n},s))}));function k(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var a=t.length,r=new Array(a);r[0]=u;var o={};for(var p in n)hasOwnProperty.call(n,p)&&(o[p]=n[p]);o.originalType=e,o.mdxType="string"==typeof e?e:i,r[1]=o;for(var m=2;m<a;m++)r[m]=t[m];return l.createElement.apply(null,r)}return l.createElement.apply(null,t)}u.displayName="MDXCreateElement"},1201:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>p,contentTitle:()=>r,default:()=>d,frontMatter:()=>a,metadata:()=>o,toc:()=>m});var l=t(7583),i=(t(79),t(8570));const a={},r="\u6784\u5efa\u914d\u7f6e",o={unversionedId:"reference/config",id:"reference/config",title:"\u6784\u5efa\u914d\u7f6e",description:"\u914d\u7f6e\u6587\u4ef6",source:"@site/docs/reference/config.md",sourceDirName:"reference",slug:"/reference/config",permalink:"/reference/config",draft:!1,editUrl:"https://github.com/ice-lab/icepkg/tree/main/website/docs/docs/reference/config.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"CLI",permalink:"/reference/cli"},next:{title:"\u5f00\u53d1\u63d2\u4ef6",permalink:"/reference/plugins-development"}},p={},m=[{value:"\u914d\u7f6e\u6587\u4ef6",id:"\u914d\u7f6e\u6587\u4ef6",level:2},{value:"\u5b8c\u6574\u914d\u7f6e\u9879",id:"\u5b8c\u6574\u914d\u7f6e\u9879",level:2},{value:"entry",id:"entry",level:3},{value:"alias",id:"alias",level:3},{value:"define",id:"define",level:3},{value:"sourceMaps",id:"sourcemaps",level:3},{value:"jsxRuntime",id:"jsxruntime",level:3},{value:"generateTypesForJs",id:"generatetypesforjs",level:3},{value:"plugins",id:"plugins",level:3},{value:"transform",id:"transform",level:3},{value:"formats",id:"formats",level:4},{value:"excludes",id:"excludes",level:4},{value:"bundle",id:"bundle",level:3},{value:"formats",id:"formats-1",level:4},{value:"modes",id:"modes",level:4},{value:"name",id:"name",level:4},{value:"externals",id:"externals",level:4},{value:"minify",id:"minify",level:4},{value:"polyfill",id:"polyfill",level:4},{value:"compileDependencies",id:"compiledependencies",level:4},{value:"development",id:"development",level:4}],s={toc:m};function d(e){let{components:n,...t}=e;return(0,i.kt)("wrapper",(0,l.Z)({},s,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"\u6784\u5efa\u914d\u7f6e"},"\u6784\u5efa\u914d\u7f6e"),(0,i.kt)("h2",{id:"\u914d\u7f6e\u6587\u4ef6"},"\u914d\u7f6e\u6587\u4ef6"),(0,i.kt)("p",null,"\u82e5\u5e0c\u671b\u5bf9 ICE PKG \u7684\u80fd\u529b\u8fdb\u884c\u914d\u7f6e\uff0c\u63a8\u8350\u5728\u9879\u76ee\u6839\u76ee\u5f55\u4e2d\u6dfb\u52a0\u540d\u4e3a ",(0,i.kt)("inlineCode",{parentName:"p"},"build.config.mts")," \u7684\u914d\u7f6e\u6587\u4ef6\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:"title=build.config.mts",title:"build.config.mts"},"import { defineConfig } from '@ice/pkg';\n\n// \u4f7f\u7528 defineConfig \u5de5\u5177\u51fd\u6570\u4ee5\u83b7\u5f97\u66f4\u597d\u7684\u7c7b\u578b\u63d0\u793a\nexport default defineConfig({\n  // \u914d\u7f6e\u9009\u9879\n});\n")),(0,i.kt)("p",null,"\u6ce8\uff1aICE PKG \u652f\u6301\u7684\u914d\u7f6e\u6587\u4ef6\u7c7b\u578b\u5305\u62ec\uff1a"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"build.config.mts")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"build.config.mjs")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"build.config.ts")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"build.config.js")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"build.json"))),(0,i.kt)("h2",{id:"\u5b8c\u6574\u914d\u7f6e\u9879"},"\u5b8c\u6574\u914d\u7f6e\u9879"),(0,i.kt)("h3",{id:"entry"},"entry"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\u7c7b\u578b\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"string | string[] | { [entryAlias: string]: string }")),(0,i.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4\u503c\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"'./src/index'"))),(0,i.kt)("p",null,"\u6307\u5b9a\u6784\u5efa\u5165\u53e3\u3002\u652f\u6301\u914d\u7f6e\u5355\u5165\u53e3\u6216\u8005\u591a\u4e2a\u5165\u53e3\u3002"),(0,i.kt)("p",null,"\u6307\u5b9a\u5355\u4e2a\u5165\u53e3\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="build.config.mts"',title:'"build.config.mts"'},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  entry: './src/index',\n});\n")),(0,i.kt)("p",null,"\u6307\u5b9a\u591a\u4e2a\u5165\u53e3\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="build.config.mts"',title:'"build.config.mts"'},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  // \u6570\u7ec4\u5f62\u5f0f\n  entry: ['./src/foo', './src/bar'],\n  // \u5bf9\u8c61\u5f62\u5f0f\uff0ckey \u503c\u4f5c\u4e3a chunk name\n  entry: {\n    foo: './src/foo',\n    bar2: './src/bar'\n  }\n});\n")),(0,i.kt)("h3",{id:"alias"},"alias"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\u7c7b\u578b\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"Record<string, string>")),(0,i.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4\u503c\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"{}"))),(0,i.kt)("p",null,"\u6bd4\u5982\uff0c\u5c06 ",(0,i.kt)("inlineCode",{parentName:"p"},"@")," \u6307\u5411 ",(0,i.kt)("inlineCode",{parentName:"p"},"./src")," \u76ee\u5f55\u3002"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="build.config.mts"',title:'"build.config.mts"'},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  alias: {\n    '@': './src',\n  },\n});\n")),(0,i.kt)("p",null,"\u7136\u540e\u4ee3\u7801\u91cc ",(0,i.kt)("inlineCode",{parentName:"p"},"import '@/foo'")," \u4f1a\u88ab\u6539\u6210 ",(0,i.kt)("inlineCode",{parentName:"p"},"import '/path/to/your/project/foo'"),"\u3002"),(0,i.kt)("h3",{id:"define"},"define"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\u7c7b\u578b\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"Record<string, string | boolean | number | object | null>")),(0,i.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4\u503c\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"{ __DEV__: 'true' | 'false', 'process.env.NODE_ENV': '\"development\"' | '\"production\"' }"))),(0,i.kt)("p",null,"\u5b9a\u4e49\u7f16\u8bd1\u65f6\u73af\u5883\u53d8\u91cf\uff0c\u4f1a\u5728\u7f16\u8bd1\u65f6\u88ab\u66ff\u6362\u3002\u6ce8\u610f\uff1a\u5c5e\u6027\u503c\u4f1a\u7ecf\u8fc7\u4e00\u6b21 ",(0,i.kt)("inlineCode",{parentName:"p"},"JSON.stringify()")," \u8f6c\u6362\u3002"),(0,i.kt)("p",null,"\u4f8b\u5982\uff0c\u5e0c\u671b\u5728\u4ee3\u7801\u4e2d\u6ce8\u5165\u7248\u672c\u53f7\uff0c\u7528\u5168\u5c40\u53d8\u91cf ",(0,i.kt)("inlineCode",{parentName:"p"},"__VERSION__")," \u6765\u66ff\u4ee3\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="build.config.mts"',title:'"build.config.mts"'},"import pkg from './package.json' assert { type: 'json' };\nimport { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  define: {\n    '__VERSION__': pkg.version,\n  },\n});\n")),(0,i.kt)("p",null,"\u5728\u7f16\u8bd1\u65f6\uff0c\u6240\u6709 ",(0,i.kt)("inlineCode",{parentName:"p"},"__VERSION__")," \u90fd\u4f1a\u88ab\u66ff\u6362\u4e3a\u9879\u76ee\u7684\u7248\u672c\u53f7\u3002"),(0,i.kt)("admonition",{type:"tip"},(0,i.kt)("p",{parentName:"admonition"},"\u5728 TS \u9879\u76ee\u4e2d\uff0c\u9700\u8981\u5728 ",(0,i.kt)("inlineCode",{parentName:"p"},"typings.d.ts")," \u6216\u5176\u4ed6\u7c7b\u578b\u58f0\u660e\u6587\u4ef6\u4e2d\uff0c\u58f0\u660e ",(0,i.kt)("inlineCode",{parentName:"p"},"define")," \u6240\u8bbe\u7f6e\u7684\u5c5e\u6027\uff0c\u4ee5\u4fbf\u901a\u8fc7\u7c7b\u578b\u68c0\u67e5\uff0c\u5e76\u83b7\u5f97\u7c7b\u578b\u63d0\u793a\u3002\u6bd4\u5982\uff1a"),(0,i.kt)("pre",{parentName:"admonition"},(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:"title=typings.d.ts",title:"typings.d.ts"},"declare const __VERSION__: string\n"))),(0,i.kt)("p",null,"ICE PKG \u9ed8\u8ba4\u6ce8\u5165\u4e86 ",(0,i.kt)("inlineCode",{parentName:"p"},"__DEV__")," \u5168\u5c40\u53d8\u91cf\uff0c\u7528\u4e8e\u6807\u8bc6\u5f00\u53d1\u6001\u73af\u5883\u3002\u8fd9\u4e2a\u53d8\u91cf\u5728\u8f93\u51fa\u4e00\u4e9b\u4ec5\u5728 development \u73af\u5883\u7684\u4fe1\u606f\u65f6\u975e\u5e38\u6709\u7528\u3002\u6bd4\u5982\uff0c\u8f93\u51fa\u5728\u7528\u6237\u5f00\u53d1\u6001\u624d\u663e\u793a\u7684\u8b66\u544a\u4fe1\u606f\u3002"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:"title=index.ts",title:"index.ts"},"if (__DEV__) {\n  console.warn('\u8bf7\u6ce8\u610f\uff0c\u8fd9\u53ef\u80fd\u4f1a\u4ea7\u751f\u9519\u8bef\uff01');\n}\n")),(0,i.kt)("admonition",{title:"\u53d1\u751f\u4e86\u4ec0\u4e48\uff1f",type:"info"},(0,i.kt)("p",{parentName:"admonition"},"\u5b9e\u9645\u4e0a\uff0c\u5728\u7f16\u8bd1\u65f6\uff0c",(0,i.kt)("inlineCode",{parentName:"p"},"__DEV__")," \u4f1a\u88ab\u66ff\u6362\u4e3a ",(0,i.kt)("inlineCode",{parentName:"p"},"process.env.NODE_ENV !== 'production'"),"\u3002")),(0,i.kt)("h3",{id:"sourcemaps"},"sourceMaps"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\u7c7b\u578b\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"boolean | 'inline'")),(0,i.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4\u503c\uff1astart \u9636\u6bb5\u9ed8\u8ba4\u4e3a ",(0,i.kt)("inlineCode",{parentName:"li"},"true"),"\uff0cbuild \u9636\u6bb5\u9ed8\u8ba4\u4e3a ",(0,i.kt)("inlineCode",{parentName:"li"},"false"))),(0,i.kt)("p",null,"\u662f\u5426\u751f\u6210 sourcemap\uff0c\u8fd9\u5728\u4ee3\u7801\u8c03\u8bd5\u7684\u65f6\u5019\u975e\u5e38\u6709\u7528\u3002"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  sourceMaps: true,\n});\n")),(0,i.kt)("p",null,"\u8fd9\u4f1a\u4e3a\u6240\u6709\u4ea7\u7269\u989d\u5916\u8f93\u51fa ",(0,i.kt)("inlineCode",{parentName:"p"},".js.map")," \u6587\u4ef6\u3002\u5982\u679c\u4f60\u60f3\u8981 sourcemap \u662f\u5185\u8054\u5728\u6e90\u7801\u4e2d\u7684\uff0c\u53ef\u5c06\u9009\u9879\u914d\u7f6e\u4e3a ",(0,i.kt)("inlineCode",{parentName:"p"},"inline"),"\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  sourceMaps: 'inline',\n});\n")),(0,i.kt)("h3",{id:"jsxruntime"},"jsxRuntime"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\u7c7b\u578b\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"'automatic' | 'classic'")),(0,i.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4\u503c\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"'automatic'"))),(0,i.kt)("p",null,"\u8bbe\u7f6e ",(0,i.kt)("a",{parentName:"p",href:"https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html"},"JSX \u8f6c\u6362"),"\u7684\u65b9\u5f0f\uff0c\u5e76\u4ea4\u7ed9\u7f16\u8bd1\u5de5\u5177\uff08SWC\uff09\u7f16\u8bd1\u5904\u7406 JSX \u8bed\u6cd5\u3002"),(0,i.kt)("p",null,"\u5047\u8bbe\u6709\u8fd9\u6837\u4e00\u6bb5 JSX \u4ee3\u7801\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-jsx"},"import React from 'react';\n\nfunction App() {\n  return <h1>Hello World</h1>;\n}\n")),(0,i.kt)("p",null,"\u5f53 ",(0,i.kt)("inlineCode",{parentName:"p"},"jsxRuntime")," \u7684\u503c\u662f ",(0,i.kt)("inlineCode",{parentName:"p"},"automatic"),"\uff0c\u7f16\u8bd1\u7ed3\u679c\u662f\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"import {jsx as _jsx} from 'react/jsx-runtime';\n\nfunction App() {\n  return _jsx('h1', { children: 'Hello world' });\n}\n")),(0,i.kt)("p",null,"\u5f53 ",(0,i.kt)("inlineCode",{parentName:"p"},"jsxRuntime")," \u7684\u503c\u662f ",(0,i.kt)("inlineCode",{parentName:"p"},"classic"),"\uff0c\u7f16\u8bd1\u7ed3\u679c\u662f\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"import React from 'react';\n\nfunction App() {\n  return React.createElement('h1', null, 'Hello world');\n}\n")),(0,i.kt)("h3",{id:"generatetypesforjs"},"generateTypesForJs"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\u7c7b\u578b\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"boolean")),(0,i.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4\u503c\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"false"))),(0,i.kt)("p",null,"\u4e3a JavaScript \u4ee3\u7801\u751f\u6210\u7c7b\u578b\u6587\u4ef6\u3002ICE PKG \u9ed8\u8ba4\u4e3a\u6587\u4ef6\u540e\u7f00\u4e3a ",(0,i.kt)("inlineCode",{parentName:"p"},".ts")," \u751f\u6210\u7c7b\u578b\u6587\u4ef6\u3002"),(0,i.kt)("p",null,"\u5982\u679c\u4f7f\u7528 ",(0,i.kt)("a",{parentName:"p",href:"https://jsdoc.app/"},"JSDoc")," \u4e3a JavaScript \u751f\u6210\u4e86\u7c7b\u578b\u6ce8\u89e3\uff0c\u8be5\u914d\u7f6e\u4f1a\u975e\u5e38\u6709\u6548\u3002\u8be6\u7ec6\u4ecb\u7ecd ",(0,i.kt)("a",{parentName:"p",href:"../guide/abilities#%E7%94%9F%E6%88%90%E7%B1%BB%E5%9E%8B%E6%96%87%E4%BB%B6"},"\u5de5\u7a0b\u80fd\u529b - \u751f\u6210\u7c7b\u578b\u6587\u4ef6"),"\u3002"),(0,i.kt)("h3",{id:"plugins"},"plugins"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\u7c7b\u578b\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"Array<string | [string, any?]>")),(0,i.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4\u503c\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"[]"))),(0,i.kt)("p",null,"ICE PKG \u57fa\u4e8e ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/ice-lab/build-scripts"},"build-scripts")," \u63d2\u4ef6\u7cfb\u7edf\uff0c\u914d\u7f6e\u989d\u5916\u7684 ICE PKG \u63d2\u4ef6\uff0c\u4ee5\u8fdb\u884c\u66f4\u6df1\u5ea6\u7684\u5de5\u7a0b\u5b9a\u5236\u3002\u66f4\u591a\u5185\u5bb9\u8bf7\u53c2\u8003",(0,i.kt)("a",{parentName:"p",href:"./plugins-development"},"\u63d2\u4ef6\u5f00\u53d1"),"\u3002"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="build.config.mts"',title:'"build.config.mts"'},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  plugins: [\n    // npm \u4f9d\u8d56\n    '@ice/plugin-docusaurus',\n    // \u76f8\u5bf9\u8def\u5f84\n    './customPlugin.mjs',\n    // \u6307\u5b9a\u63d2\u4ef6\u9009\u9879\n    ['@ice/plugin-docusaurus', { title: 'Hello World' }]\n  ],\n});\n")),(0,i.kt)("h3",{id:"transform"},"transform"),(0,i.kt)("admonition",{type:"tip"},(0,i.kt)("p",{parentName:"admonition"},"Transform \u6a21\u5f0f\u662f ICE PKG \u9ed8\u8ba4\u7684\u7f16\u8bd1\u6a21\u5f0f\u3002")),(0,i.kt)("p",null,"\u8be5\u5b57\u6bb5\u5b9a\u4e49 ",(0,i.kt)("a",{parentName:"p",href:"../guide/abilities#%E5%8F%8C%E6%A8%A1%E5%BC%8F%E6%9E%84%E5%BB%BA"},"Transform \u6a21\u5f0f")," \u4e0b\u989d\u5916\u7684\u914d\u7f6e\u3002\u9ed8\u8ba4\u914d\u7f6e\u662f\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  transform: {\n    formats: ['esm', 'es2017']\n  }\n});\n")),(0,i.kt)("h4",{id:"formats"},"formats"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\u7c7b\u578b\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"Array<'cjs' | 'esm' | 'es2017'>")),(0,i.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4\u503c\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"['esm', 'es2017']"))),(0,i.kt)("p",null,"\u8f93\u51fa\u7684\u7c7b\u578b\u3002ICE PKG \u4f1a\u9ed8\u8ba4\u628a\u4ea7\u7269\u8f93\u51fa\u5230 ",(0,i.kt)("inlineCode",{parentName:"p"},"esm")," (\u8f93\u51fa ES module + ES5 \u4ea7\u7269) \u548c ",(0,i.kt)("inlineCode",{parentName:"p"},"es2017")," (\u8f93\u51fa ES module + ES2017 \u4ea7\u7269) \u4e24\u4e2a\u6587\u4ef6\u5939\u3002"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"- esm    # ES module + ES5 \u4ea7\u7269\n- es2017 # ES module + ES2017 \u4ea7\u7269\n")),(0,i.kt)("p",null,"\u82e5\u60f3\u8981\u8f93\u51fa CommonJS \u4ea7\u7269\uff0c\u53ef\u5982\u4e0b\u914d\u7f6e\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="build.config.mts"',title:'"build.config.mts"'},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  transform: {\n    formats: ['cjs', 'esm', 'es2017'],\n  },\n});\n")),(0,i.kt)("p",null,"\u5219\u8f93\u51fa\u5982\u4e0b\u6587\u4ef6\u5939\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell"},"- cjs    # CommonJS + ES5 \u4ea7\u7269\n- esm    # ES module + ES5 \u4ea7\u7269\n- es2017 # ES module + ES2017 \u4ea7\u7269\n")),(0,i.kt)("h4",{id:"excludes"},"excludes"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\u7c7b\u578b\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"string | string[]")),(0,i.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4\u503c\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"undefined"))),(0,i.kt)("p",null,"\u6392\u9664\u65e0\u9700\u7f16\u8bd1\u7684\u6587\u4ef6\u3002\u6bd4\u5982\uff0c\u6211\u4eec\u4e0d\u60f3\u7f16\u8bd1 ",(0,i.kt)("inlineCode",{parentName:"p"},"src")," \u4e0b\u7684\u6240\u6709\u6d4b\u8bd5\u6587\u4ef6\uff0c\u5176\u4e2d\u6d4b\u8bd5\u6587\u4ef6\u5305\u542b\u5728 ",(0,i.kt)("inlineCode",{parentName:"p"},"__tests__")," \u76ee\u5f55\u4e0b\uff0c\u6216\u4ee5 ",(0,i.kt)("inlineCode",{parentName:"p"},"*.test.[j|t]s")," \u7ed3\u5c3e\u3002"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="build.config.mts"',title:'"build.config.mts"'},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  transfrom: {\n    excludes: ['**/__tests__/**', '*.test.[j|t]s'],\n  },\n});\n")),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"excludes")," \u7684\u914d\u7f6e\u5b8c\u5168\u9075\u5faa ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/isaacs/minimatch"},"minimatch")," \u5199\u6cd5\u3002"),(0,i.kt)("h3",{id:"bundle"},"bundle"),(0,i.kt)("p",null,"\u8be5\u5b57\u6bb5\u5b9a\u4e49 ",(0,i.kt)("a",{parentName:"p",href:"../guide/abilities#%E5%8F%8C%E6%A8%A1%E5%BC%8F%E6%9E%84%E5%BB%BA"},"Bundle \u6a21\u5f0f")," \u4e0b\u989d\u5916\u7684\u914d\u7f6e\uff0c\u82e5\u5f00\u542f\uff0c\u9ed8\u8ba4\u751f\u6210 ",(0,i.kt)("inlineCode",{parentName:"p"},"dist")," \u6587\u4ef6\u76ee\u5f55\u3002",(0,i.kt)("inlineCode",{parentName:"p"},"bundle")," \u5305\u542b\u4ee5\u4e0b\u914d\u7f6e\uff1a"),(0,i.kt)("h4",{id:"formats-1"},"formats"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\u7c7b\u578b\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"['esm', 'umd', 'cjs', 'es2017']")),(0,i.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4\u503c\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"['esm', 'es2017']"))),(0,i.kt)("p",null,"\u8f93\u51fa\u7684\u7c7b\u578b\uff0c\u9ed8\u8ba4\u662f\u8f93\u51fa ",(0,i.kt)("inlineCode",{parentName:"p"},"esm")," \u548c ",(0,i.kt)("inlineCode",{parentName:"p"},"es2017")," \u4ea7\u7269\u3002"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell",metastring:"title=root/dist",title:"root/dist"},"- index.esm.es5.production.js        # \u8f93\u51fa ES module + es5 \u4ea7\u7269\n- index.esm.es2017.production.js     # \u8f93\u51fa ES module + es2017 \u4ea7\u7269\n")),(0,i.kt)("p",null,"\u82e5\u53ea\u9700\u8981\u4ea7\u51fa umd \u89c4\u8303\u4ea7\u7269\uff0c\u53ef\u914d\u7f6e\u4e3a\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="build.config.mts"',title:'"build.config.mts"'},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  bundle: {\n    formats: ['umd', 'es2017'],\n  },\n});\n")),(0,i.kt)("p",null,"\u5219\u8f93\u51fa\u4ee5\u4e0b\u4ea7\u7269\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell",metastring:"title=root/dist",title:"root/dist"},"- index.umd.es5.production.js        # \u8f93\u51fa umd + es5 \u4ea7\u7269\n- index.umd.es2017.production.js # \u8f93\u51fa umd + es2017 \u4ea7\u7269\n")),(0,i.kt)("p",null,"\u6ce8\u610f\uff0c\u5982\u679c\u9700\u8981\u6253\u5305\u751f\u6210 umd \u89c4\u8303\u4ea7\u7269\uff0c\u4e0d\u80fd\u591f\u914d\u7f6e\u591a\u4e2a entry\uff08\u5165\u53e3\uff09\uff0c\u5426\u5219\u4f1a\u62a5\u9519 ",(0,i.kt)("inlineCode",{parentName:"p"},'Error: Invalid value "umd" for option "output.format" - UMD and IIFE output formats are not supported for code-splitting builds.')),(0,i.kt)("p",null,"cjs \u89c4\u8303\u4ea7\u7269\u540c\u7406\u5c06 ",(0,i.kt)("inlineCode",{parentName:"p"},"formats")," \u914d\u7f6e\u4e3a ",(0,i.kt)("inlineCode",{parentName:"p"},"['cjs', 'es2017']")," \u5373\u53ef\u3002"),(0,i.kt)("admonition",{type:"tip"},(0,i.kt)("p",{parentName:"admonition"},"Bundle \u6a21\u5f0f\u7684 formats \u5982\u679c\u5355\u72ec\u914d\u7f6e ",(0,i.kt)("inlineCode",{parentName:"p"},"['es2017']")," \u5c06\u4e0d\u4f1a\u751f\u6548\uff0c\u56e0\u4e3a\u5176\u4ec5\u51b3\u5b9a\u4ea7\u7269\u8bed\u6cd5\u5c42\u9762\u89c4\u8303\uff0c\u800c\u65e0\u6cd5\u51b3\u5b9a\u4ea7\u7269\u7684\u6a21\u5757\u89c4\u8303\u3002\u56e0\u6b64\u5176\u5fc5\u987b\u4e0e ",(0,i.kt)("inlineCode",{parentName:"p"},"'esm'"),"\u3001",(0,i.kt)("inlineCode",{parentName:"p"},"'umd'")," \u548c ",(0,i.kt)("inlineCode",{parentName:"p"},"'cjs'")," \u4e2d\u7684\u81f3\u5c11\u4e00\u9879\u642d\u914d\u914d\u7f6e\u624d\u80fd\u6b63\u5e38\u751f\u6210\u5bf9\u5e94\u6a21\u5757\u89c4\u8303\u7684 ES2017 \u4ea7\u7269\u3002")),(0,i.kt)("h4",{id:"modes"},"modes"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\u7c7b\u578b\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"Array<'development' | 'production'>")),(0,i.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4\u503c\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"['production']"))),(0,i.kt)("p",null,"\u6307\u5b9a\u8f93\u51fa\u7684\u4ea7\u7269\u662f\u5426\u7ecf\u8fc7\u538b\u7f29\u3002\u9ed8\u8ba4\u60c5\u51b5\u4e0b\u8f93\u51fa\u7684\u4ea7\u7269\u662f\u538b\u7f29\u8fc7\u7684\u3002"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell",metastring:'title="root/dist"',title:'"root/dist"'},"- index.esm.es5.production.js        # \u8f93\u51fa ES module + es5 \u4ea7\u7269\n- index.esm.es2017.production.js     # \u8f93\u51fa ES module + es2017 \u4ea7\u7269\n")),(0,i.kt)("p",null,"\u589e\u52a0 ",(0,i.kt)("inlineCode",{parentName:"p"},"'development'")," \u65f6\uff0c\u4f1a\u989d\u5916\u8f93\u51fa\u4e00\u4efd",(0,i.kt)("strong",{parentName:"p"},"\u672a\u538b\u7f29\u7684"),"\u7684\u4ea7\u7269\uff0c\u8fd9\u4e5f\u610f\u5473\u7740\u7528\u6237\u53ef\u4ee5\u5728\u5f00\u53d1\u6001\u4f7f\u7528\u8be5\u4ea7\u7269\u83b7\u5f97\u66f4\u591a\u7684\u5f00\u53d1\u65f6\u4fe1\u606f\u3002\u5728\u5f00\u53d1 Library \u65f6\uff0c\u8fd9\u5c06\u4f1a\u975e\u5e38\u6709\u4f5c\u7528\u3002"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="build.config.mts"',title:'"build.config.mts"'},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  bundle: {\n    modes: ['production', 'development'],\n  },\n});\n")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell",metastring:'title="root/dist"',title:'"root/dist"'},"- index.esm.es5.development.js        # \u8f93\u51fa\u672a\u538b\u7f29\u4ea7\u7269\uff08ES module + es5\uff09\n- index.esm.es5.production.js         # \u8f93\u51fa\u538b\u7f29\u4ea7\u7269 (ES module + es5)\n- index.esm.es2017.development.js     # \u8f93\u51fa\u672a\u538b\u7f29\u4ea7\u7269 \uff08ES module + es2017\uff09\n- index.esm.es2017.production.js      # \u8f93\u51fa\u672a\u538b\u7f29\u4ea7\u7269 (ES module + es2017)\n")),(0,i.kt)("h4",{id:"name"},"name"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\u7c7b\u578b\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"string")),(0,i.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4\u503c\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"package.name"))),(0,i.kt)("p",null,"library \u5bfc\u51fa\u7684\u540d\u79f0\uff0c\u53ef\u4ee5\u901a\u8fc7 ",(0,i.kt)("inlineCode",{parentName:"p"},"window[name]")," \u8bbf\u95ee\uff0c\u4e00\u822c\u914d\u5408\u6253\u5305 ",(0,i.kt)("inlineCode",{parentName:"p"},"umd")," \u4ea7\u7269\u65f6\u4f7f\u7528\u3002\u9ed8\u8ba4\u503c\u4e3a ",(0,i.kt)("inlineCode",{parentName:"p"},"package.json")," \u914d\u7f6e\u7684 ",(0,i.kt)("inlineCode",{parentName:"p"},"name")," \u5b57\u6bb5\u3002"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="build.config.mts"',title:'"build.config.mts"'},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  bundle: {\n    name: 'ICEPKG'\n  },\n});\n")),(0,i.kt)("h4",{id:"externals"},"externals"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\u7c7b\u578b\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"boolean | Record<string, string>")),(0,i.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4\u503c\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"true"))),(0,i.kt)("p",null,"\u9ed8\u8ba4\u60c5\u51b5\u4e0b\uff0cbundle \u7684\u4ea7\u7269\u5305\u542b\u6240\u6709\u4f9d\u8d56\u4ea7\u7269\u3002\u8be5\u9009\u9879\u53ef\u4fee\u6539\u8fd9\u4e00\u7ed3\u679c\u3002\u82e5\u60f3\u8981 Bundle \u4e0d\u5305\u542b\u4f9d\u8d56\u4ea7\u7269\uff0c\u53ef\u5982\u4e0b\u914d\u7f6e\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="build.config.mts"',title:'"build.config.mts"'},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  bundle: {\n    externals: true,\n  },\n});\n")),(0,i.kt)("p",null,"\u82e5\u60f3\u8981\u81ea\u5b9a\u4e49\u914d\u7f6e externals\uff0c\u53c2\u8003\u5982\u4e0b\u914d\u7f6e\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="build.config.mts"',title:'"build.config.mts"'},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  bundle: {\n    externals: {\n      react: 'React',\n      'react-dom': 'ReactDOM',\n    },\n  },\n});\n")),(0,i.kt)("h4",{id:"minify"},"minify"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\u7c7b\u578b\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"boolean | { js?: boolean | ((mode: string, command: string) => boolean | { options?: swc.JsMinifyOptions }); css?: boolean | ((mode: string, command: string) => boolean | { options?: cssnano.Options });}")),(0,i.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4\u503c\uff1abuild \u9636\u6bb5\u4e14 mode \u662f ",(0,i.kt)("inlineCode",{parentName:"li"},"production")," \u65f6\u4e3a ",(0,i.kt)("inlineCode",{parentName:"li"},"true"),"\uff0c\u5426\u5219\u4e3a ",(0,i.kt)("inlineCode",{parentName:"li"},"false"))),(0,i.kt)("p",null,"\u662f\u5426\u538b\u7f29 JS \u548c CSS \u8d44\u6e90\u3002"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="build.config.mts"',title:'"build.config.mts"'},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  bundle: {\n    // production \u4ea7\u7269\u548c development \u4ea7\u7269\u4e0d\u538b\u7f29\n    minify: false,\n    // \u4fee\u6539 JS \u548c CSS \u538b\u7f29\u53c2\u6570\n    minify: {\n      js: (mode, command) => { options: { /* */ } },\n      css: (mode, command) => { options: { /* */ } },\n    }\n  },\n});\n")),(0,i.kt)("h4",{id:"polyfill"},"polyfill"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\u7c7b\u578b\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"false | 'entry' | 'usage'")),(0,i.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4\u503c\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"'usage'"))),(0,i.kt)("p",null,"\u914d\u7f6e\u5904\u7406 polyfill \u7684\u903b\u8f91\u3002\u4e0d\u540c\u503c\u7684\u542b\u4e49\uff1a"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"false"),": \u4e0d\u5f15\u5165\u4efb\u4f55 polyfill"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"'entry'"),": \u6839\u636e\u914d\u7f6e\u7684 format \u503c\u5728\u6bcf\u4e2a\u6587\u4ef6\u5f00\u5934\u90fd\u5f15\u5165\u5bf9\u5e94\u7684 polyfill"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"'usage'"),": \u6839\u636e\u6e90\u7801\u4e2d\u4f7f\u7528\u5230\u7684\u4ee3\u7801\u6309\u9700\u5f15\u5165 polyfill")),(0,i.kt)("admonition",{type:"caution"},(0,i.kt)("p",{parentName:"admonition"},(0,i.kt)("inlineCode",{parentName:"p"},"polyfill")," \u9ed8\u8ba4\u503c\u5c06\u4f1a\u5728\u4e0b\u4e2a BK \u7248\u672c\u6539\u6210 ",(0,i.kt)("inlineCode",{parentName:"p"},"false"),"\u3002\u63a8\u8350\u7ec4\u4ef6\u7684 bundle \u4ea7\u7269\u4e0d\u5f15\u5165\u4efb\u4f55 polyfill\uff08\u4e5f\u5c31\u662f\u8bbe\u7f6e\u6210 ",(0,i.kt)("inlineCode",{parentName:"p"},"false"),"\uff09\uff0c\u800c\u662f\u4f7f\u7528 CDN \u7684\u65b9\u5f0f\u5f15\u5165 polyfill\u3002")),(0,i.kt)("h4",{id:"compiledependencies"},"compileDependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\u7c7b\u578b\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"boolean | RegExp[]")),(0,i.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4\u503c\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"false"))),(0,i.kt)("p",null,"\u914d\u7f6e\u662f\u5426\u7f16\u8bd1 node_modules \u4e2d\u7684\u4f9d\u8d56\u3002\u5982\u679c\u503c\u4e3a ",(0,i.kt)("inlineCode",{parentName:"p"},"true"),"\uff0c\u5219 node_modules \u4e2d\u7684\u4f9d\u8d56\u90fd\u4f1a\u7f16\u8bd1\uff1b\u5982\u679c\u503c\u4e3a false \u5219\u90fd\u4e0d\u7f16\u8bd1\uff1b\u5982\u679c\u503c\u4e3a\u6570\u7ec4\uff0c\u5219\u53ea\u4f1a\u7f16\u8bd1\u5bf9\u5e94\u7684\u4f9d\u8d56\u3002"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="build.config.mts"',title:'"build.config.mts"'},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  bundle: {\n    compileDependencies: [/antd/],\n  },\n});\n")),(0,i.kt)("h4",{id:"development"},"development"),(0,i.kt)("admonition",{type:"caution"},(0,i.kt)("p",{parentName:"admonition"},"\u6b64\u9009\u9879\u5df2\u5e9f\u5f03\uff0c\u8bf7\u4f7f\u7528 ",(0,i.kt)("a",{parentName:"p",href:"#modes"},"modes"))),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"\u7c7b\u578b\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"boolean")),(0,i.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4\u503c\uff1a",(0,i.kt)("inlineCode",{parentName:"li"},"false"))),(0,i.kt)("p",null,"\u82e5\u5f00\u542f\u8be5\u9009\u9879\uff0c\u5219\u4f1a\u989d\u5916\u8f93\u51fa\u4e00\u4efd ",(0,i.kt)("strong",{parentName:"p"},"\u672a\u538b\u7f29\u7684")," \u7684\u4ea7\u7269\uff0c\u8fd9\u4e5f\u610f\u5473\u7740\u7528\u6237\u53ef\u4ee5\u5728\u5f00\u53d1\u6001\u4f7f\u7528\u8be5\u4ea7\u7269\u83b7\u5f97\u66f4\u591a\u7684\u5f00\u53d1\u65f6\u4fe1\u606f\u3002\u5728\u5f00\u53d1 Library \u65f6\uff0c\u8fd9\u5c06\u4f1a\u975e\u5e38\u6709\u4f5c\u7528\u3002"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="build.config.mts"',title:'"build.config.mts"'},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  bundle: {\n    development: true,\n  },\n});\n")),(0,i.kt)("p",null,"\u4e0a\u8ff0\u914d\u7f6e\u4f1a\u8f93\u51fa\u5982\u4e0b\u4ea7\u7269\uff1a"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-shell",metastring:"title=root/dist",title:"root/dist"},"- index.esm.es5.development.js        # \u8f93\u51fa\u672a\u538b\u7f29\u4ea7\u7269\uff08ES module + es5\uff09\n- index.esm.es5.production.js         # \u8f93\u51fa\u538b\u7f29\u4ea7\u7269 (ES module + es5)\n- index.esm.es2017.development.js # \u8f93\u51fa\u672a\u538b\u7f29\u4ea7\u7269 \uff08ES module + es2017\uff09\n- index.esm.es2017.production.js  # \u8f93\u51fa\u672a\u538b\u7f29\u4ea7\u7269 (ES module + es2017)\n")))}d.isMDXComponent=!0}}]);