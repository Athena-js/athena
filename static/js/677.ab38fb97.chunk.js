"use strict";(self.webpackChunkathena_wiki=self.webpackChunkathena_wiki||[]).push([[677],{10:function(e,n,t){t.d(n,{t:function(){return p}});var o=t(885),s=t(2791),r=t(4242),a=t(1370),c=t(1215),u="style_button__0wQan",i="style_active__pIfM9",l=t(184),d=s.forwardRef((function(e,n){var t=e.code,d=e.name,p=(0,s.useRef)(null),g=(0,s.useReducer)((function(e){return!e}),!1),f=(0,o.Z)(g,2),y=f[0],x=f[1];return(0,s.useImperativeHandle)(n,(function(){return{canvas:p.current}}),[]),(0,l.jsxs)("div",{style:{height:"100%",overflow:"hidden"},children:[(0,l.jsxs)("div",{className:"".concat(u," ").concat(y?i:""),onClick:x,children:[(0,l.jsx)(c.J,{type:"typescript",marginRight:y?8:0}),y?d:""]}),(0,l.jsx)(r.Z,{style:a.Z,language:"typescript",showLineNumbers:!0,customStyle:{fontFamily:'Menlo, Monaco, "Courier New", monospace',fontSize:"12px",position:"absolute",lineHeight:"20px",top:24,left:0,right:0,bottom:0,opacity:y?1:0,pointerEvents:y?"unset":"none",transition:"all 0.3s ease-in-out"},children:t}),(0,l.jsx)("canvas",{ref:p})]})})),p=function(e,n,t){var o=(0,s.useRef)(null);return(0,s.useEffect)((function(){return e(o.current.canvas)}),[]),(0,l.jsx)(d,{ref:o,code:n,name:t})}},4677:function(e,n,t){t.r(n);var o=t(5861),s=t(7757),r=t.n(s),a=t(8166),c=t(10),u=function(e){var n=new a.PerspectiveCamera({position:new a.Vector3(-1.8,.6,2.73),fov:45}),t=new a.Renderer({canvas:e,camera:n}),s=new a.OrbitControl(n,e);return(0,o.Z)(r().mark((function e(){var n,o,s;return r().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(new a.TextureLoader).loadCubemapAsync(["/assets/skybox/google/px.png","/assets/skybox/google/nx.png","/assets/skybox/google/py.png","/assets/skybox/google/ny.png","/assets/skybox/google/pz.png","/assets/skybox/google/nz.png"]);case 2:return n=e.sent,o=new a.Skybox(n),t.cubemap=n,t.scene.add(o),e.next=8,(new a.GLTFLoader).loadAsync("/assets/models/helmet.glb");case 8:s=e.sent,t.scene.add(s),t.start();case 11:case"end":return e.stop()}}),e)})))(),t.onUpdate((function(){s.update()})),function(){t.stop(),t.destroy(),s.destory()}};n.default=function(){return(0,c.t)(u,"import * as Athena from 'athena3d';\n\nconst bootstrap = (canvas: HTMLCanvasElement) => {\n\n  const camera = new Athena.PerspectiveCamera({\n    position: new Athena.Vector3(-1.8, 0.6, 2.73),\n    fov: 45\n  });\n\n  const renderer = new Athena.Renderer({ canvas, camera });\n  const controls = new Athena.OrbitControl(camera, canvas);\n  \n  (async () => {\n    const texture = await new Athena.TextureLoader().loadCubemapAsync([\n      '/assets/skybox/google/px.png',\n      '/assets/skybox/google/nx.png',\n      '/assets/skybox/google/py.png',\n      '/assets/skybox/google/ny.png',\n      '/assets/skybox/google/pz.png',\n      '/assets/skybox/google/nz.png'\n    ]);\n    const skybox = new Athena.Skybox(texture);\n    renderer.cubemap = texture;\n    renderer.scene.add(skybox);\n\n    const model = await new Athena.GLTFLoader().loadAsync('/assets/models/helmet.glb');\n    renderer.scene.add(model);\n    renderer.start();\n  })();\n\n  renderer.onUpdate(() => {\n    controls.update();\n  });\n\n  return () => {\n    renderer.stop();\n    renderer.destroy();\n    controls.destory();\n  }\n  \n}","orbit_control.ts")}},5861:function(e,n,t){function o(e,n,t,o,s,r,a){try{var c=e[r](a),u=c.value}catch(i){return void t(i)}c.done?n(u):Promise.resolve(u).then(o,s)}function s(e){return function(){var n=this,t=arguments;return new Promise((function(s,r){var a=e.apply(n,t);function c(e){o(a,s,r,c,u,"next",e)}function u(e){o(a,s,r,c,u,"throw",e)}c(void 0)}))}}t.d(n,{Z:function(){return s}})}}]);
//# sourceMappingURL=677.ab38fb97.chunk.js.map