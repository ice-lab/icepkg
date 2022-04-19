"use strict";(self.webpackChunkice_component=self.webpackChunkice_component||[]).push([[979],{3387:(t,e,n)=>{function l(t){return t&&"object"==typeof t&&"default"in t?t:{default:t}}var a=l(n(9496));function r(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function i(){return i=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var l in n)Object.prototype.hasOwnProperty.call(n,l)&&(t[l]=n[l])}return t},i.apply(this,arguments)}function p(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(t);e&&(l=l.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,l)}return n}function o(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?p(Object(n),!0).forEach((function(e){r(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):p(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function u(t,e){if(null==t)return{};var n,l,a=function(t,e){if(null==t)return{};var n,l,a={},r=Object.keys(t);for(l=0;l<r.length;l++)n=r[l],e.indexOf(n)>=0||(a[n]=t[n]);return a}(t,e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);for(l=0;l<r.length;l++)n=r[l],e.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(t,n)&&(a[n]=t[n])}return a}var m=a.default.createContext({}),d=function(t){var e=a.default.useContext(m),n=e;return t&&(n="function"==typeof t?t(e):o(o({},e),t)),n},k={inlineCode:"code",wrapper:function(t){var e=t.children;return a.default.createElement(a.default.Fragment,{},e)}},s=a.default.forwardRef((function(t,e){var n=t.components,l=t.mdxType,r=t.originalType,i=t.parentName,p=u(t,["components","mdxType","originalType","parentName"]),m=d(n),s=l,c=m["".concat(i,".").concat(s)]||m[s]||k[s]||r;return n?a.default.createElement(c,o(o({ref:e},p),{},{components:n})):a.default.createElement(c,o({ref:e},p))}));s.displayName="MDXCreateElement",e.Zo=function(t){var e=d(t.components);return a.default.createElement(m.Provider,{value:e},t.children)},e.kt=function(t,e){var n=arguments,l=e&&e.mdxType;if("string"==typeof t||l){var r=n.length,i=new Array(r);i[0]=s;var p={};for(var o in e)hasOwnProperty.call(e,o)&&(p[o]=e[o]);p.originalType=t,p.mdxType="string"==typeof t?t:l,i[1]=p;for(var u=2;u<r;u++)i[u]=n[u];return a.default.createElement.apply(null,i)}return a.default.createElement.apply(null,n)}},9071:(t,e,n)=>{n.r(e),n.d(e,{assets:()=>m,contentTitle:()=>o,default:()=>s,frontMatter:()=>p,metadata:()=>u,toc:()=>d});var l=n(2848),a=n(9213),r=(n(9496),n(3387)),i=["components"],p={},o="\u63d2\u4ef6\u5f00\u53d1",u={unversionedId:"reference/plugins-development",id:"reference/plugins-development",title:"\u63d2\u4ef6\u5f00\u53d1",description:"@ice/pkg \u57fa\u4e8e build-scripts \u63d2\u4ef6\u7cfb\u7edf\u3002\u901a\u8fc7 build-scripts \u63d2\u4ef6\uff0c\u53ef\u4ee5\u6781\u5927\u5730\u6269\u5c55 @ice/pkg \u7684\u80fd\u529b\u3002",source:"@site/docs/reference/plugins-development.md",sourceDirName:"reference",slug:"/reference/plugins-development",permalink:"/reference/plugins-development",tags:[],version:"current",frontMatter:{},sidebar:"defaultSidebar",previous:{title:"\u5b8c\u6574\u914d\u7f6e\u9879",permalink:"/reference/config-list"}},m={},d=[{value:"\u4fee\u6539\u9ed8\u8ba4\u914d\u7f6e",id:"\u4fee\u6539\u9ed8\u8ba4\u914d\u7f6e",level:2},{value:"entry",id:"entry",level:3},{value:"outputDir",id:"outputdir",level:3},{value:"rollupPlugins",id:"rollupplugins",level:3},{value:"rollupOptions",id:"rollupoptions",level:3},{value:"swcCompileOptions",id:"swccompileoptions",level:3},{value:"\u63d2\u4ef6\u751f\u547d\u5468\u671f\u94a9\u5b50",id:"\u63d2\u4ef6\u751f\u547d\u5468\u671f\u94a9\u5b50",level:2}],k={toc:d};function s(t){var e=t.components,n=(0,a.Z)(t,i);return(0,r.kt)("wrapper",(0,l.Z)({},k,n,{components:e,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"\u63d2\u4ef6\u5f00\u53d1"},"\u63d2\u4ef6\u5f00\u53d1"),(0,r.kt)("p",null,"@ice/pkg \u57fa\u4e8e ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/ice-lab/build-scripts"},"build-scripts")," \u63d2\u4ef6\u7cfb\u7edf\u3002\u901a\u8fc7 build-scripts \u63d2\u4ef6\uff0c\u53ef\u4ee5\u6781\u5927\u5730\u6269\u5c55 @ice/pkg \u7684\u80fd\u529b\u3002"),(0,r.kt)("p",null,"\u63d2\u4ef6\u7684\u4f7f\u7528\u5982\u4e0b\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import { defineConfig } from '@ice/pkg';\n\nexport default defineConfig({\n  plugins: [\n    \"./customPlugin.ts\"\n  ]\n})\n")),(0,r.kt)("h2",{id:"\u4fee\u6539\u9ed8\u8ba4\u914d\u7f6e"},"\u4fee\u6539\u9ed8\u8ba4\u914d\u7f6e"),(0,r.kt)("p",null,"\u53ef\u4ee5\u901a\u8fc7 ",(0,r.kt)("inlineCode",{parentName:"p"},"onGetConfig")," API\uff0c\u53ef\u4ee5\u4fee\u6539 Package \u7f16\u8bd1\u7684\u5165\u53e3\u3001\u51fa\u53e3\u7b49 @ice/pkg \u7b49\u9ed8\u8ba4\u914d\u7f6e\uff1a"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"const plugin = (api) => {\n  const { context, onGetConfig } = api;\n  const { rootDir } = context;\n\n  onGetConfig('component-es', config => {\n    return (\n      ...config,\n      outputDir: path.join(rootDir, 'esm'), // \u5c06\u51fa\u53e3\u4fee\u6539\u4e3a esm \u6587\u4ef6\u5939\n    )\n  })\n}\n")),(0,r.kt)("p",null,"@ice/pkg \u6ce8\u518c\u4e94\u4e2a build-script \u4efb\u52a1\uff1a"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"component-esm")," - \u9ed8\u8ba4\u542f\u52a8"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"component-es2017")," - \u9ed8\u8ba4\u542f\u52a8"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"component-cjs")," - \u5f53 transform \u914d\u7f6e\u4e86 ",(0,r.kt)("inlineCode",{parentName:"li"},"formats: ['cjs']")," \u542f\u52a8"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"component-dist-esm")," - \u5f53bundle \u914d\u7f6e\u4e86 ",(0,r.kt)("inlineCode",{parentName:"li"},"formats: ['esm']")," \u65f6\u542f\u52a8"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"component-dist-es2017")," - \u5f53\u5f00\u542f bundle \u914d\u7f6e\u4e86 ",(0,r.kt)("inlineCode",{parentName:"li"},"formats: ['es2017']")," \u65f6\u542f\u52a8")),(0,r.kt)("p",null,"\u5f53\u4e0d\u6307\u5b9a\u4efb\u52a1\u540d\uff08\u6bd4\u5982\uff0c\u6307\u5b9a ",(0,r.kt)("inlineCode",{parentName:"p"},"component-esm"),"\uff09\u65f6\uff0c\u914d\u7f6e\u5bf9\u6240\u6709\u4efb\u52a1\u751f\u6548\u3002"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-ts"},"import svelte from 'rollup-plugin-svelte';\n\nconst plugin = (api) => {\n  const { context, onGetConfig } = api;\n  const { rootDir } = context;\n\n  // \u4e0d\u6307\u5b9a Task name\n  onGetConfig(config => {\n    return {\n      ...config,\n      rollupPlugins: [\n        svelte(...) // \u7f16\u8bd1 svelte \u6587\u4ef6\u5219\u4f1a\u8fdb\u884c\u5bf9\u5e94\u7684\n      ]\n    }\n  })\n}\n")),(0,r.kt)("p",null,"\u6709\u4ee5\u4e0b\u53c2\u6570\u53ef\u4ee5\u914d\u7f6e\uff1a"),(0,r.kt)("h3",{id:"entry"},"entry"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"\u7c7b\u578b ",(0,r.kt)("inlineCode",{parentName:"li"},"string")),(0,r.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4\u503c ",(0,r.kt)("inlineCode",{parentName:"li"},"./src | ./src/index.[j|t]s"))),(0,r.kt)("p",null,"\u914d\u7f6e\u7ec4\u4ef6\u7f16\u8bd1\u7684\u5165\u53e3\u3002"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"\u4efb\u52a1"),(0,r.kt)("th",{parentName:"tr",align:null},"\u9ed8\u8ba4\u503c"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"component-esm"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"./src"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"component-es2017"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"./src"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"component-cjs"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"./src"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"component-dist-esm"),(0,r.kt)("td",{parentName:"tr",align:null},"`./src/index[j")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"component-dist-es2017"),(0,r.kt)("td",{parentName:"tr",align:null},"`./src/index[j")))),(0,r.kt)("h3",{id:"outputdir"},"outputDir"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"\u7c7b\u578b ",(0,r.kt)("inlineCode",{parentName:"li"},"string")),(0,r.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4\u503c ",(0,r.kt)("inlineCode",{parentName:"li"},"es | lib | dist"))),(0,r.kt)("p",null,"\u914d\u7f6e\u7ec4\u4ef6\u7f16\u8bd1\u7684\u51fa\u53e3\u3002"),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"\u4efb\u52a1"),(0,r.kt)("th",{parentName:"tr",align:null},"\u9ed8\u8ba4\u503c"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"component-esm"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"esm"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"component-es2017"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"es2017"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"component-cjs"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"cjs"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"component-dist-esm"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"dist"))),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"component-dis-es2017"),(0,r.kt)("td",{parentName:"tr",align:null},(0,r.kt)("inlineCode",{parentName:"td"},"dist"))))),(0,r.kt)("h3",{id:"rollupplugins"},"rollupPlugins"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"\u7c7b\u578b ",(0,r.kt)("inlineCode",{parentName:"li"},"array")),(0,r.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4\u503c ",(0,r.kt)("inlineCode",{parentName:"li"},"[]"))),(0,r.kt)("p",null,"\u914d\u7f6e\u989d\u5916\u7684 ",(0,r.kt)("a",{parentName:"p",href:"https://rollupjs.org/guide/en/#plugin-development"},"rollupPlugins"),"\u3002"),(0,r.kt)("h3",{id:"rollupoptions"},"rollupOptions"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"\u7c7b\u578b\uff1a",(0,r.kt)("inlineCode",{parentName:"li"},"object")),(0,r.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4\u503c ",(0,r.kt)("inlineCode",{parentName:"li"},"{}"))),(0,r.kt)("p",null,"\u5f53 ",(0,r.kt)("a",{parentName:"p",href:"/reference/config-list#bundle"},"\u5f00\u542f bundle \u6a21\u5f0f"),"\uff0c\u53ef\u901a\u8fc7 ",(0,r.kt)("inlineCode",{parentName:"p"},"rollupOptions")," \u914d\u7f6e\u989d\u5916\u7684 ",(0,r.kt)("a",{parentName:"p",href:"https://rollupjs.org/guide/en/#command-line-flags"},"rollup \u914d\u7f6e"),"\u3002"),(0,r.kt)("p",null,"\u5f53\u8bd5\u56fe\u4fee\u6539 ",(0,r.kt)("inlineCode",{parentName:"p"},"rollupOptions.plugins")," \u53c2\u6570\u65f6\uff0c\u5efa\u8bae\u76f4\u63a5\u4f7f\u7528 ",(0,r.kt)("a",{parentName:"p",href:"#rollupPlugins"},"rollupPlugins")," \u53c2\u6570\u3002"),(0,r.kt)("h3",{id:"swccompileoptions"},"swcCompileOptions"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"\u7c7b\u578b ",(0,r.kt)("inlineCode",{parentName:"li"},"array")),(0,r.kt)("li",{parentName:"ul"},"\u9ed8\u8ba4\u503c ",(0,r.kt)("inlineCode",{parentName:"li"},"{}"))),(0,r.kt)("p",null,"swc \u7f16\u8bd1\u9009\u9879\u3002\u5177\u4f53\u53ef\u53c2\u8003 ",(0,r.kt)("a",{parentName:"p",href:"https://swc.rs/docs/configuration/swcrc"},"swc \u914d\u7f6e"),"\u3002"),(0,r.kt)("h2",{id:"\u63d2\u4ef6\u751f\u547d\u5468\u671f\u94a9\u5b50"},"\u63d2\u4ef6\u751f\u547d\u5468\u671f\u94a9\u5b50"),(0,r.kt)("p",null,"@ice/pkg \u63d2\u4ef6\u63d0\u4f9b\u4e00\u4e0b\u751f\u547d\u5468\u671f\u94a9\u5b50\uff1a"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"build \u547d\u4ee4\uff1a")),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"\u751f\u547d\u5468\u671f"),(0,r.kt)("th",{parentName:"tr",align:null},"\u53c2\u6570"),(0,r.kt)("th",{parentName:"tr",align:null},"\u8c03\u7528\u65f6\u673a"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"before.build.load"),(0,r.kt)("td",{parentName:"tr",align:null},"{ args: CommandArgs; config: PkgConfig[] }"),(0,r.kt)("td",{parentName:"tr",align:null},"\u83b7\u53d6\u6240\u6709\u4efb\u52a1\u914d\u7f6e\u540e")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"before.build.run"),(0,r.kt)("td",{parentName:"tr",align:null},"{ args: CommandArgs; config: PkgConfig[]  }"),(0,r.kt)("td",{parentName:"tr",align:null},"\u7f16\u8bd1\u6267\u884c\u4e4b\u524d")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"after.build.compile"),(0,r.kt)("td",{parentName:"tr",align:null},"-"),(0,r.kt)("td",{parentName:"tr",align:null},"\u7f16\u8bd1\u7ed3\u675f")))),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"start \u547d\u4ee4")),(0,r.kt)("table",null,(0,r.kt)("thead",{parentName:"table"},(0,r.kt)("tr",{parentName:"thead"},(0,r.kt)("th",{parentName:"tr",align:null},"\u751f\u547d\u5468\u671f"),(0,r.kt)("th",{parentName:"tr",align:null},"\u53c2\u6570"),(0,r.kt)("th",{parentName:"tr",align:null},"\u8c03\u7528\u65f6\u673a"))),(0,r.kt)("tbody",{parentName:"table"},(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"before.start.load"),(0,r.kt)("td",{parentName:"tr",align:null},"{ args: CommandArgs; config: PkgConfig[] }"),(0,r.kt)("td",{parentName:"tr",align:null},"\u83b7\u53d6\u6240\u6709\u4efb\u52a1\u914d\u7f6e\u540e")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"before.start.run"),(0,r.kt)("td",{parentName:"tr",align:null},"{ args: CommandArgs; config: PkgConfig[]  }"),(0,r.kt)("td",{parentName:"tr",align:null},"\u7f16\u8bd1\u6267\u884c\u4e4b\u524d")),(0,r.kt)("tr",{parentName:"tbody"},(0,r.kt)("td",{parentName:"tr",align:null},"after.start.compile"),(0,r.kt)("td",{parentName:"tr",align:null},"-"),(0,r.kt)("td",{parentName:"tr",align:null},"\u7f16\u8bd1\u7ed3\u675f")))))}s.isMDXComponent=!0}}]);