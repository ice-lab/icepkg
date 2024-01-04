"use strict";(self.webpackChunkicepkg_site=self.webpackChunkicepkg_site||[]).push([[416],{8570:(e,t,n)=>{n.d(t,{Zo:()=>o,kt:()=>k});var a=n(79);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function d(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},l=Object.keys(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(a=0;a<l.length;a++)n=l[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var p=a.createContext({}),m=function(e){var t=a.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},o=function(e){var t=m(e.components);return a.createElement(p.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},u=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,l=e.originalType,p=e.parentName,o=d(e,["components","mdxType","originalType","parentName"]),u=m(n),k=r,c=u["".concat(p,".").concat(k)]||u[k]||s[k]||l;return n?a.createElement(c,i(i({ref:t},o),{},{components:n})):a.createElement(c,i({ref:t},o))}));function k(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=n.length,i=new Array(l);i[0]=u;var d={};for(var p in t)hasOwnProperty.call(t,p)&&(d[p]=t[p]);d.originalType=e,d.mdxType="string"==typeof e?e:r,i[1]=d;for(var m=2;m<l;m++)i[m]=n[m];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}u.displayName="MDXCreateElement"},5637:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>i,default:()=>s,frontMatter:()=>l,metadata:()=>d,toc:()=>m});var a=n(7583),r=(n(79),n(8570));const l={},i="\u6784\u5efa\u4ea7\u7269",d={unversionedId:"guide/build",id:"guide/build",title:"\u6784\u5efa\u4ea7\u7269",description:"\u672c\u6587\u8bb2\u8ff0\u4e0d\u540c\u6784\u5efa\u6a21\u5f0f\u4e0b\u7684\u4ea7\u7269\u8bf4\u660e\u4ee5\u53ca\u9002\u7528\u7684\u573a\u666f\u3002\u5b8c\u6574\u7684\u4ea7\u7269\u6784\u5efa\u914d\u7f6e\u53ef\u67e5\u770b\u6587\u6863 Transform \u6a21\u5f0f\u6784\u5efa\u914d\u7f6e\u548c Bundle \u6a21\u5f0f\u6784\u5efa\u914d\u7f6e\u3002",source:"@site/docs/guide/build.md",sourceDirName:"guide",slug:"/guide/build",permalink:"/guide/build",draft:!1,editUrl:"https://github.com/ice-lab/icepkg/tree/main/website/docs/docs/guide/build.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"\u6784\u5efa\u573a\u666f",permalink:"/guide/scenarios"},next:{title:"\u53d1\u5e03",permalink:"/guide/publish"}},p={},m=[{value:"\u6784\u5efa\u4ea7\u7269\u8bf4\u660e",id:"\u6784\u5efa\u4ea7\u7269\u8bf4\u660e",level:2},{value:"\u9ed8\u8ba4\u6784\u5efa\u4ea7\u7269",id:"\u9ed8\u8ba4\u6784\u5efa\u4ea7\u7269",level:2},{value:"\u6784\u5efa\u73b0\u4ee3\u4ea7\u7269",id:"\u6784\u5efa\u73b0\u4ee3\u4ea7\u7269",level:2},{value:"ES Module \u548c CommonJS \u4ea7\u7269",id:"es-module-\u548c-commonjs-\u4ea7\u7269",level:2},{value:"UMD \u4ea7\u7269",id:"umd-\u4ea7\u7269",level:2}],o={toc:m};function s(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},o,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"\u6784\u5efa\u4ea7\u7269"},"\u6784\u5efa\u4ea7\u7269"),(0,r.kt)("p",null,"\u672c\u6587\u8bb2\u8ff0\u4e0d\u540c",(0,r.kt)("a",{parentName:"p",href:"./abilities#%E5%8F%8C%E6%A8%A1%E5%BC%8F%E6%9E%84%E5%BB%BA"},"\u6784\u5efa\u6a21\u5f0f"),"\u4e0b\u7684\u4ea7\u7269\u8bf4\u660e\u4ee5\u53ca\u9002\u7528\u7684\u573a\u666f\u3002\u5b8c\u6574\u7684\u4ea7\u7269\u6784\u5efa\u914d\u7f6e\u53ef\u67e5\u770b\u6587\u6863 ",(0,r.kt)("a",{parentName:"p",href:"../reference/config#transform"},"Transform \u6a21\u5f0f\u6784\u5efa\u914d\u7f6e"),"\u548c ",(0,r.kt)("a",{parentName:"p",href:"../reference/config#bundle"},"Bundle \u6a21\u5f0f\u6784\u5efa\u914d\u7f6e"),"\u3002"),(0,r.kt)("h2",{id:"\u6784\u5efa\u4ea7\u7269\u8bf4\u660e"},"\u6784\u5efa\u4ea7\u7269\u8bf4\u660e"),(0,r.kt)("p",null,"ICE PKG \u9ed8\u8ba4\u652f\u6301 ",(0,r.kt)("inlineCode",{parentName:"p"},"esm"),"\u3001",(0,r.kt)("inlineCode",{parentName:"p"},"es2017"),"\u3001",(0,r.kt)("inlineCode",{parentName:"p"},"cjs"),"\u3001",(0,r.kt)("inlineCode",{parentName:"p"},"umd")," \u56db\u79cd\u6784\u5efa\u4ea7\u7269\u7c7b\u578b\u3002\u6bcf\u79cd\u4ea7\u7269\u7c7b\u578b\u5728\u4e0d\u540c\u6784\u5efa\u6a21\u5f0f\u4e0b\u652f\u6301\u60c5\u51b5\u3001\u6a21\u5757\u89c4\u8303\u3001\u8bed\u6cd5\u89c4\u8303\u8bf4\u660e\u5982\u4e0b\u8868\uff1a"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:"center"},"\u4ea7\u7269\u7c7b\u578b"),(0,r.kt)("th",{parentName:"tr",align:"center"},"Transform \u6a21\u5f0f"),(0,r.kt)("th",{parentName:"tr",align:"center"},"Bundle \u6a21\u5f0f"),(0,r.kt)("th",{parentName:"tr",align:"center"},"\u6a21\u5757\u89c4\u8303"),(0,r.kt)("th",{parentName:"tr",align:"center"},"\u8bed\u6cd5\u89c4\u8303"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"esm")),(0,r.kt)("td",{parentName:"tr",align:"center"},"\u2705\u652f\u6301"),(0,r.kt)("td",{parentName:"tr",align:"center"},"\u2705\u652f\u6301"),(0,r.kt)("td",{parentName:"tr",align:"center"},"ES Module"),(0,r.kt)("td",{parentName:"tr",align:"center"},"ES5")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"es2017")),(0,r.kt)("td",{parentName:"tr",align:"center"},"\u2705\u652f\u6301"),(0,r.kt)("td",{parentName:"tr",align:"center"},"\u2705\u652f\u6301"),(0,r.kt)("td",{parentName:"tr",align:"center"},"ES Module"),(0,r.kt)("td",{parentName:"tr",align:"center"},"ES2017")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"cjs")),(0,r.kt)("td",{parentName:"tr",align:"center"},"\u2705\u652f\u6301"),(0,r.kt)("td",{parentName:"tr",align:"center"},"\u2705\u652f\u6301"),(0,r.kt)("td",{parentName:"tr",align:"center"},"CommonJS"),(0,r.kt)("td",{parentName:"tr",align:"center"},"ES5")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"umd")),(0,r.kt)("td",{parentName:"tr",align:"center"},"\u274c\u4e0d\u652f\u6301"),(0,r.kt)("td",{parentName:"tr",align:"center"},"\u2705\u652f\u6301"),(0,r.kt)("td",{parentName:"tr",align:"center"},"UMD"),(0,r.kt)("td",{parentName:"tr",align:"center"},"ES5")))),(0,r.kt)("p",null,"\u6bcf\u79cd\u6784\u5efa\u4ea7\u7269\u7684\u4f18\u7f3a\u70b9\u548c\u9002\u7528\u573a\u666f\u5982\u4e0b\u8868\u6240\u793a\uff1a"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:"center"},"\u4ea7\u7269\u7c7b\u578b"),(0,r.kt)("th",{parentName:"tr",align:null},"\u4f18\u70b9"),(0,r.kt)("th",{parentName:"tr",align:null},"\u7f3a\u70b9"),(0,r.kt)("th",{parentName:"tr",align:null},"\u9002\u7528\u573a\u666f"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"esm")),(0,r.kt)("td",{parentName:"tr",align:null},"\u517c\u5bb9\u6027\u8f83\u597d"),(0,r.kt)("td",{parentName:"tr",align:null},"\u4f53\u79ef\u5927"),(0,r.kt)("td",{parentName:"tr",align:null},"\u6d88\u8d39\u4ea7\u7269\u7684\u5e94\u7528\u6253\u5305\u65f6\u4e0d\u7f16\u8bd1 ",(0,r.kt)("inlineCode",{parentName:"td"},"node_modules"),"\uff1b\u6216\u8005\u8fd0\u884c\u73af\u5883\u652f\u6301\u7684 ECMAScript \u7248\u672c\u8f83\u4f4e")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"es2017")),(0,r.kt)("td",{parentName:"tr",align:null},"\u4fdd\u7559\u5927\u90e8\u5206 JavaScript \u8bed\u6cd5\uff0c\u4f53\u79ef\u5c0f"),(0,r.kt)("td",{parentName:"tr",align:null},"\u517c\u5bb9\u6027\u5dee"),(0,r.kt)("td",{parentName:"tr",align:null},"\u6d88\u8d39\u4ea7\u7269\u7684\u5e94\u7528\u6253\u5305\u65f6\u7f16\u8bd1 ",(0,r.kt)("inlineCode",{parentName:"td"},"node_modules"),"\uff1b\u6216\u8005\u8fd0\u884c\u73af\u5883\u652f\u6301\u7684 ES2017 \u8bed\u6cd5\u3002\u66f4\u591a\u8bf4\u660e\u53ef\u53c2\u8003",(0,r.kt)("a",{parentName:"td",href:"./abilities#es2017-%E4%BA%A7%E7%89%A9"},"\u6587\u6863"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"cjs")),(0,r.kt)("td",{parentName:"tr",align:null},"\u517c\u5bb9\u5404\u7248\u672c\u7684 Node.js"),(0,r.kt)("td",{parentName:"tr",align:null},"\u4f53\u79ef\u5927"),(0,r.kt)("td",{parentName:"tr",align:null},"\u5728 Node.js \u73af\u5883\u4e0b\u8fd0\u884c")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},(0,r.kt)("inlineCode",{parentName:"td"},"umd")),(0,r.kt)("td",{parentName:"tr",align:null},"\u517c\u5bb9\u8fd0\u884c\u5728\u6d4f\u89c8\u5668\u548c Node.js \u4e2d"),(0,r.kt)("td",{parentName:"tr",align:null},"\u4f53\u79ef\u5927"),(0,r.kt)("td",{parentName:"tr",align:null},"\u7528\u6237\u7684\u9879\u76ee\u4e2d\u67d0\u4e2a\u4f9d\u8d56 external\uff0c\u9700\u8981\u5728 HTML \u4e2d\u901a\u8fc7 ",(0,r.kt)("inlineCode",{parentName:"td"},"<script />")," \u5f15\u5165 UMD \u4ea7\u7269\uff1b\u6216\u8005\u5728\u6d4f\u89c8\u5668\u4e2d\u76f4\u63a5\u4f7f\u7528\u4ea7\u7269")))),(0,r.kt)("h2",{id:"\u9ed8\u8ba4\u6784\u5efa\u4ea7\u7269"},"\u9ed8\u8ba4\u6784\u5efa\u4ea7\u7269"),(0,r.kt)("p",null,"\u4e0b\u9762\u662f ICE PKG \u9ed8\u8ba4\u7684\u4ea7\u7269\u6784\u5efa\u914d\u7f6e\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="build.config.mts"',title:'"build.config.mts"'},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  transform: {\n    formats: ['esm', 'es2017'],\n  },\n})\n")),(0,r.kt)("p",null,"\u9ed8\u8ba4\u60c5\u51b5\u4e0b\uff0cICE PKG \u53ea\u542f\u7528 Transform \u6a21\u5f0f\u5e76\u5c06\u4ea7\u7269\u5206\u522b\u8f93\u51fa\u5230 ",(0,r.kt)("inlineCode",{parentName:"p"},"esm")," \u76ee\u5f55\u548c ",(0,r.kt)("inlineCode",{parentName:"p"},"es2017")," \u76ee\u5f55\u3002"),(0,r.kt)("p",null,"\u6267\u884c ",(0,r.kt)("inlineCode",{parentName:"p"},"npm run build")," \u547d\u4ee4\u540e\uff0c\u5f97\u5230\u4ee5\u4e0b\u7684\u6784\u5efa\u4ea7\u7269\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-md"},"\u2500\u2500 es2017\n|  \u251c\u2500\u2500 index.d.ts\n|  \u2514\u2500\u2500 index.js\n\u251c\u2500\u2500 esm\n|  \u251c\u2500\u2500 index.d.ts\n|  \u2514\u2500\u2500 index.js\n")),(0,r.kt)("p",null,"\u8f93\u51fa\u6784\u5efa\u76ee\u5f55\u540d\u548c\u6784\u5efa\u4ea7\u7269\u7c7b\u578b\u4e00\u4e00\u5bf9\u5e94\u3002"),(0,r.kt)("p",null,"\u5bf9\u4e8e React \u7ec4\u4ef6\u6765\u8bf4\uff0c\u5b83\u4eec\u4f1a\u5728\u5e94\u7528\u4e2d\u6d88\u8d39\uff0c\u800c\u5e94\u7528\u901a\u5e38\u662f\u4f1a\u88ab\u6253\u5305\u5de5\u5177\u6253\u5305\u540e\u624d\u80fd\u5728\u751f\u4ea7\u73af\u5883\u4e2d\u4f7f\u7528\u3002\u4ee5 Webpack \u4e3e\u4f8b\uff0c\u53ef\u4ee5\u914d\u7f6e ",(0,r.kt)("inlineCode",{parentName:"p"},"resolve.conditionNames = ['es2017', 'esm']"),"\uff0c\u8fd9\u6837\u4f1a\u4f18\u5148\u4f7f\u7528 es2017 \u4ea7\u7269\uff0c\u914d\u5408\u5728 ",(0,r.kt)("inlineCode",{parentName:"p"},"browserslist")," \u4e2d\u914d\u7f6e\u9ad8\u7248\u672c\u7684\u6d4f\u89c8\u5668\uff08\u6bd4\u5982\u4e2d\u540e\u53f0\u573a\u666f\uff09\uff0c\u6253\u5305\u51fa\u6765\u7684\u4ea7\u7269\u80fd\u76f4\u63a5\u8fd0\u884c\u5728\u76ee\u6807\u6d4f\u89c8\u5668\uff0c\u4f53\u79ef\u4e5f\u4f1a\u66f4\u5c0f\u3002"),(0,r.kt)("h2",{id:"\u6784\u5efa\u73b0\u4ee3\u4ea7\u7269"},"\u6784\u5efa\u73b0\u4ee3\u4ea7\u7269"),(0,r.kt)("p",null,"\u5982\u679c\u4f60\u786e\u5b9a\u4f60\u7684\u8fd0\u884c\u73af\u5883\u652f\u6301 ",(0,r.kt)("a",{parentName:"p",href:"./abilities#es2017-%E4%BA%A7%E7%89%A9"},"ES2017 \u4ea7\u7269"),"\uff0c\u63a8\u8350\u4f7f\u7528\u4ee5\u4e0b\u7684\u914d\u7f6e\u4ec5\u751f\u6210\u4f53\u79ef\u66f4\u5c0f\u7684\u6784\u5efa\u4ea7\u7269\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="build.config.mts"',title:'"build.config.mts"'},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  transform: {\n    formats: ['es2017'],\n  },\n  bundle: {\n    formats: ['esm', 'es2017'],\n  },\n})\n")),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},(0,r.kt)("a",{parentName:"p",href:"./abilities#transform-%E6%A8%A1%E5%BC%8F"},"Transform \u6a21\u5f0f"),"\u548c ",(0,r.kt)("a",{parentName:"p",href:"./abilities#bundle-%E6%A8%A1%E5%BC%8F"},"Bundle \u6a21\u5f0f"),"\u5747\u652f\u6301\u751f\u6210 ES2017 \u4ea7\u7269\u3002\u4f60\u53ef\u4ee5\u6839\u636e\u5b9e\u9645\u7684\u9700\u6c42\uff0c\u9009\u62e9\u542f\u52a8\u5355\u4e2a\u6a21\u5f0f\u6216\u8005\u53cc\u6a21\u5f0f\u3002")),(0,r.kt)("p",null,"\u6784\u5efa\u4ea7\u7269\u5982\u4e0b\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-md"},"\u2500\u2500 es2017\n|  \u251c\u2500\u2500 index.d.ts\n|  \u2514\u2500\u2500 index.js\n\u251c\u2500\u2500 dist\n|  \u2514\u2500\u2500 index.esm.es2017.production.js\n")),(0,r.kt)("h2",{id:"es-module-\u548c-commonjs-\u4ea7\u7269"},"ES Module \u548c CommonJS \u4ea7\u7269"),(0,r.kt)("p",null,"\u8fd9\u79cd\u573a\u666f\u4e0b\u662f\u9488\u5bf9\u8981\u751f\u6210\u8fd0\u884c\u5728 Node.js \u73af\u5883\u4e0b\u7684\u4ea7\u7269\u3002\u5982\u679c\u4f60\u7684\u4ea7\u7269\u9700\u8981\u517c\u5bb9\u4f4e\u7248\u672c Node.js (v12.20.0 \u4ee5\u4e0b)\uff0c\u5219\u8fd8\u662f\u9700\u8981\u751f\u6210 CommonJS \u4ea7\u7269\uff0c\u5426\u5219\u53ef\u4ee5\u76f4\u63a5\u4f7f\u7528 ES Module \u7684\u4ea7\u7269\u3002"),(0,r.kt)("admonition",{type:"tip"},(0,r.kt)("p",{parentName:"admonition"},"\u4e0d\u540c\u7248\u672c\u7684 Node.js \u652f\u6301\u7684 ECMAScript \u8bed\u6cd5\u53ef\u53c2\u8003 ",(0,r.kt)("a",{parentName:"p",href:"https://node.green/"},"Node Green \u7f51\u7ad9"),"\u3002")),(0,r.kt)("p",null,"\u7531\u4e8e Node 12.20.0 \u652f\u6301 ES Module \u548c\u6240\u6709\u7684 ES2017 \u7684\u8bed\u6cd5\u3002\u56e0\u6b64\u63a8\u8350\u4ee5\u4e0b\u7684\u914d\u7f6e\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="build.config.mts"',title:'"build.config.mts"'},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  transform: {\n    formats: ['cjs', 'es2017'],\n  },\n  bundle: {\n    formats: ['cjs', 'esm', 'es2017'],\n  },\n})\n")),(0,r.kt)("blockquote",null,(0,r.kt)("p",{parentName:"blockquote"},(0,r.kt)("a",{parentName:"p",href:"./abilities#transform-%E6%A8%A1%E5%BC%8F"},"Transform \u6a21\u5f0f"),"\u548c ",(0,r.kt)("a",{parentName:"p",href:"./abilities#bundle-%E6%A8%A1%E5%BC%8F"},"Bundle \u6a21\u5f0f")," \u5747\u652f\u6301\u751f\u6210 ES2017 \u4ea7\u7269\u548c CommonJS \u4ea7\u7269\u3002\u4f60\u53ef\u4ee5\u6839\u636e\u5b9e\u9645\u7684\u9700\u6c42\uff0c\u9009\u62e9\u542f\u52a8\u5355\u4e2a\u6a21\u5f0f\u6216\u8005\u53cc\u6a21\u5f0f\u3002")),(0,r.kt)("p",null,"\u6267\u884c ",(0,r.kt)("inlineCode",{parentName:"p"},"npm run build")," \u540e\u8f93\u51fa\u7684\u4ea7\u7269\u5982\u4e0b\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-md"},"\u2500\u2500 cjs\n|  \u251c\u2500\u2500 index.d.ts\n|  \u2514\u2500\u2500 index.js\n\u251c\u2500\u2500 es2017\n|  \u251c\u2500\u2500 index.d.ts\n|  \u2514\u2500\u2500 index.js\n\u251c\u2500\u2500 dist\n|  \u251c\u2500\u2500 index.cjs.es5.production.js\n|  \u2514\u2500\u2500 index.esm.es2017.production.js\n")),(0,r.kt)("p",null,"\u5176\u4e2d\uff0c",(0,r.kt)("inlineCode",{parentName:"p"},"cjs")," \u76ee\u5f55\u548c ",(0,r.kt)("inlineCode",{parentName:"p"},"es2017")," \u76ee\u5f55\u662f Transform \u6784\u5efa\u6a21\u5f0f\u7684\u4ea7\u7269\uff1b",(0,r.kt)("inlineCode",{parentName:"p"},"dist")," \u76ee\u5f55\u662f Bundle \u6784\u5efa\u6a21\u5f0f\u7684\u4ea7\u7269\u3002"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:"center"},"\u4ea7\u7269\u7c7b\u578b"),(0,r.kt)("th",{parentName:"tr",align:null},"\u6a21\u5757\u89c4\u8303"),(0,r.kt)("th",{parentName:"tr",align:null},"\u8bed\u6cd5\u89c4\u8303"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},"es2017"),(0,r.kt)("td",{parentName:"tr",align:null},"ES Module"),(0,r.kt)("td",{parentName:"tr",align:null},"ES2017")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:"center"},"cjs"),(0,r.kt)("td",{parentName:"tr",align:null},"CommonJS"),(0,r.kt)("td",{parentName:"tr",align:null},"ES5")))),(0,r.kt)("p",null,"\u7136\u540e\u5728 ",(0,r.kt)("inlineCode",{parentName:"p"},"package.json")," \u4e2d\u914d\u7f6e ",(0,r.kt)("inlineCode",{parentName:"p"},"exports")," \u4ea7\u7269\u5bfc\u51fa\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-json"},'{\n  "exports": {\n    ".": {\n      "import": "./es2017/index.js",\n      "require": "./cjs/index.js",\n      "default": "./cjs/index.js",\n    }\n  }\n}\n')),(0,r.kt)("h2",{id:"umd-\u4ea7\u7269"},"UMD \u4ea7\u7269"),(0,r.kt)("p",null,"\u4e00\u822c\u60c5\u51b5\u4e0b\uff0c",(0,r.kt)("a",{parentName:"p",href:"./scenarios#%E5%89%8D%E7%AB%AF%E7%B1%BB%E5%BA%93"},"\u524d\u7aef\u7c7b\u5e93"),"\u7684\u573a\u666f\u9700\u8981\u6253\u5305\u6784\u5efa\u751f\u6210 UMD \u4ea7\u7269\u3002"),(0,r.kt)("p",null,"ICE PKG \u4ec5\u652f\u6301\u5728 ",(0,r.kt)("a",{parentName:"p",href:"./abilities#bundle-%E6%A8%A1%E5%BC%8F"},"Bundle \u6a21\u5f0f"),"\u4e0b\u6784\u5efa\u51fa UMD \u4ea7\u7269\uff0c\u914d\u7f6e\u65b9\u5f0f\u5982\u4e0b\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts",metastring:'title="build.config.mts"',title:'"build.config.mts"'},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  bundle: {\n    formats: ['umd'],\n    name: 'my-library',  // \u914d\u7f6e umd \u6a21\u5757\u5bfc\u51fa\u7684\u540d\u5b57\uff0c\u901a\u8fc7 `window[name]` \u8bbf\u95ee\n  }\n})\n")),(0,r.kt)("p",null,"\u6267\u884c ",(0,r.kt)("inlineCode",{parentName:"p"},"npm run build")," \u540e\uff0c\u5c06\u4f1a\u8f93\u51fa\u4ee5\u4e0b\u7684\u6784\u5efa\u7ed3\u679c\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-md"},"dist\n\u251c\u2500\u2500 index.umd.es5.production.css\n\u2514\u2500\u2500 index.umd.es5.production.js\n")),(0,r.kt)("p",null,"\u5982\u679c\u9700\u8981\u989d\u5916\u8f93\u51fa\u4e00\u4efd\u672a\u538b\u7f29\u7684 UMD \u4ea7\u7269\u4ee5\u65b9\u4fbf\u8c03\u8bd5\u6784\u5efa\uff0c\u53ef\u4ee5\u65b0\u589e ",(0,r.kt)("a",{parentName:"p",href:"../reference/config#modes"},"bundle.modes \u914d\u7f6e\u9879"),"\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-diff",metastring:'title="build.config.mts"',title:'"build.config.mts"'},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  bundle: {\n    formats: ['umd'],\n    name: 'my-library',\n+   modes: ['production', 'development'],\n  }\n})\n")),(0,r.kt)("p",null,"\u6267\u884c ",(0,r.kt)("inlineCode",{parentName:"p"},"npm run build")," \u540e\uff0c\u5c06\u4f1a\u8f93\u51fa\u4ee5\u4e0b\u7684\u6784\u5efa\u7ed3\u679c\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-md"},"dist\n\u251c\u2500\u2500 index.umd.es5.development.css\n\u251c\u2500\u2500 index.umd.es5.development.js\n\u251c\u2500\u2500 index.umd.es5.production.css\n\u2514\u2500\u2500 index.umd.es5.production.js\n")))}s.isMDXComponent=!0}}]);