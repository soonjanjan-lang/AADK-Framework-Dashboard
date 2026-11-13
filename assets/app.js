/* Kerangka SKUAD dashboard. All framework wording comes from window.KERANGKA (kerangka.json),
   the same file used to build the proposal, so the two always match. Data are synthetic. */
(function () {
  'use strict';
  var K = window.KERANGKA, D = window.DASH, T = window.I18N;
  var IND = {}; K.indicators.forEach(function (i) { IND[i.id] = i; });
  var LV = {}; K.levels.forEach(function (l) { LV[l.id] = l; });
  var DEC = { IN1: 2, IN2: 1, AC1: 3, AC2: 1, OP1: 1, OP2: 2, OP3: 1, OC1: 2, OC2: 1, OC3: 1, IM1: 2, IM2: 1, IM3: 1, VM1: 0, VM2: 2 };
  var SECTIONS = ['overview', 'p1', 'p2', 'p3', 'enablers', 'evidence'];
  var state = { lang: 'en', district: 'ALL', year: 2025, level: 'all', ind: 'IN1', step: 'S1', active: 'overview' };
  try { var saved = window.localStorage.getItem('kerangka-lang'); if (saved === 'en' || saved === 'bm') state.lang = saved; } catch (e) { /* storage unavailable */ }

  /* ------------------------------------------------------------ helpers */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function t(key, vars) {
    var s = (T[state.lang] && T[state.lang][key] != null) ? T[state.lang][key] : (T.en[key] != null ? T.en[key] : key);
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  }
  function L(o) { return o[state.lang] != null ? o[state.lang] : o.en; }
  function O(o) { return o[state.lang === 'en' ? 'bm' : 'en']; }
  function locale() { return state.lang === 'bm' ? 'ms-MY' : 'en-MY'; }
  function num(v, d) { return Number(v).toLocaleString(locale(), { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function fmt(id, v) {
    if (v == null || isNaN(v)) return '–';
    var u = IND[id].unit.en, n = num(v, DEC[id]);
    if (u === 'RM') return 'RM' + n;
    if (u === '%') return n + '%';
    if (u === 'ratio') return 'RM' + n;
    return n;
  }

  var ICONS = {
    info: '<circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16.5"/><circle cx="12" cy="7.6" r=".6" fill="currentColor"/>',
    on: '<circle cx="12" cy="12" r="9"/><polyline points="8 12.5 11 15.5 16 9.5"/>',
    close: '<path d="M12 4 21 19.5H3Z"/><line x1="12" y1="10" x2="12" y2="14"/><circle cx="12" cy="16.9" r=".6" fill="currentColor"/>',
    below: '<circle cx="12" cy="12" r="9"/><line x1="12" y1="7.5" x2="12" y2="16"/><polyline points="8.5 12.5 12 16 15.5 12.5"/>',
    above_cost: '<circle cx="12" cy="12" r="9"/><line x1="12" y1="16.5" x2="12" y2="8"/><polyline points="8.5 11.5 12 8 15.5 11.5"/>',
    none: '<circle cx="12" cy="12" r="9"/><line x1="8" y1="12" x2="16" y2="12"/>',
    up: '<line x1="12" y1="19" x2="12" y2="5"/><polyline points="6 11 12 5 18 11"/>',
    down: '<line x1="12" y1="5" x2="12" y2="19"/><polyline points="6 13 12 19 18 13"/>',
    arrowR: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="13 6 19 12 13 18"/>',
    loop: '<path d="M4 12a8 8 0 1 0 2.4-5.7"/><polyline points="4 4 4 8.5 8.5 8.5"/>',
    book: '<path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4Z"/><path d="M20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6Z"/>',
    house: '<path d="M4 20V10l8-6 8 6v10"/><path d="M9.5 20v-6h5v6"/>',
    ball: '<circle cx="12" cy="12" r="8"/><path d="M4 12h16"/><path d="M12 4c3.2 3 3.2 13 0 16"/><path d="M12 4c-3.2 3-3.2 13 0 16"/>',
    case: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2"/><path d="M3 13h18"/>',
    phone: '<rect x="7" y="3" width="10" height="18" rx="2"/><line x1="11" y1="17.5" x2="13" y2="17.5"/>',
    award: '<circle cx="12" cy="9" r="5"/><path d="M9 13.5 7.5 21 12 18.5 16.5 21 15 13.5"/>',
    learn: '<path d="M3 9.5 12 5l9 4.5-9 4.5Z"/><path d="M7 11.5v4.5c3 2 7 2 10 0v-4.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 14"/>',
    message: '<path d="M4 5h16v11H9l-5 4Z"/>',
    pillars: '<path d="M4 20h16"/><path d="M6 20v-8M10 20v-8M14 20v-8M18 20v-8"/><path d="M3 10 12 4l9 6Z"/>',
    bars: '<path d="M5 20v-8M12 20V5M19 20v-5"/>',
    people: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><path d="M16 5.5a3 3 0 0 1 0 5.6"/><path d="M17.5 15c2 .6 3.5 2.4 3.5 5"/>',
    coins: '<ellipse cx="12" cy="7" rx="7" ry="3"/><path d="M5 7v5c0 1.7 3.1 3 7 3s7-1.3 7-3V7"/><path d="M5 12v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>'
  };
  function icon(name, cls) { return '<svg class="icon' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + ICONS[name] + '</svg>'; }

  /* ------------------------------------------------------------ data */
  function districtLabel(code) {
    if (code === 'ALL') return t('all_districts');
    return t(code.indexOf('PLS') === 0 ? 'district_opt_pls' : 'district_opt', { code: code });
  }
  function valueOf(id, district, year) {
    var vals = D.rows.filter(function (r) { return r.y === year && (district === 'ALL' || r.d === district) && r[id] != null; })
      .map(function (r) { return r[id]; });
    if (!vals.length) return null;
    return vals.reduce(function (a, b) { return a + b; }, 0) / vals.length;
  }
  function statusOf(ind, v) {
    if (v == null) return 'none';
    var tg = ind.sim.target;
    if (ind.dir === 'down') return v <= tg ? 'on' : (v <= tg * 1.1 ? 'close' : 'above_cost');
    return v >= tg ? 'on' : (v >= tg * 0.9 ? 'close' : 'below');
  }
  function statusHTML(st) { return '<span class="status status--' + st + '">' + icon(st) + esc(t('status_' + st)) + '</span>'; }

  /* ------------------------------------------------------------ chrome: header, notice, map, footer */
  function renderChrome() {
    document.documentElement.lang = state.lang === 'bm' ? 'ms' : 'en';
    document.title = t('doc_title');
    $('[data-i18n="skip"]').textContent = t('skip');
    $('#page-title').textContent = K.title.bm;
    $('#page-sub').innerHTML = (state.lang === 'en' ? '<span class="sub-name">' + esc(K.title.en) + '</span><span class="sub-sep" aria-hidden="true"> · </span>' : '') + '<span class="sub-ctx">' + esc(t('subtitle')) + '</span>';
    $('#lang-group').setAttribute('aria-label', t('lang_group'));
    $$('.lang__btn').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === state.lang)); });
    $('#notice').innerHTML = icon('info') + '<span class="notice__long">' + esc(t('notice')) + '</span><span class="notice__short">' + esc(t('notice_short')) + '</span>';
    $('#map').setAttribute('aria-label', t('map_label'));
    var counts = { P1: K.indicators.length, P2: K.ladder.length + K.channels.length + K.partners.length + K.retention.length, P3: K.tiers.length + K.pathway.length };
    var extent = { P1: state.lang === 'bm' ? K.indicators.length + ' indikator' : K.indicators.length + ' indicators',
      P2: state.lang === 'bm' ? K.ladder.length + ' anak tangga · ' + K.channels.length + ' saluran · ' + K.partners.length + ' rakan kongsi' : K.ladder.length + ' rungs · ' + K.channels.length + ' channels · ' + K.partners.length + ' partners',
      P3: state.lang === 'bm' ? K.tiers.length + ' tahap · ' + K.pathway.length + ' langkah' : K.tiers.length + ' tiers · ' + K.pathway.length + ' steps' };
    var arrow = '<div class="map__arrow" aria-hidden="true"><svg viewBox="0 0 16 12"><polyline points="2 10 8 3 14 10" fill="none" stroke="currentColor" stroke-width="2"/></svg></div>';
    var h = '<p class="map__h">' + esc(t('map_label')) + '</p><p class="map__hint">' + esc(t('map_hint')) + '</p><div class="map__fig">';
    h += '<a class="mb mb--goal" href="#overview" data-target="overview"><span class="mb__t">' + esc(t('map_goal')) + '</span><span class="mb__s">' + esc(L(K.goal)) + '</span></a>' + arrow;
    K.pillars.forEach(function (p) {
      h += '<a class="mb mb--p mb--' + p.id + '" href="#' + p.id.toLowerCase() + '" data-target="' + p.id.toLowerCase() + '" style="--ext:' + (44 + counts[p.id] * 5) + 'px">' +
        '<span class="mb__row"><span class="mb__num">' + p.num + '</span><span><span class="mb__t">' + esc(p.bm) + '</span><span class="mb__short">' + esc(t('short_' + p.id)) + '</span>' +
        '<span class="mb__s">' + esc(state.lang === 'en' ? p.en : extent[p.id]) + '</span>' + (state.lang === 'en' ? '<span class="mb__s">' + esc(extent[p.id]) + '</span>' : '') + '</span></span></a>';
    });
    h += '<a class="mb mb--en" href="#enablers" data-target="enablers"><span class="mb__t">' + esc(t('map_enablers')) + ' (' + K.enablers.length + ')</span><span class="mb__s">' + esc(K.enablers.map(function (e) { return L(e); }).join(' · ')) + '</span></a>';
    h += '<a class="mb mb--ev" href="#evidence" data-target="evidence"><span class="mb__t">' + esc(t('map_evidence')) + ' (' + K.evidence.length + ')</span><span class="mb__s">' + esc(K.evidence.map(function (e) { return L(e); }).join(' · ')) + '</span></a>';
    h += '</div>';
    $('#map').innerHTML = h;
    $$('.mb', $('#map')).forEach(function (a) {
      a.addEventListener('click', function () {
        var id = a.getAttribute('href').slice(1);
        setTimeout(function () { var s = document.getElementById(id); if (s) { var hd = s.querySelector('h2'); (hd || s).focus({ preventScroll: true }); } }, 350);
      });
    });
    markActive(state.active);
    $('#footer').innerHTML = '<div class="footer__inner"><p><strong>' + esc(K.title.bm) + '</strong></p><p>' + esc(t('foot_1')) + '</p><p>' + esc(t('foot_2')) + '</p><p>' + esc(t('foot_3')) + '</p></div>';
  }
  function markActive(id) {
    state.active = id;
    $$('.mb', $('#map')).forEach(function (a) {
      var tgt = a.getAttribute('data-target');
      var on = tgt === id || (id === 'overview' && tgt === 'overview');
      if (a.classList.contains('mb--title')) on = false;
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    var rail = $('#map'), cur = $('.mb[aria-current="true"]', rail);
    if (!cur) return;
    if (window.matchMedia('(max-width: 980px)').matches) { cur.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'auto' }); return; }
    var top = cur.offsetTop, bottom = top + cur.offsetHeight;
    if (top < rail.scrollTop) rail.scrollTop = top - 12;
    else if (bottom > rail.scrollTop + rail.clientHeight) rail.scrollTop = bottom - rail.clientHeight + 12;
  }

  /* ------------------------------------------------------------ section header */
  function phead(kind, num, title, alt, id) {
    return '<div class="phead phead--' + kind + '"><span class="phead__num" aria-hidden="true">' + num + '</span><div><h2 id="' + id + '" tabindex="-1">' + esc(title) + '</h2>' +
      (alt ? '<p class="phead__en">' + esc(alt) + '</p>' : '') + '</div></div>';
  }
  function indChips(ids) {
    return '<div class="chips"><span class="chips__label">' + esc(t('measured_by')) + ':</span>' + ids.map(function (id) {
      return '<button type="button" class="chip" data-goto-ind="' + id + '" aria-label="' + esc(id + ': ' + L(IND[id])) + '">' + esc(id) + '</button>';
    }).join('') + '</div>';
  }

  /* ------------------------------------------------------------ overview */
  function renderOverview() {
    var h = '<h2 id="overview-h" tabindex="-1">' + esc(t('ov_h')) + '</h2><p class="lead">' + esc(t('ov_p')) + '</p>';
    var up = '<span class="fig__arrow" aria-hidden="true"><svg viewBox="0 0 16 12"><polyline points="2 10 8 3 14 10" fill="none" stroke="currentColor" stroke-width="2.25"/></svg></span>';
    h += '<div class="fig">';
    h += '<p class="fig__goal"><b>' + esc(t('goal')) + ':</b> ' + esc(L(K.goal)) + ' <span class="fig__alt" lang="' + (state.lang === 'en' ? 'ms' : 'en') + '">(' + esc(O(K.goal)) + ')</span></p>';
    h += '<div class="fig__arrows">' + up + up + up + '</div><div class="pband">';
    K.pillars.forEach(function (p) {
      h += '<div class="pcol pcol--' + p.id + '"><div class="pcol__head"><p class="pcol__name">' + p.num + '. ' + esc(p.bm) + '</p><p class="pcol__en">' + esc(p.en) + '</p></div>' +
        '<div class="pcol__body"><a class="btn" href="#' + p.id.toLowerCase() + '">' + esc(t('go_pillar', { n: p.num })) + icon('arrowR') + '</a></div></div>';
    });
    h += '</div>';
    h += '<a class="fig__band fig__band--en" href="#enablers"><b>' + esc(t('fig_enablers')) + ':</b> ' + esc(K.enablers.map(function (e) { return L(e); }).join(' \u00b7 ')) + '</a>';
    h += '<div class="fig__arrows fig__arrows--one">' + up + '</div>';
    h += '<a class="fig__band fig__band--ev" href="#evidence"><b>' + esc(t('fig_evidence')) + ':</b> ' + esc(K.evidence.map(function (e) { return L(e); }).join(' \u00b7 ')) + '</a>';
    h += '</div>';
    $('#overview').innerHTML = h;
  }

  /* ------------------------------------------------------------ pillar 1: scorecard */
  function renderP1() {
    var p = K.pillars[0];
    var h = phead('P1', 1, p.bm, p.en, 'p1-h') + '<p class="lead">' + esc(L(p.summary)) + '</p>';
    h += '<h3 id="scorecard-h">' + esc(t('p1_scorecard_h')) + '</h3><p class="muted">' + esc(t('p1_scorecard_p')) + '</p>';
    h += '<div class="controls"><div class="field"><label for="f-district">' + esc(t('district')) + '</label><select id="f-district">' +
      ['ALL'].concat(D.districts).map(function (d) { return '<option value="' + d + '"' + (d === state.district ? ' selected' : '') + '>' + esc(districtLabel(d)) + '</option>'; }).join('') +
      '</select></div><div class="field"><label for="f-year">' + esc(t('year')) + '</label><select id="f-year">' +
      D.years.slice().reverse().map(function (y) { return '<option value="' + y + '"' + (y === state.year ? ' selected' : '') + '>' + y + '</option>'; }).join('') +
      '</select></div><div class="field"><span class="field__label" id="lvl-label">' + esc(t('level')) + '</span><div class="seg" role="group" aria-labelledby="lvl-label">' +
      ['all'].concat(K.levels.map(function (l) { return l.id; })).map(function (id) {
        return '<button type="button" class="seg__btn" data-level="' + id + '" aria-pressed="' + (state.level === id) + '">' + esc(id === 'all' ? t('all_levels') : L(LV[id])) + '</button>';
      }).join('') + '</div></div></div>';
    h += '<p class="sc-cap" id="sc-cap-vis" aria-hidden="true"></p><div class="tablewrap" id="sc-wrap"><table class="sc" id="sc"><caption id="sc-cap" class="sr-only"></caption><colgroup><col class="c-ind"><col class="c-lvl"><col class="c-val"><col class="c-tgt"><col class="c-st"><col class="c-base"></colgroup>' +
      '<thead><tr><th scope="col">' + esc(t('th_indicator')) + '</th><th scope="col">' + esc(t('th_level')) + '</th><th scope="col" class="num" id="th-val"></th><th scope="col" class="num">' + esc(t('th_target')) + '</th><th scope="col">' + esc(t('th_status')) + '</th><th scope="col" class="num">' + esc(t('th_baseline')) + '</th></tr></thead><tbody>';
    K.indicators.forEach(function (i) {
      h += '<tr data-ind="' + i.id + '" data-level="' + i.level + '"><td><button type="button" class="rowbtn" data-ind="' + i.id + '" aria-controls="detail"><span class="rowbtn__name">' + esc(L(i)) + '</span><span class="rowbtn__meta">' + i.id + ' · ' + esc(i.unit.en === 'ratio' ? t('per_rm1') : L(i.unit)) + '</span></button></td>' +
        '<td class="c-lvl" data-label="' + esc(t('th_level')) + '">' + esc(L(LV[i.level])) + '</td><td class="num c-val" data-label=""><span class="v" data-cell="val"></span></td><td class="num c-tgt" data-label="' + esc(t('th_target')) + '"><span class="v" data-cell="tgt"></span></td><td class="c-st"><span class="v" data-cell="st"></span></td><td class="num c-base" data-label="' + esc(t('th_baseline')) + '"><span class="v" data-cell="base"></span></td></tr>';
    });
    h += '</tbody></table></div><p class="note">' + esc(t('target_note')) + '</p>';
    h += '<div class="detail" id="detail" tabindex="-1" aria-live="polite"></div>';
    $('#p1').innerHTML = h;
    $('#f-district').addEventListener('change', function (e) { state.district = e.target.value; updateScorecard(true); });
    $('#f-year').addEventListener('change', function (e) { state.year = Number(e.target.value); updateScorecard(true); });
    $$('.seg__btn', $('#p1')).forEach(function (b) { b.addEventListener('click', function () { state.level = b.getAttribute('data-level'); applyLevel(); }); });
    $$('.rowbtn', $('#p1')).forEach(function (b) { b.addEventListener('click', function () { selectInd(b.getAttribute('data-ind'), false); }); });
    applyLevel(); updateScorecard(false); renderDetail();
  }
  function applyLevel() {
    $$('.seg__btn', $('#p1')).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-level') === state.level)); });
    $$('#sc tbody tr').forEach(function (tr) { tr.hidden = !(state.level === 'all' || tr.getAttribute('data-level') === state.level); });
  }
  function updateScorecard(announce) {
    var tbl = $('#sc'); if (!tbl) return;
    $('#th-val').textContent = t('th_value', { year: state.year });
    $('#sc-cap').textContent = t('table_caption', { district: districtLabel(state.district), year: state.year });
    $('#sc-cap-vis').textContent = $('#sc-cap').textContent;
    $$('#sc td.c-val').forEach(function (td) { td.setAttribute('data-label', t('th_value', { year: state.year })); });
    var apply = function () {
      $$('#sc tbody tr').forEach(function (tr) {
        var id = tr.getAttribute('data-ind'), ind = IND[id];
        var v = valueOf(id, state.district, state.year), b = valueOf(id, state.district, 2019);
        $('[data-cell="val"]', tr).textContent = fmt(id, v);
        $('[data-cell="tgt"]', tr).textContent = fmt(id, ind.sim.target);
        $('[data-cell="st"]', tr).innerHTML = statusHTML(statusOf(ind, v));
        $('[data-cell="base"]', tr).textContent = fmt(id, b);
        tr.classList.toggle('is-sel', id === state.ind);
      });
      tbl.classList.remove('is-updating');
    };
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (announce && !reduce) { tbl.classList.add('is-updating'); setTimeout(apply, 120); } else apply();
    if (announce) { $('#live').textContent = t('showing', { district: districtLabel(state.district), year: state.year }); renderDetail(); }
  }
  function selectInd(id, scroll) {
    state.ind = id;
    if (state.level !== 'all' && IND[id].level !== state.level) { state.level = 'all'; applyLevel(); }
    $$('#sc tbody tr').forEach(function (tr) { tr.classList.toggle('is-sel', tr.getAttribute('data-ind') === id); });
    renderDetail();
    var det = $('#detail');
    if (scroll) { det.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); }
    det.focus({ preventScroll: !!scroll });
  }
  function renderDetail() {
    var ind = IND[state.ind], det = $('#detail'); if (!det) return;
    var dvText = ind.dv === 'DV1' ? t('dv1') : t('dv2');
    var h = '<div class="detail__head"><div><p class="detail__title">' + ind.id + ' · ' + esc(L(ind)) + '</p><p class="detail__alt" lang="' + (state.lang === 'en' ? 'ms' : 'en') + '">' + esc(O(ind)) + '</p></div>' +
      '<span class="note--dir">' + icon(ind.dir === 'down' ? 'down' : 'up') + esc(ind.dir === 'down' ? t('better_lower') : t('better_higher')) + '</span></div>';
    h += '<dl class="facts"><dt>' + esc(t('detail_def')) + '</dt><dd>' + esc(L(ind.def)) + '</dd><dt>' + esc(t('detail_source')) + '</dt><dd>' + esc(L(ind.source)) + '</dd>' +
      '<dt>' + esc(t('detail_freq')) + '</dt><dd>' + esc(L(ind.freq)) + '</dd><dt>' + esc(t('detail_outcome')) + '</dt><dd>' + esc(dvText) + '</dd><dt>' + esc(t('detail_skop')) + '</dt><dd>Skop 6 (' + ind.skop + ')</dd></dl>';
    h += '<p class="chart-cap">' + icon('info') + esc(t('trend_cap')) + '</p><div class="legend" id="trend-legend"></div><div class="chart" id="trend" tabindex="0" role="img"></div>';
    h += '<details class="nums"><summary>' + esc(t('show_numbers')) + '</summary><div class="tablewrap"><table><thead><tr><th scope="col">' + esc(t('year')) + '</th>' +
      (state.district !== 'ALL' ? '<th scope="col" class="num">' + esc(districtLabel(state.district)) + '</th>' : '') + '<th scope="col" class="num">' + esc(t('series_avg')) + '</th><th scope="col" class="num">' + esc(t('series_target')) + '</th></tr></thead><tbody>' +
      D.years.map(function (y) {
        return '<tr><th scope="row">' + y + '</th>' + (state.district !== 'ALL' ? '<td class="num">' + fmt(ind.id, valueOf(ind.id, state.district, y)) + '</td>' : '') + '<td class="num">' + fmt(ind.id, valueOf(ind.id, 'ALL', y)) + '</td><td class="num">' + fmt(ind.id, ind.sim.target) + '</td></tr>';
      }).join('') + '</tbody></table></div></details>';
    det.innerHTML = h;
    drawTrend();
  }

  /* ------------------------------------------------------------ charts (drawn at real pixel size so text stays 16px) */
  function niceTicks(lo, hi, n) {
    if (lo === hi) { lo = lo - 1; hi = hi + 1; }
    var span = hi - lo, step = Math.pow(10, Math.floor(Math.log10(span / n))), err = (span / n) / step;
    if (err >= 7.5) step *= 10; else if (err >= 3.5) step *= 5; else if (err >= 1.5) step *= 2;
    var a = Math.floor(lo / step) * step, b = Math.ceil(hi / step) * step, out = [];
    for (var v = a; v <= b + step / 2; v += step) out.push(Number(v.toFixed(10)));
    return out;
  }
  function svgEl(w, hgt, inner) { return '<svg width="' + w + '" height="' + hgt + '" viewBox="0 0 ' + w + ' ' + hgt + '" aria-hidden="true" focusable="false">' + inner + '</svg>'; }
  function drawTrend() {
    var box = $('#trend'); if (!box) return;
    var ind = IND[state.ind], W = Math.floor(box.clientWidth) || 300, H = W < 520 ? 280 : 300;
    var M = { l: W < 520 ? 64 : 84, r: W < 520 ? 16 : 120, t: 16, b: 40 };
    var years = D.years, sel = state.district !== 'ALL';
    var avg = years.map(function (y) { return valueOf(ind.id, 'ALL', y); });
    var dis = sel ? years.map(function (y) { return valueOf(ind.id, state.district, y); }) : null;
    var all = avg.concat(dis || []).concat([ind.sim.target]).filter(function (v) { return v != null; });
    var ticks = niceTicks(Math.min.apply(null, all), Math.max.apply(null, all), 4);
    var y0 = ticks[0], y1 = ticks[ticks.length - 1];
    var X = function (i) { return M.l + (W - M.l - M.r) * (i / (years.length - 1)); };
    var Y = function (v) { return M.t + (H - M.t - M.b) * (1 - (v - y0) / (y1 - y0)); };
    var g = '';
    ticks.forEach(function (tk) { g += '<line x1="' + M.l + '" x2="' + (W - M.r) + '" y1="' + Y(tk) + '" y2="' + Y(tk) + '" stroke="#E1E5EC" stroke-width="1"/><text x="' + (M.l - 10) + '" y="' + (Y(tk) + 5) + '" text-anchor="end">' + esc(fmt(ind.id, tk)) + '</text>'; });
    years.forEach(function (yr, i) { if (W >= 520 || i % 2 === 0) g += '<text x="' + X(i) + '" y="' + (H - 12) + '" text-anchor="middle">' + yr + '</text>'; });
    g += '<line x1="' + M.l + '" x2="' + (W - M.r) + '" y1="' + (H - M.b) + '" y2="' + (H - M.b) + '" stroke="#9AA6B8" stroke-width="1"/>';
    var tY = Y(ind.sim.target);
    g += '<line x1="' + M.l + '" x2="' + (W - M.r) + '" y1="' + tY + '" y2="' + tY + '" stroke="#1F3864" stroke-width="2" stroke-dasharray="2 5" stroke-linecap="round"/>';
    var line = function (vals, color, dash, wdt) {
      var d = '', pts = '';
      vals.forEach(function (v, i) { if (v == null) return; d += (d ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1); pts += '<circle cx="' + X(i) + '" cy="' + Y(v) + '" r="4.5" fill="' + color + '" stroke="#fff" stroke-width="2"/>'; });
      return '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="' + wdt + '" stroke-linejoin="round" stroke-linecap="round"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + '/>' + pts;
    };
    g += line(avg, '#5B6576', sel ? '7 5' : null, 2.5);
    if (sel) g += line(dis, '#1F5FAD', null, 3);
    if (W >= 520) {
      var last = years.length - 1, labels = [{ v: ind.sim.target, txt: t('series_target'), c: '#1F3864' }, { v: avg[last], txt: t('avg_short'), c: '#5B6576' }];
      if (sel) labels.push({ v: dis[last], txt: state.district, c: '#1F5FAD' });
      labels = labels.filter(function (l) { return l.v != null; }).sort(function (a, b) { return Y(a.v) - Y(b.v); });
      var lastY = -999;
      labels.forEach(function (l) { var yy = Math.max(Y(l.v) + 5, lastY + 20); lastY = yy; g += '<text class="lbl" x="' + (W - M.r + 10) + '" y="' + yy + '" fill="' + l.c + '" style="fill:' + l.c + '">' + esc(l.txt) + '</text>'; });
    }
    g += '<line id="xh" x1="0" x2="0" y1="' + M.t + '" y2="' + (H - M.b) + '" stroke="#1F3864" stroke-width="1" opacity="0"/>';
    box.innerHTML = svgEl(W, H, g) + '<div class="tip" hidden></div>';
    box.setAttribute('aria-label', t('trend_h') + ': ' + L(ind) + '. ' + years.map(function (y, i) { return y + ' ' + fmt(ind.id, sel ? dis[i] : avg[i]); }).join(', ') + '. ' + t('series_target') + ' ' + fmt(ind.id, ind.sim.target) + '.');
    var sw = function (dash, c, w) { return '<svg viewBox="0 0 32 12" aria-hidden="true"><line x1="1" y1="6" x2="31" y2="6" stroke="' + c + '" stroke-width="' + w + '"' + (dash ? ' stroke-dasharray="' + dash + '"' : '') + ' stroke-linecap="round"/></svg>'; };
    $('#trend-legend').innerHTML = (sel ? '<span class="legend__item">' + sw(null, '#1F5FAD', 3) + esc(districtLabel(state.district)) + '</span>' : '') +
      '<span class="legend__item">' + sw(sel ? '7 5' : null, '#5B6576', 2.5) + esc(t('series_avg')) + '</span><span class="legend__item">' + sw('2 5', '#1F3864', 2) + esc(t('series_target')) + '</span>';
    var tip = $('.tip', box), xh = $('#xh', box), idx = years.length - 1;
    var show = function (i) {
      idx = Math.max(0, Math.min(years.length - 1, i));
      xh.setAttribute('x1', X(idx)); xh.setAttribute('x2', X(idx)); xh.setAttribute('opacity', '.5');
      tip.hidden = false;
      tip.innerHTML = '<b>' + years[idx] + '</b><br>' + (sel ? esc(state.district) + ': ' + fmt(ind.id, dis[idx]) + '<br>' : '') + esc(t('series_avg')) + ': ' + fmt(ind.id, avg[idx]) + '<br>' + esc(t('series_target')) + ': ' + fmt(ind.id, ind.sim.target);
      var v = sel ? dis[idx] : avg[idx];
      tip.style.left = Math.min(Math.max(X(idx), 110), W - 110) + 'px'; tip.style.top = (v == null ? M.t + 40 : Y(v)) + 'px';
    };
    var hide = function () { tip.hidden = true; xh.setAttribute('opacity', '0'); };
    box.onmousemove = function (e) { var r = box.getBoundingClientRect(); var x = e.clientX - r.left; show(Math.round((x - M.l) / ((W - M.l - M.r) / (years.length - 1)))); };
    box.onmouseleave = hide; box.onblur = hide; box.onfocus = function () { show(idx); };
    box.onkeydown = function (e) { if (e.key === 'ArrowRight') { show(idx + 1); e.preventDefault(); } else if (e.key === 'ArrowLeft') { show(idx - 1); e.preventDefault(); } else if (e.key === 'Escape') hide(); };
  }
  function linfit(xs, ys, ws) {
    var sw = 0, sx = 0, sy = 0, sxx = 0, sxy = 0;
    xs.forEach(function (x, i) { var w = ws[i]; sw += w; sx += w * x; sy += w * ys[i]; sxx += w * x * x; sxy += w * x * ys[i]; });
    var b = (sw * sxy - sx * sy) / (sw * sxx - sx * sx), a = (sy - b * sx) / sw; return function (x) { return a + b * x; };
  }
  function drawRD() {
    var box = $('#rd'); if (!box) return;
    var bins = D.rd_bins.filter(function (b) { return Math.abs(b.mid) <= 24; });
    var W = Math.floor(box.clientWidth) || 300, H = 320, M = { l: 56, r: 16, t: 58, b: 46 };
    var xs = bins.map(function (b) { return b.mid; }), ys = bins.map(function (b) { return b.relapse * 100; });
    var ticks = niceTicks(Math.min.apply(null, ys) - 2, Math.max.apply(null, ys) + 2, 4), y0 = ticks[0], y1 = ticks[ticks.length - 1];
    var X = function (x) { return M.l + (W - M.l - M.r) * ((x + 25) / 50); }, Y = function (v) { return M.t + (H - M.t - M.b) * (1 - (v - y0) / (y1 - y0)); };
    var g = '';
    ticks.forEach(function (tk) { g += '<line x1="' + M.l + '" x2="' + (W - M.r) + '" y1="' + Y(tk) + '" y2="' + Y(tk) + '" stroke="#E1E5EC"/><text x="' + (M.l - 8) + '" y="' + (Y(tk) + 5) + '" text-anchor="end">' + tk + '%</text>'; });
    [-24, -12, 0, 12, 24].forEach(function (x) { g += '<text x="' + X(x) + '" y="' + (H - 18) + '" text-anchor="middle">' + (x > 0 ? '+' + x : x) + '</text>'; });
    g += '<line x1="' + X(0) + '" x2="' + X(0) + '" y1="' + (M.t - 28) + '" y2="' + (H - M.b) + '" stroke="#5B6576" stroke-width="1.5" stroke-dasharray="5 4"/>';
    g += '<text x="' + X(0) + '" y="' + (M.t - 36) + '" text-anchor="middle" class="lbl">' + esc(t('rd_start')) + '</text>';
    [[function (x) { return x < 0; }, -24, 0], [function (x) { return x >= 0; }, 0, 24]].forEach(function (side) {
      var px = [], py = [], pw = [];
      bins.forEach(function (b) { if (side[0](b.mid)) { px.push(b.mid); py.push(b.relapse * 100); pw.push(Math.sqrt(b.n)); } });
      var f = linfit(px, py, pw);
      g += '<line x1="' + X(side[1]) + '" y1="' + Y(f(side[1])) + '" x2="' + X(side[2]) + '" y2="' + Y(f(side[2])) + '" stroke="#1F3864" stroke-width="3" stroke-linecap="round"/>';
    });
    bins.forEach(function (b) { g += '<circle cx="' + X(b.mid) + '" cy="' + Y(b.relapse * 100) + '" r="5" fill="#1F3864" fill-opacity=".8" stroke="#fff" stroke-width="2"/>'; });
    g += '<text x="' + X(-12) + '" y="' + (M.t - 10) + '" text-anchor="middle">' + esc(t('rd_before')) + '</text><text x="' + X(12) + '" y="' + (M.t - 10) + '" text-anchor="middle">' + esc(t('rd_after')) + '</text>';
    box.innerHTML = svgEl(W, H, g);
    box.setAttribute('aria-label', t('rd_axis_y') + ' / ' + t('rd_axis_x') + '. ' + t('rd_p'));
  }

  /* ------------------------------------------------------------ pillar 2 */
  function renderP2() {
    var p = K.pillars[1];
    var h = phead('P2', 2, p.bm, p.en, 'p2-h') + '<p class="lead">' + esc(L(p.summary)) + '</p>';
    h += '<h3>' + esc(t('p2_ladder_h')) + '</h3><p class="muted">' + esc(t('p2_ladder_p')) + '</p><p class="updir">' + icon('up') + esc(L(K.ladder[0]) + ' → ' + L(K.ladder[K.ladder.length - 1])) + '</p>';
    h += '<ol class="ladder" reversed>';
    K.ladder.slice().reverse().forEach(function (r, k) {
      var n = K.ladder.length - k;
      h += '<li class="rung"><span class="rung__step" aria-hidden="true">' + n + '</span><div class="rung__body"><p class="rung__name">' + esc(r.bm) + '<span class="rung__alt">' + esc(r.en) + '</span></p><p class="rung__desc">' + esc(L(r.desc)) + '</p>' + indChips(r.indicators) + '</div></li>';
    });
    h += '</ol>';
    var chIcons = ['book', 'house', 'ball', 'case', 'phone'];
    h += '<h3>' + esc(t('p2_channels_h')) + '</h3><ul class="list">' + K.channels.map(function (c, i) { return '<li>' + icon(chIcons[i]) + '<span>' + esc(L(c)) + '</span></li>'; }).join('') + '</ul>';
    h += '<h3>' + esc(t('p2_partners_h')) + '</h3><div class="tablewrap"><table class="ptable"><thead><tr><th scope="col">' + esc(t('th_partner')) + '</th><th scope="col">' + esc(t('th_role')) + '</th></tr></thead><tbody>' +
      K.partners.map(function (pa) { return '<tr><td>' + esc(L(pa)) + '</td><td>' + esc(L(pa.role)) + '</td></tr>'; }).join('') + '</tbody></table></div>';
    var rIcons = ['award', 'learn', 'clock', 'message'];
    h += '<h3>' + esc(t('p2_keep_h')) + '</h3><ul class="list">' + K.retention.map(function (r, i) { return '<li>' + icon(rIcons[i]) + '<span>' + esc(L(r)) + '</span></li>'; }).join('') + '</ul>';
    $('#p2').innerHTML = h;
  }

  /* ------------------------------------------------------------ pillar 3 */
  function renderP3() {
    var p = K.pillars[2];
    var h = phead('P3', 3, p.bm, p.en, 'p3-h') + '<p class="lead">' + esc(L(p.summary)) + '</p>';
    h += '<h3>' + esc(t('p3_tiers_h')) + '</h3><p class="muted">' + esc(t('p3_tiers_p')) + '</p><div class="tiers">';
    K.tiers.forEach(function (tr) {
      h += '<div class="tier"><p class="tier__name">' + (state.lang === 'bm' ? 'Tahap ' : 'Tier ') + tr.num + ': ' + esc(L(tr)) + '<span class="tier__alt">(' + esc(O(tr)) + ')</span></p>' +
        '<p class="tier__row"><b>' + esc(t('who')) + ':</b> ' + esc(L(tr.who)) + '</p><p class="tier__row"><b>' + esc(t('what')) + ':</b> ' + esc(L(tr.what)) + '</p>' + indChips(tr.indicators) + '</div>';
    });
    h += '</div><h3>' + esc(t('p3_path_h')) + '</h3><p class="muted">' + esc(t('p3_path_p')) + '</p><ol class="path">';
    K.pathway.forEach(function (s, i) {
      h += '<li><button type="button" class="stepbtn" data-step="' + s.id + '" aria-pressed="' + (state.step === s.id) + '" aria-controls="stepbox"><span class="stepbtn__n">' + esc(t('step_n', { n: i + 1 })) + '</span><span class="stepbtn__name">' + esc(L(s)) + '</span></button></li>';
    });
    h += '</ol><div class="stepbox" id="stepbox" aria-live="polite"></div><p class="loop">' + icon('loop') + '<span>' + esc(t('loop_note')) + '</span></p>';
    $('#p3').innerHTML = h;
    $$('.stepbtn', $('#p3')).forEach(function (b) { b.addEventListener('click', function () { state.step = b.getAttribute('data-step'); renderStep(); }); });
    renderStep();
  }
  function renderStep() {
    var s = K.pathway.filter(function (x) { return x.id === state.step; })[0], i = K.pathway.indexOf(s);
    $$('.stepbtn', $('#p3')).forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-step') === state.step)); });
    $('#stepbox').innerHTML = '<p class="stepbox__lead"><b>' + esc(t('step_n', { n: i + 1 })) + ': ' + esc(L(s)) + '</b> (' + esc(O(s)) + ') · ' + esc(t('lead')) + ': <b>' + esc(L(s.lead)) + '</b></p><p class="stepbox__desc">' + esc(L(s.desc)) + '</p>';
  }

  /* ------------------------------------------------------------ enablers + evidence */
  function renderEnablers() {
    var enIcons = ['pillars', 'bars', 'people', 'coins'];
    var h = phead('EN', icon('pillars'), t('en_h'), state.lang === 'en' ? 'Pemboleh daya merentas' : 'Cross-cutting enablers', 'enablers-h') + '<p class="lead">' + esc(t('en_p')) + '</p><ul class="ens">';
    K.enablers.forEach(function (e, i) { h += '<li>' + icon(enIcons[i]) + '<div><p class="ens__name">' + esc(L(e)) + '</p><p class="ens__alt">' + esc(O(e)) + '</p><p class="ens__desc">' + esc(L(e.desc)) + '</p></div></li>'; });
    h += '</ul>';
    $('#enablers').innerHTML = h;
  }
  function renderEvidence() {
    var evIcons = ['target', 'coins', 'message'], c = D.calc_defaults;
    var h = phead('EV', icon('target'), t('ev_h'), state.lang === 'en' ? 'Asas bukti dan nilai untuk wang' : 'Evidence base and value for money', 'evidence-h') + '<p class="lead">' + esc(t('ev_p')) + '</p><ul class="evs">';
    K.evidence.forEach(function (e, i) { h += '<li>' + icon(evIcons[i]) + '<p class="evs__name">' + esc(L(e)) + '</p><p class="evs__alt">' + esc(O(e)) + '</p><p class="evs__desc">' + esc(L(e.desc)) + '</p></li>'; });
    h += '</ul><h3>' + esc(t('rd_h')) + '</h3><div class="split"><div><p>' + esc(t('rd_p')) + '</p><p class="note" style="margin-top:.75rem">' + esc(t('rd_note')) + '</p></div><div class="chart" id="rd" role="img"></div></div>';
    var fields = [['clients', 'calc_clients', c.clients, 1], ['effect', 'calc_effect', c.effect_pp, 0.1], ['avoided', 'calc_avoided', c.avoided_cost, 100], ['work', 'calc_work', c.extra_work_pp, 0.1], ['wage', 'calc_wage', c.annual_wage, 100], ['cost', 'calc_cost', c.cost, 1000]];
    h += '<h3>' + esc(t('calc_h')) + '</h3><p class="muted">' + esc(t('calc_p')) + '</p><div class="calc"><form class="calc__form" id="calc" novalidate>' +
      fields.map(function (f) { return '<div class="field"><label for="c-' + f[0] + '">' + esc(t(f[1])) + '</label><input type="number" inputmode="decimal" min="0" step="' + f[3] + '" id="c-' + f[0] + '" value="' + f[2] + '" aria-describedby="e-' + f[0] + '"><p class="field__err" id="e-' + f[0] + '" hidden>' + esc(t('calc_invalid')) + '</p></div>'; }).join('') +
      '</form><dl class="results" aria-live="polite"><div><dt>' + esc(t('out_extra')) + '</dt><dd id="o-extra"></dd></div><div><dt>' + esc(t('out_cost_per')) + '</dt><dd id="o-cpe"></dd></div><div><dt>' + esc(t('out_bcr')) + '</dt><dd id="o-bcr"></dd></div></dl></div>';
    $('#evidence').innerHTML = h;
    $('#calc').addEventListener('input', calc);
    $('#calc').addEventListener('submit', function (e) { e.preventDefault(); });
    drawRD(); calc();
  }
  function calc() {
    var ids = ['clients', 'effect', 'avoided', 'work', 'wage', 'cost'], v = {}, ok = true;
    ids.forEach(function (id) {
      var el = $('#c-' + id), x = el.value === '' ? NaN : Number(el.value), bad = !(x >= 0);
      $('#e-' + id).hidden = !bad; el.setAttribute('aria-invalid', String(bad)); if (bad) ok = false; v[id] = x;
    });
    if (!ok) { ['o-extra', 'o-cpe', 'o-bcr'].forEach(function (id) { $('#' + id).textContent = '–'; }); return; }
    var extra = v.clients * v.effect / 100, benefit = extra * v.avoided + v.clients * v.work / 100 * v.wage;
    $('#o-extra').textContent = num(extra, 0);
    $('#o-cpe').textContent = extra > 0 ? 'RM' + num(v.cost / extra, 0) : '–';
    $('#o-bcr').textContent = v.cost > 0 ? 'RM' + num(benefit / v.cost, 2) : '–';
  }

  /* ------------------------------------------------------------ global wiring */
  function renderAll() {
    renderChrome(); renderOverview(); renderP1(); renderP2(); renderP3(); renderEnablers(); renderEvidence();
    $$('[data-goto-ind]').forEach(function (b) { b.addEventListener('click', function () { selectInd(b.getAttribute('data-goto-ind'), true); }); });
  }
  $$('.lang__btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var lang = b.getAttribute('data-lang'); if (lang === state.lang) return;
      state.lang = lang; try { window.localStorage.setItem('kerangka-lang', lang); } catch (e) { /* ignore */ }
      var y = window.scrollY; renderAll(); window.scrollTo(0, y); b.focus();
    });
  });
  renderAll();
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) markActive(en.target.getAttribute('data-section')); });
    }, { rootMargin: '-35% 0px -60% 0px', threshold: 0 });
    SECTIONS.forEach(function (id) { io.observe(document.getElementById(id)); });
  }
  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { drawTrend(); drawRD(); }, 150); });
})();
