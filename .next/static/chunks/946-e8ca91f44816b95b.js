"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[946],{3946:function(e,t,a){a.d(t,{default:function(){return C}});var r=a(7437),n=a(7138),l=a(6463),s=a(6474),i=a(8030);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let o=(0,i.Z)("LayoutDashboard",[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]]),c=(0,i.Z)("Rss",[["path",{d:"M4 11a9 9 0 0 1 9 9",key:"pv89mb"}],["path",{d:"M4 4a16 16 0 0 1 16 16",key:"k0647b"}],["circle",{cx:"5",cy:"19",r:"1",key:"bfqh0e"}]]);var d=a(7583);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let h=(0,i.Z)("Globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]),u=(0,i.Z)("Compass",[["path",{d:"m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",key:"9ktpf1"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);var x=a(1240);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let f=(0,i.Z)("House",[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"1d0kgt"}]]);var m=a(8758);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let p=(0,i.Z)("ArrowLeftRight",[["path",{d:"M8 3 4 7l4 4",key:"9rb6wj"}],["path",{d:"M4 7h16",key:"6tx8e3"}],["path",{d:"m16 21 4-4-4-4",key:"siv7j2"}],["path",{d:"M20 17H4",key:"h6l3hr"}]]),k=(0,i.Z)("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]]);var y=a(9338);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let b=(0,i.Z)("Library",[["path",{d:"m16 6 4 14",key:"ji33uf"}],["path",{d:"M12 6v14",key:"1n7gus"}],["path",{d:"M8 8v12",key:"1gg7y9"}],["path",{d:"M4 4v16",key:"6qkkli"}]]);var v=a(6540);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let g=(0,i.Z)("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]]),j=(0,i.Z)("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]]);var w=a(2265);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let N=(0,i.Z)("Bell",[["path",{d:"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9",key:"1qo2s2"}],["path",{d:"M10.3 21a1.94 1.94 0 0 0 3.4 0",key:"qgo35s"}]]);function M(e){let{userId:t}=e,a=(0,s.e)(),[n,l]=(0,w.useState)(0),[i,o]=(0,w.useState)([]),[c,d]=(0,w.useState)(!1);async function h(){let{data:e}=await a.from("notifications").select("*, sender:profiles(full_name, avatar_url)").eq("user_id",t).order("created_at",{ascending:!1}).limit(20);e&&(o(e),l(e.filter(e=>!e.is_read).length))}async function u(){await a.from("notifications").update({is_read:!0}).eq("user_id",t).eq("is_read",!1),l(0),o(e=>e.map(e=>({...e,is_read:!0})))}return(0,w.useEffect)(()=>{h();let e=a.channel("notifications").on("postgres_changes",{event:"INSERT",schema:"public",table:"notifications",filter:"user_id=eq.".concat(t)},()=>h()).subscribe();return()=>{a.removeChannel(e)}},[]),(0,r.jsxs)("div",{className:"relative",children:[(0,r.jsxs)("button",{onClick:()=>{d(!c),!c&&n>0&&u()},className:"relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-ink/55 hover:bg-neutral-100 hover:text-ink transition-colors w-full",children:[(0,r.jsx)(N,{size:15,className:"text-ink/40"}),(0,r.jsx)("span",{children:"Bildirimler"}),n>0&&(0,r.jsx)("span",{className:"ml-auto bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium",children:n>9?"9+":n})]}),c&&(0,r.jsxs)("div",{className:"fixed left-56 bottom-20 w-80 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 overflow-hidden",children:[(0,r.jsxs)("div",{className:"flex items-center justify-between px-4 py-3 border-b border-neutral-100",children:[(0,r.jsx)("span",{className:"font-medium text-ink text-sm",children:"Bildirimler"}),n>0&&(0,r.jsx)("button",{onClick:u,className:"text-xs text-brand hover:underline",children:"T\xfcm\xfcn\xfc okundu işaretle"})]}),(0,r.jsx)("div",{className:"max-h-80 overflow-y-auto",children:i.length>0?i.map(e=>(0,r.jsxs)("div",{className:"flex items-start gap-3 px-4 py-3 border-b border-neutral-50 hover:bg-neutral-50 transition-colors ".concat(e.is_read?"":"bg-brand/3"),children:[(0,r.jsx)("span",{className:"text-lg flex-shrink-0",children:{like:"❤️",comment:"\uD83D\uDCAC",match:"\uD83E\uDD1D",message:"✉️",takas:"⚡"}[e.type]||"\uD83D\uDD14"}),(0,r.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,r.jsx)("p",{className:"text-sm text-ink/80 leading-relaxed",children:e.content}),(0,r.jsx)("p",{className:"mono text-xs text-ink/35 mt-0.5",children:function(e){let t=Date.now()-new Date(e).getTime(),a=Math.floor(t/6e4),r=Math.floor(t/36e5);return a<1?"Şimdi":a<60?"".concat(a," dk"):r<24?"".concat(r," sa"):"".concat(Math.floor(t/864e5)," g\xfcn")}(e.created_at)})]}),!e.is_read&&(0,r.jsx)("div",{className:"w-2 h-2 rounded-full bg-brand flex-shrink-0 mt-1.5"})]},e.id)):(0,r.jsxs)("div",{className:"py-10 text-center",children:[(0,r.jsx)(N,{size:24,className:"text-ink/15 mx-auto mb-2"}),(0,r.jsx)("p",{className:"text-sm text-ink/35",children:"Hen\xfcz bildirim yok."})]})})]})]})}let Z=[{label:"Ana",items:[{href:"/dashboard",label:"Dashboard",icon:o},{href:"/feed",label:"Akış",icon:c},{href:"/mesajlar",label:"Mesajlar",icon:d.Z}]},{label:"Keşfet",items:[{href:"/harita",label:"Harita",icon:h},{href:"/kesfet",label:"Startuplar",icon:u},{href:"/eslestirme",label:"Co-founder",icon:x.Z}]},{label:"Topluluk",items:[{href:"/garaj",label:"Garaj",icon:f},{href:"/kahve",label:"Kahve Molası",icon:m.Z},{href:"/takas",label:"Takas",icon:p}]},{label:"B\xfcy\xfc",items:[{href:"/office-hours",label:"Mentorlar",icon:k},{href:"/demo-day",label:"Demo Day",icon:y.Z},{href:"/kaynaklar",label:"Kaynaklar",icon:b},{href:"/kutuphane",label:"K\xfct\xfcphane",icon:v.Z}]}];function C(e){let{user:t}=e,a=(0,l.useRouter)(),i=(0,l.usePathname)(),o=(0,s.e)();async function c(){await o.auth.signOut(),a.push("/"),a.refresh()}return t?(0,r.jsxs)("aside",{className:"fixed top-0 left-0 h-screen w-56 bg-cream border-r border-neutral-200 flex flex-col z-50",children:[(0,r.jsx)("div",{className:"px-5 py-5 border-b border-neutral-200",children:(0,r.jsxs)(n.default,{href:"/",className:"font-serif text-xl font-bold text-ink",children:["Campus",(0,r.jsx)("em",{className:"text-brand not-italic",children:"We"})]})}),(0,r.jsx)("nav",{className:"flex-1 overflow-y-auto py-3 px-3",children:Z.map(e=>(0,r.jsxs)("div",{className:"mb-4",children:[(0,r.jsx)("p",{className:"mono text-xs text-ink/25 tracking-widest px-3 mb-1",children:e.label.toUpperCase()}),(0,r.jsx)("div",{className:"space-y-0.5",children:e.items.map(e=>{let t=i===e.href||i.startsWith(e.href+"/");return(0,r.jsxs)(n.default,{href:e.href,prefetch:!0,className:"flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ".concat(t?"bg-brand/10 text-brand font-medium":"text-ink/55 hover:bg-neutral-100 hover:text-ink"),children:[(0,r.jsx)(e.icon,{size:15,className:t?"text-brand":"text-ink/40"}),e.label]},e.href)})})]},e.label))}),(0,r.jsxs)("div",{className:"border-t border-neutral-200 p-3 space-y-0.5",children:[(0,r.jsx)(M,{userId:t.id}),(0,r.jsxs)(n.default,{href:"/profile",className:"flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ".concat("/profile"===i?"bg-brand/10 text-brand font-medium":"text-ink/55 hover:bg-neutral-100 hover:text-ink"),children:[(0,r.jsx)(g,{size:15,className:"text-ink/40"}),"Profil"]}),(0,r.jsxs)("button",{onClick:c,className:"w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-ink/40 hover:bg-neutral-100 hover:text-ink transition-colors",children:[(0,r.jsx)(j,{size:15}),"\xc7ıkış yap"]})]})]}):null}},6474:function(e,t,a){a.d(t,{e:function(){return n}});var r=a(3980);function n(){return(0,r.createBrowserClient)("https://kmfeqbiqotmxyawlppek.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZmVxYmlxb3RteHlhd2xwcGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MzYzNTQsImV4cCI6MjA5MzQxMjM1NH0.3w5qqO0DhuSJfE3eCnvHD3LGoXIJo43ZoLsgRlHqotg")}},8030:function(e,t,a){a.d(t,{Z:function(){return o}});var r=a(2265);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let n=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),l=function(){for(var e=arguments.length,t=Array(e),a=0;a<e;a++)t[a]=arguments[a];return t.filter((e,t,a)=>!!e&&a.indexOf(e)===t).join(" ")};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var s={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let i=(0,r.forwardRef)((e,t)=>{let{color:a="currentColor",size:n=24,strokeWidth:i=2,absoluteStrokeWidth:o,className:c="",children:d,iconNode:h,...u}=e;return(0,r.createElement)("svg",{ref:t,...s,width:n,height:n,stroke:a,strokeWidth:o?24*Number(i)/Number(n):i,className:l("lucide",c),...u},[...h.map(e=>{let[t,a]=e;return(0,r.createElement)(t,a)}),...Array.isArray(d)?d:[d]])}),o=(e,t)=>{let a=(0,r.forwardRef)((a,s)=>{let{className:o,...c}=a;return(0,r.createElement)(i,{ref:s,iconNode:t,className:l("lucide-".concat(n(e)),o),...c})});return a.displayName="".concat(e),a}},6540:function(e,t,a){a.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,a(8030).Z)("BookOpen",[["path",{d:"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",key:"vv98re"}],["path",{d:"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",key:"1cyq3y"}]])},8758:function(e,t,a){a.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,a(8030).Z)("Coffee",[["path",{d:"M10 2v2",key:"7u0qdc"}],["path",{d:"M14 2v2",key:"6buw04"}],["path",{d:"M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1",key:"pwadti"}],["path",{d:"M6 2v2",key:"colzsn"}]])},7583:function(e,t,a){a.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,a(8030).Z)("MessageCircle",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}]])},9338:function(e,t,a){a.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,a(8030).Z)("Star",[["polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2",key:"8f66p6"}]])},1240:function(e,t,a){a.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,a(8030).Z)("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]])}}]);