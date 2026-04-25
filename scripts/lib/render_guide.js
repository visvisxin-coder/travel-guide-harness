const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../..");

function loadGuide(input) {
  const guidePath = path.resolve(root, input);
  return JSON.parse(fs.readFileSync(guidePath, "utf8"));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Inline SVG icons — zero dependencies, works offline, uses currentColor
const I = {
  mapPin: '<svg class="hi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>',
  train: '<svg class="hi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><line x1="4" y1="9" x2="20" y2="9"/><circle cx="8.5" cy="17.5" r="1.5"/><circle cx="15.5" cy="17.5" r="1.5"/></svg>',
  umbrella: '<svg class="hi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 1 10 10H2A10 10 0 0 1 12 2z"/><path d="M12 12v8a2 2 0 0 0 4 0"/></svg>',
  star: '<svg class="hi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  subway: '<svg class="hi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="16" x2="16" y2="16"/><circle cx="8" cy="19" r="1"/><circle cx="16" cy="19" r="1"/></svg>',
  sunrise: '<svg class="hi-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v8"/><line x1="1" y1="22" x2="23" y2="22"/><polyline points="8 15 12 11 16 15"/></svg>',
  sun: '<svg class="hi-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>',
  moon: '<svg class="hi-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',
  arrow: '<svg class="hi-xs" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>'
};

const PERIOD_ICONS = { "上午": I.sunrise, "下午": I.sun, "晚上": I.moon };

function pills(items = []) {
  return `<div class="pill-row">${items.map((item) => `<span class="pill">${escapeHtml(item)}</span>`).join("")}</div>`;
}

function assetUrl(assetPath) {
  return `../../${assetPath.split(path.sep).join("/")}`;
}

function segmentHtml(segment) {
  const periodIcon = PERIOD_ICONS[segment.period] || "";
  const periodClass = segment.period === "上午" ? "period-morning" : segment.period === "下午" ? "period-afternoon" : segment.period === "晚上" ? "period-evening" : "";
  return `
    <section class="segment ${periodClass}">
      <div class="time">${periodIcon}<span>${escapeHtml(segment.time)}</span><br><span class="label">${escapeHtml(segment.period)}</span></div>
      <div>
        <div class="place">${escapeHtml(segment.place)}</div>
        <div class="detail">${escapeHtml(segment.duration)} · ${escapeHtml(segment.transport)} · ${escapeHtml(segment.budget)}</div>
        <p>${escapeHtml(segment.why)}</p>
      </div>
    </section>`;
}

function transportLegHtml(leg) {
  return `
    <section class="segment">
      <div class="time">${escapeHtml(leg.recommended_mode)}</div>
      <div>
        <div class="place">${escapeHtml(leg.from)} → ${escapeHtml(leg.to)}</div>
        <div class="detail">${escapeHtml(leg.estimated_time)} · ${escapeHtml(leg.estimated_cost)}</div>
        <p>${escapeHtml(leg.why)}</p>
        <div class="detail">备选：${escapeHtml((leg.alternatives || []).join(" / "))}</div>
        <div class="detail">痛点：${escapeHtml((leg.pain_points || []).join(" / "))}</div>
      </div>
    </section>`;
}

function transportPlanHtml(guide, mode) {
  if (!guide.transport_plan || !Array.isArray(guide.transport_plan.days)) return "";
  const dayClass = mode === "html" ? "transport-card" : mode === "poster" ? "card" : "day";
  const gridOpen = mode === "html" ? `<div class="two-column">` : "";
  const gridClose = mode === "html" ? `</div>` : "";
  return `
    <section>
      <h2>${I.train} 点到点交通</h2>
      <p>${escapeHtml(guide.transport_plan.summary || guide.transport.main)}</p>
      ${gridOpen}
      ${guide.transport_plan.days.map((day) => `
        <article class="${dayClass}">
          <h3>Day ${day.day} 交通建议</h3>
          ${(day.legs || []).map(transportLegHtml).join("")}
        </article>
      `).join("")}
      ${gridClose}
    </section>`;
}

function socialTrendHtml(guide, mode) {
  if (!guide.social_trends || !Array.isArray(guide.social_trends.items)) return "";
  const cardClass = mode === "html" ? "note-card" : mode === "poster" ? "card" : "day";
  const gridOpen = mode === "html" ? `<div class="section-grid">` : "";
  const gridClose = mode === "html" ? `</div>` : "";
  return `
    <section>
      <h2>${I.star} 小红书热搜参考</h2>
      <p>${escapeHtml(guide.social_trends.source_policy || "社交平台热度仅作参考，需结合路线和实际情况判断。")}</p>
      ${gridOpen}
      ${guide.social_trends.items.map((item) => `
        <article class="${cardClass}">
          <h3>${escapeHtml(item.name)}</h3>
          <div class="detail">${escapeHtml(item.type)} · ${escapeHtml(item.recommended_action)}</div>
          <p>${escapeHtml(item.trend_reason)}</p>
          <div class="detail">适合：${escapeHtml((item.fit_for || []).join(" / "))}</div>
          <div class="detail">注意：${escapeHtml((item.caveats || []).join(" / "))}</div>
        </article>
      `).join("")}
      ${gridClose}
    </section>`;
}

function metroMapHtml(guide, mode) {
  if (!guide.metro_map || !guide.metro_map.enabled) return "";
  const cardClass = mode === "html" ? "metro-card" : mode === "poster" ? "card" : "day";
  return `
    <section>
      <h2>${I.subway} 城市地铁线图</h2>
      <article class="${cardClass}">
        <figure class="metro-figure">
          <img src="${escapeHtml(assetUrl(guide.metro_map.image))}" alt="${escapeHtml(guide.metro_map.alt)}">
          <figcaption>${escapeHtml(guide.metro_map.caption)}</figcaption>
        </figure>
        ${pills((guide.metro_map.related_lines || []).map((line) => `${line}号线`))}
        <p class="detail">相关站点：${escapeHtml((guide.metro_map.related_stations || []).join(" / "))}</p>
        <p class="detail">${escapeHtml(guide.metro_map.disclaimer)}</p>
      </article>
    </section>`;
}

function bodyHtml(guide, mode) {
  const dayClass = mode === "html" ? "note-card" : mode === "poster" ? "card" : "day";
  const heroClass = mode === "html" ? "html-hero" : mode === "poster" ? "hero" : "cover";
  const overviewClass = mode === "html" ? "overview-grid" : "meta-grid";
  const dayGridOpen = mode === "html" ? `<div class="section-grid">` : "";
  const dayGridClose = mode === "html" ? `</div>` : "";
  return `
    <section class="${heroClass}">
      ${guide.cover && mode === "html" ? `<img class="cover-image" src="${escapeHtml(assetUrl(guide.cover.image))}" alt="${escapeHtml(guide.cover.alt)}">` : ""}
      <div class="eyebrow">${I.mapPin} ${escapeHtml(guide.city)} · ${escapeHtml(guide.last_checked)} 更新</div>
      <h1>${escapeHtml(guide.title)}</h1>
      <p class="subtitle">${escapeHtml(guide.subtitle)}</p>
      ${pills(guide.overview.best_for)}
      <div class="${overviewClass}">
        ${mode === "html"
          ? `<div class="overview-item"><span class="ov-icon ov-pace"></span><div class="label">节奏</div><div>${escapeHtml(guide.overview.pace)}</div></div>
             <div class="overview-item"><span class="ov-icon ov-budget"></span><div class="label">预算</div><div>${escapeHtml(guide.overview.budget_level)}</div></div>
             <div class="overview-item"><span class="ov-icon ov-route"></span><div class="label">路线逻辑</div><div>${escapeHtml(guide.overview.route_logic)}</div></div>`
          : `<div class="label">节奏</div><div>${escapeHtml(guide.overview.pace)}</div>
             <div class="label">预算</div><div>${escapeHtml(guide.overview.budget_level)}</div>
             <div class="label">路线逻辑</div><div>${escapeHtml(guide.overview.route_logic)}</div>`}
      </div>
    </section>
    <section class="section-itinerary">
      <h2>${I.mapPin} 每日路线</h2>
      ${dayGridOpen}
      ${guide.days.map((day) => `
        <article class="${mode === "html" ? "day-card" : dayClass}">
          <h3>${I.arrow} Day ${day.day} · ${escapeHtml(day.title)}</h3>
          <p class="detail">${escapeHtml(day.theme)}</p>
          ${day.segments.map(segmentHtml).join("")}
        </article>
      `).join("")}
      ${dayGridClose}
    </section>
    ${socialTrendHtml(guide, mode)}
    ${transportPlanHtml(guide, mode)}
    ${metroMapHtml(guide, mode)}
    <section>
      <h2>${I.umbrella} 交通与备选</h2>
      <p>${escapeHtml(guide.transport.main)}</p>
      ${pills(guide.transport.tips)}
      ${guide.backup_plans.map((item) => `
        <article class="${dayClass}">
          <h3>${escapeHtml(item.scenario)}</h3>
          <p>${escapeHtml(item.plan)}</p>
        </article>
      `).join("")}
    </section>`;
}

function renderTemplate(guide, templatePath, cssSourcePath, cssTargetPath, content, outputPath) {
  const template = fs.readFileSync(templatePath, "utf8");
  const html = template
    .replaceAll("{{title}}", escapeHtml(guide.title))
    .replace("{{content}}", content);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.copyFileSync(cssSourcePath, cssTargetPath);
  fs.writeFileSync(outputPath, html);
  return outputPath;
}

function renderHtml(guide) {
  return renderTemplate(
    guide,
    path.join(root, "layouts/html/guide.html"),
    path.join(root, "layouts/html/site.css"),
    path.join(root, "outputs/html/site.css"),
    bodyHtml(guide, "html"),
    path.join(root, "outputs/html", `${guide.slug}.html`)
  );
}

function renderPdfPreview(guide) {
  return renderTemplate(
    guide,
    path.join(root, "layouts/pdf/a4.html"),
    path.join(root, "layouts/pdf/print.css"),
    path.join(root, "outputs/pdf/print.css"),
    bodyHtml(guide, "pdf"),
    path.join(root, "outputs/pdf", `${guide.slug}-preview.html`)
  );
}

function renderImagePreview(guide) {
  return renderTemplate(
    guide,
    path.join(root, "layouts/image/poster.html"),
    path.join(root, "layouts/image/mobile.css"),
    path.join(root, "outputs/images/mobile.css"),
    bodyHtml(guide, "poster"),
    path.join(root, "outputs/images", `${guide.slug}-poster.html`)
  );
}

function relativeOutput(outputPath) {
  return path.relative(root, outputPath);
}

module.exports = {
  loadGuide,
  relativeOutput,
  renderHtml,
  renderImagePreview,
  renderPdfPreview
};
