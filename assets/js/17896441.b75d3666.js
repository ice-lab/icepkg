"use strict";(self.webpackChunkicepkg_site=self.webpackChunkicepkg_site||[]).push([[918],{6057:(e,t,n)=>{n.r(t),n.d(t,{default:()=>Re});var a=n(9231),l=n(9841),r=n(7554),s=n(2464),i=n(3388),c=n(6215),o=n(596),m=n(2169);function d(e){const{permalink:t,title:n,subLabel:r,isNext:s}=e;return a.createElement(m.Z,{className:(0,l.Z)("pagination-nav__link",s?"pagination-nav__link--next":"pagination-nav__link--prev"),to:t},r&&a.createElement("div",{className:"pagination-nav__sublabel"},r),a.createElement("div",{className:"pagination-nav__label"},n))}function u(e){const{previous:t,next:n}=e;return a.createElement("nav",{className:"pagination-nav docusaurus-mt-lg","aria-label":(0,o.I)({id:"theme.docs.paginator.navAriaLabel",message:"Docs pages navigation",description:"The ARIA label for the docs pagination"})},t&&a.createElement(d,(0,c.Z)({},t,{subLabel:a.createElement(o.Z,{id:"theme.docs.paginator.previous",description:"The label used to navigate to the previous doc"},"Previous")})),n&&a.createElement(d,(0,c.Z)({},n,{subLabel:a.createElement(o.Z,{id:"theme.docs.paginator.next",description:"The label used to navigate to the next doc"},"Next"),isNext:!0})))}var p=n(9638),h=n(3063),v=n(8375),E=n(6246);const b={unreleased:function(e){let{siteTitle:t,versionMetadata:n}=e;return a.createElement(o.Z,{id:"theme.docs.versions.unreleasedVersionLabel",description:"The label used to tell the user that he's browsing an unreleased doc version",values:{siteTitle:t,versionLabel:a.createElement("b",null,n.label)}},"This is unreleased documentation for {siteTitle} {versionLabel} version.")},unmaintained:function(e){let{siteTitle:t,versionMetadata:n}=e;return a.createElement(o.Z,{id:"theme.docs.versions.unmaintainedVersionLabel",description:"The label used to tell the user that he's browsing an unmaintained doc version",values:{siteTitle:t,versionLabel:a.createElement("b",null,n.label)}},"This is documentation for {siteTitle} {versionLabel}, which is no longer actively maintained.")}};function g(e){const t=b[e.versionMetadata.banner];return a.createElement(t,e)}function f(e){let{versionLabel:t,to:n,onClick:l}=e;return a.createElement(o.Z,{id:"theme.docs.versions.latestVersionSuggestionLabel",description:"The label used to tell the user to check the latest version",values:{versionLabel:t,latestVersionLink:a.createElement("b",null,a.createElement(m.Z,{to:n,onClick:l},a.createElement(o.Z,{id:"theme.docs.versions.latestVersionLinkLabel",description:"The label used for the latest version suggestion link label"},"latest version")))}},"For up-to-date documentation, see the {latestVersionLink} ({versionLabel}).")}function N(e){let{className:t,versionMetadata:n}=e;const{siteConfig:{title:r}}=(0,p.Z)(),{pluginId:s}=(0,h.gA)({failfast:!0}),{savePreferredVersionName:c}=(0,v.J)(s),{latestDocSuggestion:o,latestVersionSuggestion:m}=(0,h.Jo)(s),d=null!=o?o:(u=m).docs.find((e=>e.id===u.mainDocId));var u;return a.createElement("div",{className:(0,l.Z)(t,i.k.docs.docVersionBanner,"alert alert--warning margin-bottom--md"),role:"alert"},a.createElement("div",null,a.createElement(g,{siteTitle:r,versionMetadata:n})),a.createElement("div",{className:"margin-top--md"},a.createElement(f,{versionLabel:m.label,to:d.path,onClick:()=>c(m.name)})))}function L(e){let{className:t}=e;const n=(0,E.E)();return n.banner?a.createElement(N,{className:t,versionMetadata:n}):null}function k(e){let{className:t}=e;const n=(0,E.E)();return n.badge?a.createElement("span",{className:(0,l.Z)(t,i.k.docs.docVersionBadge,"badge badge--secondary")},a.createElement(o.Z,{id:"theme.docs.versionBadge.label",values:{versionLabel:n.label}},"Version: {versionLabel}")):null}function Z(e){let{lastUpdatedAt:t,formattedLastUpdatedAt:n}=e;return a.createElement(o.Z,{id:"theme.lastUpdated.atDate",description:"The words used to describe on which date a page has been last updated",values:{date:a.createElement("b",null,a.createElement("time",{dateTime:new Date(1e3*t).toISOString()},n))}}," on {date}")}function _(e){let{lastUpdatedBy:t}=e;return a.createElement(o.Z,{id:"theme.lastUpdated.byUser",description:"The words used to describe by who the page has been last updated",values:{user:a.createElement("b",null,t)}}," by {user}")}function C(e){let{lastUpdatedAt:t,formattedLastUpdatedAt:n,lastUpdatedBy:l}=e;return a.createElement("span",{className:i.k.common.lastUpdated},a.createElement(o.Z,{id:"theme.lastUpdated.lastUpdatedAtBy",description:"The sentence used to display when a page has been last updated, and by who",values:{atDate:t&&n?a.createElement(Z,{lastUpdatedAt:t,formattedLastUpdatedAt:n}):"",byUser:l?a.createElement(_,{lastUpdatedBy:l}):""}},"Last updated{atDate}{byUser}"),!1)}const y="iconEdit_OYAI";function T(e){let{className:t,...n}=e;return a.createElement("svg",(0,c.Z)({fill:"currentColor",height:"20",width:"20",viewBox:"0 0 40 40",className:(0,l.Z)(y,t),"aria-hidden":"true"},n),a.createElement("g",null,a.createElement("path",{d:"m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z"})))}function x(e){let{editUrl:t}=e;return a.createElement("a",{href:t,target:"_blank",rel:"noreferrer noopener",className:i.k.common.editThisPage},a.createElement(T,null),a.createElement(o.Z,{id:"theme.common.editThisPage",description:"The link label to edit the current page"},"Edit this page"))}const H="tag_BjXh",A="tagRegular_KdWl",U="tagWithCount_V0lH";function w(e){let{permalink:t,label:n,count:r}=e;return a.createElement(m.Z,{href:t,className:(0,l.Z)(H,r?U:A)},n,r&&a.createElement("span",null,r))}const M="tags_qJbH",B="tag_gwuN";function I(e){let{tags:t}=e;return a.createElement(a.Fragment,null,a.createElement("b",null,a.createElement(o.Z,{id:"theme.tags.tagsListLabel",description:"The label alongside a tag list"},"Tags:")),a.createElement("ul",{className:(0,l.Z)(M,"padding--none","margin-left--sm")},t.map((e=>{let{label:t,permalink:n}=e;return a.createElement("li",{key:n,className:B},a.createElement(w,{label:t,permalink:n}))}))))}const S="lastUpdated_dBQ_";function V(e){return a.createElement("div",{className:(0,l.Z)(i.k.docs.docFooterTagsRow,"row margin-bottom--sm")},a.createElement("div",{className:"col"},a.createElement(I,e)))}function D(e){let{editUrl:t,lastUpdatedAt:n,lastUpdatedBy:r,formattedLastUpdatedAt:s}=e;return a.createElement("div",{className:(0,l.Z)(i.k.docs.docFooterEditMetaRow,"row")},a.createElement("div",{className:"col"},t&&a.createElement(x,{editUrl:t})),a.createElement("div",{className:(0,l.Z)("col",S)},(n||r)&&a.createElement(C,{lastUpdatedAt:n,formattedLastUpdatedAt:s,lastUpdatedBy:r})))}function O(e){const{content:t}=e,{metadata:n}=t,{editUrl:r,lastUpdatedAt:s,formattedLastUpdatedAt:c,lastUpdatedBy:o,tags:m}=n,d=m.length>0,u=!!(r||s||o);return d||u?a.createElement("footer",{className:(0,l.Z)(i.k.docs.docFooter,"docusaurus-mt-lg")},d&&a.createElement(V,{tags:m}),u&&a.createElement(D,{editUrl:r,lastUpdatedAt:s,lastUpdatedBy:o,formattedLastUpdatedAt:c})):null}var R=n(1856);function P(e){const t=e.map((e=>({...e,parentIndex:-1,children:[]}))),n=Array(7).fill(-1);t.forEach(((e,t)=>{const a=n.slice(2,e.level);e.parentIndex=Math.max(...a),n[e.level]=t}));const a=[];return t.forEach((e=>{const{parentIndex:n,...l}=e;n>=0?t[n].children.push(l):a.push(l)})),a}function z(e){let{toc:t,minHeadingLevel:n,maxHeadingLevel:a}=e;return t.flatMap((e=>{const t=z({toc:e.children,minHeadingLevel:n,maxHeadingLevel:a});return function(e){return e.level>=n&&e.level<=a}(e)?[{...e,children:t}]:t}))}function F(e){const t=e.getBoundingClientRect();return t.top===t.bottom?F(e.parentNode):t}function q(e,t){var n;let{anchorTopOffset:a}=t;const l=e.find((e=>F(e).top>=a));if(l){var r;return function(e){return e.top>0&&e.bottom<window.innerHeight/2}(F(l))?l:null!=(r=e[e.indexOf(l)-1])?r:null}return null!=(n=e[e.length-1])?n:null}function j(){const e=(0,a.useRef)(0),{navbar:{hideOnScroll:t}}=(0,R.L)();return(0,a.useEffect)((()=>{e.current=t?0:document.querySelector(".navbar").clientHeight}),[t]),e}function G(e){const t=(0,a.useRef)(void 0),n=j();(0,a.useEffect)((()=>{if(!e)return()=>{};const{linkClassName:a,linkActiveClassName:l,minHeadingLevel:r,maxHeadingLevel:s}=e;function i(){const e=function(e){return Array.from(document.getElementsByClassName(e))}(a),i=function(e){let{minHeadingLevel:t,maxHeadingLevel:n}=e;const a=[];for(let l=t;l<=n;l+=1)a.push("h"+l+".anchor");return Array.from(document.querySelectorAll(a.join()))}({minHeadingLevel:r,maxHeadingLevel:s}),c=q(i,{anchorTopOffset:n.current}),o=e.find((e=>c&&c.id===function(e){return decodeURIComponent(e.href.substring(e.href.indexOf("#")+1))}(e)));e.forEach((e=>{!function(e,n){n?(t.current&&t.current!==e&&t.current.classList.remove(l),e.classList.add(l),t.current=e):e.classList.remove(l)}(e,e===o)}))}return document.addEventListener("scroll",i),document.addEventListener("resize",i),i(),()=>{document.removeEventListener("scroll",i),document.removeEventListener("resize",i)}}),[e,n])}function J(e){let{toc:t,className:n,linkClassName:l,isChild:r}=e;return t.length?a.createElement("ul",{className:r?void 0:n},t.map((e=>a.createElement("li",{key:e.id},a.createElement("a",{href:"#"+e.id,className:null!=l?l:void 0,dangerouslySetInnerHTML:{__html:e.value}}),a.createElement(J,{isChild:!0,toc:e.children,className:n,linkClassName:l}))))):null}const W=a.memo(J);function X(e){let{toc:t,className:n="table-of-contents table-of-contents__left-border",linkClassName:l="table-of-contents__link",linkActiveClassName:r,minHeadingLevel:s,maxHeadingLevel:i,...o}=e;const m=(0,R.L)(),d=null!=s?s:m.tableOfContents.minHeadingLevel,u=null!=i?i:m.tableOfContents.maxHeadingLevel,p=function(e){let{toc:t,minHeadingLevel:n,maxHeadingLevel:l}=e;return(0,a.useMemo)((()=>z({toc:P(t),minHeadingLevel:n,maxHeadingLevel:l})),[t,n,l])}({toc:t,minHeadingLevel:d,maxHeadingLevel:u});return G((0,a.useMemo)((()=>{if(l&&r)return{linkClassName:l,linkActiveClassName:r,minHeadingLevel:d,maxHeadingLevel:u}}),[l,r,d,u])),a.createElement(W,(0,c.Z)({toc:p,className:n,linkClassName:l},o))}const Y="tableOfContents_XCDc";function K(e){let{className:t,...n}=e;return a.createElement("div",{className:(0,l.Z)(Y,"thin-scrollbar",t)},a.createElement(X,(0,c.Z)({},n,{linkClassName:"table-of-contents__link toc-highlight",linkActiveClassName:"table-of-contents__link--active"})))}var Q=n(9398);const $="tocCollapsibleButton_PoVG",ee="tocCollapsibleButtonExpanded_jMr1";function te(e){let{collapsed:t,...n}=e;return a.createElement("button",(0,c.Z)({type:"button"},n,{className:(0,l.Z)("clean-btn",$,!t&&ee,n.className)}),a.createElement(o.Z,{id:"theme.TOCCollapsible.toggleButtonLabel",description:"The label used by the button on the collapsible TOC component"},"On this page"))}const ne="tocCollapsible_RA2M",ae="tocCollapsibleContent_KsOk",le="tocCollapsibleExpanded_s9GP";function re(e){let{toc:t,className:n,minHeadingLevel:r,maxHeadingLevel:s}=e;const{collapsed:i,toggleCollapsed:c}=(0,Q.u)({initialState:!0});return a.createElement("div",{className:(0,l.Z)(ne,!i&&le,n)},a.createElement(te,{collapsed:i,onClick:c}),a.createElement(Q.z,{lazy:!0,className:ae,collapsed:i},a.createElement(X,{toc:t,minHeadingLevel:r,maxHeadingLevel:s})))}const se="anchorWithStickyNavbar_zHE2",ie="anchorWithHideOnScrollNavbar_hh91";function ce(e){let{as:t,id:n,...r}=e;const{navbar:{hideOnScroll:s}}=(0,R.L)();return"h1"!==t&&n?a.createElement(t,(0,c.Z)({},r,{className:(0,l.Z)("anchor",s?ie:se),id:n}),r.children,a.createElement("a",{className:"hash-link",href:"#"+n,title:(0,o.I)({id:"theme.common.headingLinkTitle",message:"Direct link to heading",description:"Title for link to heading"})},"\u200b")):a.createElement(t,(0,c.Z)({},r,{id:void 0}))}var oe=n(110),me=n(2407),de=n(6162);function ue(e){return a.createElement("svg",(0,c.Z)({viewBox:"0 0 24 24"},e),a.createElement("path",{d:"M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z",fill:"currentColor"}))}const pe={breadcrumbsContainer:"breadcrumbsContainer_Yj7d",breadcrumbHomeIcon:"breadcrumbHomeIcon_GgNT"};function he(e){let{children:t,href:n,isLast:l}=e;const r="breadcrumbs__link";return l?a.createElement("span",{className:r,itemProp:"name"},t):n?a.createElement(m.Z,{className:r,href:n,itemProp:"item"},a.createElement("span",{itemProp:"name"},t)):a.createElement("span",{className:r},t)}function ve(e){let{children:t,active:n,index:r,addMicrodata:s}=e;return a.createElement("li",(0,c.Z)({},s&&{itemScope:!0,itemProp:"itemListElement",itemType:"https://schema.org/ListItem"},{className:(0,l.Z)("breadcrumbs__item",{"breadcrumbs__item--active":n})}),t,a.createElement("meta",{itemProp:"position",content:String(r+1)}))}function Ee(){const e=(0,de.Z)("/");return a.createElement("li",{className:"breadcrumbs__item"},a.createElement(m.Z,{"aria-label":(0,o.I)({id:"theme.docs.breadcrumbs.home",message:"Home page",description:"The ARIA label for the home page in the breadcrumbs"}),className:(0,l.Z)("breadcrumbs__link",pe.breadcrumbsItemLink),href:e},a.createElement(ue,{className:pe.breadcrumbHomeIcon})))}function be(){const e=(0,oe.s1)(),t=(0,me.Ns)();return e?a.createElement("nav",{className:(0,l.Z)(i.k.docs.docBreadcrumbs,pe.breadcrumbsContainer),"aria-label":(0,o.I)({id:"theme.docs.breadcrumbs.navAriaLabel",message:"Breadcrumbs",description:"The ARIA label for the breadcrumbs"})},a.createElement("ul",{className:"breadcrumbs",itemScope:!0,itemType:"https://schema.org/BreadcrumbList"},t&&a.createElement(Ee,null),e.map(((t,n)=>{const l=n===e.length-1;return a.createElement(ve,{key:n,active:l,index:n,addMicrodata:!!t.href},a.createElement(he,{href:t.href,isLast:l},t.label))})))):null}var ge=n(4852),fe=n(473);var Ne=n(7936);var Le=n(1993);const ke="details_TLkU",Ze="isBrowser_CRHR",_e="collapsibleContent_ns21";function Ce(e){return!!e&&("SUMMARY"===e.tagName||Ce(e.parentElement))}function ye(e,t){return!!e&&(e===t||ye(e.parentElement,t))}function Te(e){let{summary:t,children:n,...r}=e;const s=(0,Le.Z)(),i=(0,a.useRef)(null),{collapsed:o,setCollapsed:m}=(0,Q.u)({initialState:!r.open}),[d,u]=(0,a.useState)(r.open);return a.createElement("details",(0,c.Z)({},r,{ref:i,open:d,"data-collapsed":o,className:(0,l.Z)(ke,s&&Ze,r.className),onMouseDown:e=>{Ce(e.target)&&e.detail>1&&e.preventDefault()},onClick:e=>{e.stopPropagation();const t=e.target;Ce(t)&&ye(t,i.current)&&(e.preventDefault(),o?(m(!1),u(!0)):m(!0))}}),null!=t?t:a.createElement("summary",null,"Details"),a.createElement(Q.z,{lazy:!1,collapsed:o,disableSSRStyle:!0,onCollapseTransitionEnd:e=>{m(e),u(!e)}},a.createElement("div",{className:_e},n)))}const xe="details_lLDk";function He(e){let{...t}=e;return a.createElement(Te,(0,c.Z)({},t,{className:(0,l.Z)("alert alert--info",xe,t.className)}))}function Ae(e){return a.createElement(ce,e)}const Ue="containsTaskList_EpMX";const we="img_DGl3";const Me={head:function(e){const t=a.Children.map(e.children,(e=>a.isValidElement(e)?function(e){var t;if(null!=(t=e.props)&&t.mdxType&&e.props.originalType){const{mdxType:t,originalType:n,...l}=e.props;return a.createElement(e.props.originalType,l)}return e}(e):e));return a.createElement(fe.Z,e,t)},code:function(e){const t=["a","b","big","i","span","em","strong","sup","sub","small"];return a.Children.toArray(e.children).every((e=>"string"==typeof e&&!e.includes("\n")||(0,a.isValidElement)(e)&&t.includes(e.props.mdxType)))?a.createElement("code",e):a.createElement(Ne.Z,e)},a:function(e){return a.createElement(m.Z,e)},pre:function(e){var t;return a.createElement(Ne.Z,(0,a.isValidElement)(e.children)&&"code"===(null==(t=e.children.props)?void 0:t.originalType)?e.children.props:{...e})},details:function(e){const t=a.Children.toArray(e.children),n=t.find((e=>{var t;return a.isValidElement(e)&&"summary"===(null==(t=e.props)?void 0:t.mdxType)})),l=a.createElement(a.Fragment,null,t.filter((e=>e!==n)));return a.createElement(He,(0,c.Z)({},e,{summary:n}),l)},ul:function(e){return a.createElement("ul",(0,c.Z)({},e,{className:(t=e.className,(0,l.Z)(t,(null==t?void 0:t.includes("contains-task-list"))&&Ue))}));var t},img:function(e){return a.createElement("img",(0,c.Z)({loading:"lazy"},e,{className:(t=e.className,(0,l.Z)(t,we))}));var t},h1:e=>a.createElement(Ae,(0,c.Z)({as:"h1"},e)),h2:e=>a.createElement(Ae,(0,c.Z)({as:"h2"},e)),h3:e=>a.createElement(Ae,(0,c.Z)({as:"h3"},e)),h4:e=>a.createElement(Ae,(0,c.Z)({as:"h4"},e)),h5:e=>a.createElement(Ae,(0,c.Z)({as:"h5"},e)),h6:e=>a.createElement(Ae,(0,c.Z)({as:"h6"},e))};function Be(e){let{children:t}=e;return a.createElement(ge.Zo,{components:Me},t)}const Ie="docItemContainer_cVTm",Se="docItemCol_ojJQ",Ve="tocMobile_AkdM";function De(e){var t;const{content:n}=e,{metadata:l,frontMatter:s,assets:i}=n,{keywords:c}=s,{description:o,title:m}=l,d=null!=(t=i.image)?t:s.image;return a.createElement(r.d,{title:m,description:o,keywords:c,image:d})}function Oe(e){const{content:t}=e,{metadata:n,frontMatter:r}=t,{hide_title:c,hide_table_of_contents:o,toc_min_heading_level:m,toc_max_heading_level:d}=r,{title:p}=n,h=!c&&void 0===t.contentTitle,v=(0,s.i)(),E=!o&&t.toc&&t.toc.length>0,b=E&&("desktop"===v||"ssr"===v);return a.createElement("div",{className:"row"},a.createElement("div",{className:(0,l.Z)("col",!o&&Se)},a.createElement(L,null),a.createElement("div",{className:Ie},a.createElement("article",null,a.createElement(be,null),a.createElement(k,null),E&&a.createElement(re,{toc:t.toc,minHeadingLevel:m,maxHeadingLevel:d,className:(0,l.Z)(i.k.docs.docTocMobile,Ve)}),a.createElement("div",{className:(0,l.Z)(i.k.docs.docMarkdown,"markdown")},h&&a.createElement("header",null,a.createElement(ce,{as:"h1"},p)),a.createElement(Be,null,a.createElement(t,null))),a.createElement(O,e)),a.createElement(u,{previous:n.previous,next:n.next}))),b&&a.createElement("div",{className:"col col--3"},a.createElement(K,{toc:t.toc,minHeadingLevel:m,maxHeadingLevel:d,className:i.k.docs.docTocDesktop})))}function Re(e){const t="docs-doc-id-"+e.content.metadata.unversionedId;return a.createElement(r.FG,{className:t},a.createElement(De,e),a.createElement(Oe,e))}},6246:(e,t,n)=>{n.d(t,{E:()=>i,q:()=>s});var a=n(9231),l=n(7041);const r=a.createContext(null);function s(e){let{children:t,version:n}=e;return a.createElement(r.Provider,{value:n},t)}function i(){const e=(0,a.useContext)(r);if(null===e)throw new l.i6("DocsVersionProvider");return e}}}]);