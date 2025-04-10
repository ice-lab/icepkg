(self.webpackChunkicepkg_site=self.webpackChunkicepkg_site||[]).push([[538],{8570:(e,t,n)=>{"use strict";n.d(t,{Zo:()=>u,kt:()=>d});var o=n(79);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},c=Object.keys(e);for(o=0;o<c.length;o++)n=c[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(o=0;o<c.length;o++)n=c[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=o.createContext({}),i=function(e){var t=o.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},u=function(e){var t=i(e.components);return o.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},m=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,c=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),m=i(n),d=r,y=m["".concat(l,".").concat(d)]||m[d]||p[d]||c;return n?o.createElement(y,a(a({ref:t},u),{},{components:n})):o.createElement(y,a({ref:t},u))}));function d(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var c=n.length,a=new Array(c);a[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:r,a[1]=s;for(var i=2;i<c;i++)a[i]=n[i];return o.createElement.apply(null,a)}return o.createElement.apply(null,n)}m.displayName="MDXCreateElement"},9587:(e,t,n)=>{"use strict";n.d(t,{Z:()=>G});var o=n(7583),r=n(79),c=n(5187),a=n(9841),s=n(4513),l=n(8408);function i(){const{prism:e}=(0,l.L)(),{colorMode:t}=(0,s.I)(),n=e.theme,o=e.darkTheme||n;return"dark"===t?o:n}var u=n(7176),p=n(6494),m=n.n(p);const d=/title=(?<quote>["'])(?<title>.*?)\1/,y=/\{(?<range>[\d,-]+)\}/,f={js:{start:"\\/\\/",end:""},jsBlock:{start:"\\/\\*",end:"\\*\\/"},jsx:{start:"\\{\\s*\\/\\*",end:"\\*\\/\\s*\\}"},bash:{start:"#",end:""},html:{start:"\x3c!--",end:"--\x3e"}};function g(e,t){const n=e.map((e=>{const{start:n,end:o}=f[e];return`(?:${n}\\s*(${t.flatMap((e=>[e.line,e.block?.start,e.block?.end].filter(Boolean))).join("|")})\\s*${o})`})).join("|");return new RegExp(`^\\s*(?:${n})\\s*$`)}function h(e,t){let n=e.replace(/\n$/,"");const{language:o,magicComments:r,metastring:c}=t;if(c&&y.test(c)){const e=c.match(y).groups.range;if(0===r.length)throw new Error(`A highlight range has been given in code block's metastring (\`\`\` ${c}), but no magic comment config is available. Docusaurus applies the first magic comment entry's className for metastring ranges.`);const t=r[0].className,o=m()(e).filter((e=>e>0)).map((e=>[e-1,[t]]));return{lineClassNames:Object.fromEntries(o),code:n}}if(void 0===o)return{lineClassNames:{},code:n};const a=function(e,t){switch(e){case"js":case"javascript":case"ts":case"typescript":return g(["js","jsBlock"],t);case"jsx":case"tsx":return g(["js","jsBlock","jsx"],t);case"html":return g(["js","jsBlock","html"],t);case"python":case"py":case"bash":return g(["bash"],t);case"markdown":case"md":return g(["html","jsx","bash"],t);default:return g(Object.keys(f),t)}}(o,r),s=n.split("\n"),l=Object.fromEntries(r.map((e=>[e.className,{start:0,range:""}]))),i=Object.fromEntries(r.filter((e=>e.line)).map((e=>{let{className:t,line:n}=e;return[n,t]}))),u=Object.fromEntries(r.filter((e=>e.block)).map((e=>{let{className:t,block:n}=e;return[n.start,t]}))),p=Object.fromEntries(r.filter((e=>e.block)).map((e=>{let{className:t,block:n}=e;return[n.end,t]})));for(let m=0;m<s.length;){const e=s[m].match(a);if(!e){m+=1;continue}const t=e.slice(1).find((e=>void 0!==e));i[t]?l[i[t]].range+=`${m},`:u[t]?l[u[t]].start=m:p[t]&&(l[p[t]].range+=`${l[p[t]].start}-${m-1},`),s.splice(m,1)}n=s.join("\n");const d={};return Object.entries(l).forEach((e=>{let[t,{range:n}]=e;m()(n).forEach((e=>{d[e]??=[],d[e].push(t)}))})),{lineClassNames:d,code:n}}const b="codeBlockContainer_bo0c";function k(e){let{as:t,...n}=e;const c=function(e){const t={color:"--prism-color",backgroundColor:"--prism-background-color"},n={};return Object.entries(e.plain).forEach((e=>{let[o,r]=e;const c=t[o];c&&"string"==typeof r&&(n[c]=r)})),n}(i());return r.createElement(t,(0,o.Z)({},n,{style:c,className:(0,a.Z)(n.className,b,u.k.common.codeBlock)}))}const v={codeBlockContent:"codeBlockContent_J7bp",codeBlockTitle:"codeBlockTitle_K1Wm",codeBlock:"codeBlock_ckpM",codeBlockStandalone:"codeBlockStandalone__vb_",codeBlockLines:"codeBlockLines_kd3L",codeBlockLinesWithNumbering:"codeBlockLinesWithNumbering_VI0y",buttonGroup:"buttonGroup_m4jX"};function E(e){let{children:t,className:n}=e;return r.createElement(k,{as:"pre",tabIndex:0,className:(0,a.Z)(v.codeBlockStandalone,"thin-scrollbar",n)},r.createElement("code",{className:v.codeBlockLines},t))}var N=n(9778);const B={attributes:!0,characterData:!0,childList:!0,subtree:!0};function j(e,t){const[n,o]=(0,r.useState)(),c=(0,r.useCallback)((()=>{o(e.current?.closest("[role=tabpanel][hidden]"))}),[e,o]);(0,r.useEffect)((()=>{c()}),[c]),function(e,t,n){void 0===n&&(n=B);const o=(0,N.zX)(t),c=(0,N.Ql)(n);(0,r.useEffect)((()=>{const t=new MutationObserver(o);return e&&t.observe(e,c),()=>t.disconnect()}),[e,o,c])}(n,(e=>{e.forEach((e=>{"attributes"===e.type&&"hidden"===e.attributeName&&(t(),c())}))}),{attributes:!0,characterData:!1,childList:!1,subtree:!1})}const w={plain:{backgroundColor:"#2a2734",color:"#9a86fd"},styles:[{types:["comment","prolog","doctype","cdata","punctuation"],style:{color:"#6c6783"}},{types:["namespace"],style:{opacity:.7}},{types:["tag","operator","number"],style:{color:"#e09142"}},{types:["property","function"],style:{color:"#9a86fd"}},{types:["tag-id","selector","atrule-id"],style:{color:"#eeebff"}},{types:["attr-name"],style:{color:"#c4b9fe"}},{types:["boolean","string","entity","url","attr-value","keyword","control","directive","unit","statement","regex","atrule","placeholder","variable"],style:{color:"#ffcc99"}},{types:["deleted"],style:{textDecorationLine:"line-through"}},{types:["inserted"],style:{textDecorationLine:"underline"}},{types:["italic"],style:{fontStyle:"italic"}},{types:["important","bold"],style:{fontWeight:"bold"}},{types:["important"],style:{color:"#c4b9fe"}}]};var C={Prism:n(4468).Z,theme:w};function O(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function L(){return L=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o])}return e},L.apply(this,arguments)}var T=/\r\n|\r|\n/,x=function(e){0===e.length?e.push({types:["plain"],content:"\n",empty:!0}):1===e.length&&""===e[0].content&&(e[0].content="\n",e[0].empty=!0)},P=function(e,t){var n=e.length;return n>0&&e[n-1]===t?e:e.concat(t)},S=function(e,t){var n=e.plain,o=Object.create(null),r=e.styles.reduce((function(e,n){var o=n.languages,r=n.style;return o&&!o.includes(t)||n.types.forEach((function(t){var n=L({},e[t],r);e[t]=n})),e}),o);return r.root=n,r.plain=L({},n,{backgroundColor:null}),r};function _(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&-1===t.indexOf(o)&&(n[o]=e[o]);return n}const I=function(e){function t(){for(var t=this,n=[],o=arguments.length;o--;)n[o]=arguments[o];e.apply(this,n),O(this,"getThemeDict",(function(e){if(void 0!==t.themeDict&&e.theme===t.prevTheme&&e.language===t.prevLanguage)return t.themeDict;t.prevTheme=e.theme,t.prevLanguage=e.language;var n=e.theme?S(e.theme,e.language):void 0;return t.themeDict=n})),O(this,"getLineProps",(function(e){var n=e.key,o=e.className,r=e.style,c=L({},_(e,["key","className","style","line"]),{className:"token-line",style:void 0,key:void 0}),a=t.getThemeDict(t.props);return void 0!==a&&(c.style=a.plain),void 0!==r&&(c.style=void 0!==c.style?L({},c.style,r):r),void 0!==n&&(c.key=n),o&&(c.className+=" "+o),c})),O(this,"getStyleForToken",(function(e){var n=e.types,o=e.empty,r=n.length,c=t.getThemeDict(t.props);if(void 0!==c){if(1===r&&"plain"===n[0])return o?{display:"inline-block"}:void 0;if(1===r&&!o)return c[n[0]];var a=o?{display:"inline-block"}:{},s=n.map((function(e){return c[e]}));return Object.assign.apply(Object,[a].concat(s))}})),O(this,"getTokenProps",(function(e){var n=e.key,o=e.className,r=e.style,c=e.token,a=L({},_(e,["key","className","style","token"]),{className:"token "+c.types.join(" "),children:c.content,style:t.getStyleForToken(c),key:void 0});return void 0!==r&&(a.style=void 0!==a.style?L({},a.style,r):r),void 0!==n&&(a.key=n),o&&(a.className+=" "+o),a})),O(this,"tokenize",(function(e,t,n,o){var r={code:t,grammar:n,language:o,tokens:[]};e.hooks.run("before-tokenize",r);var c=r.tokens=e.tokenize(r.code,r.grammar,r.language);return e.hooks.run("after-tokenize",r),c}))}return e&&(t.__proto__=e),t.prototype=Object.create(e&&e.prototype),t.prototype.constructor=t,t.prototype.render=function(){var e=this.props,t=e.Prism,n=e.language,o=e.code,r=e.children,c=this.getThemeDict(this.props),a=t.languages[n];return r({tokens:function(e){for(var t=[[]],n=[e],o=[0],r=[e.length],c=0,a=0,s=[],l=[s];a>-1;){for(;(c=o[a]++)<r[a];){var i=void 0,u=t[a],p=n[a][c];if("string"==typeof p?(u=a>0?u:["plain"],i=p):(u=P(u,p.type),p.alias&&(u=P(u,p.alias)),i=p.content),"string"==typeof i){var m=i.split(T),d=m.length;s.push({types:u,content:m[0]});for(var y=1;y<d;y++)x(s),l.push(s=[]),s.push({types:u,content:m[y]})}else a++,t.push(u),n.push(i),o.push(0),r.push(i.length)}a--,t.pop(),n.pop(),o.pop(),r.pop()}return x(s),l}(void 0!==a?this.tokenize(t,o,a,n):[o]),className:"prism-code language-"+n,style:void 0!==c?c.root:{},getLineProps:this.getLineProps,getTokenProps:this.getTokenProps})},t}(r.Component),Z="codeLine_lpby",A="codeLineNumber_qTSl",D="codeLineContent_SGXS";function W(e){let{line:t,classNames:n,showLineNumbers:c,getLineProps:s,getTokenProps:l}=e;1===t.length&&"\n"===t[0].content&&(t[0].content="");const i=s({line:t,className:(0,a.Z)(n,c&&Z)}),u=t.map(((e,t)=>r.createElement("span",(0,o.Z)({key:t},l({token:e,key:t})))));return r.createElement("span",i,c?r.createElement(r.Fragment,null,r.createElement("span",{className:A}),r.createElement("span",{className:D},u)):u,r.createElement("br",null))}var $=n(2969),z=n(4277);const H={copyButtonCopied:"copyButtonCopied_cIWK",copyButtonIcons:"copyButtonIcons_bNWq",copyButtonIcon:"copyButtonIcon_Cakd",copyButtonSuccessIcon:"copyButtonSuccessIcon_a23A"};function M(e){let{code:t,className:n}=e;const[o,c]=(0,r.useState)(!1),s=(0,r.useRef)(void 0),l=(0,r.useCallback)((()=>{(0,$.Z)(t),c(!0),s.current=window.setTimeout((()=>{c(!1)}),1e3)}),[t]);return(0,r.useEffect)((()=>()=>window.clearTimeout(s.current)),[]),r.createElement("button",{type:"button","aria-label":o?(0,z.I)({id:"theme.CodeBlock.copied",message:"Copied",description:"The copied button label on code blocks"}):(0,z.I)({id:"theme.CodeBlock.copyButtonAriaLabel",message:"Copy code to clipboard",description:"The ARIA label for copy code blocks button"}),title:(0,z.I)({id:"theme.CodeBlock.copy",message:"Copy",description:"The copy button label on code blocks"}),className:(0,a.Z)("clean-btn",n,H.copyButton,o&&H.copyButtonCopied),onClick:l},r.createElement("span",{className:H.copyButtonIcons,"aria-hidden":"true"},r.createElement("svg",{className:H.copyButtonIcon,viewBox:"0 0 24 24"},r.createElement("path",{d:"M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"})),r.createElement("svg",{className:H.copyButtonSuccessIcon,viewBox:"0 0 24 24"},r.createElement("path",{d:"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"}))))}const R="wordWrapButtonIcon_ygyk",V="wordWrapButtonEnabled_uLmC";function q(e){let{className:t,onClick:n,isEnabled:o}=e;const c=(0,z.I)({id:"theme.CodeBlock.wordWrapToggle",message:"Toggle word wrap",description:"The title attribute for toggle word wrapping button of code block lines"});return r.createElement("button",{type:"button",onClick:n,className:(0,a.Z)("clean-btn",t,o&&V),"aria-label":c,title:c},r.createElement("svg",{className:R,viewBox:"0 0 24 24","aria-hidden":"true"},r.createElement("path",{fill:"currentColor",d:"M4 19h6v-2H4v2zM20 5H4v2h16V5zm-3 6H4v2h13.25c1.1 0 2 .9 2 2s-.9 2-2 2H15v-2l-3 3l3 3v-2h2c2.21 0 4-1.79 4-4s-1.79-4-4-4z"})))}function F(e){let{children:t,className:n="",metastring:c,title:s,showLineNumbers:u,language:p}=e;const{prism:{defaultLanguage:m,magicComments:y}}=(0,l.L)(),f=p??n.split(" ").find((e=>e.startsWith("language-")))?.replace(/language-/,"")??m;const g=i(),b=function(){const[e,t]=(0,r.useState)(!1),[n,o]=(0,r.useState)(!1),c=(0,r.useRef)(null),a=(0,r.useCallback)((()=>{const n=c.current.querySelector("code");e?n.removeAttribute("style"):(n.style.whiteSpace="pre-wrap",n.style.overflowWrap="anywhere"),t((e=>!e))}),[c,e]),s=(0,r.useCallback)((()=>{const{scrollWidth:e,clientWidth:t}=c.current,n=e>t||c.current.querySelector("code").hasAttribute("style");o(n)}),[c]);return j(c,s),(0,r.useEffect)((()=>{s()}),[e,s]),(0,r.useEffect)((()=>(window.addEventListener("resize",s,{passive:!0}),()=>{window.removeEventListener("resize",s)})),[s]),{codeBlockRef:c,isEnabled:e,isCodeScrollable:n,toggle:a}}(),E=function(e){return e?.match(d)?.groups.title??""}(c)||s,{lineClassNames:N,code:B}=h(t,{metastring:c,language:f,magicComments:y}),w=u??function(e){return Boolean(e?.includes("showLineNumbers"))}(c);return r.createElement(k,{as:"div",className:(0,a.Z)(n,f&&!n.includes(`language-${f}`)&&`language-${f}`)},E&&r.createElement("div",{className:v.codeBlockTitle},E),r.createElement("div",{className:v.codeBlockContent},r.createElement(I,(0,o.Z)({},C,{theme:g,code:B,language:f??"text"}),(e=>{let{className:t,tokens:n,getLineProps:o,getTokenProps:c}=e;return r.createElement("pre",{tabIndex:0,ref:b.codeBlockRef,className:(0,a.Z)(t,v.codeBlock,"thin-scrollbar")},r.createElement("code",{className:(0,a.Z)(v.codeBlockLines,w&&v.codeBlockLinesWithNumbering)},n.map(((e,t)=>r.createElement(W,{key:t,line:e,getLineProps:o,getTokenProps:c,classNames:N[t],showLineNumbers:w})))))})),r.createElement("div",{className:v.buttonGroup},(b.isEnabled||b.isCodeScrollable)&&r.createElement(q,{className:v.codeButton,onClick:()=>b.toggle(),isEnabled:b.isEnabled}),r.createElement(M,{className:v.codeButton,code:B}))))}function G(e){let{children:t,...n}=e;const a=(0,c.Z)(),s=function(e){return r.Children.toArray(e).some((e=>(0,r.isValidElement)(e)))?e:Array.isArray(e)?e.join(""):e}(t),l="string"==typeof s?F:E;return r.createElement(l,(0,o.Z)({key:String(a)},n),s)}},6494:(e,t)=>{function n(e){let t,n=[];for(let o of e.split(",").map((e=>e.trim())))if(/^-?\d+$/.test(o))n.push(parseInt(o,10));else if(t=o.match(/^(-?\d+)(-|\.\.\.?|\u2025|\u2026|\u22EF)(-?\d+)$/)){let[e,o,r,c]=t;if(o&&c){o=parseInt(o),c=parseInt(c);const e=o<c?1:-1;"-"!==r&&".."!==r&&"\u2025"!==r||(c+=e);for(let t=o;t!==c;t+=e)n.push(t)}}return n}t.default=n,e.exports=n},2969:(e,t,n)=>{"use strict";function o(e,t){let{target:n=document.body}=void 0===t?{}:t;const o=document.createElement("textarea"),r=document.activeElement;o.value=e,o.setAttribute("readonly",""),o.style.contain="strict",o.style.position="absolute",o.style.left="-9999px",o.style.fontSize="12pt";const c=document.getSelection();let a=!1;c.rangeCount>0&&(a=c.getRangeAt(0)),n.append(o),o.select(),o.selectionStart=0,o.selectionEnd=e.length;let s=!1;try{s=document.execCommand("copy")}catch{}return o.remove(),a&&(c.removeAllRanges(),c.addRange(a)),r&&r.focus(),s}n.d(t,{Z:()=>o})}}]);