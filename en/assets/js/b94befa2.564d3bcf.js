"use strict";(self.webpackChunkicepkg_site=self.webpackChunkicepkg_site||[]).push([[682],{734:function(e,n,t){t.d(n,{Zo:function(){return u},kt:function(){return c}});var l=t(9231);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function r(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);n&&(l=l.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,l)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?r(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function o(e,n){if(null==e)return{};var t,l,a=function(e,n){if(null==e)return{};var t,l,a={},r=Object.keys(e);for(l=0;l<r.length;l++)t=r[l],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(l=0;l<r.length;l++)t=r[l],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var p=l.createContext({}),s=function(e){var n=l.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},u=function(e){var n=s(e.components);return l.createElement(p.Provider,{value:n},e.children)},m={inlineCode:"code",wrapper:function(e){var n=e.children;return l.createElement(l.Fragment,{},n)}},d=l.forwardRef((function(e,n){var t=e.components,a=e.mdxType,r=e.originalType,p=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),d=s(t),c=a,k=d["".concat(p,".").concat(c)]||d[c]||m[c]||r;return t?l.createElement(k,i(i({ref:n},u),{},{components:t})):l.createElement(k,i({ref:n},u))}));function c(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var r=t.length,i=new Array(r);i[0]=d;var o={};for(var p in n)hasOwnProperty.call(n,p)&&(o[p]=n[p]);o.originalType=e,o.mdxType="string"==typeof e?e:a,i[1]=o;for(var s=2;s<r;s++)i[s]=t[s];return l.createElement.apply(null,i)}return l.createElement.apply(null,t)}d.displayName="MDXCreateElement"},2443:function(e,n,t){t.r(n),t.d(n,{assets:function(){return p},contentTitle:function(){return i},default:function(){return m},frontMatter:function(){return r},metadata:function(){return o},toc:function(){return s}});var l=t(9044),a=(t(9231),t(734));const r={},i="\u5b8c\u6574\u914d\u7f6e\u9879",o={unversionedId:"reference/config-list",id:"reference/config-list",title:"\u5b8c\u6574\u914d\u7f6e\u9879",description:"\u6240\u6709\u914d\u7f6e\u9879\u5982\u4e0b\uff1a",source:"@site/docs/reference/config-list.md",sourceDirName:"reference",slug:"/reference/config-list",permalink:"/en/reference/config-list",draft:!1,editUrl:"https://github.com/ice-lab/icepkg/tree/main/website/docs/docs/reference/config-list.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"\u524d\u7aef\u7c7b\u5e93",permalink:"/en/scenarios/web"},next:{title:"\u5f00\u53d1\u63d2\u4ef6",permalink:"/en/reference/plugins-development"}},p={},s=[{value:"alias",id:"alias",level:2},{value:"define",id:"define",level:2},{value:"sourceMaps",id:"sourcemaps",level:2},{value:"generateTypesForJs",id:"generatetypesforjs",level:2},{value:"plugins",id:"plugins",level:2},{value:"transfrom",id:"transfrom",level:2},{value:"formats",id:"formats",level:3},{value:"excludes",id:"excludes",level:3},{value:"bundle",id:"bundle",level:2},{value:"formats",id:"formats-1",level:3},{value:"name",id:"name",level:3},{value:"filename",id:"filename",level:3},{value:"externals",id:"externals",level:3},{value:"development",id:"development",level:3}],u={toc:s};function m(e){let{components:n,...t}=e;return(0,a.kt)("wrapper",(0,l.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"\u5b8c\u6574\u914d\u7f6e\u9879"},"\u5b8c\u6574\u914d\u7f6e\u9879"),(0,a.kt)("p",null,"\u6240\u6709\u914d\u7f6e\u9879\u5982\u4e0b\uff1a"),(0,a.kt)("h2",{id:"alias"},"alias"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u7c7b\u578b ",(0,a.kt)("inlineCode",{parentName:"li"},"object")),(0,a.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4\u503c ",(0,a.kt)("inlineCode",{parentName:"li"},"{}"))),(0,a.kt)("p",null,"\u6bd4\u5982\uff0c\u5c06 ",(0,a.kt)("inlineCode",{parentName:"p"},"@")," \u6307\u5411 ",(0,a.kt)("inlineCode",{parentName:"p"},"./src/")," \u76ee\u5f55\u3002"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  alias: {\n    '@': './src/',\n  },\n});\n")),(0,a.kt)("h2",{id:"define"},"define"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u7c7b\u578b ",(0,a.kt)("inlineCode",{parentName:"li"},"string|boolean|object|null|undefined")),(0,a.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4\u503c ",(0,a.kt)("inlineCode",{parentName:"li"},"{}"))),(0,a.kt)("p",null,"\u5b9a\u4e49\u7f16\u8bd1\u65f6\u73af\u5883\u53d8\u91cf\uff0c\u4f1a\u5728\u7f16\u8bd1\u65f6\u88ab\u66ff\u6362\u3002\u8be6\u7ec6\u4ecb\u7ecd ",(0,a.kt)("a",{parentName:"p",href:"/guide/abilities#define"},"\u5de5\u7a0b\u80fd\u529b - define"),"\u3002"),(0,a.kt)("h2",{id:"sourcemaps"},"sourceMaps"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u7c7b\u578b ",(0,a.kt)("inlineCode",{parentName:"li"},"boolean | 'inline'")),(0,a.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4 ",(0,a.kt)("inlineCode",{parentName:"li"},"false"))),(0,a.kt)("p",null,"\u662f\u5426\u751f\u6210 sourcemap\uff0c\u8fd9\u5728\u4ee3\u7801\u8c03\u8bd5\u7684\u65f6\u5019\u975e\u5e38\u6709\u7528\u3002\u8be6\u7ec6\u4ecb\u7ecd ",(0,a.kt)("a",{parentName:"p",href:"/guide/abilities#sourcemap"},"\u5de5\u7a0b\u80fd\u529b - \u751f\u6210\u7c7b\u578b\u6587\u4ef6"),"\u3002"),(0,a.kt)("h2",{id:"generatetypesforjs"},"generateTypesForJs"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u7c7b\u578b ",(0,a.kt)("inlineCode",{parentName:"li"},"boolean")),(0,a.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4 ",(0,a.kt)("inlineCode",{parentName:"li"},"false"))),(0,a.kt)("p",null,"\u4e3a JavaScript \u4ee3\u7801\u751f\u6210\u7c7b\u578b\u6587\u4ef6\u3002ICE PKG \u9ed8\u8ba4\u4e3a\u6587\u4ef6\u540e\u7f00\u4e3a ",(0,a.kt)("inlineCode",{parentName:"p"},".ts")," \u751f\u6210\u7c7b\u578b\u6587\u4ef6\u3002"),(0,a.kt)("p",null,"\u5982\u679c\u4f7f\u7528 ",(0,a.kt)("a",{parentName:"p",href:"https://jsdoc.app/"},"JSDoc")," \u4e3a JavaScript \u751f\u6210\u4e86\u7c7b\u578b\u6ce8\u89e3\uff0c\u8be5\u914d\u7f6e\u4f1a\u975e\u5e38\u6709\u6548\u3002\u8be6\u7ec6\u4ecb\u7ecd ",(0,a.kt)("a",{parentName:"p",href:"/guide/abilities#%E7%94%9F%E6%88%90%E7%B1%BB%E5%9E%8B%E6%96%87%E4%BB%B6"},"\u5de5\u7a0b\u80fd\u529b - \u751f\u6210\u7c7b\u578b\u6587\u4ef6"),"\u3002"),(0,a.kt)("h2",{id:"plugins"},"plugins"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u7c7b\u578b ",(0,a.kt)("inlineCode",{parentName:"li"},"array")),(0,a.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4 ",(0,a.kt)("inlineCode",{parentName:"li"},"[]"))),(0,a.kt)("p",null,"ICE PKG \u57fa\u4e8e ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/ice-lab/build-scripts"},"build-scripts")," \u63d2\u4ef6\u7cfb\u7edf\u3002\u66f4\u591a\u5185\u5bb9\u8bf7\u53c2\u8003 ",(0,a.kt)("a",{parentName:"p",href:"/reference/plugins-development"},"\u63d2\u4ef6\u5f00\u53d1"),"\u3002"),(0,a.kt)("h2",{id:"transfrom"},"transfrom"),(0,a.kt)("p",null,"\u8be5\u5b57\u6bb5\u5b9a\u4e49 ",(0,a.kt)("a",{parentName:"p",href:"/#%E5%8F%8C%E6%A8%A1%E5%BC%8F"},"transform \u6a21\u5f0f")," \u4e0b\u989d\u5916\u7684\u914d\u7f6e\u3002",(0,a.kt)("inlineCode",{parentName:"p"},"bundle")," \u5305\u542b\u4ee5\u4e0b\u914d\u7f6e\uff1a"),(0,a.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,a.kt)("div",{parentName:"div",className:"admonition-heading"},(0,a.kt)("h5",{parentName:"div"},(0,a.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,a.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,a.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,a.kt)("div",{parentName:"div",className:"admonition-content"},(0,a.kt)("p",{parentName:"div"},"transform \u6a21\u5f0f\u662f ICE PKG \u9ed8\u8ba4\u7684\u7f16\u8bd1\u6a21\u5f0f\u3002"))),(0,a.kt)("h3",{id:"formats"},"formats"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u7c7b\u578b ",(0,a.kt)("inlineCode",{parentName:"li"},"['esm', 'cjs', 'es2017']")),(0,a.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4 ",(0,a.kt)("inlineCode",{parentName:"li"},"['esm', 'es2017']"))),(0,a.kt)("p",null,"\u8f93\u51fa\u7684\u7c7b\u578b\u3002ICE PKG \u4f1a\u9ed8\u8ba4\u7f16\u8bd1\u51fa ",(0,a.kt)("inlineCode",{parentName:"p"},"esm")," (\u8f93\u51fa ES module + ES5 \u4ea7\u7269) \u548c ",(0,a.kt)("inlineCode",{parentName:"p"},"es2017")," (\u8f93\u51fa ES module + ES2017 \u4ea7\u7269) \u4e24\u4e2a\u6587\u4ef6\u5939\u3002"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"- esm # ES module + ES5 \u4ea7\u7269\n- es2017 # ES module + ES2017 \u4ea7\u7269\n")),(0,a.kt)("p",null,"\u82e5\u60f3\u8981\u8f93\u51fa CommonJS \u4ea7\u7269\uff0c\u53ef\u5982\u4e0b\u914d\u7f6e\uff1a"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  transfrom: {\n    formats: ['cjs', 'esm', 'es2017'],\n  },\n});\n")),(0,a.kt)("p",null,"\u5219\u8f93\u51fa\u5982\u4e0b\u6587\u4ef6\u5939\uff1a"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell"},"- cjs # CommonJS + ES5 \u4ea7\u7269\n- esm # ES module + ES5 \u4ea7\u7269\n- es2017 # ES module + ES2017 \u4ea7\u7269\n")),(0,a.kt)("h3",{id:"excludes"},"excludes"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u7c7b\u578b ",(0,a.kt)("inlineCode",{parentName:"li"},"string | string[]")),(0,a.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4 ",(0,a.kt)("inlineCode",{parentName:"li"},"\u7a7a"))),(0,a.kt)("p",null,"\u6392\u9664\u65e0\u9700\u7f16\u8bd1\u7684\u6587\u4ef6\u3002\u6bd4\u5982\uff0c\u6211\u4eec\u4e0d\u60f3\u7f16\u8bd1 ",(0,a.kt)("inlineCode",{parentName:"p"},"src")," \u4e0b\u7684\u6240\u6709\u6d4b\u8bd5\u6587\u4ef6\uff0c\u5176\u4e2d\u6d4b\u8bd5\u6587\u4ef6\u5305\u542b\u5728 ",(0,a.kt)("inlineCode",{parentName:"p"},"__tests__")," \u76ee\u5f55\u4e0b\uff0c\u6216\u4ee5 ",(0,a.kt)("inlineCode",{parentName:"p"},"*.test.[j|t]s")," \u7ed3\u5c3e\u3002"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  transfrom: {\n    excludes: ['**/__tests__/**', '*.test.[j|t]s'],\n  },\n});\n")),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"excludes")," \u7684\u914d\u7f6e\u5b8c\u5168\u9075\u5faa ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/isaacs/minimatch"},"minimatch")," \u5199\u6cd5\u3002"),(0,a.kt)("h2",{id:"bundle"},"bundle"),(0,a.kt)("p",null,"\u8be5\u5b57\u6bb5\u5b9a\u4e49 ",(0,a.kt)("a",{parentName:"p",href:"/#%E5%8F%8C%E6%A8%A1%E5%BC%8F"},"bundle \u6a21\u5f0f")," \u4e0b\u989d\u5916\u7684\u914d\u7f6e\uff0c\u82e5\u5f00\u542f\uff0c\u9ed8\u8ba4\u751f\u6210 ",(0,a.kt)("inlineCode",{parentName:"p"},"dist")," \u6587\u4ef6\u76ee\u5f55\u3002",(0,a.kt)("inlineCode",{parentName:"p"},"bundle")," \u5305\u542b\u4ee5\u4e0b\u914d\u7f6e\uff1a"),(0,a.kt)("h3",{id:"formats-1"},"formats"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u7c7b\u578b ",(0,a.kt)("inlineCode",{parentName:"li"},"['esm', 'umd', 'es2017']")),(0,a.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4 ",(0,a.kt)("inlineCode",{parentName:"li"},"['esm', 'es2017']"))),(0,a.kt)("p",null,"\u8f93\u51fa\u7684\u7c7b\u578b\uff0c\u9ed8\u8ba4\u662f\u8f93\u51fa ",(0,a.kt)("inlineCode",{parentName:"p"},"esm")," \u548c ",(0,a.kt)("inlineCode",{parentName:"p"},"es2017")," \u4ea7\u7269\u3002"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell",metastring:"title=root/dist",title:"root/dist"},"- index.production.js # \u8f93\u51fa ES module + es5 \u4ea7\u7269\n- index.es2017.production.js # \u8f93\u51fa ES module + es2017 \u4ea7\u7269\n")),(0,a.kt)("p",null,"\u82e5\u53ea\u9700\u8981\u4ea7\u51fa umd \u89c4\u8303\u4ea7\u7269\uff0c\u53ef\u914d\u7f6e\u4e3a\uff1a"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  bundle: {\n    formats: ['umd', 'es2017'],\n  },\n});\n")),(0,a.kt)("p",null,"\u5219\u8f93\u51fa\u4e00\u4e0b\u4ea7\u7269\uff1a"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell",metastring:"title=root/dist",title:"root/dist"},"- index.umd.production.js # \u8f93\u51fa umd + es5 \u4ea7\u7269\n- index.umd.es2017.production.js # \u8f93\u51fa umd + es2017 \u4ea7\u7269\n")),(0,a.kt)("h3",{id:"name"},"name"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u7c7b\u578b ",(0,a.kt)("inlineCode",{parentName:"li"},"string")),(0,a.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4 ",(0,a.kt)("inlineCode",{parentName:"li"},"package.name"))),(0,a.kt)("p",null,"library \u5bfc\u51fa\u7684\u540d\u79f0\uff0c\u53ef\u4ee5\u901a\u8fc7 ",(0,a.kt)("inlineCode",{parentName:"p"},"window[name]")," \u8bbf\u95ee\u3002\u9ed8\u8ba4\u4e3a ",(0,a.kt)("inlineCode",{parentName:"p"},"package.json")," \u914d\u7f6e\u7684 ",(0,a.kt)("inlineCode",{parentName:"p"},"name")," \u5b57\u6bb5\u3002"),(0,a.kt)("h3",{id:"filename"},"filename"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u7c7b\u578b ",(0,a.kt)("inlineCode",{parentName:"li"},"string")),(0,a.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4 ",(0,a.kt)("inlineCode",{parentName:"li"},"index.js"))),(0,a.kt)("p",null,"\u751f\u6210\u7684\u6587\u4ef6\u540d\u524d\u7f00\uff0c\u9ed8\u8ba4\u4e3a ",(0,a.kt)("inlineCode",{parentName:"p"},"index.js"),"\u3002"),(0,a.kt)("h3",{id:"externals"},"externals"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u7c7b\u578b ",(0,a.kt)("inlineCode",{parentName:"li"},"boolean|object")),(0,a.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4 ",(0,a.kt)("inlineCode",{parentName:"li"},"true"))),(0,a.kt)("p",null,"\u9ed8\u8ba4\u60c5\u51b5\u4e0b\uff0cbundle \u7684\u4ea7\u7269\u4e0d\u5305\u542b\u4f9d\u8d56\u4ea7\u7269\u3002\u8be5\u9009\u9879\u53ef\u4fee\u6539\u8fd9\u4e00\u7ed3\u679c\u3002\u82e5\u60f3\u8981 bundle \u5305\u542b\u6240\u6709\u4f9d\u8d56\u4ea7\u7269\uff0c\u53ef\u5982\u4e0b\u914d\u7f6e\uff1a"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  bundle: {\n    externals: false,\n  },\n});\n")),(0,a.kt)("p",null,"\u82e5\u60f3\u8981\u81ea\u5b9a\u4e49\u914d\u7f6e externals\uff0c\u53c2\u8003\u5982\u4e0b\u914d\u7f6e\uff1a"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  bundle: {\n    externals: {\n      react: 'React',\n      'react-dom': 'ReactDOM',\n    },\n  },\n});\n")),(0,a.kt)("h3",{id:"development"},"development"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"\u7c7b\u578b ",(0,a.kt)("inlineCode",{parentName:"li"},"boolean")),(0,a.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4 ",(0,a.kt)("inlineCode",{parentName:"li"},"false"))),(0,a.kt)("p",null,"\u82e5\u5f00\u542f\u8be5\u9009\u9879\uff0c\u5219\u4f1a\u989d\u5916\u8f93\u51fa\u4e00\u4efd ",(0,a.kt)("strong",{parentName:"p"},"\u672a\u538b\u7f29\u7684")," \u7684\u4ea7\u7269\uff0c\u8fd9\u4e5f\u610f\u5473\u7740\u7528\u6237\u53ef\u4ee5\u5728\u5f00\u53d1\u6001\u4f7f\u7528\u8be5\u4ea7\u7269\u83b7\u5f97\u66f4\u591a\u7684\u5f00\u53d1\u65f6\u4fe1\u606f\u3002\u5728\u5f00\u53d1 Library \u65f6\uff0c\u8fd9\u5c06\u4f1a\u975e\u5e38\u6709\u4f5c\u7528\u3002"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  bundle: {\n    development: true,\n  },\n});\n")),(0,a.kt)("p",null,"\u4e0a\u8ff0\u914d\u7f6e\u4f1a\u8f93\u51fa\u5982\u4e0b\u4ea7\u7269\uff1a"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell",metastring:"title=root/dist",title:"root/dist"},"- index.development.js # \u8f93\u51fa\u672a\u538b\u7f29\u4ea7\u7269\uff08ES module + es5\uff09\n- index.production.js # \u8f93\u51fa\u538b\u7f29\u4ea7\u7269 (ES module + es5)\n- index.es2017.development.js # \u8f93\u51fa\u672a\u538b\u7f29\u4ea7\u7269 \uff08ES module + es2017\uff09\n- index.es2017.produciton.js # \u8f93\u51fa\u672a\u538b\u7f29\u4ea7\u7269 (ES module + es2017)\n")))}m.isMDXComponent=!0}}]);