"use strict";(self.webpackChunkice_component=self.webpackChunkice_component||[]).push([[713],{3387:(e,t,n)=>{function a(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var r=a(n(9496));function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(){return i=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e},i.apply(this,arguments)}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function p(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=r.default.createContext({}),d=function(e){var t=r.default.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.default.createElement(r.default.Fragment,{},t)}},u=r.default.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,i=e.parentName,l=p(e,["components","mdxType","originalType","parentName"]),c=d(n),u=a,f=c["".concat(i,".").concat(u)]||c[u]||m[u]||o;return n?r.default.createElement(f,s(s({ref:t},l),{},{components:n})):r.default.createElement(f,s({ref:t},l))}));u.displayName="MDXCreateElement",t.Zo=function(e){var t=d(e.components);return r.default.createElement(c.Provider,{value:t},e.children)},t.kt=function(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=u;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var p=2;p<o;p++)i[p]=n[p];return r.default.createElement.apply(null,i)}return r.default.createElement.apply(null,n)}},1647:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>u,frontMatter:()=>l,metadata:()=>p,toc:()=>d});var a=n(2848),r=n(9213),o=(n(9496),n(3387)),i=["components"],l={},s="Node \u6a21\u5757",p={unversionedId:"scenarios/node",id:"scenarios/node",title:"Node \u6a21\u5757",description:"\u5bf9\u4e8e\u6d88\u8d39\u5728 Node \u7aef\u7684\u4ea7\u7269\uff0c\u6839\u636e\u662f\u5426\u8fd8\u9700\u8981\u63d0\u4f9b CommonJS \u4ea7\u7269\uff0c\u53ef\u5206\u4e3a\u4e24\u79cd\u5f00\u53d1\u5f62\u6001\u3002",source:"@site/docs/scenarios/node.md",sourceDirName:"scenarios",slug:"/scenarios/node",permalink:"/scenarios/node",tags:[],version:"current",frontMatter:{},sidebar:"defaultSidebar",previous:{title:"React \u7ec4\u4ef6\u5f00\u53d1",permalink:"/scenarios/component"},next:{title:"Web Library \u5f00\u53d1",permalink:"/scenarios/library"}},c={},d=[{value:"Pure ESM",id:"pure-esm",level:2},{value:"Dual Mode",id:"dual-mode",level:2}],m={toc:d};function u(e){var t=e.components,n=(0,r.Z)(e,i);return(0,o.kt)("wrapper",(0,a.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"node-\u6a21\u5757"},"Node \u6a21\u5757"),(0,o.kt)("p",null,"\u5bf9\u4e8e\u6d88\u8d39\u5728 Node \u7aef\u7684\u4ea7\u7269\uff0c\u6839\u636e\u662f\u5426\u8fd8\u9700\u8981\u63d0\u4f9b CommonJS \u4ea7\u7269\uff0c\u53ef\u5206\u4e3a\u4e24\u79cd\u5f00\u53d1\u5f62\u6001\u3002"),(0,o.kt)("h2",{id:"pure-esm"},"Pure ESM"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c"},"Pure ESM")," \u662f\u53ea\u63d0\u4f9b ES module \u4ea7\u7269\u7684\u5f00\u53d1\u5f62\u6001\uff0c\u8981\u6c42 Node \u7684\u7248\u672c\u5728 ",(0,o.kt)("inlineCode",{parentName:"p"},"^12.20.0 || ^14.13.1 || >=16.0.0")," \u7684\u8303\u56f4\u3002"),(0,o.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"@ice/pkg \u66f4\u63a8\u5d07 Pure ESM \u7684\u5f00\u53d1\u6a21\u5f0f\u3002"))),(0,o.kt)("p",null,"Pure ESM \u7684\u5f00\u53d1\u5f62\u6001\u4e0b\u53ea\u9700\u8f93\u51fa ",(0,o.kt)("inlineCode",{parentName:"p"},"es2017")," \u7684\u4ea7\u7269\u5373\u53ef\u3002\u914d\u7f6e\u5982\u4e0b\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts",metastring:"title=build.config.ts",title:"build.config.ts"},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig(\n  transform: {\n    formats: ['es2017'],\n  }\n})\n")),(0,o.kt)("p",null,"\u540c\u65f6 Packge Exports \u7684\u914d\u7f6e\u5982\u4e0b\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json",metastring:"title=package.json",title:"package.json"},'{\n  "type": "module",\n  "exports": "./es2017/index.js"\n}\n')),(0,o.kt)("h2",{id:"dual-mode"},"Dual Mode"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://nodejs.org/dist/latest-v16.x/docs/api/packages.html#dual-commonjses-module-packages"},"Dual Mode")," \u65e8\u5728\u540c\u65f6\u63d0\u4f9b CommonJS \u548c ES module \u4ea7\u7269\u3002\u901a\u5e38\u662f\u4e3a\u4e86\u517c\u5bb9 Node \u7248\u672c\u4f4e\u4e8e ",(0,o.kt)("inlineCode",{parentName:"p"},"12.20.0")," \u7684\u7248\u672c\u3002"),(0,o.kt)("div",{className:"admonition admonition-warning alert alert--danger"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z"}))),"warning")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"Node 10.x\u3001Node 11.x \u5df2\u5728 ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/nodejs/Release#end-of-life-releases"},"2021\u5e744\u6708")," \u505c\u6b62\u7ef4\u62a4\u3002\u8bf7\u4f7f\u7528 Pure ESM \u5f00\u53d1\u4f60\u7684 Node \u6a21\u5757\u3002"))),(0,o.kt)("p",null,"\u652f\u6301 Dual Mode \u7684\u6a21\u5757\u9700\u8981\u989d\u5916\u8f93\u51fa CommonJS \u4ea7\u7269\uff0c\u914d\u7f6e\u5982\u4e0b\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts",metastring:"title=build.config.ts",title:"build.config.ts"},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig(\n  transform: {\n    formats: ['cjs', 'es2017'],\n  }\n})\n")),(0,o.kt)("p",null,"\u8be5\u914d\u7f6e\u8f93\u51fa ",(0,o.kt)("inlineCode",{parentName:"p"},"cjs")," \u548c ",(0,o.kt)("inlineCode",{parentName:"p"},"es2017")," \u4e24\u4e2a\u6587\u4ef6\u5939\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"- cjs\n- es2017\n")),(0,o.kt)("p",null,"\u63a8\u8350\u7684 Package Exports \u914d\u7f6e\u5982\u4e0b\uff0c\u4e14\u4e0d\u63a8\u8350\u914d\u7f6e ",(0,o.kt)("inlineCode",{parentName:"p"},'type: "module"')),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-diff",metastring:"title=package.json",title:"package.json"},'{\n- "type": "module",\n  "exports": {\n    "import": "./es2017/index.js",\n    "require": "./cjs/index.js"\n  }\n}\n')))}u.isMDXComponent=!0}}]);