import{g as E,h as j,s as he,a as s,t as z,w as R,i as me,j as pe,u as _e,y as W,v as _,N as K,n as X,k as Ee,q as je,a7 as Re,I as H,A as Me,R as be,a8 as Oe,E as I,a9 as De,aa as Le,ab as Ne,ac as we,ad as Ye,S as Ge,ae as qe,J as Fe,x as Y,af as ne,M as ye,a5 as Ve,Y as O,ag as G,_ as Xe,$ as D,a0 as He,r as $,o as q,c as oe,b as l,F as We,a1 as Ke,e as F,ah as se,f as y,a2 as Ue}from"./index.cc388c43.js";import{T as ie}from"./index.9e3b63d6.js";import{C as ce,a as re,b as le}from"./index.da4ba9b3.js";import{B as Je}from"./index.78e8b60d.js";const[Ce,Qe]=E("action-bar"),U=Symbol(Ce),Ze={safeAreaInsetBottom:z};var et=j({name:Ce,props:Ze,setup(e,{slots:n}){const{linkChildren:f}=he(U);return f(),()=>{var r;return s("div",{class:[Qe(),{"van-safe-area-bottom":e.safeAreaInsetBottom}]},[(r=n.default)==null?void 0:r.call(n)])}}});const ue=R(et),[tt,at]=E("action-bar-button"),nt=me({},pe,{type:String,text:String,icon:String,color:String,loading:Boolean,disabled:Boolean});var ot=j({name:tt,props:nt,setup(e,{slots:n}){const f=_e(),{parent:r,index:t}=W(U),c=_(()=>{if(r){const h=r.children[t.value-1];return!(h&&"isButton"in h)}}),m=_(()=>{if(r){const h=r.children[t.value+1];return!(h&&"isButton"in h)}});return K({isButton:!0}),()=>{const{type:h,icon:o,text:i,color:u,loading:v,disabled:C}=e;return s(Je,{class:at([h,{last:m.value,first:c.value}]),size:"large",type:h,icon:o,color:u,loading:v,disabled:C,onClick:f},{default:()=>[n.default?n.default():i]})}}});const de=R(ot),[st,V]=E("action-bar-icon"),it=me({},pe,{dot:Boolean,text:String,icon:String,color:String,badge:X,iconClass:Ee,badgeProps:Object,iconPrefix:String});var ct=j({name:st,props:it,setup(e,{slots:n}){const f=_e();W(U);const r=()=>{const{dot:t,badge:c,icon:m,color:h,iconClass:o,badgeProps:i,iconPrefix:u}=e;return n.icon?s(Re,je({dot:t,class:V("icon"),content:c},i),{default:n.icon}):s(H,{tag:"div",dot:t,name:m,badge:c,color:h,class:[V("icon"),o],badgeProps:i,classPrefix:u},null)};return()=>s("div",{role:"button",class:V(),tabindex:0,onClick:f},[r(),n.default?n.default():e.text])}});const ve=R(ct),[$e,L]=E("swipe"),rt={loop:z,width:X,height:X,vertical:Boolean,autoplay:Y(0),duration:Y(500),touchable:z,lazyRender:Boolean,initialSwipe:Y(0),indicatorColor:String,showIndicators:z,stopPropagation:z},ke=Symbol($e);var lt=j({name:$e,props:rt,emits:["change"],setup(e,{emit:n,slots:f}){const r=Me(),t=be({rect:null,width:0,height:0,offset:0,active:0,swiping:!1}),c=Oe(),{children:m,linkChildren:h}=he(ke),o=_(()=>m.length),i=_(()=>t[e.vertical?"height":"width"]),u=_(()=>e.vertical?c.deltaY.value:c.deltaX.value),v=_(()=>t.rect?(e.vertical?t.rect.height:t.rect.width)-i.value*o.value:0),C=_(()=>Math.ceil(Math.abs(v.value)/i.value)),k=_(()=>o.value*i.value),x=_(()=>(t.active+o.value)%o.value),b=_(()=>{const a=e.vertical?"vertical":"horizontal";return c.direction.value===a}),xe=_(()=>{const a={transitionDuration:`${t.swiping?0:e.duration}ms`,transform:`translate${e.vertical?"Y":"X"}(${t.offset}px)`};if(i.value){const g=e.vertical?"height":"width",d=e.vertical?"width":"height";a[g]=`${k.value}px`,a[d]=e[d]?`${e[d]}px`:""}return a}),Be=a=>{const{active:g}=t;return a?e.loop?G(g+a,-1,o.value):G(g+a,0,C.value):g},J=(a,g=0)=>{let d=a*i.value;e.loop||(d=Math.min(d,-v.value));let w=g-d;return e.loop||(w=G(w,v.value,0)),w},B=({pace:a=0,offset:g=0,emitChange:d})=>{if(o.value<=1)return;const{active:w}=t,p=Be(a),A=J(p,g);if(e.loop){if(m[0]&&A!==v.value){const N=A<v.value;m[0].setOffset(N?k.value:0)}if(m[o.value-1]&&A!==0){const N=A>0;m[o.value-1].setOffset(N?-k.value:0)}}t.active=p,t.offset=A,d&&p!==w&&n("change",x.value)},M=()=>{t.swiping=!0,t.active<=-1?B({pace:o.value}):t.active>=o.value&&B({pace:-o.value})},Pe=()=>{M(),c.reset(),O(()=>{t.swiping=!1,B({pace:-1,emitChange:!0})})},Q=()=>{M(),c.reset(),O(()=>{t.swiping=!1,B({pace:1,emitChange:!0})})};let Z;const S=()=>clearTimeout(Z),T=()=>{S(),e.autoplay>0&&o.value>1&&(Z=setTimeout(()=>{Q(),T()},+e.autoplay))},P=(a=+e.initialSwipe)=>{if(!r.value)return;const g=()=>{var d,w;if(!ne(r)){const p={width:r.value.offsetWidth,height:r.value.offsetHeight};t.rect=p,t.width=+((d=e.width)!=null?d:p.width),t.height=+((w=e.height)!=null?w:p.height)}o.value&&(a=Math.min(o.value-1,a)),t.active=a,t.swiping=!0,t.offset=J(a),m.forEach(p=>{p.setOffset(0)}),T()};ne(r)?ye().then(g):g()},ee=()=>P(t.active);let te;const Se=a=>{!e.touchable||(c.start(a),te=Date.now(),S(),M())},Te=a=>{e.touchable&&t.swiping&&(c.move(a),b.value&&(Ve(a,e.stopPropagation),B({offset:u.value})))},ae=()=>{if(!e.touchable||!t.swiping)return;const a=Date.now()-te,g=u.value/a;if((Math.abs(g)>.25||Math.abs(u.value)>i.value/2)&&b.value){const w=e.vertical?c.offsetY.value:c.offsetX.value;let p=0;e.loop?p=w>0?u.value>0?-1:1:0:p=-Math[u.value>0?"ceil":"floor"](u.value/i.value),B({pace:p,emitChange:!0})}else u.value&&B({pace:0});t.swiping=!1,T()},Ae=(a,g={})=>{M(),c.reset(),O(()=>{let d;e.loop&&a===o.value?d=t.active===0?0:a:d=a%o.value,g.immediate?O(()=>{t.swiping=!1}):t.swiping=!1,B({pace:d-t.active,emitChange:!0})})},Ie=(a,g)=>{const d=g===x.value,w=d?{backgroundColor:e.indicatorColor}:void 0;return s("i",{style:w,class:L("indicator",{active:d})},null)},ze=()=>{if(f.indicator)return f.indicator({active:x.value,total:o.value});if(e.showIndicators&&o.value>1)return s("div",{class:L("indicators",{vertical:e.vertical})},[Array(o.value).fill("").map(Ie)])};return K({prev:Pe,next:Q,state:t,resize:ee,swipeTo:Ae}),h({size:i,props:e,count:o,activeIndicator:x}),I(()=>e.initialSwipe,a=>P(+a)),I(o,()=>P(t.active)),I(()=>e.autoplay,T),I([De,Le],ee),I(Ne(),a=>{a==="visible"?T():S()}),we(P),Ye(()=>P(t.active)),Ge(()=>P(t.active)),qe(S),Fe(S),()=>{var a;return s("div",{ref:r,class:L()},[s("div",{style:xe.value,class:L("track",{vertical:e.vertical}),onTouchstart:Se,onTouchmove:Te,onTouchend:ae,onTouchcancel:ae},[(a=f.default)==null?void 0:a.call(f)]),ze()])}}});const fe=R(lt),[ut,dt]=E("swipe-item");var vt=j({name:ut,setup(e,{slots:n}){let f;const r=be({offset:0,inited:!1,mounted:!1}),{parent:t,index:c}=W(ke);if(!t)return;const m=_(()=>{const i={},{vertical:u}=t.props;return t.size.value&&(i[u?"height":"width"]=`${t.size.value}px`),r.offset&&(i.transform=`translate${u?"Y":"X"}(${r.offset}px)`),i}),h=_(()=>{const{loop:i,lazyRender:u}=t.props;if(!u||f)return!0;if(!r.mounted)return!1;const v=t.activeIndicator.value,C=t.count.value-1,k=v===0&&i?C:v-1,x=v===C&&i?0:v+1;return f=c.value===v||c.value===k||c.value===x,f}),o=i=>{r.offset=i};return we(()=>{ye(()=>{r.mounted=!0})}),K({setOffset:o}),()=>{var i;return s("div",{class:dt(),style:m.value},[h.value?(i=n.default)==null?void 0:i.call(n):null])}}});const ge=R(vt);const ft={components:{[ie.name]:ie,[ce.name]:ce,[H.name]:H,[re.name]:re,[le.name]:le,[fe.name]:fe,[ge.name]:ge,[ue.name]:ue,[ve.name]:ve,[de.name]:de},data(){return{goodsList:[{id:"1",title:"\u8FDB\u53E3\u9999\u8549",desc:"\u7EA6250g\uFF0C2\u6839",price:200,express:"8.00",num:1,thumb:[D+"/images/banana.jpeg"]},{id:"2",title:"\u9655\u897F\u871C\u68A8",desc:"\u7EA6600g",price:690,express:"10.00",num:1,thumb:[D+"/images/sydney.jpeg"]},{id:"3",title:"\u7F8E\u56FD\u4F3D\u529B\u679C",desc:"\u7EA6680g/3\u4E2A",price:2680,express:"\u514D\u8FD0\u8D39",num:1,thumb:[D+"/images/apple1.jpeg",D+"/images/apple2.jpeg"]}],goods:{title:"\u7F8E\u56FD\u4F3D\u529B\u679C\uFF08\u7EA6680g/3\u4E2A\uFF09",price:2680,express:"\u514D\u8FD0\u8D39",remain:19,thumb:["https://img.yzcdn.cn/public_files/2017/10/24/e5a5a02309a41f9f5def56684808d9ae.jpeg","https://img.yzcdn.cn/public_files/2017/10/24/1791ba14088f9c2be8c610d0a6cc0f93.jpeg"]}}},created(){console.log("Goods created"),this.getGoods();const{id:e}=this.$route.query;this.unBeforeEach=this.$keepRouter.beforeEach("goods",n=>{if(n.query.id!==e)return n.cache=!1;n.cache=!0})},mounted(){this.$toast.loading({message:"\u6A21\u62DF\u52A0\u8F7D\u4E2D...",forbidClick:!0,duration:1e3})},activated(){console.log("Goods activated")},beforeUnmount(){this.unBeforeEach()},methods:{addCart(){this.$toast.success({message:"\u6DFB\u52A0\u8D2D\u7269\u8F66\u6210\u529F\uFF0C\u9500\u6BC1\u8D2D\u7269\u8F66\u9875\u9762"}),this.$keepRouter.destroy("cart")},getGoods(){let{goodsList:e,$route:{query:n}}=this;this.goods=e.find(f=>f.id===n.id&&f)},formatPrice(){return"\xA5"+(this.goods.price/100).toFixed(2)},onClickCart(){this.$router.push("cart")},sorry(){He("\u6682\u65E0\u540E\u7EED\u903B\u8F91~")}}},gt={class:"goods"},ht=["src"],mt={class:"goods-title"},pt={class:"goods-price"},_t=y("\u8FD0\u8D39go(-1)\uFF1A\u8FD4\u56DE\u65F6\u4F7F\u7528\u7F13\u5B58"),bt=y("\u5269\u4F59back\uFF1A\u8FD4\u56DE\u65F6\u4F7F\u7528\u7F13\u5B58"),wt=y("\u70B9\u51FB"),yt=y("\u70B9\u51FB"),Ct=y("\u70B9\u51FB"),$t=y("\u70B9\u51FB"),kt=y(" \u5BA2\u670D "),xt=y(" \u8D2D\u7269\u8F66 "),Bt=y(" \u52A0\u5165\u8D2D\u7269\u8F66 "),Pt=y("\u70B9\u51FB"),St=y(" \u7ACB\u5373\u8D2D\u4E70 ");function Tt(e,n,f,r,t,c){const m=$("van-swipe-item"),h=$("van-swipe"),o=$("van-cell"),i=$("van-col"),u=$("van-cell-group"),v=$("van-tag"),C=$("van-action-bar-icon"),k=$("van-action-bar-button"),x=$("van-action-bar");return q(),oe("div",gt,[s(h,{class:"goods-swipe",autoplay:3e3,onClick:n[0]||(n[0]=b=>e.$router.push({name:"cart",cache:!0}))},{default:l(()=>[(q(!0),oe(We,null,Ke(t.goods.thumb,b=>(q(),Ue(m,{key:b},{default:l(()=>[F("img",{src:b},null,8,ht)]),_:2},1024))),128))]),_:1}),s(u,null,{default:l(()=>[s(o,null,{default:l(()=>[F("div",mt,se(t.goods.title),1),F("div",pt,se(c.formatPrice(t.goods.price)),1)]),_:1}),s(o,{class:"goods-express"},{default:l(()=>[s(i,{span:"24",onClick:n[1]||(n[1]=b=>e.$router.jump(-1,{cache:!0}))},{default:l(()=>[_t]),_:1}),s(i,{span:"24",onClick:n[2]||(n[2]=b=>e.$router.back({cache:!0}))},{default:l(()=>[bt]),_:1})]),_:1})]),_:1}),s(u,{class:"goods-cell-group"},{default:l(()=>[s(o,{title:"\u4E0D\u9500\u6BC1\u8D2D\u7269\u8F66\u9875\u9762\uFF0C\u8DF3\u8F6C\u56DE\u8D2D\u7269\u8F66",icon:"cart","is-link":"",onClick:n[3]||(n[3]=b=>e.$router.jump({type:"push",name:"cart",cache:!0}))},{default:l(()=>[s(v,{class:"goods-tag",type:"danger"},{default:l(()=>[wt]),_:1})]),_:1}),s(o,{title:"\u9500\u6BC1\u8D2D\u7269\u8F66\u9875\u9762\uFF0C\u8DF3\u8F6C\u56DE\u8D2D\u7269\u8F66",icon:"cart","is-link":"",onClick:n[4]||(n[4]=b=>e.$router.push({name:"cart"}))},{default:l(()=>[s(v,{class:"goods-tag",type:"danger"},{default:l(()=>[yt]),_:1})]),_:1}),s(o,{title:"\u4E0D\u9500\u6BC1user\uFF0C\u8DF3\u8F6C\u56DEuser",icon:"manager","is-link":"",onClick:n[5]||(n[5]=b=>e.$router.jump({type:"push",name:"user",cache:!0}))},{default:l(()=>[s(v,{class:"goods-tag",type:"danger"},{default:l(()=>[Ct]),_:1})]),_:1})]),_:1}),s(u,{class:"goods-cell-group"},{default:l(()=>[s(o,{title:"\u56DE\u5230\u8D2D\u7269\u8F66\uFF0C\u9500\u6BC1\u5168\u90E8\u7F13\u5B58\u9875\u9762","is-link":"",onClick:n[6]||(n[6]=b=>e.$router.push({name:"cart",destroy:"ALL"}))},{default:l(()=>[s(v,{class:"goods-tag",type:"danger"},{default:l(()=>[$t]),_:1})]),_:1})]),_:1}),s(x,null,{default:l(()=>[s(C,{icon:"chat-o",onClick:c.sorry},{default:l(()=>[kt]),_:1},8,["onClick"]),s(C,{icon:"cart-o",onClick:c.onClickCart},{default:l(()=>[xt]),_:1},8,["onClick"]),s(k,{type:"warning",onClick:c.addCart},{default:l(()=>[Bt,s(v,{class:"goods-tag",type:"danger"},{default:l(()=>[Pt]),_:1})]),_:1},8,["onClick"]),s(k,{type:"danger",onClick:c.sorry},{default:l(()=>[St]),_:1},8,["onClick"])]),_:1})])}var jt=Xe(ft,[["render",Tt]]);export{jt as default};
//# sourceMappingURL=index.263b602b.js.map
