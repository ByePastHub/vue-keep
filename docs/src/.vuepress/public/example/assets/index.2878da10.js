import{g as z,i as I,j as R,m as l,n as C,h as w,u as D,a4 as N,a,I as q,a5 as L,a6 as O,w as U}from"./index.f905627f.js";const[_,o]=z("button"),j=I({},R,{tag:l("button"),text:String,icon:String,type:l("default"),size:l("normal"),color:String,block:Boolean,plain:Boolean,round:Boolean,square:Boolean,loading:Boolean,hairline:Boolean,disabled:Boolean,iconPrefix:String,nativeType:l("button"),loadingSize:C,loadingText:String,loadingType:String,iconPosition:l("left")});var E=w({name:_,props:j,emits:["click"],setup(e,{emit:g,slots:i}){const f=D(),b=()=>i.loading?i.loading():a(O,{size:e.loadingSize,type:e.loadingType,class:o("loading")},null),c=()=>{if(e.loading)return b();if(i.icon)return a("div",{class:o("icon")},[i.icon()]);if(e.icon)return a(q,{name:e.icon,class:o("icon"),classPrefix:e.iconPrefix},null)},x=()=>{let n;if(e.loading?n=e.loadingText:n=i.default?i.default():e.text,n)return a("span",{class:o("text")},[n])},m=()=>{const{color:n,plain:r}=e;if(n){const t={color:r?n:"white"};return r||(t.background=n),n.includes("gradient")?t.border=0:t.borderColor=n,t}},y=n=>{e.loading?L(n):e.disabled||(g("click",n),f())};return()=>{const{tag:n,type:r,size:t,block:S,round:B,plain:P,square:k,loading:T,disabled:s,hairline:d,nativeType:h,iconPosition:u}=e,v=[o([r,t,{plain:P,block:S,round:B,square:k,loading:T,disabled:s,hairline:d}]),{[N]:d}];return a(n,{type:h,class:v,style:m(),disabled:s,onClick:y},{default:()=>[a("div",{class:o("content")},[u==="left"&&c(),x(),u==="right"&&c()])]})}}});const p=U(E);export{p as B};
//# sourceMappingURL=index.2878da10.js.map