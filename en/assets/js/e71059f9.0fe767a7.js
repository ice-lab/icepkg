"use strict";(self.webpackChunkicepkg_site=self.webpackChunkicepkg_site||[]).push([[713],{4852:(e,n,t)=>{t.d(n,{Zo:()=>c,kt:()=>m});var r=t(9231);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var s=r.createContext({}),p=function(e){var n=r.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},c=function(e){var n=p(e.components);return r.createElement(s.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},u=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),u=p(t),m=o,f=u["".concat(s,".").concat(m)]||u[m]||d[m]||a;return t?r.createElement(f,i(i({ref:n},c),{},{components:t})):r.createElement(f,i({ref:n},c))}));function m(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var a=t.length,i=new Array(a);i[0]=u;var l={};for(var s in n)hasOwnProperty.call(n,s)&&(l[s]=n[s]);l.originalType=e,l.mdxType="string"==typeof e?e:o,i[1]=l;for(var p=2;p<a;p++)i[p]=t[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}u.displayName="MDXCreateElement"},4785:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>s,contentTitle:()=>i,default:()=>d,frontMatter:()=>a,metadata:()=>l,toc:()=>p});var r=t(6215),o=(t(9231),t(4852));const a={},i="Node \u6a21\u5757",l={unversionedId:"scenarios/node",id:"scenarios/node",title:"Node \u6a21\u5757",description:"\u521d\u59cb\u5316 Node \u6a21\u5757\u9879\u76ee",source:"@site/docs/scenarios/node.md",sourceDirName:"scenarios",slug:"/scenarios/node",permalink:"/en/scenarios/node",draft:!1,editUrl:"https://github.com/ice-lab/icepkg/tree/main/website/docs/docs/scenarios/node.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Rax \u7ec4\u4ef6",permalink:"/en/scenarios/rax"},next:{title:"\u524d\u7aef\u7c7b\u5e93",permalink:"/en/scenarios/web"}},s={},p=[{value:"\u521d\u59cb\u5316 Node \u6a21\u5757\u9879\u76ee",id:"\u521d\u59cb\u5316-node-\u6a21\u5757\u9879\u76ee",level:2},{value:"\u4f7f\u7528 Node \u6a21\u5757",id:"\u4f7f\u7528-node-\u6a21\u5757",level:2},{value:"Pure ESM \u6a21\u5f0f",id:"pure-esm-\u6a21\u5f0f",level:3},{value:"Dual \u6a21\u5f0f",id:"dual-\u6a21\u5f0f",level:3}],c={toc:p};function d(e){let{components:n,...t}=e;return(0,o.kt)("wrapper",(0,r.Z)({},c,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"node-\u6a21\u5757"},"Node \u6a21\u5757"),(0,o.kt)("h2",{id:"\u521d\u59cb\u5316-node-\u6a21\u5757\u9879\u76ee"},"\u521d\u59cb\u5316 Node \u6a21\u5757\u9879\u76ee"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"$ npm init @ice/pkg node-project\n")),(0,o.kt)("p",null,"\u9879\u76ee\u7c7b\u578b\u9009\u62e9\u300eNode \u6a21\u5757\u300f\uff0c\u4f1a\u5728\u5f53\u524d\u76ee\u5f55\u4e0b\u65b0\u5efa node-project \u6587\u4ef6\u5939\u5e76\u5728\u5176\u4e2d\u521d\u59cb\u5316 Node \u6a21\u5757\u9879\u76ee\uff0c\u5176\u6587\u4ef6\u76ee\u5f55\u7ed3\u6784\u5982\u4e0b\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},".\n\u251c\u2500\u2500 README.md\n\u251c\u2500\u2500 abc.json\n\u251c\u2500\u2500 build.config.mts\n\u251c\u2500\u2500 package.json\n\u251c\u2500\u2500 src\n\u2502\xa0\xa0 \u2514\u2500\u2500 index.ts\n\u2514\u2500\u2500 tsconfig.json\n")),(0,o.kt)("h2",{id:"\u4f7f\u7528-node-\u6a21\u5757"},"\u4f7f\u7528 Node \u6a21\u5757"),(0,o.kt)("p",null,"\u5bf9\u4e8e\u6d88\u8d39\u5728 Node \u7aef\u7684\u4ea7\u7269\uff0c\u6839\u636e\u662f\u5426\u8fd8\u9700\u8981\u63d0\u4f9b CommonJS \u4ea7\u7269\uff0c\u53ef\u5206\u4e3a\u4e24\u79cd\u5f00\u53d1\u5f62\u6001\u3002"),(0,o.kt)("h3",{id:"pure-esm-\u6a21\u5f0f"},"Pure ESM \u6a21\u5f0f"),(0,o.kt)("admonition",{type:"tip"},(0,o.kt)("p",{parentName:"admonition"},"ICE PKG \u63a8\u8350\u4f7f\u7528 Pure ESM \u7684\u5f00\u53d1\u6a21\u5f0f\u3002")),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c"},"Pure ESM")," \u662f\u53ea\u63d0\u4f9b ES module \u4ea7\u7269\u7684\u5f00\u53d1\u5f62\u6001\uff0c\u8981\u6c42 Node \u7684\u7248\u672c\u5728 ",(0,o.kt)("inlineCode",{parentName:"p"},"^12.20.0 || ^14.13.1 || >=16.0.0")," \u7684\u8303\u56f4\u3002"),(0,o.kt)("p",null,"Pure ESM \u7684\u5f00\u53d1\u5f62\u6001\u4e0b\u53ea\u9700\u8f93\u51fa ",(0,o.kt)("inlineCode",{parentName:"p"},"es2017")," \u7684\u4ea7\u7269\u5373\u53ef\u3002\u914d\u7f6e\u5982\u4e0b\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts",metastring:"title=build.config.mts",title:"build.config.mts"},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  transform: {\n    formats: ['es2017'],\n  },\n});\n")),(0,o.kt)("p",null,"\u540c\u65f6\u5bfc\u51fa\u914d\u7f6e\u5982\u4e0b\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json",metastring:"title=package.json",title:"package.json"},'{\n  "type": "module",\n  "exports": "./es2017/index.js"\n}\n')),(0,o.kt)("h3",{id:"dual-\u6a21\u5f0f"},"Dual \u6a21\u5f0f"),(0,o.kt)("admonition",{type:"warning"},(0,o.kt)("p",{parentName:"admonition"},"Node 10.x\u3001Node 11.x \u5df2\u5728 ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/nodejs/Release#end-of-life-releases"},"2021\u5e744\u6708")," \u505c\u6b62\u7ef4\u62a4\u3002\u6240\u4ee5\u5efa\u8bae\u4f7f\u7528 Pure ESM \u5f00\u53d1 Node \u6a21\u5757\u3002")),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://nodejs.org/dist/latest-v16.x/docs/api/packages.html#dual-commonjses-module-packages"},"Dual \u6a21\u5f0f")," \u65e8\u5728\u540c\u65f6\u63d0\u4f9b CommonJS \u548c ES module \u4ea7\u7269\u3002\u901a\u5e38\u662f\u4e3a\u4e86\u517c\u5bb9 Node \u7248\u672c\u4f4e\u4e8e ",(0,o.kt)("inlineCode",{parentName:"p"},"12.20.0")," \u7684\u7248\u672c\u3002"),(0,o.kt)("p",null,"\u652f\u6301 Dual \u6a21\u5f0f\u7684\u6a21\u5757\u9700\u8981\u989d\u5916\u8f93\u51fa CommonJS \u4ea7\u7269\uff0c\u914d\u7f6e\u5982\u4e0b\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts",metastring:"title=build.config.mts",title:"build.config.mts"},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  transform: {\n    formats: ['cjs', 'es2017'],\n  },\n});\n")),(0,o.kt)("p",null,"\u8be5\u914d\u7f6e\u8f93\u51fa ",(0,o.kt)("inlineCode",{parentName:"p"},"cjs")," \u548c ",(0,o.kt)("inlineCode",{parentName:"p"},"es2017")," \u4e24\u4e2a\u6587\u4ef6\u5939\uff1a"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-shell"},"- cjs\n- es2017\n")),(0,o.kt)("p",null,"\u63a8\u8350\u7684\u5bfc\u51fa\u914d\u7f6e\u5982\u4e0b\uff0c\u4e14\u4e0d\u63a8\u8350\u914d\u7f6e ",(0,o.kt)("inlineCode",{parentName:"p"},'type: "module"')),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-diff",metastring:"title=package.json",title:"package.json"},'{\n- "type": "module",\n  "exports": {\n    "import": "./es2017/index.js",\n    "require": "./cjs/index.js"\n  }\n}\n')))}d.isMDXComponent=!0}}]);