(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[118],{6118:function(e,t,a){Promise.resolve().then(a.bind(a,8595)),Promise.resolve().then(a.t.bind(a,231,23))},8595:function(e,t,a){"use strict";a.d(t,{default:function(){return z}});var r=a(7437),n=a(7138),s=a(6463),i=a(6474),l=a(7140),c=a(9348),o=a(7583),d=a(4436),u=a(2030),h=a(1240),f=a(3852),x=a(8758),m=a(2891),p=a(933),y=a(9338),k=a(3402),b=a(6540),v=a(2022),g=a(4258),Z=a(9896),j=a(2265),w=a(6600);function N(e){let{userId:t}=e,a=(0,i.e)(),[n,s]=(0,j.useState)(0),[l,c]=(0,j.useState)([]),[o,d]=(0,j.useState)(!1);async function u(){let{data:e}=await a.from("notifications").select("*, sender:profiles(full_name, avatar_url)").eq("user_id",t).order("created_at",{ascending:!1}).limit(20);e&&(c(e),s(e.filter(e=>!e.is_read).length))}async function h(){await a.from("notifications").update({is_read:!0}).eq("user_id",t).eq("is_read",!1),s(0),c(e=>e.map(e=>({...e,is_read:!0})))}return(0,j.useEffect)(()=>{u();let e=a.channel("notifications").on("postgres_changes",{event:"INSERT",schema:"public",table:"notifications",filter:"user_id=eq.".concat(t)},()=>u()).subscribe();return()=>{a.removeChannel(e)}},[]),(0,r.jsxs)("div",{className:"relative",children:[(0,r.jsxs)("button",{onClick:()=>{d(!o),!o&&n>0&&h()},className:"relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-ink/55 hover:bg-neutral-100 hover:text-ink transition-colors w-full",children:[(0,r.jsx)(w.Z,{size:15,className:"text-ink/40"}),(0,r.jsx)("span",{children:"Bildirimler"}),n>0&&(0,r.jsx)("span",{className:"ml-auto bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium",children:n>9?"9+":n})]}),o&&(0,r.jsxs)("div",{className:"fixed left-56 bottom-20 w-80 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 overflow-hidden",children:[(0,r.jsxs)("div",{className:"flex items-center justify-between px-4 py-3 border-b border-neutral-100",children:[(0,r.jsx)("span",{className:"font-medium text-ink text-sm",children:"Bildirimler"}),n>0&&(0,r.jsx)("button",{onClick:h,className:"text-xs text-brand hover:underline",children:"T\xfcm\xfcn\xfc okundu işaretle"})]}),(0,r.jsx)("div",{className:"max-h-80 overflow-y-auto",children:l.length>0?l.map(e=>(0,r.jsxs)("div",{className:"flex items-start gap-3 px-4 py-3 border-b border-neutral-50 hover:bg-neutral-50 transition-colors ".concat(e.is_read?"":"bg-brand/3"),children:[(0,r.jsx)("span",{className:"text-lg flex-shrink-0",children:{like:"❤️",comment:"\uD83D\uDCAC",match:"\uD83E\uDD1D",message:"✉️",takas:"⚡"}[e.type]||"\uD83D\uDD14"}),(0,r.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,r.jsx)("p",{className:"text-sm text-ink/80 leading-relaxed",children:e.content}),(0,r.jsx)("p",{className:"mono text-xs text-ink/35 mt-0.5",children:function(e){let t=Date.now()-new Date(e).getTime(),a=Math.floor(t/6e4),r=Math.floor(t/36e5);return a<1?"Şimdi":a<60?"".concat(a," dk"):r<24?"".concat(r," sa"):"".concat(Math.floor(t/864e5)," g\xfcn")}(e.created_at)})]}),!e.is_read&&(0,r.jsx)("div",{className:"w-2 h-2 rounded-full bg-brand flex-shrink-0 mt-1.5"})]},e.id)):(0,r.jsxs)("div",{className:"py-10 text-center",children:[(0,r.jsx)(w.Z,{size:24,className:"text-ink/15 mx-auto mb-2"}),(0,r.jsx)("p",{className:"text-sm text-ink/35",children:"Hen\xfcz bildirim yok."})]})})]})]})}let M=[{label:"Ana",items:[{href:"/dashboard",label:"Dashboard",icon:l.Z},{href:"/feed",label:"Akış",icon:c.Z},{href:"/mesajlar",label:"Mesajlar",icon:o.Z}]},{label:"Keşfet",items:[{href:"/harita",label:"Harita",icon:d.Z},{href:"/kesfet",label:"Startuplar",icon:u.Z},{href:"/eslestirme",label:"Co-founder",icon:h.Z}]},{label:"Topluluk",items:[{href:"/garaj",label:"Garaj",icon:f.Z},{href:"/kahve",label:"Kahve Molası",icon:x.Z},{href:"/takas",label:"Takas",icon:m.Z}]},{label:"B\xfcy\xfc",items:[{href:"/office-hours",label:"Mentorlar",icon:p.Z},{href:"/demo-day",label:"Demo Day",icon:y.Z},{href:"/kaynaklar",label:"Kaynaklar",icon:k.Z},{href:"/kutuphane",label:"K\xfct\xfcphane",icon:b.Z}]}];function z(e){let{user:t}=e,a=(0,s.useRouter)(),l=(0,s.usePathname)(),c=(0,i.e)();async function o(){await c.auth.signOut(),a.push("/"),a.refresh()}return t?(0,r.jsxs)("aside",{className:"fixed top-0 left-0 h-screen w-56 bg-cream border-r border-neutral-200 flex flex-col z-50",children:[(0,r.jsx)("div",{className:"px-5 py-5 border-b border-neutral-200",children:(0,r.jsxs)(n.default,{href:"/",className:"font-serif text-xl font-bold text-ink",children:["Campus",(0,r.jsx)("em",{className:"text-brand not-italic",children:"We"})]})}),(0,r.jsx)("nav",{className:"flex-1 overflow-y-auto py-3 px-3",children:M.map(e=>(0,r.jsxs)("div",{className:"mb-4",children:[(0,r.jsx)("p",{className:"mono text-xs text-ink/25 tracking-widest px-3 mb-1",children:e.label.toUpperCase()}),(0,r.jsx)("div",{className:"space-y-0.5",children:e.items.map(e=>{let t=l===e.href||l.startsWith(e.href+"/");return(0,r.jsxs)(n.default,{href:e.href,prefetch:!0,className:"flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ".concat(t?"bg-brand/10 text-brand font-medium":"text-ink/55 hover:bg-neutral-100 hover:text-ink"),children:[(0,r.jsx)(e.icon,{size:15,className:t?"text-brand":"text-ink/40"}),e.label]},e.href)})})]},e.label))}),(0,r.jsxs)("div",{className:"border-t border-neutral-200 p-3 space-y-0.5",children:[(0,r.jsx)(N,{userId:t.id}),(0,r.jsxs)(n.default,{href:"/profile",className:"flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ".concat("/profile"===l?"bg-brand/10 text-brand font-medium":"text-ink/55 hover:bg-neutral-100 hover:text-ink"),children:[(0,r.jsx)(v.Z,{size:15,className:"text-ink/40"}),"Profil"]}),(0,r.jsxs)(n.default,{href:"/ayarlar",className:"flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ".concat("/ayarlar"===l?"bg-brand/10 text-brand font-medium":"text-ink/55 hover:bg-neutral-100 hover:text-ink"),children:[(0,r.jsx)(g.Z,{size:15,className:"text-ink/40"}),"Ayarlar"]}),(0,r.jsxs)("button",{onClick:o,className:"w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-ink/40 hover:bg-neutral-100 hover:text-ink transition-colors",children:[(0,r.jsx)(Z.Z,{size:15}),"\xc7ıkış yap"]})]})]}):null}},6474:function(e,t,a){"use strict";a.d(t,{e:function(){return n}});var r=a(3980);function n(){return(0,r.createBrowserClient)("https://kmfeqbiqotmxyawlppek.supabase.co","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttZmVxYmlxb3RteHlhd2xwcGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MzYzNTQsImV4cCI6MjA5MzQxMjM1NH0.3w5qqO0DhuSJfE3eCnvHD3LGoXIJo43ZoLsgRlHqotg")}},8030:function(e,t,a){"use strict";a.d(t,{Z:function(){return c}});var r=a(2265);/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let n=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),s=function(){for(var e=arguments.length,t=Array(e),a=0;a<e;a++)t[a]=arguments[a];return t.filter((e,t,a)=>!!e&&a.indexOf(e)===t).join(" ")};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var i={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let l=(0,r.forwardRef)((e,t)=>{let{color:a="currentColor",size:n=24,strokeWidth:l=2,absoluteStrokeWidth:c,className:o="",children:d,iconNode:u,...h}=e;return(0,r.createElement)("svg",{ref:t,...i,width:n,height:n,stroke:a,strokeWidth:c?24*Number(l)/Number(n):l,className:s("lucide",o),...h},[...u.map(e=>{let[t,a]=e;return(0,r.createElement)(t,a)}),...Array.isArray(d)?d:[d]])}),c=(e,t)=>{let a=(0,r.forwardRef)((a,i)=>{let{className:c,...o}=a;return(0,r.createElement)(l,{ref:i,iconNode:t,className:s("lucide-".concat(n(e)),c),...o})});return a.displayName="".concat(e),a}},2891:function(e,t,a){"use strict";a.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,a(8030).Z)("ArrowLeftRight",[["path",{d:"M8 3 4 7l4 4",key:"9rb6wj"}],["path",{d:"M4 7h16",key:"6tx8e3"}],["path",{d:"m16 21 4-4-4-4",key:"siv7j2"}],["path",{d:"M20 17H4",key:"h6l3hr"}]])},6600:function(e,t,a){"use strict";a.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,a(8030).Z)("Bell",[["path",{d:"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9",key:"1qo2s2"}],["path",{d:"M10.3 21a1.94 1.94 0 0 0 3.4 0",key:"qgo35s"}]])},6540:function(e,t,a){"use strict";a.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,a(8030).Z)("BookOpen",[["path",{d:"M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z",key:"vv98re"}],["path",{d:"M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",key:"1cyq3y"}]])},933:function(e,t,a){"use strict";a.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,a(8030).Z)("Clock",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["polyline",{points:"12 6 12 12 16 14",key:"68esgv"}]])},8758:function(e,t,a){"use strict";a.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,a(8030).Z)("Coffee",[["path",{d:"M10 2v2",key:"7u0qdc"}],["path",{d:"M14 2v2",key:"6buw04"}],["path",{d:"M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1",key:"pwadti"}],["path",{d:"M6 2v2",key:"colzsn"}]])},2030:function(e,t,a){"use strict";a.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,a(8030).Z)("Compass",[["path",{d:"m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z",key:"9ktpf1"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]])},4436:function(e,t,a){"use strict";a.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,a(8030).Z)("Globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]])},3852:function(e,t,a){"use strict";a.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,a(8030).Z)("House",[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"1d0kgt"}]])},7140:function(e,t,a){"use strict";a.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,a(8030).Z)("LayoutDashboard",[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]])},3402:function(e,t,a){"use strict";a.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,a(8030).Z)("Library",[["path",{d:"m16 6 4 14",key:"ji33uf"}],["path",{d:"M12 6v14",key:"1n7gus"}],["path",{d:"M8 8v12",key:"1gg7y9"}],["path",{d:"M4 4v16",key:"6qkkli"}]])},9896:function(e,t,a){"use strict";a.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,a(8030).Z)("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]])},7583:function(e,t,a){"use strict";a.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,a(8030).Z)("MessageCircle",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}]])},9348:function(e,t,a){"use strict";a.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,a(8030).Z)("Rss",[["path",{d:"M4 11a9 9 0 0 1 9 9",key:"pv89mb"}],["path",{d:"M4 4a16 16 0 0 1 16 16",key:"k0647b"}],["circle",{cx:"5",cy:"19",r:"1",key:"bfqh0e"}]])},4258:function(e,t,a){"use strict";a.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,a(8030).Z)("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]])},9338:function(e,t,a){"use strict";a.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,a(8030).Z)("Star",[["polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2",key:"8f66p6"}]])},2022:function(e,t,a){"use strict";a.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,a(8030).Z)("User",[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]])},1240:function(e,t,a){"use strict";a.d(t,{Z:function(){return r}});/**
 * @license lucide-react v0.400.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let r=(0,a(8030).Z)("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]])}}]);