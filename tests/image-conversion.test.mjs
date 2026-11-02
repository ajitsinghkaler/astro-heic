import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';
const require=createRequire(import.meta.url);
const JSZip=require('jszip');
const compile=path=>ts.transpileModule(readFileSync(new URL(path,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,experimentalDecorators:true,esModuleInterop:true}}).outputText;
const helperCode=compile('../src/services/conversion-options.ts');
const serviceCode=compile('../src/services/convert.service.ts');
const helperExports={};
vm.runInNewContext(helperCode,{exports:helperExports});
const {fittedDimensions,outputFilename}=helperExports;

function setup({failCanvas=false,failEncode=false,fallbackType=false}={}) {
  const blobs=new Map(),revoked=new Set(),decodes=[],encodes=[],downloads=[];
  let id=0;
  const url={createObjectURL(blob){const key=`blob:test/${++id}`;blobs.set(key,blob);return key;},revokeObjectURL(key){revoked.add(key);}};
  class BrowserImage {
    set src(key){const photo=blobs.get(key);this.naturalWidth=photo.width;this.naturalHeight=photo.height;queueMicrotask(()=>photo.imageError?this.onerror():this.onload());}
  }
  const document={createElement(tag){
    if(tag==='a')return {click(){downloads.push({name:this.download,blob:blobs.get(this.href)});}};
    assert.equal(tag,'canvas');
    return {
      width:0,height:0,
      getContext(){return failCanvas?null:{drawImage(){}};},
      toBlob(callback,type,quality){
        encodes.push({type,quality,width:this.width,height:this.height});
        callback(failEncode?null:new Blob([`encoded-${this.width}x${this.height}`],{type:fallbackType?'image/png':type}));
      },
    };
  }};
  const exports={};
  vm.runInNewContext(serviceCode,{
    exports,Blob,URL:url,Image:BrowserImage,document,fetch:async key=>({blob:async()=>blobs.get(key)}),
    setTimeout:fn=>fn(),console:{error(){}},
    require(name){
      if(name==='@angular/core')return {Injectable:()=>value=>value};
      if(name==='./conversion-options')return helperExports;
      if(name==='jszip')return JSZip;
      if(name==='heic-to')return {async heicTo(options){
        decodes.push(options);
        if(options.blob.fail)throw new Error('decode failed');
        return Object.assign(new Blob([`decoded-${options.blob.name}`],{type:'image/png'}),{width:options.blob.width,height:options.blob.height,imageError:options.blob.imageError});
      }};
      throw new Error(`Unexpected module ${name}`);
    },
  });
  return {service:new exports.ConvertService(),blobs,revoked,decodes,encodes,downloads,photo:(name,width=1600,height=900,extra={})=>({name,width,height,size:100,...extra})};
}

test('shrinks a landscape photo to the longest edge without distortion',()=>{
 const fit=fittedDimensions(1600,900,800);assert.equal(fit.width,800);assert.equal(fit.height,450);
});
test('keeps portrait proportions and never enlarges a smaller image',()=>{
 const fit=fittedDimensions(900,1600,800);assert.equal(fit.width,450);assert.equal(fit.height,800);
 const small=fittedDimensions(180,320,800);assert.equal(small.width,180);assert.equal(small.height,320);
});
test('creates safe unique filenames despite case-insensitive collisions and path-like names',()=>{
 const used=new Set();
 assert.equal(outputFilename('Photo.HEIC','jpg',used),'Photo.jpg');
 assert.equal(outputFilename('photo.heic','jpg',used),'photo_2.jpg');
 assert.equal(outputFilename('../photo.heic','jpg',used),'_photo.jpg');
});
test('retains source filenames, dimensions and bytes for an original-size PNG',async()=>{
 const t=setup();const result=await t.service.convertFiles([t.photo('my-photo.heic',320,180)],'image/png');
 assert.equal(result[0].name,'my-photo.png');assert.equal(result[0].sourceName,'my-photo.heic');
 assert.equal(result[0].width,320);assert.equal(result[0].height,180);assert(result[0].size>0);
 assert.equal(t.encodes.length,0);assert.equal(t.decodes[0].type,'image/png');
});
test('resizes and applies the requested JPEG quality with one lossy encode',async()=>{
 const t=setup();const result=await t.service.convertFiles([t.photo('photo.heic')],'image/jpeg',{maxEdge:800,quality:0.35});
 assert.equal(result[0].width,800);assert.equal(result[0].height,450);
 assert.deepEqual(t.encodes,[{type:'image/jpeg',quality:0.35,width:800,height:450}]);
 assert.equal(t.decodes[0].type,'image/png');
 assert.equal(t.blobs.get(result[0].url).type,'image/jpeg');
});
test('uses WebP encoding and reports progress for every completed photo',async()=>{
 const t=setup(),progress=[];
 const result=await t.service.convertFiles([t.photo('one.heic'),t.photo('two.heic')],'image/webp',{onProgress:(done,total)=>progress.push([done,total])});
 assert.deepEqual(progress,[[1,2],[2,2]]);
 assert(t.encodes.every(e=>e.type==='image/webp'&&e.quality===0.8));
 assert.deepEqual(Array.from(result,r=>r.name),['one.webp','two.webp']);
});
test('a real ZIP retains all images when basenames collide',async()=>{
 const t=setup();const result=await t.service.convertFiles([t.photo('photo.heic'),t.photo('photo.heic'),t.photo('photo_2.heic')],'image/png');
 await t.service.downloadZip(result);
 const zip=await JSZip.loadAsync(await t.downloads[0].blob.arrayBuffer());
 const files=Object.values(zip.files).filter(f=>!f.dir);
 assert.equal(files.length,3);
 assert.deepEqual(files.map(f=>f.name.split('/').at(-1)),['photo.png','photo_2.png','photo_2_2.png']);
 assert.equal(await files[0].async('string'),'decoded-photo.heic');
});
test('releases temporary and result URLs if a later photo fails',async()=>{
 const t=setup();await assert.rejects(t.service.convertFiles([t.photo('good.heic'),t.photo('bad.heic',20,20,{fail:true})],'image/png'),/bad.heic/);
 assert.equal(t.blobs.size,t.revoked.size);
});
for(const [option,options]of [['failCanvas',{maxEdge:800}],['failEncode',{}],['fallbackType',{}]]){
 test(`rejects an unusable browser encoder (${option}) instead of mislabelling output`,async()=>{
  const t=setup({[option]:true});await assert.rejects(t.service.convertFiles([t.photo('photo.heic')],'image/jpeg',options),/Could not convert/);
  assert.equal(t.blobs.size,t.revoked.size);
 });
}
test('rejects invalid settings and an empty selection before decoding',async()=>{
 const t=setup();
 await assert.rejects(t.service.convertFiles([],'image/png'),/photo/);
 await assert.rejects(t.service.convertFiles([t.photo('p.heic')],'image/jpeg',{quality:NaN}),/quality/);
 await assert.rejects(t.service.convertFiles([t.photo('p.heic')],'image/jpeg',{maxEdge:0.5}),/edge/);
 assert.equal(t.decodes.length,0);
});
