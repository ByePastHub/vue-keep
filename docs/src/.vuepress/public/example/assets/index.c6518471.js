import{g as z,i as I,j as R,m as l,n as C,h as w,u as D,a3 as N,a,I as p,a4 as q,a5 as E,w as L}from"./index.60c3b51a.js";const[O,o]=z("button"),U=I({},R,{tag:l("button"),text:String,icon:String,type:l("default"),size:l("normal"),color:String,block:Boolean,plain:Boolean,round:Boolean,square:Boolean,loading:Boolean,hairline:Boolean,disabled:Boolean,iconPrefix:String,nativeType:l("button"),loadingSize:C,loadingText:String,loadingType:String,iconPosition:l("left")});var _=w({name:O,props:U,emits:["click"],setup(n,{emit:g,slots:i}){const f=D(),b=()=>i.loading?i.loading():a(E,{size:n.loadingSize,type:n.loadingType,class:o("loading")},null),c=()=>{if(n.loading)return b();if(i.icon)return a("div",{class:o("icon")},[i.icon()]);if(n.icon)return a(p,{name:n.icon,class:o("icon"),classPrefix:n.iconPrefix},null)},x=()=>{let e;if(n.loading?e=n.loadingText:e=i.default?i.default():n.text,e)return a("span",{class:o("text")},[e])},m=()=>{const{color:e,plain:r}=n;if(e){const t={color:r?e:"white"};return r||(t.background=e),e.includes("gradient")?t.border=0:t.borderColor=e,t}},S=e=>{n.loading?q(e):n.disabled||(g("click",e),f())};return()=>{const{tag:e,type:r,size:t,block:y,round:B,plain:k,square:P,loading:v,disabled:s,hairline:d,nativeType:T,iconPosition:u}=n,h=[o([r,t,{plain:k,block:y,round:B,square:P,loading:v,disabled:s,hairline:d}]),{[N]:d}];return a(e,{type:T,class:h,style:m(),disabled:s,onClick:S},{default:()=>[a("div",{class:o("content")},[u==="left"&&c(),x(),u==="right"&&c()])]})}}});const A=L(_);const V="/vue-keep/example";export{A as B,V as a};
//# sourceMappingURL=index.c6518471.js.map