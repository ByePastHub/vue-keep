import{g as S,h as T,a as n,T as h,t as k,m as v,H as x,I as B,w as I}from"./index.8535182c.js";const[P,s]=S("tag"),w={size:String,mark:Boolean,show:k,type:v("default"),color:String,plain:Boolean,round:Boolean,textColor:String,closeable:Boolean};var y=T({name:P,props:w,emits:["close"],setup(o,{slots:t,emit:r}){const c=a=>{a.stopPropagation(),r("close",a)},i=()=>o.plain?{color:o.textColor||o.color,borderColor:o.color}:{color:o.textColor,background:o.color},d=()=>{var a;const{type:u,mark:m,plain:g,round:C,size:e,closeable:f}=o,l={mark:m,plain:g,round:C};e&&(l[e]=e);const b=f&&n(B,{name:"cross",class:[s("close"),x],onClick:c},null);return n("span",{style:i(),class:s([l,u])},[(a=t.default)==null?void 0:a.call(t),b])};return()=>n(h,{name:o.closeable?"van-fade":void 0},{default:()=>[o.show?d():null]})}});const p=I(y);export{p as T};
//# sourceMappingURL=index.6097ebe5.js.map
