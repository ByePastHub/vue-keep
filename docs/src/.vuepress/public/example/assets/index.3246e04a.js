import{k as W,m as $,n as y,h as S,i as ne,z as ce,t as z,A as w,v as L,a as t,I as G,C as E,g as B,D as le,l as V,E as A,G as de,J as se,K as te,L as ue,q as F,M as me,w as p,f as fe,s as be,N as q,O as ae,P as ge,y as he,Q as ve,R as ke,S as xe,U as _e,V as ye,W as Se,x as j,X as Pe,Y as M,Z as K,_ as Ce,$ as N,a0 as we,r as T,o as O,c as X,b as Y,F as $e,a1 as Be,a2 as pe,a3 as Te}from"./index.7e292e13.js";import{T as Ie}from"./index.9e6ab853.js";import{B as Le}from"./index.a4b2fe0b.js";const re={name:W,shape:$("round"),disabled:Boolean,iconSize:y,modelValue:W,checkedColor:String,labelPosition:String,labelDisabled:Boolean};var Ve=S({props:ne({},re,{bem:ce(Function),role:String,parent:Object,checked:Boolean,bindGroup:z}),emits:["click","toggle"],setup(e,{emit:n,slots:o}){const d=w(),l=a=>{if(e.parent&&e.bindGroup)return e.parent.props[a]},c=L(()=>l("disabled")||e.disabled),f=L(()=>l("direction")),r=L(()=>{const a=e.checkedColor||l("checkedColor");if(a&&e.checked&&!c.value)return{borderColor:a,backgroundColor:a}}),i=a=>{const{target:m}=a,h=d.value,k=h===m||(h==null?void 0:h.contains(m));!c.value&&(k||!e.labelDisabled)&&n("toggle"),n("click",a)},s=()=>{const{bem:a,shape:m,checked:h}=e,k=e.iconSize||l("iconSize");return t("div",{ref:d,class:a("icon",[m,{disabled:c.value,checked:h}]),style:{fontSize:E(k)}},[o.icon?o.icon({checked:h,disabled:c.value}):t(G,{name:"success",style:r.value},null)])},g=()=>{if(o.default)return t("span",{class:e.bem("label",[e.labelPosition,{disabled:c.value}])},[o.default()])};return()=>{const a=e.labelPosition==="left"?[g(),s()]:[s(),g()];return t("div",{role:e.role,class:e.bem([{disabled:c.value,"label-disabled":e.labelDisabled},f.value]),tabindex:c.value?void 0:0,"aria-checked":e.checked,onClick:i},[a])}}});const[ze,C]=B("image"),Ge={src:String,alt:String,fit:String,position:String,round:Boolean,width:y,height:y,radius:y,lazyLoad:Boolean,iconSize:y,showError:z,errorIcon:$("photo-fail"),iconPrefix:String,showLoading:z,loadingIcon:$("photo")};var Re=S({name:ze,props:Ge,emits:["load","error"],setup(e,{emit:n,slots:o}){const d=w(!1),l=w(!0),c=w(),{$Lazyload:f}=le().proxy,r=L(()=>{const u={width:E(e.width),height:E(e.height)};return V(e.radius)&&(u.overflow="hidden",u.borderRadius=E(e.radius)),u});A(()=>e.src,()=>{d.value=!1,l.value=!0});const i=u=>{l.value=!1,n("load",u)},s=u=>{d.value=!0,l.value=!1,n("error",u)},g=(u,b,x)=>x?x():t(G,{name:u,size:e.iconSize,class:b,classPrefix:e.iconPrefix},null),a=()=>{if(l.value&&e.showLoading)return t("div",{class:C("loading")},[g(e.loadingIcon,C("loading-icon"),o.loading)]);if(d.value&&e.showError)return t("div",{class:C("error")},[g(e.errorIcon,C("error-icon"),o.error)])},m=()=>{if(d.value||!e.src)return;const u={alt:e.alt,class:C("img"),style:{objectFit:e.fit,objectPosition:e.position}};return e.lazyLoad?te(t("img",F({ref:c},u),null),[[ue("lazy"),e.src]]):t("img",F({src:e.src,onLoad:i,onError:s},u),null)},h=({el:u})=>{const b=()=>{u===c.value&&l.value&&i()};c.value?b():me(b)},k=({el:u})=>{u===c.value&&!d.value&&s()};return f&&de&&(f.$on("loaded",h),f.$on("error",k),se(()=>{f.$off("loaded",h),f.$off("error",k)})),()=>{var u;return t("div",{class:C({round:e.round}),style:r.value},[m(),a(),(u=o.default)==null?void 0:u.call(o)])}}});const Ee=p(Re),[Ae,v]=B("card"),De={tag:String,num:y,desc:String,thumb:String,title:String,price:y,centered:Boolean,lazyLoad:Boolean,currency:$("\xA5"),thumbLink:String,originPrice:y};var Ne=S({name:Ae,props:De,emits:["click-thumb"],setup(e,{slots:n,emit:o}){const d=()=>{if(n.title)return n.title();if(e.title)return t("div",{class:[v("title"),"van-multi-ellipsis--l2"]},[e.title])},l=()=>{if(n.tag||e.tag)return t("div",{class:v("tag")},[n.tag?n.tag():t(Ie,{mark:!0,type:"danger"},{default:()=>[e.tag]})])},c=()=>n.thumb?n.thumb():t(Ee,{src:e.thumb,fit:"cover",width:"100%",height:"100%",lazyLoad:e.lazyLoad},null),f=()=>{if(n.thumb||e.thumb)return t("a",{href:e.thumbLink,class:v("thumb"),onClick:s=>o("click-thumb",s)},[c(),l()])},r=()=>{if(n.desc)return n.desc();if(e.desc)return t("div",{class:[v("desc"),"van-ellipsis"]},[e.desc])},i=()=>{const s=e.price.toString().split(".");return t("div",null,[t("span",{class:v("price-currency")},[e.currency]),t("span",{class:v("price-integer")},[s[0]]),fe("."),t("span",{class:v("price-decimal")},[s[1]])])};return()=>{var s,g,a;const m=n.num||V(e.num),h=n.price||V(e.price),k=n["origin-price"]||V(e.originPrice),u=m||h||k||n.bottom,b=h&&t("div",{class:v("price")},[n.price?n.price():i()]),x=k&&t("div",{class:v("origin-price")},[n["origin-price"]?n["origin-price"]():`${e.currency} ${e.originPrice}`]),P=m&&t("div",{class:v("num")},[n.num?n.num():`x${e.num}`]),D=n.footer&&t("div",{class:v("footer")},[n.footer()]),R=u&&t("div",{class:v("bottom")},[(s=n["price-top"])==null?void 0:s.call(n),b,x,P,(g=n.bottom)==null?void 0:g.call(n)]);return t("div",{class:v()},[t("div",{class:v("header")},[f(),t("div",{class:v("content",{centered:e.centered})},[t("div",null,[d(),r(),(a=n.tags)==null?void 0:a.call(n)]),R])]),D])}}});const H=p(Ne),[ie,Oe]=B("checkbox-group"),Fe={max:y,disabled:Boolean,iconSize:y,direction:String,modelValue:ge(),checkedColor:String},oe=Symbol(ie);var je=S({name:ie,props:Fe,emits:["change","update:modelValue"],setup(e,{emit:n,slots:o}){const{children:d,linkChildren:l}=be(oe),c=r=>n("update:modelValue",r),f=(r={})=>{typeof r=="boolean"&&(r={checked:r});const{checked:i,skipDisabled:s}=r,a=d.filter(m=>m.props.bindGroup?m.props.disabled&&s?m.checked.value:i!=null?i:!m.checked.value:!1).map(m=>m.name);c(a)};return A(()=>e.modelValue,r=>n("change",r)),q({toggleAll:f}),ae(()=>e.modelValue),l({props:e,updateValue:c}),()=>{var r;return t("div",{class:Oe([e.direction])},[(r=o.default)==null?void 0:r.call(o)])}}});const[qe,Ue]=B("checkbox"),We=ne({},re,{bindGroup:z});var Me=S({name:qe,props:We,emits:["change","update:modelValue"],setup(e,{emit:n,slots:o}){const{parent:d}=he(oe),l=r=>{const{name:i}=e,{max:s,modelValue:g}=d.props,a=g.slice();if(r)!(s&&a.length>=s)&&!a.includes(i)&&(a.push(i),e.bindGroup&&d.updateValue(a));else{const m=a.indexOf(i);m!==-1&&(a.splice(m,1),e.bindGroup&&d.updateValue(a))}},c=L(()=>d&&e.bindGroup?d.props.modelValue.indexOf(e.name)!==-1:!!e.modelValue),f=(r=!c.value)=>{d&&e.bindGroup?l(r):n("update:modelValue",r)};return A(()=>e.modelValue,r=>n("change",r)),q({toggle:f,props:e,checked:c}),ae(()=>e.modelValue),()=>t(Ve,F({bem:Ue,role:"checkbox",parent:d,checked:c.value,onToggle:f},e),ve(o,["default","icon"]))}});const J=p(Me),Q=p(je),[Ke,I]=B("notice-bar"),Xe={text:String,mode:String,color:String,delay:j(1),speed:j(60),leftIcon:String,wrapable:Boolean,background:String,scrollable:{type:Boolean,default:null}};var Ye=S({name:Ke,props:Xe,emits:["close","replay"],setup(e,{emit:n,slots:o}){let d=0,l=0,c;const f=w(),r=w(),i=ke({show:!0,offset:0,duration:0}),s=()=>{if(o["left-icon"])return o["left-icon"]();if(e.leftIcon)return t(G,{class:I("left-icon"),name:e.leftIcon},null)},g=()=>{if(e.mode==="closeable")return"cross";if(e.mode==="link")return"arrow"},a=b=>{e.mode==="closeable"&&(i.show=!1,n("close",b))},m=()=>{if(o["right-icon"])return o["right-icon"]();const b=g();if(b)return t(G,{name:b,class:I("right-icon"),onClick:a},null)},h=()=>{i.offset=d,i.duration=0,Pe(()=>{M(()=>{i.offset=-l,i.duration=(l+d)/+e.speed,n("replay")})})},k=()=>{const b=e.scrollable===!1&&!e.wrapable,x={transform:i.offset?`translateX(${i.offset}px)`:"",transitionDuration:`${i.duration}s`};return t("div",{ref:f,role:"marquee",class:I("wrap")},[t("div",{ref:r,style:x,class:[I("content"),{"van-ellipsis":b}],onTransitionend:h},[o.default?o.default():e.text])])},u=()=>{const{delay:b,speed:x,scrollable:P}=e,D=V(b)?+b*1e3:0;d=0,l=0,i.offset=0,i.duration=0,clearTimeout(c),c=setTimeout(()=>{if(!f.value||!r.value||P===!1)return;const R=K(f).width,U=K(r).width;(P||U>R)&&M(()=>{d=R,l=U,i.offset=-l,i.duration=l/+x})},D)};return xe(u),_e(u),ye("pageshow",u),q({reset:u}),A(()=>[e.text,e.scrollable],u),()=>{const{color:b,wrapable:x,background:P}=e;return te(t("div",{role:"alert",class:I({wrapable:x}),style:{color:b,background:P}},[s(),k(),m()]),[[Se,i.show]])}}});const Z=p(Ye),[He,_,Je]=B("submit-bar"),Qe={tip:String,label:String,price:Number,tipIcon:String,loading:Boolean,currency:$("\xA5"),disabled:Boolean,textAlign:String,buttonText:String,buttonType:$("danger"),buttonColor:String,suffixLabel:String,decimalLength:j(2),safeAreaInsetBottom:z};var Ze=S({name:He,props:Qe,emits:["submit"],setup(e,{emit:n,slots:o}){const d=()=>{const{price:r,label:i,currency:s,textAlign:g,suffixLabel:a,decimalLength:m}=e;if(typeof r=="number"){const h=(r/100).toFixed(+m).split("."),k=m?`.${h[1]}`:"";return t("div",{class:_("text"),style:{textAlign:g}},[t("span",null,[i||Je("label")]),t("span",{class:_("price")},[s,t("span",{class:_("price-integer")},[h[0]]),k]),a&&t("span",{class:_("suffix-label")},[a])])}},l=()=>{var r;const{tip:i,tipIcon:s}=e;if(o.tip||i)return t("div",{class:_("tip")},[s&&t(G,{class:_("tip-icon"),name:s},null),i&&t("span",{class:_("tip-text")},[i]),(r=o.tip)==null?void 0:r.call(o)])},c=()=>n("submit"),f=()=>o.button?o.button():t(Le,{round:!0,type:e.buttonType,text:e.buttonText,class:_("button",e.buttonType),color:e.buttonColor,loading:e.loading,disabled:e.disabled,onClick:c},null);return()=>{var r,i;return t("div",{class:[_(),{"van-safe-area-bottom":e.safeAreaInsetBottom}]},[(r=o.top)==null?void 0:r.call(o),l(),t("div",{class:_("bar")},[(i=o.default)==null?void 0:i.call(o),d(),f()])])}}});const ee=p(Ze);const en={components:{[Z.name]:Z,[H.name]:H,[J.name]:J,[ee.name]:ee,[Q.name]:Q},data(){return{checkedGoods:["2"],goods:[{id:"1",title:"\u8FDB\u53E3\u9999\u8549",desc:"\u7EA6250g\uFF0C2\u6839",price:200,num:1,thumb:N+"/images/banana.jpeg"},{id:"2",title:"\u9655\u897F\u871C\u68A8",desc:"\u7EA6600g",price:690,num:1,thumb:N+"/images/sydney.jpeg"},{id:"3",title:"\u7F8E\u56FD\u4F3D\u529B\u679C",desc:"\u7EA6680g/3\u4E2A",price:2680,num:1,thumb:N+"/images/apple1.jpeg"}]}},created(){console.log("Cart created")},mounted(){this.$toast.loading({message:"\u6A21\u62DF\u52A0\u8F7D\u4E2D...",forbidClick:!0,duration:1e3})},activated(){console.log("Cart activated")},computed:{submitBarText(){const e=this.checkedGoods.length;return"\u7ED3\u7B97"+(e?`(${e})`:"")},totalPrice(){return this.goods.reduce((e,n)=>e+(this.checkedGoods.indexOf(n.id)!==-1?n.price:0),0)}},methods:{formatPrice(e){return(e/100).toFixed(2)},onSubmit(){we("\u70B9\u51FB\u7ED3\u7B97")}}};function nn(e,n,o,d,l,c){const f=T("van-notice-bar"),r=T("van-card"),i=T("van-checkbox"),s=T("van-checkbox-group"),g=T("van-submit-bar");return O(),X("div",null,[t(f,{"left-icon":"volume-o",wrapable:"",text:"tips: \u70B9\u51FB\u4E00\u4E2A\u5546\u54C1\u8FDB\u53BB\uFF0C\u9996\u6B21\u4F1A\u52A0\u8F7D\u9875\u9762\uFF0C\u7136\u540E\u4E0D\u8981\u9500\u6BC1\u8D2D\u7269\u8F66\u9875\u9762\uFF0C\u91CD\u65B0\u56DE\u5230\u8D2D\u7269\u8F66\u9875\u9762\uFF0C\u5728\u4E0D\u9500\u6BC1\u5546\u54C1\u9875\u9762\u7684\u524D\u63D0\u4E0B\uFF0C\u518D\u6B21\u70B9\u51FB\u540C\u6837\u7684\u5546\u54C1\u5219\u4E0D\u4F1A\u91CD\u65B0\u52A0\u8F7D\u65B0\u9875\u9762\uFF0C\u70B9\u51FB\u4E00\u4E0B\u8BD5\u8BD5\u5427",onClick:n[0]||(n[0]=a=>e.$router.forward())}),t(s,{class:"card-goods",modelValue:l.checkedGoods,"onUpdate:modelValue":n[1]||(n[1]=a=>l.checkedGoods=a)},{default:Y(()=>[(O(!0),X($e,null,Be(l.goods,a=>(O(),pe(i,{class:"card-goods__item",key:a.id,name:a.id},{default:Y(()=>[t(r,{title:a.title,desc:a.desc,num:a.num,price:c.formatPrice(a.price),thumb:a.thumb,onClick:Te(m=>e.$router.jump({type:"push",name:"goods",query:{id:a.id}}),["stop"])},null,8,["title","desc","num","price","thumb","onClick"])]),_:2},1032,["name"]))),128))]),_:1},8,["modelValue"]),t(g,{price:c.totalPrice,disabled:!l.checkedGoods.length,"button-text":c.submitBarText,onSubmit:c.onSubmit},null,8,["price","disabled","button-text","onSubmit"])])}var on=Ce(en,[["render",nn],["__scopeId","data-v-0a993acd"]]);export{on as default};
//# sourceMappingURL=index.3246e04a.js.map
