"use strict";(self.webpackChunkicepkg_site=self.webpackChunkicepkg_site||[]).push([[920],{277:(e,t,n)=>{n.r(t),n.d(t,{default:()=>T});var r=n(9231),a=n(4999),l=n(8637),s=n(8250),c=n(9356),o=n(7612);const u=["zero","one","two","few","many","other"];function i(e){return u.filter((t=>e.includes(t)))}const m={locale:"en",pluralForms:i(["one","other"]),select:e=>1===e?"one":"other"};function h(){const{i18n:{currentLocale:e}}=(0,a.Z)();return(0,r.useMemo)((()=>{try{return function(e){const t=new Intl.PluralRules(e);return{locale:e,pluralForms:i(t.resolvedOptions().pluralCategories),select:e=>t.select(e)}}(e)}catch(t){return console.error('Failed to use Intl.PluralRules for locale "'+e+'".\nDocusaurus will fallback to the default (English) implementation.\nError: '+t.message+"\n"),m}}),[e])}function p(){const e=h();return{selectMessage:(t,n)=>function(e,t,n){const r=e.split("|");if(1===r.length)return r[0];r.length>n.pluralForms.length&&console.error("For locale="+n.locale+", a maximum of "+n.pluralForms.length+" plural forms are expected ("+n.pluralForms.join(",")+"), but the message contains "+r.length+": "+e);const a=n.select(t),l=n.pluralForms.indexOf(a);return r[Math.min(l,r.length-1)]}(n,t,e)}}var g=n(9324),d=n(2397);const f=function(){const e=(0,g.k6)(),t=(0,g.TH)(),{siteConfig:{baseUrl:n}}=(0,a.Z)(),r=d.Z.canUseDOM?new URLSearchParams(t.search):null,l=(null==r?void 0:r.get("q"))||"",s=(null==r?void 0:r.get("ctx"))||"",c=(null==r?void 0:r.get("version"))||"",o=e=>{const n=new URLSearchParams(t.search);return e?n.set("q",e):n.delete("q"),n};return{searchValue:l,searchContext:s,searchVersion:c,updateSearchPath:t=>{const n=o(t);e.replace({search:n.toString()})},generateSearchPageLink:e=>{const t=o(e);return n+"search?"+t.toString()}}};var E=n(9454),y=n(2524),S=n(6373),w=n(5764),v=n(5536),b=n(4778),k=n(6359),P=n(1669);const C="searchQueryInput_cwKb",I="searchResultItem_KCr8",R="searchResultItemPath_dCki",_="searchResultItemSummary_FkBy";function F(){const{siteConfig:{baseUrl:e}}=(0,a.Z)(),{selectMessage:t}=p(),{searchValue:n,searchContext:l,searchVersion:c,updateSearchPath:u}=f(),[i,m]=(0,r.useState)(n),[h,g]=(0,r.useState)(),[d,S]=(0,r.useState)(),w=""+e+c,v=(0,r.useMemo)((()=>i?(0,o.I)({id:"theme.SearchPage.existingResultsTitle",message:'Search results for "{query}"',description:"The search page title for non-empty query"},{query:i}):(0,o.I)({id:"theme.SearchPage.emptyResultsTitle",message:"Search the documentation",description:"The search page title for empty query"})),[i]);(0,r.useEffect)((()=>{u(i),h&&(i?h(i,(e=>{S(e)})):S(void 0))}),[i,h]);const k=(0,r.useCallback)((e=>{m(e.target.value)}),[]);return(0,r.useEffect)((()=>{n&&n!==i&&m(n)}),[n]),(0,r.useEffect)((()=>{!async function(){const{wrappedIndexes:e,zhDictionary:t}=await(0,E.w)(w,l);g((()=>(0,y.v)(e,t,100)))}()}),[l,w]),r.createElement(r.Fragment,null,r.createElement(s.Z,null,r.createElement("meta",{property:"robots",content:"noindex, follow"}),r.createElement("title",null,v)),r.createElement("div",{className:"container margin-vert--lg"},r.createElement("h1",null,v),r.createElement("input",{type:"search",name:"q",className:C,"aria-label":"Search",onChange:k,value:i,autoComplete:"off",autoFocus:!0}),!h&&i&&r.createElement("div",null,r.createElement(b.Z,null)),d&&(d.length>0?r.createElement("p",null,t(d.length,(0,o.I)({id:"theme.SearchPage.documentsFound.plurals",message:"1 document found|{count} documents found",description:'Pluralized label for "{count} documents found". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)'},{count:d.length}))):r.createElement("p",null,(0,o.I)({id:"theme.SearchPage.noResultsText",message:"No documents were found",description:"The paragraph for empty search result"}))),r.createElement("section",null,d&&d.map((e=>r.createElement(x,{key:e.document.i,searchResult:e}))))))}function x(e){let{searchResult:{document:t,type:n,page:a,tokens:l,metadata:s}}=e;const o=0===n,u=2===n,i=(o?t.b:a.b).slice(),m=u?t.s:t.t;o||i.push(a.t);let h="";if(P.vc&&l.length>0){const e=new URLSearchParams;for(const t of l)e.append("_highlight",t);h="?"+e.toString()}return r.createElement("article",{className:I},r.createElement("h2",null,r.createElement(c.Z,{to:t.u+h+(t.h||""),dangerouslySetInnerHTML:{__html:u?(0,S.C)(m,l):(0,w.o)(m,(0,v.m)(s,"t"),l,100)}})),i.length>0&&r.createElement("p",{className:R},(0,k.e)(i)),u&&r.createElement("p",{className:_,dangerouslySetInnerHTML:{__html:(0,w.o)(t.t,(0,v.m)(s,"t"),l,100)}}))}const T=function(){return r.createElement(l.Z,null,r.createElement(F,null))}}}]);