/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=window,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;class n{constructor(t,i,o){if(this._$cssResult$=!0,o!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=i}get styleSheet(){let t=this.o;const s=this.t;if(i&&void 0===t){const i=void 0!==s&&1===s.length;i&&(t=o.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(s,t))}return t}toString(){return this.cssText}}const e=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let i="";for(const s of t.cssRules)i+=s.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,s))(i)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var r;const h=window,l=h.trustedTypes,c=l?l.emptyScript:"",d=h.reactiveElementPolyfillSupport,a={toAttribute(t,i){switch(i){case Boolean:t=t?c:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},u=(t,i)=>i!==t&&(i==i||t==t),v={attribute:!0,type:String,converter:a,reflect:!1,hasChanged:u};class p extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(t){var i;null!==(i=this.h)&&void 0!==i||(this.h=[]),this.h.push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const o=this._$Ep(s,i);void 0!==o&&(this._$Ev.set(o,s),t.push(o))})),t}static createProperty(t,i=v){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,o=this.getPropertyDescriptor(t,s,i);void 0!==o&&Object.defineProperty(this.prototype,t,o)}}static getPropertyDescriptor(t,i,s){return{get(){return this[i]},set(o){const n=this[t];this[i]=o,this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||v}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)i.unshift(e(t))}else void 0!==t&&i.push(e(t));return i}static _$Ep(t,i){const s=i.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var i,s;(null!==(i=this._$ES)&&void 0!==i?i:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t))}removeController(t){var i;null===(i=this._$ES)||void 0===i||i.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Ei.set(i,this[i]),delete this[i])}))}createRenderRoot(){var s;const o=null!==(s=this.shadowRoot)&&void 0!==s?s:this.attachShadow(this.constructor.shadowRootOptions);return((s,o)=>{i?s.adoptedStyleSheets=o.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):o.forEach((i=>{const o=document.createElement("style"),n=t.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=i.cssText,s.appendChild(o)}))})(o,this.constructor.elementStyles),o}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}))}attributeChangedCallback(t,i,s){this._$AK(t,s)}_$EO(t,i,s=v){var o;const n=this.constructor._$Ep(t,s);if(void 0!==n&&!0===s.reflect){const e=(void 0!==(null===(o=s.converter)||void 0===o?void 0:o.toAttribute)?s.converter:a).toAttribute(i,s.type);this._$El=t,null==e?this.removeAttribute(n):this.setAttribute(n,e),this._$El=null}}_$AK(t,i){var s;const o=this.constructor,n=o._$Ev.get(t);if(void 0!==n&&this._$El!==n){const t=o.getPropertyOptions(n),e="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(s=t.converter)||void 0===s?void 0:s.fromAttribute)?t.converter:a;this._$El=n,this[n]=e.fromAttribute(i,t.type),this._$El=null}}requestUpdate(t,i,s){let o=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||u)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===s.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,s))):o=!1),!this.isUpdatePending&&o&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,i)=>this[i]=t)),this._$Ei=void 0);let i=!1;const s=this._$AL;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this._$Ek()}catch(t){throw i=!1,this._$Ek(),t}i&&this._$AE(s)}willUpdate(t){}_$AE(t){var i;null===(i=this._$ES)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,i)=>this._$EO(i,this[i],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var f;p.finalized=!0,p.elementProperties=new Map,p.elementStyles=[],p.shadowRootOptions={mode:"open"},null==d||d({ReactiveElement:p}),(null!==(r=h.reactiveElementVersions)&&void 0!==r?r:h.reactiveElementVersions=[]).push("1.4.1");const g=window,m=g.trustedTypes,_=m?m.createPolicy("lit-html",{createHTML:t=>t}):void 0,y=`lit$${(Math.random()+"").slice(9)}$`,b="?"+y,w=`<${b}>`,$=document,x=(t="")=>$.createComment(t),k=t=>null===t||"object"!=typeof t&&"function"!=typeof t,S=Array.isArray,C=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,A=/-->/g,E=/>/g,T=RegExp(">|[ \t\n\f\r](?:([^\\s\"'>=/]+)([ \t\n\f\r]*=[ \t\n\f\r]*(?:[^ \t\n\f\r\"'`<>=]|(\"|')|))|$)","g"),z=/'/g,M=/"/g,N=/^(?:script|style|textarea|title)$/i,U=(t=>(i,...s)=>({_$litType$:t,strings:i,values:s}))(1),O=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),P=new WeakMap,R=$.createTreeWalker($,129,null,!1),L=(t,i)=>{const s=t.length-1,o=[];let n,e=2===i?"<svg>":"",r=C;for(let i=0;i<s;i++){const s=t[i];let h,l,c=-1,d=0;for(;d<s.length&&(r.lastIndex=d,l=r.exec(s),null!==l);)d=r.lastIndex,r===C?"!--"===l[1]?r=A:void 0!==l[1]?r=E:void 0!==l[2]?(N.test(l[2])&&(n=RegExp("</"+l[2],"g")),r=T):void 0!==l[3]&&(r=T):r===T?">"===l[0]?(r=null!=n?n:C,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,h=l[1],r=void 0===l[3]?T:'"'===l[3]?M:z):r===M||r===z?r=T:r===A||r===E?r=C:(r=T,n=void 0);const a=r===T&&t[i+1].startsWith("/>")?" ":"";e+=r===C?s+w:c>=0?(o.push(h),s.slice(0,c)+"$lit$"+s.slice(c)+y+a):s+y+(-2===c?(o.push(void 0),i):a)}const h=e+(t[s]||"<?>")+(2===i?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==_?_.createHTML(h):h,o]};class H{constructor({strings:t,_$litType$:i},s){let o;this.parts=[];let n=0,e=0;const r=t.length-1,h=this.parts,[l,c]=L(t,i);if(this.el=H.createElement(l,s),R.currentNode=this.el.content,2===i){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes)}for(;null!==(o=R.nextNode())&&h.length<r;){if(1===o.nodeType){if(o.hasAttributes()){const t=[];for(const i of o.getAttributeNames())if(i.endsWith("$lit$")||i.startsWith(y)){const s=c[e++];if(t.push(i),void 0!==s){const t=o.getAttribute(s.toLowerCase()+"$lit$").split(y),i=/([.?@])?(.*)/.exec(s);h.push({type:1,index:n,name:i[2],strings:t,ctor:"."===i[1]?V:"?"===i[1]?G:"@"===i[1]?Z:J})}else h.push({type:6,index:n})}for(const i of t)o.removeAttribute(i)}if(N.test(o.tagName)){const t=o.textContent.split(y),i=t.length-1;if(i>0){o.textContent=m?m.emptyScript:"";for(let s=0;s<i;s++)o.append(t[s],x()),R.nextNode(),h.push({type:2,index:++n});o.append(t[i],x())}}}else if(8===o.nodeType)if(o.data===b)h.push({type:2,index:n});else{let t=-1;for(;-1!==(t=o.data.indexOf(y,t+1));)h.push({type:7,index:n}),t+=y.length-1}n++}}static createElement(t,i){const s=$.createElement("template");return s.innerHTML=t,s}}function q(t,i,s=t,o){var n,e,r,h;if(i===O)return i;let l=void 0!==o?null===(n=s._$Cl)||void 0===n?void 0:n[o]:s._$Cu;const c=k(i)?void 0:i._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(e=null==l?void 0:l._$AO)||void 0===e||e.call(l,!1),void 0===c?l=void 0:(l=new c(t),l._$AT(t,s,o)),void 0!==o?(null!==(r=(h=s)._$Cl)&&void 0!==r?r:h._$Cl=[])[o]=l:s._$Cu=l),void 0!==l&&(i=q(t,l._$AS(t,i.values),l,o)),i}class B{constructor(t,i){this.v=[],this._$AN=void 0,this._$AD=t,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}p(t){var i;const{el:{content:s},parts:o}=this._$AD,n=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:$).importNode(s,!0);R.currentNode=n;let e=R.nextNode(),r=0,h=0,l=o[0];for(;void 0!==l;){if(r===l.index){let i;2===l.type?i=new I(e,e.nextSibling,this,t):1===l.type?i=new l.ctor(e,l.name,l.strings,this,t):6===l.type&&(i=new K(e,this,t)),this.v.push(i),l=o[++h]}r!==(null==l?void 0:l.index)&&(e=R.nextNode(),r++)}return n}m(t){let i=0;for(const s of this.v)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++}}class I{constructor(t,i,s,o){var n;this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=o,this._$C_=null===(n=null==o?void 0:o.isConnected)||void 0===n||n}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$C_}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=q(this,t,i),k(t)?t===j||null==t||""===t?(this._$AH!==j&&this._$AR(),this._$AH=j):t!==this._$AH&&t!==O&&this.$(t):void 0!==t._$litType$?this.T(t):void 0!==t.nodeType?this.k(t):(t=>S(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.O(t):this.$(t)}S(t,i=this._$AB){return this._$AA.parentNode.insertBefore(t,i)}k(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}$(t){this._$AH!==j&&k(this._$AH)?this._$AA.nextSibling.data=t:this.k($.createTextNode(t)),this._$AH=t}T(t){var i;const{values:s,_$litType$:o}=t,n="number"==typeof o?this._$AC(t):(void 0===o.el&&(o.el=H.createElement(o.h,this.options)),o);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===n)this._$AH.m(s);else{const t=new B(n,this),i=t.p(this.options);t.m(s),this.k(i),this._$AH=t}}_$AC(t){let i=P.get(t.strings);return void 0===i&&P.set(t.strings,i=new H(t)),i}O(t){S(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,o=0;for(const n of t)o===i.length?i.push(s=new I(this.S(x()),this.S(x()),this,this.options)):s=i[o],s._$AI(n),o++;o<i.length&&(this._$AR(s&&s._$AB.nextSibling,o),i.length=o)}_$AR(t=this._$AA.nextSibling,i){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var i;void 0===this._$AM&&(this._$C_=t,null===(i=this._$AP)||void 0===i||i.call(this,t))}}class J{constructor(t,i,s,o,n){this.type=1,this._$AH=j,this._$AN=void 0,this.element=t,this.name=i,this._$AM=o,this.options=n,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=j}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,s,o){const n=this.strings;let e=!1;if(void 0===n)t=q(this,t,i,0),e=!k(t)||t!==this._$AH&&t!==O,e&&(this._$AH=t);else{const o=t;let r,h;for(t=n[0],r=0;r<n.length-1;r++)h=q(this,o[s+r],i,r),h===O&&(h=this._$AH[r]),e||(e=!k(h)||h!==this._$AH[r]),h===j?t=j:t!==j&&(t+=(null!=h?h:"")+n[r+1]),this._$AH[r]=h}e&&!o&&this.P(t)}P(t){t===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class V extends J{constructor(){super(...arguments),this.type=3}P(t){this.element[this.name]=t===j?void 0:t}}const D=m?m.emptyScript:"";class G extends J{constructor(){super(...arguments),this.type=4}P(t){t&&t!==j?this.element.setAttribute(this.name,D):this.element.removeAttribute(this.name)}}class Z extends J{constructor(t,i,s,o,n){super(t,i,s,o,n),this.type=5}_$AI(t,i=this){var s;if((t=null!==(s=q(this,t,i,0))&&void 0!==s?s:j)===O)return;const o=this._$AH,n=t===j&&o!==j||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,e=t!==j&&(o===j||n);n&&this.element.removeEventListener(this.name,this,o),e&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var i,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t)}}class K{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){q(this,t)}}const W=g.litHtmlPolyfillSupport;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var Q,F;null==W||W(H,I),(null!==(f=g.litHtmlVersions)&&void 0!==f?f:g.litHtmlVersions=[]).push("2.3.1");class X extends p{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,i;const s=super.createRenderRoot();return null!==(t=(i=this.renderOptions).renderBefore)&&void 0!==t||(i.renderBefore=s.firstChild),s}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,i,s)=>{var o,n;const e=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:i;let r=e._$litPart$;if(void 0===r){const t=null!==(n=null==s?void 0:s.renderBefore)&&void 0!==n?n:null;e._$litPart$=r=new I(i.insertBefore(x(),t),t,void 0,null!=s?s:{})}return r._$AI(t),r})(i,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return O}}X.finalized=!0,X._$litElement$=!0,null===(Q=globalThis.litElementHydrateSupport)||void 0===Q||Q.call(globalThis,{LitElement:X});const Y=globalThis.litElementPolyfillSupport;null==Y||Y({LitElement:X}),(null!==(F=globalThis.litElementVersions)&&void 0!==F?F:globalThis.litElementVersions=[]).push("3.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const tt=t=>i=>"function"==typeof i?((t,i)=>(customElements.define(t,i),i))(t,i):((t,i)=>{const{kind:s,elements:o}=i;return{kind:s,elements:o,finisher(i){customElements.define(t,i)}}})(t,i)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,it=(t,i)=>"method"===i.kind&&i.descriptor&&!("value"in i.descriptor)?{...i,finisher(s){s.createProperty(i.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:i.key,initializer(){"function"==typeof i.initializer&&(this[i.key]=i.initializer.call(this))},finisher(s){s.createProperty(i.key,t)}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function st(t){return function(t){return(i,s)=>void 0!==s?((t,i,s)=>{i.constructor.createProperty(s,t)})(t,i,s):it(t,i)}({...t,state:!0})}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var ot;null===(ot=window.HTMLSlotElement)||void 0===ot||ot.prototype.assignedElements;const nt=U`<svg class="icon discount_icon" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
<path d="M17.78 3.09A1.995 1.995 0 0 0 16 2h-5.165c-.535 0-1.046.214-1.422.593l-6.82 6.89c0 .002 0 .003-.002.003a2.015 2.015 0 0 0-.5.874L.738 8.055a2 2 0 0 1 .712-2.737L9.823.425A1.99 1.99 0 0 1 11.35.22l4.99 1.337a2 2 0 0 1 1.44 1.533z" fill-opacity=".55"/><path d="M10.835 2H16a2 2 0 0 1 2 2v5.172c0 .53-.21 1.04-.586 1.414l-6.818 6.818a2 2 0 0 1-2.82.01l-5.166-5.1a2.001 2.001 0 0 1-.02-2.828c.002 0 .003 0 .003-.002l6.82-6.89A2 2 0 0 1 10.835 2zM13.5 8a1.5 1.5 0 1 0-.001-3.001A1.5 1.5 0 0 0 13.5 8z"/>
</svg>`,et=U`<svg class="icon gift_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
<g fill-rule="evenodd">
<path d="M12.915 5c.055-.156.085-.325.085-.5 0-.828-.672-1.5-1.5-1.5S10 3.672 10 4.5V11h6v2h-6v5H8v-5H2v-2h6V4.5C8 3.672 7.328 3 6.5 3S5 3.672 5 4.5c0 .175.03.344.085.5h-2.05C3.012 4.837 3 4.67 3 4.5 3 2.567 4.567 1 6.5 1c.98 0 1.865.402 2.5 1.05C9.635 1.403 10.52 1 11.5 1 13.433 1 15 2.567 15 4.5c0 .17-.012.337-.035.5h-2.05z" fill-opacity=".55" fill-rule="nonzero"></path>
<path d="M16 13v2c0 1.657-1.343 3-3 3h-3v-5h6zm0-2h-6V5h6c1.105 0 2 .895 2 2s-.895 2-2 2v2zM2 13h6v5H5c-1.657 0-3-1.343-3-3v-2zm0-2V9C.895 9 0 8.105 0 7s.895-2 2-2h6v6H2z"></path>
</g>
</svg>`,rt=U`<svg class="icon spinner_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
<path d="M20 10c0 5.523-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0v2c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8h2z"></path>
</svg>`,ht=U`<svg class="icon close_icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="m12 13.05-5.075 5.075q-.2.2-.512.212-.313.013-.538-.212-.225-.225-.225-.525 0-.3.225-.525L10.95 12 5.875 6.925q-.2-.2-.212-.513-.013-.312.212-.537.225-.225.525-.225.3 0 .525.225L12 10.95l5.075-5.075q.2-.2.513-.213.312-.012.537.213.225.225.225.525 0 .3-.225.525L13.05 12l5.075 5.075q.2.2.212.512.013.313-.212.538-.225.225-.525.225-.3 0-.525-.225Z"/>
</svg>`;class lt{constructor(t){this._token="",this._authorizationToken="",this._data={checkout:{applied_discounts:[],gift_cards:[],total_discount_amount:""}},this._discounts=[],this._gift_cards=[],this._error=!1,(this.host=t).addController(this)}async getTokens(){var t,i;const s=await fetch("/checkout");if(!s.ok)throw Error("Not ok status!");const o=await s.text(),n=document.createElement("div");n.innerHTML=o;this._authorizationToken=null!==(i=null===(t=n.querySelector("[name=shopify-checkout-authorization-token]"))||void 0===t?void 0:t.content)&&void 0!==i?i:"",this._token=s.url.split("/").pop()}queryCheckout(t="GET",i=null){return fetch(`/wallets/checkouts/${this._token}`,{headers:{accept:"*/*","content-type":"application/json","x-shopify-checkout-authorization-token":this._authorizationToken},body:i,method:t,mode:"cors",credentials:"omit"})}async clearDiscount(t,i){var s,o;const n=t.currentTarget;n.classList.add("loading"),console.log("%cTEST","color: orange; background: black; padding: 5px;",n);try{const t=JSON.stringify({checkout:{clear_discount:1,discount_code:i}}),e=await this.queryCheckout("PUT",t);if(!e.ok)throw Error("Not ok status!");const r=await e.json();(null===(s=null==r?void 0:r.checkout)||void 0===s?void 0:s.applied_discounts)&&(this._discounts=r.checkout.applied_discounts),(null===(o=null==r?void 0:r.checkout)||void 0===o?void 0:o.gift_cards)&&(this._gift_cards=r.checkout.gift_cards),n.classList.remove("loading"),this.host.requestUpdate()}catch(t){n.classList.remove("loading"),console.log(t)}}async clearGiftCard(t,i){var s,o;const n=t.currentTarget;n.classList.add("loading"),console.log("%cTEST","color: orange; background: black; padding: 5px;",n);try{const t=JSON.stringify({checkout:{applied_gift_cards:{[i.id]:{id:i.id,_delete:1}}}}),n=await this.queryCheckout("PUT",t);if(!n.ok)throw Error("Not ok status!");const e=await n.json();(null===(s=null==e?void 0:e.checkout)||void 0===s?void 0:s.applied_discounts)&&(this._discounts=e.checkout.applied_discounts),(null===(o=null==e?void 0:e.checkout)||void 0===o?void 0:o.gift_cards)&&(this._gift_cards=e.checkout.gift_cards),this.host.requestUpdate()}catch(t){console.log(t)}}async applyCode(t){var i,s;const o=JSON.stringify({checkout:{reduction_code:t}}),n=await this.queryCheckout("PUT",o);if(!n.ok)throw Error("Not ok status!");const e=await n.json();(null===(i=null==e?void 0:e.checkout)||void 0===i?void 0:i.applied_discounts)&&(this._discounts=e.checkout.applied_discounts),(null===(s=null==e?void 0:e.checkout)||void 0===s?void 0:s.gift_cards)&&(this._gift_cards=e.checkout.gift_cards),this.host.requestUpdate()}async discountQuery(){var t,i;try{await this.getTokens();const s=await this.queryCheckout();if(404===s.status)throw Error("CART Empty! 404 status!");if(!s.ok)throw Error("Not ok status!");const o=await s.json();(null===(t=null==o?void 0:o.checkout)||void 0===t?void 0:t.applied_discounts)&&(this._discounts=o.checkout.applied_discounts),(null===(i=null==o?void 0:o.checkout)||void 0===i?void 0:i.gift_cards)&&(this._gift_cards=o.checkout.gift_cards),this._data=o}catch(t){console.log(t),this._error=!0}}async hostConnected(){await this.discountQuery(),this.host.requestUpdate()}}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var ct=function(t,i,s,o){for(var n,e=arguments.length,r=e<3?i:null===o?o=Object.getOwnPropertyDescriptor(i,s):o,h=t.length-1;h>=0;h--)(n=t[h])&&(r=(e<3?n(r):e>3?n(i,s,r):n(i,s))||r);return e>3&&r&&Object.defineProperty(i,s,r),r};let dt=class extends X{constructor(){super(...arguments),this.data={checkout:{applied_discounts:[],gift_cards:[],total_discount_amount:""}},this.hide=!1,this.error=!1,this.loading=!1,this.disabled=!0,this.code="",this.dataFetcher=new lt(this)}handleInput(t){var i;this.error=!1,this.code=null===(i=t.target)||void 0===i?void 0:i.value}async applyCode(){if(this.code.length){this.loading=!0;try{await this.dataFetcher.applyCode(this.code),this.loading=!1}catch(t){this.loading=!1,this.error=!0,console.log(t)}}}getDiscountsAndGifts(){return this.dataFetcher._discounts.length||this.dataFetcher._gift_cards.length?U`<div class="discounter-component__codes">
        ${this.dataFetcher._discounts.map((t=>U`
            <div class="discounter-component__code">
              <span>
                ${nt}
                <span>${t.title}</span>
              </span>
              <button
                type="button"
                @click=${i=>this.dataFetcher.clearDiscount(i,t.title)}
              >
                ${ht}
                ${rt}
              </button>
            </div>
          `))}

        ${this.dataFetcher._gift_cards.map((t=>U`
            <div class="discounter-component__code">
              <span>
                ${et}
                <span>•••• ${t.last_characters}</span>
              </span>
              <button
                type="button"
                @click=${i=>this.dataFetcher.clearGiftCard(i,t)}
              >
                ${ht}
                ${rt}
              </button>
            </div>
          `))}
      </div>`:""}render(){if(this.hide)return"";const t=this.loading?"button loading":"button",i=this.error?"error":"";return U`
      <div class="discounter-component">
        <div class="discounter-component__form--wrapper">
          <div class="discounter-component__form">
            <input
              type="text"
              class=${i}
              placeholder="Gift card or discount code"
              .value=${this.code}
              @input=${this.handleInput}
            >
            <button
              type="submit"
              class=${t}
              ?disabled=${this.disabled||!this.code.length}
              @click=${this.applyCode}
            >
              <span>Apply</span>
              ${rt}
            </button>
          </div>

          ${this.error?U`<p class="discounter-component__message">Enter a valid discount code or gift card</p>`:""}
        </div>

        ${this.getDiscountsAndGifts()}
      </div>
    `}};dt.styles=((t,...i)=>{const o=1===t.length?t[0]:i.reduce(((i,s,o)=>i+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1]),t[0]);return new n(o,t,s)})`
    .discounter-component__form--wrapper {
      padding: 6px
    }
    .discounter-component__form {
      display: flex;
      gap: 12px;
    }
    .discounter-component__form input {
      border-radius: 5px;
      padding: 13px 11px;
    }
    .discounter-component__form input.error {
      border: 1px solid #ff6d6d;
    }
    .discounter-component__form button {
      border-radius: 5px;
      background: black;
      color: white;
      padding: 0 24px;
      position: relative;
    }
    .discounter-component__form button.loading {
      padding: 0px 24px;
    }
    .discounter-component__form button[disabled] {
      cursor: not-allowed;
      opacity: 0.4;
    }
    .discounter-component__form button svg {
      visibility: hidden;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-top: -10px;
      margin-left: -10px;
      transition: opacity 0.3s ease-in-out;
      opacity: 0;
    }
    .discounter-component__form button.loading span {
      visibility: hidden;
    }
    .discounter-component__form button.loading svg {
      animation: rotate 0.5s linear infinite;
      visibility: visible;
      opacity: 1;
    }
    .discounter-component__message {
      color: #ff6d6d;
      margin: 8px 0 4px;
    }
    .discounter-component__codes {
      display: flex;
      gap: 10px;
      margin-top: 12px;
    }
    .discounter-component__code {
      background-color: rgba(113, 113, 113, 0.11);
      border-radius: 5px;
      color: #717171;
      display: inline-flex;
      gap: 8px;
      padding: 10px;
    }
    .discounter-component__code span {
      align-items: center;
      display: flex;
      font-size: 13px;
      font-weight: 600;
      gap: 8px;
    }
    .discounter-component .icon {
      fill: currentColor;
      height: 18px;
      width: 18px;
    }
    .discounter-component__code button {
      background: transparent;
      border: 0;
      cursor: pointer;
      padding: 0;
    }
    .discounter-component__code button .icon {
      height: 16px;
      width: 16px;
    }
    .discounter-component__code button .spinner_icon {
      animation: rotate 0.5s linear infinite;
    }
    .discounter-component__code button .close_icon,
    .discounter-component__code button.loading .spinner_icon {
      display: block;
    }
    .discounter-component__code button .spinner_icon,
    .discounter-component__code button.loading .close_icon {
      display: none;
    }
    @keyframes rotate {
      0% {
        transform: rotate(0);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `,ct([st()],dt.prototype,"data",void 0),ct([st()],dt.prototype,"hide",void 0),ct([st()],dt.prototype,"error",void 0),ct([st()],dt.prototype,"loading",void 0),ct([st()],dt.prototype,"disabled",void 0),ct([st()],dt.prototype,"code",void 0),dt=ct([tt("discounter-form")],dt);let at=class extends X{constructor(){super(...arguments),this.dataFetcher=new lt(this)}render(){const t=this.dataFetcher._data;return U`
      <div class="discounter-component">
        <h1>${t.checkout.total_discount_amount}</h1>
      </div>
    `}};at=ct([tt("discounter-summary")],at);export{dt as DiscounterForm,at as DiscounterSummary};
