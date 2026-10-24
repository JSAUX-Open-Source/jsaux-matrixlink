let pickedPath="",toasts=[];
const fs=require('fs'),vm=require('vm'),assert=require('assert');
let cursor=0,slots=[],effects=[],intervals=[],calls=[],enabled=false;
const react={
  createContext:value=>({value}),createElement:(type,props,...children)=>({type,props:{...props,children}}),
  useState:init=>{const i=cursor++;if(!(i in slots))slots[i]=typeof init==='function'?init():init;return[slots[i],v=>{slots[i]=typeof v==='function'?v(slots[i]):v;}];},
  useRef:value=>{const i=cursor++;if(!(i in slots))slots[i]={current:value};return slots[i];},
  useEffect:(f,deps)=>effects.push(f),useLayoutEffect:()=>{},useMemo:f=>f(),useCallback:f=>f,
  useContext:c=>c.value,Fragment:'fragment'
};
const win={navigator:{language:'zh-CN',languages:['zh-CN']},location:{href:'http://localhost',search:''},
  setInterval:f=>(intervals.push(f),intervals.length),clearInterval:()=>{},setTimeout,clearTimeout,
  innerWidth:800,innerHeight:800,addEventListener:()=>{},removeEventListener:()=>{},
  requestAnimationFrame:()=>1,cancelAnimationFrame:()=>{}};
win.window=win;win.top=win;win.parent=win;
win.__DECKY_SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_deckyLoaderAPIInit={connect:()=>({_version:2,
 callable:name=>async payload=>{calls.push([name,payload]);if(name==='update_display_settings'){enabled=payload.doNotDisturb;return{ok:true};}
  if(name==='get_refresh_settings')return{ok:true,doNotDisturb:enabled};if(name==='upload_custom_asset_from_path')return{ok:true};if(name==='get_custom_assets')return{assets:{gallery:['same.gif','b.gif','c.gif','d.gif','e.gif','f.gif'],max_assets:6,upload_allowed:false}};return{};},toaster:{toast:value=>toasts.push(value)},openFilePicker:async()=>({realpath:pickedPath})})};
const context={window:win,navigator:win.navigator,console,URL,URLSearchParams,Set,Map,Date,Promise,
  SP_REACT:react,SP_JSX:{jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props})},setTimeout,clearTimeout};
const pluginIndex=require('path').join(__dirname,'..','decky-plugin','dist','index.js');
const factory=vm.runInNewContext(fs.readFileSync(pluginIndex,'utf8'),context);
const wrapped=factory().content;const content=wrapped.props.children;assert.equal(typeof content.type,'function');
function render(){cursor=0;effects=[];return content.type();}
function walk(n,predicate){if(!n)return null;if(Array.isArray(n)){for(const v of n){const got=walk(v,predicate);if(got)return got;}return null;}
 if(typeof n==='object'){if(predicate(n))return n;return walk(n.props?.children,predicate);}return null;}
async function flush(){await new Promise(resolve=>setImmediate(resolve));}
(async()=>{
 let tree=render();walk(tree,n=>n.props?.['data-settings-open']).props.onClick();tree=render();
 let fw=walk(tree,n=>n.props?.['data-firmware-action']);assert.equal(fw.props.children,'版本未知');fw.props.onClick();assert.equal(toasts.at(-1).body,'固件更新暂不支持');
 slots[slots.indexOf('--')]='1.2.0';tree=render();fw=walk(tree,n=>n.props?.['data-firmware-action']);assert.equal(fw.props.children,'暂不支持升级');
 let toggle=walk(tree,n=>n.props?.['data-settings-field']==='dnd');assert.equal(toggle.props['aria-checked'],false);toggle.props.onClick({currentTarget:{getAttribute:()=>null,removeAttribute:()=>{}}});await flush();assert.equal(enabled,true);
 walk(tree,n=>typeof n.props?.onClick==='function' && n.props.onClick.toString().includes('setSettingsOpen(false)')).props.onClick();
 slots[slots.indexOf('dashboard')]='gif';const assetSlot=slots.findIndex(Array.isArray);slots[assetSlot]=['same.gif','b.gif','c.gif','d.gif','e.gif','f.gif'];
 tree=render();let panel=walk(tree,n=>n.type?.name==='CustomAssetPanel');assert(panel);let view=panel.type(panel.props);const upload=walk(view,n=>n.props?.['data-custom-upload']);assert(upload);assert.equal(upload.props.children,'替换同名图片');
 pickedPath='/tmp/new-seventh.gif';const before=calls.filter(x=>x[0]==='upload_custom_asset_from_path').length;await upload.props.onClick();await flush();assert.equal(calls.filter(x=>x[0]==='upload_custom_asset_from_path').length,before);assert(toasts.at(-1).body.includes('同名'));
 tree=render();panel=walk(tree,n=>n.type?.name==='CustomAssetPanel');view=panel.type(panel.props);pickedPath='/tmp/same.gif';await walk(view,n=>n.props?.['data-custom-upload']).props.onClick();await flush();assert.equal(calls.filter(x=>x[0]==='upload_custom_asset_from_path').length,before+1);
 console.log('PASS plugin firmware unknown/unsupported, DND default and toggle, full-gallery replacement UI and seventh-file rejection');
})().catch(e=>{console.error(e);process.exitCode=1;});
