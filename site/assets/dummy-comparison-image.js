(() => {
  "use strict";
  async function create(snapshot) {
    const width = 1440, margin = 36, top = 304 + snapshot.warnings.length * 24, rowHeight = 116;
    const height = top + snapshot.rows.length * rowHeight + 114;
    const scale = Math.min(2, 16000 / height, Math.sqrt(24000000 / (width * height)));
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(width * scale); canvas.height = Math.ceil(height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.scale(scale, scale);
    const colors = { bg: "#1e2221", panel: "#272f2a", line: "#3a443e", text: "#e8eee9", muted: "#a2b0a7", mine: "#b5ecd9", ranker: "#d9c5a5", negative: "#e8b69d", positive: "#8edbc3" };
    function text(value, x, y, size = 16, color = colors.text, align = "left", weight = 500, maxWidth = width) {
      ctx.fillStyle = color; ctx.font = `${weight} ${size}px "Segoe UI", "Malgun Gothic", sans-serif`; ctx.textAlign = align;
      let fitted = String(value ?? "");
      if (ctx.measureText(fitted).width > maxWidth) {
        while (fitted.length > 1 && ctx.measureText(fitted + "…").width > maxWidth) fitted = fitted.slice(0, -1);
        fitted += "…";
      }
      ctx.fillText(fitted, x, y);
    }
    function line(y) { ctx.strokeStyle = colors.line; ctx.beginPath(); ctx.moveTo(margin, y); ctx.lineTo(width - margin, y); ctx.stroke(); }
    ctx.fillStyle = colors.bg; ctx.fillRect(0, 0, width, height);
    text("NOT METER", margin, 35, 12, colors.muted, "left", 700);
    text(snapshot.title, margin, 69, 26, colors.text, "left", 700, 1000);
    text(snapshot.subtitle, width - margin, 67, 14, colors.muted, "right");
    const cardWidth = 536;
    for (let index = 0; index < 2; index++) {
      const data = snapshot.people[index], x = margin + index * cardWidth;
      ctx.fillStyle = index === 0 ? colors.panel : "#282d29"; ctx.fillRect(x, 90, cardWidth - 1, 126);
      text(data.label, x + 18, 113, 12, index === 0 ? colors.mine : colors.ranker);
      text(data.name, x + 18, 144, 22, colors.text, "left", 700, 215);
      text(data.dps, x + cardWidth - 20, 144, 28, colors.text, "right", 700, 286);
      text(data.context, x + 18, 174, 14, colors.muted);
      if (data.dateText) text(data.dateText, x + 18, 196, 12, colors.muted);
    }
    text(snapshot.gapLabel, width - margin - 133, 126, 14, colors.muted, "center");
    text(snapshot.gap, width - margin - 133, 170, 36, snapshot.gap.startsWith("-") ? colors.negative : colors.positive, "center", 700);
    text(snapshot.legend, margin, 241, 13, colors.muted);
    text(snapshot.conditions, width - margin, 241, 12, colors.ranker, "right", 500, 610);
    snapshot.warnings.forEach((warning, index) => text(warning, margin, 266 + index * 24, 13, colors.ranker, "left", 500, width - margin * 2));
    const firstWidth = 280, remainingWidth = width - 2 * margin - firstWidth, cellWidth = remainingWidth / 5;
    ctx.fillStyle = colors.panel; ctx.fillRect(margin, top - 44, width - 2 * margin, 44);
    text(snapshot.columns[0], margin + 14, top - 15, 13, colors.muted);
    snapshot.columns.slice(1).forEach((name, index) => text(name, margin + firstWidth + (index + 1) * cellWidth - 14, top - 15, 13, colors.muted, "right"));
    const loaded = new Map();
    async function iconImage(style) {
      const match = /url\(["']?([^"')]+)["']?\)/.exec(style.image || "");
      if (!match) return null;
      const url = new URL(match[1], location.href);
      if (url.origin !== location.origin) return null;
      if (!loaded.has(url.href)) loaded.set(url.href, new Promise(resolve => {
        const img = new Image();
        const timer = setTimeout(() => resolve(null), 2500);
        img.onload = () => { clearTimeout(timer); resolve(img); }; img.onerror = () => { clearTimeout(timer); resolve(null); }; img.src = url.href;
      }));
      return loaded.get(url.href);
    }
    const icons = await Promise.all(snapshot.rows.map(row => iconImage(row.icon)));
    snapshot.rows.forEach((row, index) => {
      const y = top + index * rowHeight;
      if (index % 2) { ctx.fillStyle = "#ffffff03"; ctx.fillRect(margin, y, width - 2 * margin, rowHeight); }
      const img = icons[index];
      if (img) {
        const [sx, sy] = row.icon.position.split(" ").map(parseFloat), [sw] = row.icon.size.split(" ").map(parseFloat);
        const ratio = img.naturalWidth / sw;
        if ([sx, sy, ratio].every(Number.isFinite)) ctx.drawImage(img, -sx * ratio, -sy * ratio, 28 * ratio, 28 * ratio, margin + 12, y + 20, 34, 34);
      }
      text(row.name, margin + 58, y + 27, 16, colors.text, "left", 600, firstWidth - 75);
      text(row.level, margin + 58, y + 46, 11, colors.muted, "left", 500, firstWidth - 75);
      row.traits.forEach((trait, traitIndex) => {
        const baseline = y + 65 + traitIndex * 18, start = margin + 58;
        text(trait.label, start, baseline, 11, trait.side === "mine" ? colors.mine : colors.ranker);
        if (trait.flags) trait.flags.forEach((active, dotIndex) => {
          ctx.fillStyle = active ? "#d9be95" : "#505052";
          ctx.beginPath(); ctx.arc(start + 112 + dotIndex * 10, baseline - 4, 3.5, 0, Math.PI * 2); ctx.fill();
        });
        else text(trait.description, start + 155, baseline, 11, colors.muted, "right", 500, 80);
      });
      text(row.condition, margin + 58, y + 102, 11, colors.ranker, "left", 500, firstWidth - 75);
      row.values.forEach((cell, column) => {
        const x = margin + firstWidth + (column + 1) * cellWidth - 14;
        const labelX = x - cellWidth + 24;
        text(snapshot.mineLabel, labelX, y + 41, 11, colors.mine);
        text(cell.mine, x, y + 41, 18, colors.mine, "right", 600, cellWidth - 80);
        text(snapshot.rankerLabel, labelX, y + 63, 11, colors.ranker);
        text(cell.ranker, x, y + 63, 18, colors.ranker, "right", 600, cellWidth - 80);
        text(`${snapshot.deltaLabel} ${cell.delta}`, x, y + 84, 12, cell.sign < 0 ? colors.negative : cell.sign > 0 ? colors.positive : colors.muted, "right", 500, cellWidth - 18);
      });
      line(y + rowHeight);
    });
    const bottom = top + snapshot.rows.length * rowHeight;
    text(snapshot.note, margin, bottom + 34, 12, colors.muted, "left", 500, width - 2 * margin);
    text("NotMeter · notmeter.com", margin, bottom + 77, 13, colors.muted);
    text(`${snapshot.rows.length} skills · 60 seconds`, width - margin, bottom + 77, 12, colors.muted, "right");
    try {
      return await new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("PNG unavailable")), "image/png"));
    } finally { canvas.width = canvas.height = 1; loaded.clear(); }
  }
  globalThis.NotMeterDummyComparisonImage = Object.freeze({ create });
})();
