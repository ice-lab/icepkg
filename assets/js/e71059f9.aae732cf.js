"use strict";(self.webpackChunkicepkg_site=self.webpackChunkicepkg_site||[]).push([[713],{734:function(e,n,t){t.d(n,{Zo:function(){return p},kt:function(){return m}});var r=t(9231);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var s=r.createContext({}),c=function(e){var n=r.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},p=function(e){var n=c(e.components);return r.createElement(s.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},u=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=c(t),m=a,f=u["".concat(s,".").concat(m)]||u[m]||d[m]||o;return t?r.createElement(f,i(i({ref:n},p),{},{components:t})):r.createElement(f,i({ref:n},p))}));function m(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=t.length,i=new Array(o);i[0]=u;var l={};for(var s in n)hasOwnProperty.call(n,s)&&(l[s]=n[s]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var c=2;c<o;c++)i[c]=t[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}u.displayName="MDXCreateElement"},5190:function(e,n,t){t.r(n),t.d(n,{assets:function(){return s},contentTitle:function(){return i},default:function(){return d},frontMatter:function(){return o},metadata:function(){return l},toc:function(){return c}});var r=t(9044),a=(t(9231),t(734));const o={},i="Node \u6a21\u5757",l={unversionedId:"scenarios/node",id:"scenarios/node",title:"Node \u6a21\u5757",description:"\u521d\u59cb\u5316 Node \u6a21\u5757\u9879\u76ee",source:"@site/docs/scenarios/node.md",sourceDirName:"scenarios",slug:"/scenarios/node",permalink:"/scenarios/node",draft:!1,editUrl:"https://github.com/ice-lab/icepkg/tree/main/website/docs/docs/scenarios/node.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Rax \u7ec4\u4ef6",permalink:"/scenarios/rax"},next:{title:"\u524d\u7aef\u7c7b\u5e93",permalink:"/scenarios/web"}},s={},c=[{value:"\u521d\u59cb\u5316 Node \u6a21\u5757\u9879\u76ee",id:"\u521d\u59cb\u5316-node-\u6a21\u5757\u9879\u76ee",level:2},{value:"\u4f7f\u7528 Node \u6a21\u5757",id:"\u4f7f\u7528-node-\u6a21\u5757",level:2},{value:"Pure ESM \u6a21\u5f0f",id:"pure-esm-\u6a21\u5f0f",level:3},{value:"Dual \u6a21\u5f0f",id:"dual-\u6a21\u5f0f",level:3}],p={toc:c};function d(e){let{components:n,...t}=e;return(0,a.kt)("wrapper",(0,r.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"node-\u6a21\u5757"},"Node \u6a21\u5757"),(0,a.kt)("h2",{id:"\u521d\u59cb\u5316-node-\u6a21\u5757\u9879\u76ee"},"\u521d\u59cb\u5316 Node \u6a21\u5757\u9879\u76ee"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"$ npm init @ice/pkg node\n")),(0,a.kt)("p",null,"\u4f1a\u5728\u5f53\u524d\u76ee\u5f55\u4e0b\u65b0\u5efa node \u6587\u4ef6\u5939\u5e76\u5728\u5176\u4e2d\u521d\u59cb\u5316 Node \u6a21\u5757\u9879\u76ee\uff0c\u5176\u6587\u4ef6\u76ee\u5f55\u7ed3\u6784\u5982\u4e0b\uff1a"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},".\n\u251c\u2500\u2500 README.md\n\u251c\u2500\u2500 abc.json\n\u251c\u2500\u2500 build.config.mts\n\u251c\u2500\u2500 package.json\n\u251c\u2500\u2500 src\n\u2502\xa0\xa0 \u2514\u2500\u2500 index.ts\n\u2514\u2500\u2500 tsconfig.json\n")),(0,a.kt)("h2",{id:"\u4f7f\u7528-node-\u6a21\u5757"},"\u4f7f\u7528 Node \u6a21\u5757"),(0,a.kt)("p",null,"\u5bf9\u4e8e\u6d88\u8d39\u5728 Node \u7aef\u7684\u4ea7\u7269\uff0c\u6839\u636e\u662f\u5426\u8fd8\u9700\u8981\u63d0\u4f9b CommonJS \u4ea7\u7269\uff0c\u53ef\u5206\u4e3a\u4e24\u79cd\u5f00\u53d1\u5f62\u6001\u3002"),(0,a.kt)("h3",{id:"pure-esm-\u6a21\u5f0f"},"Pure ESM \u6a21\u5f0f"),(0,a.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("p",{parentName:"div"},"ICE PKG \u63a8\u8350\u4f7f\u7528 Pure ESM \u7684\u5f00\u53d1\u6a21\u5f0f\u3002"))),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c"},"Pure ESM")," \u662f\u53ea\u63d0\u4f9b ES module \u4ea7\u7269\u7684\u5f00\u53d1\u5f62\u6001\uff0c\u8981\u6c42 Node \u7684\u7248\u672c\u5728 ",(0,a.kt)("inlineCode",{parentName:"p"},"^12.20.0 || ^14.13.1 || >=16.0.0")," \u7684\u8303\u56f4\u3002"),(0,a.kt)("p",null,"Pure ESM \u7684\u5f00\u53d1\u5f62\u6001\u4e0b\u53ea\u9700\u8f93\u51fa ",(0,a.kt)("inlineCode",{parentName:"p"},"es2017")," \u7684\u4ea7\u7269\u5373\u53ef\u3002\u914d\u7f6e\u5982\u4e0b\uff1a"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts",metastring:"title=build.config.mts",title:"build.config.mts"},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  transform: {\n    formats: ['es2017'],\n  },\n});\n")),(0,a.kt)("p",null,"\u540c\u65f6\u5bfc\u51fa\u914d\u7f6e\u5982\u4e0b\uff1a"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json",metastring:"title=package.json",title:"package.json"},'{\n  "type": "module",\n  "exports": "./es2017/index.js"\n}\n')),(0,a.kt)("h3",{id:"dual-\u6a21\u5f0f"},"Dual \u6a21\u5f0f"),(0,a.kt)("div",{className:"admonition admonition-warning alert alert--danger"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z"}))),"warning")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("p",{parentName:"div"},"Node 10.x\u3001Node 11.x \u5df2\u5728 ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/nodejs/Release#end-of-life-releases"},"2021\u5e744\u6708")," \u505c\u6b62\u7ef4\u62a4\u3002\u6240\u4ee5\u5efa\u8bae\u4f7f\u7528 Pure ESM \u5f00\u53d1 Node \u6a21\u5757\u3002"))),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://nodejs.org/dist/latest-v16.x/docs/api/packages.html#dual-commonjses-module-packages"},"Dual \u6a21\u5f0f")," \u65e8\u5728\u540c\u65f6\u63d0\u4f9b CommonJS \u548c ES module \u4ea7\u7269\u3002\u901a\u5e38\u662f\u4e3a\u4e86\u517c\u5bb9 Node \u7248\u672c\u4f4e\u4e8e ",(0,a.kt)("inlineCode",{parentName:"p"},"12.20.0")," \u7684\u7248\u672c\u3002"),(0,a.kt)("p",null,"\u652f\u6301 Dual \u6a21\u5f0f\u7684\u6a21\u5757\u9700\u8981\u989d\u5916\u8f93\u51fa CommonJS \u4ea7\u7269\uff0c\u914d\u7f6e\u5982\u4e0b\uff1a"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts",metastring:"title=build.config.mts",title:"build.config.mts"},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  transform: {\n    formats: ['cjs', 'es2017'],\n  },\n});\n")),(0,a.kt)("p",null,"\u8be5\u914d\u7f6e\u8f93\u51fa ",(0,a.kt)("inlineCode",{parentName:"p"},"cjs")," \u548c ",(0,a.kt)("inlineCode",{parentName:"p"},"es2017")," \u4e24\u4e2a\u6587\u4ef6\u5939\uff1a"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"- cjs\n- es2017\n")),(0,a.kt)("p",null,"\u63a8\u8350\u7684\u5bfc\u51fa\u914d\u7f6e\u5982\u4e0b\uff0c\u4e14\u4e0d\u63a8\u8350\u914d\u7f6e ",(0,a.kt)("inlineCode",{parentName:"p"},'type: "module"')),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-diff",metastring:"title=package.json",title:"package.json"},'{\n- "type": "module",\n  "exports": {\n    "import": "./es2017/index.js",\n    "require": "./cjs/index.js"\n  }\n}\n')))}d.isMDXComponent=!0}}]);