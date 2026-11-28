(() => {
  "use strict";
  const base = new URL("./assets/settings-preview-icons/", document.baseURI);
  const namespace = "http://www.w3.org/2000/svg", memo = new Map(), assets = new Map(), matches = new Map();
  let catalog, retained = 0;
  async function read(url, limit) {
    const response = await fetch(url, {credentials:"omit", signal:AbortSignal.timeout(5000)});
    if (!response.ok) throw Error("Icon unavailable");
    const reader = response.body.getReader(), chunks = []; let size = 0;
    try {
      for (;;) {
        const {done,value} = await reader.read(); if (done) break;
        size += value.length; if (size > limit) throw Error("Icon too large"); chunks.push(value);
      }
    } finally { await reader.cancel().catch(() => {}); }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk,offset); offset += chunk.length; }
    return bytes;
  }
  function png(bytes) {
    if (bytes.length < 24 || bytes.length > 262144 || bytes[0] !== 137 || bytes[1] !== 80 || bytes[2] !== 78 || bytes[3] !== 71) return null;
    const view = new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength), width = view.getUint32(16), height = view.getUint32(20);
    return width > 0 && height > 0 && width <= 256 && height <= 256 ? {width,height} : null;
  }
  function bytes(text) { return Uint8Array.from(atob(text), value => value.charCodeAt(0)); }
  function dataUrl(data) {
    let text = "";
    for (let offset = 0; offset < data.length; offset += 8192) text += String.fromCharCode(...data.subarray(offset,offset+8192));
    return "data:image/png;base64," + btoa(text);
  }
  async function index() {
    catalog ??= read(new URL("index.json?v=20261014-job-icon-theme-b",base),524288).then(data => {
      const value = JSON.parse(new TextDecoder().decode(data));
      if (value.schema !== "notmeter-preview-icons-v1" || !Array.isArray(value.icons) || value.icons.length > 1200) throw Error("Invalid icon index");
      const exact = new Map();
      const icons = value.icons.map(icon => {
        if (!/^[a-f0-9]{64}$/.test(icon.id) || !/^[a-f0-9]{64}$/.test(icon.file) ||
            !Number.isInteger(icon.width) || !Number.isInteger(icon.height) || icon.width < 16 || icon.height < 16 ||
            icon.width > 256 || icon.height > 256 || typeof icon.sample !== "string" || icon.sample.length !== 344) throw Error("Invalid icon");
        const sample = bytes(icon.sample); if (sample.length !== 256) throw Error("Invalid icon sample");
        const result = {...icon,sample}; exact.set(icon.id,result); return result;
      });
      return {icons,exact};
    }).catch(error => { catalog = null; throw error; });
    return catalog;
  }
  function distance(left,right) {
    let total = 0;
    for (let i = 0; i < left.length; i++) { const difference = left[i]-right[i]; total += difference*difference; }
    return total/left.length;
  }
  function samplePixels(pixels,width,extent,margin = 1/8) {
    const result = new Uint8Array(256);
    for (let row=0;row<8;row++) for (let column=0;column<8;column++) {
      const step = (1-margin*2)/8, left = extent*(margin+column*step), top = extent*(margin+row*step), right = left+extent*step, bottom = top+extent*step;
      const total = [0,0,0,0];
      for (let y=Math.floor(top);y<Math.ceil(bottom);y++) for (let x=Math.floor(left);x<Math.ceil(right);x++) {
        const weight = (Math.min(x+1,right)-Math.max(x,left))*(Math.min(y+1,bottom)-Math.max(y,top)), offset = (y*width+x)*4;
        for (let channel=0;channel<4;channel++) total[channel] += weight*pixels[offset+channel]*(channel<3?pixels[offset+3]/255:1);
      }
      for (let channel=0;channel<4;channel++) result[(row*8+column)*4+channel] = Math.round(total[channel]/((right-left)*(bottom-top)));
    }
    return result;
  }
  async function fullSample(data) {
    const bitmap = await createImageBitmap(new Blob([data],{type:"image/png"}));
    try {
      const canvas = document.createElement("canvas"); canvas.width = bitmap.width; canvas.height = bitmap.height;
      const context = canvas.getContext("2d",{willReadFrequently:true}); context.drawImage(bitmap,0,0);
      const pixels = context.getImageData(0,0,canvas.width,canvas.height).data, width = canvas.width;
      const edge = pixels[(Math.floor(width/2)*width+width-1)*4+3]/255;
      return samplePixels(pixels,width,width-1+edge,0);
    } finally { bitmap.close(); }
  }
  async function identify(data, candidates) {
    const dimensions = png(data);
    if (!dimensions || dimensions.width !== dimensions.height || dimensions.width < 8 || dimensions.width >= 48) return null;
    const bitmap = await createImageBitmap(new Blob([data],{type:"image/png"}));
    try {
      const canvas = document.createElement("canvas"); canvas.width = canvas.height = dimensions.width;
      const context = canvas.getContext("2d",{willReadFrequently:true}); context.drawImage(bitmap,0,0);
      const pixels = context.getImageData(0,0,canvas.width,canvas.height).data, width = canvas.width;
      let opaque = 0;
      for (let y = 1; y < width-1; y++) for (let x = 1; x < width-1; x++) if (pixels[(y*width+x)*4+3] >= 250) opaque++;
      if (opaque < (width-2)*(width-2)*.98) return null;
      const edge = pixels[(Math.floor(width/2)*width+width-1)*4+3]/255, extent = width-1+edge;
      const sample = samplePixels(pixels,width,extent);
      let best = null, score = Infinity;
      for (const icon of candidates) {
        if (icon.width !== icon.height) continue;
        const value = distance(sample,icon.sample);
        if (value < score) { best = icon; score = value; }
      }
      if (!best || score > 320) return null;
      let next = Infinity;
      for (const icon of candidates) {
        if (icon.width !== icon.height || distance(best.sample,icon.sample) < 80) continue;
        next = Math.min(next,distance(sample,icon.sample));
      }
      return score < next*.22 ? best : null;
    } finally { bitmap.close(); }
  }
  async function image(icon) {
    if (!assets.has(icon.file)) {
      const promise = read(new URL(icon.file+".png",base),262144).then(async data => {
        const digest = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",data)),n=>n.toString(16).padStart(2,"0")).join("");
        if (digest !== icon.file || !png(data)) throw Error("Invalid icon content");
        return dataUrl(data);
      }).catch(error => { assets.delete(icon.file); throw error; });
      assets.set(icon.file,promise);
      while (assets.size > 160) assets.delete(assets.keys().next().value);
    }
    return assets.get(icon.file);
  }
  async function restore(source) {
    if (!source || typeof source !== "string" || source.length > 524288) return source;
    if (memo.has(source)) return memo.get(source);
    const svg = new DOMParser().parseFromString(source,"image/svg+xml");
    if (svg.querySelector("parsererror") || svg.documentElement.namespaceURI !== namespace) return source;
    const images = Array.from(svg.getElementsByTagNameNS(namespace,"image"));
    if (!images.length || images.length > 128) return source;
    let changed = false, failed = false, cursor = 0, sceneIndex;
    const requested = new Map(), deadline = performance.now()+5000;
    async function worker() {
      while (cursor < images.length) {
        if (performance.now() >= deadline) { failed = true; break; }
        const element = images[cursor++], href = element.getAttribute("href") || "";
        if (!/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(href) || href.length > 350000) continue;
        try {
          const original = bytes(href.slice(22)), dimensions = png(original);
          if (!dimensions) continue;
          if (dimensions.width >= 64 && dimensions.height >= 64) continue;
          const id = /^nmi_[a-zA-Z0-9]+_([a-f0-9]{64})$/.exec(element.id)?.[1];
          if (!id && (dimensions.width !== dimensions.height || dimensions.width < 8 || dimensions.width >= 48)) continue;
          const entries = await (sceneIndex ??= index());
          let match;
          if (id) match = entries.exact.get(id);
          else {
            if (!matches.has(href)) {
              matches.set(href,identify(original,entries.icons));
              while (matches.size > 256) matches.delete(matches.keys().next().value);
            }
            match = await matches.get(href);
          }
          if (!match || dimensions.width >= match.width && dimensions.height >= match.height) continue;
          if (!requested.has(match.file)) requested.set(match.file,image(match));
          const replacement = await requested.get(match.file);
          const restoredSize = png(bytes(replacement.slice(22)));
          if (!restoredSize || dimensions.width >= restoredSize.width && dimensions.height >= restoredSize.height) continue;
          if (!id && distance(await fullSample(original),await fullSample(bytes(replacement.slice(22)))) > 500) continue;
          element.setAttribute("href",replacement); changed = true;
        } catch { failed = true; }
      }
    }
    await Promise.all(Array.from({length:Math.min(4,images.length)},worker));
    const result = changed ? new XMLSerializer().serializeToString(svg.documentElement) : source;
    if (!failed) {
      memo.set(source,result); retained += (source.length+result.length)*2;
      while (memo.size > 24 || retained > 8388608) {
        const first = memo.keys().next().value; retained -= (first.length+memo.get(first).length)*2; memo.delete(first);
      }
    }
    return result;
  }
  globalThis.NotMeterPreviewIcons = Object.freeze({restore});
})();
