(() => {
  "use strict";
  const ROOT = "./assets/character-titles/", VERSION = "20261011-appearance-1";
  const requests = new Map(), images = new Map(), active = new Set();
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const LOCALES = { ko: "ko-KR", en: "en-US", "zh-TW": "zh-TW", th: "en-US",
    "ja-JP": "ja-JP", "de-DE": "de-DE", "fr-FR": "fr-FR", "es-ES": "es-ES", "pt-BR": "pt-BR", "ru-RU": "ru-RU" };
  const LABELS = { ko: "외형 타이틀", en: "Appearance title", "zh-TW": "外觀稱號", th: "ฉายาที่แสดง",
    "ja-JP": "表示タイトル", "de-DE": "Angezeigter Titel", "fr-FR": "Titre affiché", "es-ES": "Título visible",
    "pt-BR": "Título exibido", "ru-RU": "Отображаемый титул" };
  const COLORS = { Common: "#C3C3C3", Rare: "#19E048", Legend: "#379AFF", Unique: "#FFD02B",
    Epic: "#FF6C00", Mythic: "#FF3245", Special: "#00FFD8" };
  let frame = 0, lastDraw = 0;

  function json(name) {
    if (!requests.has(name)) requests.set(name,
      fetch(`${ROOT}${name}?v=${VERSION}`, { signal: AbortSignal.timeout(8000) })
        .then(response => { if (!response.ok) throw Error("Title catalog unavailable"); return response.json(); })
        .catch(error => { requests.delete(name); throw error; }));
    return requests.get(name);
  }
  function loadImage(name) {
    if (!images.has(name)) {
      const image = new Image(); image.src = ROOT + name;
      images.set(name, image.decode().then(() => image).catch(error => { images.delete(name); throw error; }));
    }
    return images.get(name);
  }
  function resolve(profile, region, locale, catalog, names) {
    const id = String(Number(profile?.titleId) || 0);
    const row = catalog?.regions?.[region === "ww" ? "ww" : "kr"]?.[id], localized = names?.[id];
    return { id, name: (Array.isArray(localized) ? localized[0] : localized) || String(profile?.titleName || "").trim(),
      lang: Array.isArray(localized) ? localized[1] : localized ? LOCALES[locale] || "en-US"
        : region === "ww" ? "en-US" : region === "tw" ? "zh-TW" : "ko-KR",
      color: catalog?.colors?.[row?.[0]] || COLORS[profile?.titleGrade] || COLORS.Common,
      background: row && catalog.art[row[1]], decoration: row && catalog.art[row[2]] };
  }
  function create(profile, region, locale) {
    if (!(Number(profile?.titleId) > 0) && !String(profile?.titleName || "").trim()) return null;
    const root = document.createElement("div"), label = document.createElement("span");
    root.className = "character-appearance-title"; label.className = "character-appearance-title-text"; root.append(label);
    function apply(value) {
      label.textContent = value.name; root.hidden = !value.name;
      root.title = `${LABELS[locale] || LABELS.en}: ${value.name}`;
      root.style.setProperty("--title-color", value.color); root.dataset.titleId = value.id; root.lang = value.lang;
    }
    apply(resolve(profile, region, locale));
    Promise.all([json("catalog.json"), json(`${region === "ww" ? "ww" : "kr"}.${LOCALES[locale] || "en-US"}.json`)])
      .then(async ([catalog, names]) => {
        if (!root.isConnected) return;
        const value = resolve(profile, region, locale, catalog, names); apply(value);
        const art = [value.background, value.decoration];
        if (!art.some(Boolean)) { root.dataset.ready = "true"; return; }
        // Expose decoration only after all images load; failures retain the readable title.
        const loaded = await Promise.all(art.map(async item => item && ({ ...item,
          source: await loadImage(item.image), textures: item.effect
            ? await Promise.all(["Texture", "T2_Mask", "T3_Mix", "T4_Distortion"].map(key => loadImage(item.effect.textures[key]))) : [] })));
        if (!root.isConnected) return;
        root.classList.add("has-title-art");
        const entry = { root, label, band: value.background?.textBand || [0,1],
          layers: loaded.map((item, index) => item && makeLayer(root, item, index === 1)).filter(Boolean), visible: true };
        layout(entry);
        active.add(entry); visibility.observe(root); sizes.observe(root); cleanup.observe(document.body, { childList: true, subtree: true });
        render(entry, 0); root.dataset.ready = "true"; schedule();
      }).catch(() => { root.dataset.ready = "fallback"; });
    return root;
  }

  // Recreate the exported material layers in WebGL; Unreal's cooked shader bytecode is not executable here.
  const VERTEX = `attribute vec2 position; varying vec2 uv;
    void main(){uv=position*.5+.5;gl_Position=vec4(position.x,-position.y,0.,1.);}`;
  const FRAGMENT = `precision highp float;
    varying vec2 uv;
    uniform sampler2D base,trail,maskTex,mixTex,distortion;
    uniform vec2 size,sourceSize,distortionBias,distortionPower;
    uniform vec4 bounds,transform1,transform2,transform3,transform4,pan1,pan2,pan3,pan4,color1,color3;
    uniform float time,sliced,center1,center2,center3,center4,mixAdd;
    vec2 transform(vec2 p,vec4 t,vec4 v,float center){return(p-.5*center)*t.xy+.5*center+t.zw+v.xy*time;}
    void main(){
      vec2 p=uv;
      if(sliced>0.){
        float left=sourceSize.x*.5-bounds.x,right=bounds.z-sourceSize.x*.5,x=uv.x*size.x;
        float middle=max(1.,size.x-left-right);
        float sx=x<left?bounds.x+x:(x>size.x-right?bounds.z-(size.x-x):sourceSize.x*.5+(x-left)/middle-.5);
        p=vec2(sx/sourceSize.x,mix(bounds.y,bounds.w,uv.y)/sourceSize.y);
      }else p=mix(bounds.xy,bounds.zw,uv)/sourceSize;
      vec4 original=texture2D(base,p);
      vec2 warp=texture2D(distortion,fract(transform(p,transform4,pan4,center4))).rg+distortionBias;
      vec4 a=texture2D(trail,fract(transform(p,transform1,pan1,center1)+warp*distortionPower.x))*color1;
      vec4 b=texture2D(mixTex,fract(transform(p,transform3,pan3,center3)+warp*distortionPower.y))*color3;
      vec2 mp=transform(p,transform2,pan2,center2);
      float mask=texture2D(maskTex,clamp(mp,0.,1.)).r;
      vec3 light=mix(a.rgb*b.rgb,a.rgb+b.rgb,mixAdd)*mask;
      if(sliced<.5){
        // Sparkle texels must remain visible outside the opaque crown silhouette.
        float sparkleAlpha=clamp(max(light.r,max(light.g,light.b))*color1.a,0.,1.);
        float alpha=max(original.a,sparkleAlpha);
        gl_FragColor=vec4(clamp((original.rgb*original.a+light)/max(alpha,.001),0.,1.),alpha);
      }else gl_FragColor=vec4(clamp(original.rgb+light*original.rgb,0.,1.),original.a);
    }`;

  function makeLayer(root, art, icon) {
    const canvas = document.createElement("canvas");
    canvas.className = icon ? "character-title-decoration" : "character-title-background";
    canvas.setAttribute("aria-hidden", "true"); root.prepend(canvas);
    let gl = null, program = null, lost = false, disposed = false, fallbackCanvas = null, fallbackSize = "";
    const resources = [];
    if (art.effect) try { gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: false, depth: false }); } catch {}
    if (gl) {
      try {
        function shader(type, source) {
          const shader = gl.createShader(type); resources.push(["deleteShader", shader]);
          gl.shaderSource(shader, source); gl.compileShader(shader);
          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw Error("Title shader unavailable");
          return shader;
        }
        program = gl.createProgram(); resources.push(["deleteProgram", program]);
        gl.attachShader(program, shader(gl.VERTEX_SHADER, VERTEX)); gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FRAGMENT));
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw Error("Title shader unavailable");
        gl.useProgram(program);
        const buffer = gl.createBuffer(); resources.push(["deleteBuffer", buffer]);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
        const position = gl.getAttribLocation(program, "position");
        gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
        [art.source, ...art.textures].forEach((image, i) => {
          const texture = gl.createTexture(); resources.push(["deleteTexture", texture]);
          gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
          gl.uniform1i(gl.getUniformLocation(program, ["base", "trail", "maskTex", "mixTex", "distortion"][i]), i);
        });
        const s = art.effect.scalar, flags = art.effect.switch;
        for (let n = 1; n <= 4; n++) {
          gl.uniform4f(gl.getUniformLocation(program, `transform${n}`), s[`T${n}_Tiling_U`], s[`T${n}_Tiling_V`], s[`T${n}_Offset_U`], s[`T${n}_Offset_V`]);
          gl.uniform4f(gl.getUniformLocation(program, `pan${n}`), flags[`T${n}_isPanning`] ? s[`T${n}_Panning_U`] : 0, flags[`T${n}_isPanning`] ? s[`T${n}_Panning_V`] : 0, 0, 0);
          gl.uniform1f(gl.getUniformLocation(program, `center${n}`), flags[`T${n}_isScaleCenter`] ? 1 : 0);
        }
        gl.uniform4fv(gl.getUniformLocation(program, "color1"), art.effect.vector.T1_MultiplyColor);
        gl.uniform4fv(gl.getUniformLocation(program, "color3"), art.effect.vector.T3_MultiplyColor);
        gl.uniform2f(gl.getUniformLocation(program, "distortionBias"), s.T4_Bias_U, s.T4_Bias_V);
        gl.uniform2f(gl.getUniformLocation(program, "distortionPower"), flags.T4_UseDistortion_T1 ? s.T4_Intensity_T1 : 0, flags.T4_UseDistortion_T3 ? s.T4_Intensity_T3 : 0);
        gl.uniform2fv(gl.getUniformLocation(program, "sourceSize"), art.size);
        gl.uniform4fv(gl.getUniformLocation(program, "bounds"), art.bounds);
        gl.uniform1f(gl.getUniformLocation(program, "sliced"), icon ? 0 : 1);
        gl.uniform1f(gl.getUniformLocation(program, "mixAdd"), flags["T3_RGB_Add_T1_RGB?"] ? 1 : 0);
        canvas.addEventListener("webglcontextlost", event => { event.preventDefault(); if (!disposed) { lost = true; fallback(); } });
      } catch { lost = true; }
    }
    function fallback() {
      if (!fallbackCanvas) {
        fallbackCanvas = document.createElement("canvas"); fallbackCanvas.className = canvas.className;
        fallbackCanvas.setAttribute("aria-hidden", "true"); canvas.hidden = true; root.prepend(fallbackCanvas);
      }
      const width = icon ? 44 : Math.max(107, root.clientWidth), height = icon ? 38 : Math.max(44, root.clientHeight);
      if (fallbackSize === `${width}:${height}`) return;
      fallbackSize = `${width}:${height}`;
      fallbackCanvas.width = width * 2; fallbackCanvas.height = height * 2;
      const ctx = fallbackCanvas.getContext("2d"); if (!ctx) return;
      ctx.scale(2, 2);
      const [x, y, right, bottom] = art.bounds, h = bottom-y, mid = art.size[0]/2;
      if (icon) ctx.drawImage(art.source, x, y, right-x, h, 0, 0, width, height);
      else {
        const l = mid-x, r = right-mid;
        ctx.drawImage(art.source,x,y,l,h,0,0,l,height);
        ctx.drawImage(art.source,mid-.5,y,1,h,l,0,Math.max(1,width-l-r),height);
        ctx.drawImage(art.source,mid,y,r,h,width-r,0,r,height);
      }
    }
    function draw(time) {
      if (!gl || lost) { fallback(); return; }
      const width = icon ? 44 : Math.max(107, root.clientWidth), height = icon ? 38 : Math.max(44, root.clientHeight), dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(width*dpr) || canvas.height !== Math.round(height*dpr)) {
        canvas.width = Math.round(width*dpr); canvas.height = Math.round(height*dpr);
      }
      gl.viewport(0,0,canvas.width,canvas.height); gl.uniform2f(gl.getUniformLocation(program, "size"), width, height);
      gl.uniform1f(gl.getUniformLocation(program, "time"), time); gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    return { draw, get animated() { return !!gl && !lost; }, dispose() {
      disposed = true;
      if (gl) { for (const [method, value] of resources) gl[method](value); gl.getExtension("WEBGL_lose_context")?.loseContext(); }
    } };
  }

  function layout(entry) {
    const [top, bottom] = entry.band, center = (top + bottom) / 2;
    const textHeight = entry.label.getBoundingClientRect().height;
    const height = Math.max(44, (textHeight + 8) / Math.max(.2, bottom - top));
    const paddingTop = `${Math.max(0, height * center - textHeight / 2).toFixed(3)}px`;
    const paddingBottom = `${Math.max(0, height * (1 - center) - textHeight / 2).toFixed(3)}px`;
    if (entry.root.style.paddingTop !== paddingTop) entry.root.style.paddingTop = paddingTop;
    if (entry.root.style.paddingBottom !== paddingBottom) entry.root.style.paddingBottom = paddingBottom;
    entry.root.style.setProperty("--title-line-center", `${height * center}px`);
  }
  function render(entry, time) { for (const layer of entry.layers) layer.draw(time); }
  function schedule() {
    if (!frame && !document.hidden && !motion.matches && [...active].some(item => item.visible && item.layers.some(layer => layer.animated))) frame = requestAnimationFrame(tick);
  }
  function tick(time) {
    frame = 0; if (document.hidden || motion.matches) return;
    if (time-lastDraw >= 1000/30) {
      for (const entry of active) if (entry.visible && entry.root.isConnected) render(entry, time/1000);
      lastDraw = time;
    }
    schedule();
  }
  const visibility = new IntersectionObserver(entries => {
    for (const record of entries) for (const item of active) if (item.root === record.target) item.visible = record.isIntersecting;
    schedule();
  });
  const cleanup = new MutationObserver(() => {
    for (const item of active) if (!item.root.isConnected) {
      visibility.unobserve(item.root); sizes.unobserve(item.root); for (const layer of item.layers) layer.dispose(); active.delete(item);
    }
    if (!active.size) { cancelAnimationFrame(frame); frame = 0; cleanup.disconnect(); }
  });
  const sizes = new ResizeObserver(entries => {
    for (const record of entries) for (const item of active) if (item.root === record.target) { layout(item); render(item, 0); }
  });
  document.addEventListener("visibilitychange", schedule);
  motion.addEventListener("change", () => { for (const item of active) render(item, 0); schedule(); });
  window.addEventListener("resize", () => { for (const item of active) render(item, 0); });
  window.NotMeterCharacterTitles = Object.freeze({ create, resolve });
})();
