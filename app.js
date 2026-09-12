"use strict";

// La parrilla y el proveedor de vídeo están aislados aquí para facilitar el cambio a MP4 o HLS.
const TIME_ZONE = "Europe/Madrid";
const CHANNELS = {
  cnt: { name: "CNT", color: "#fec601", logo: "assets/cnt-logo.png", type: "Generalista", programmed: true },
  weazel: { name: "Weazel", color: "#cf0000", logo: "assets/weazel-logo.png", type: "Segundo generalista" },
  comedy: { name: "Comedy TV", color: "#2475ba", logo: "assets/comedy-tv-logo.png", type: "Comedia" },
  metv: { name: "MeTV", color: "#44cafe", logo: "assets/metv-logo.png", type: "Música" },
  canyon: { name: "The Canyon Channel", color: "#843600", logo: "assets/canyon-logo.png", type: "Cine y películas" },
  emotion: { name: "Emotion", color: "#af087c", logo: "assets/emotion-logo.png", type: "Entretenimiento" }
};
const CATALOG = window.CONTENT_CATALOG;
const SCHEDULES = window.CHANNEL_SCHEDULES;
const CNT_SCHEDULE = SCHEDULES.cnt;
const BROADCAST_DAY_START = 6 * 3600;

// Cambiar a "html5" cuando los archivos estén alojados en un servidor con streaming por rangos.
const VIDEO_PROVIDER = "drive";
const html5Sources = {};

const $ = (id) => document.getElementById(id);
const timeFormatter = new Intl.DateTimeFormat("es-ES", {
  timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
});
const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit"
});
let loadedKey = "";
let awaitingDriveClick = false;
let guideKey = "";
let guideWindowStart = 0;
let controlsTimer;
let activeChannel = "cnt";
const logoVersion = Date.now();

function madridParts(date = new Date()) {
  const parts = Object.fromEntries(timeFormatter.formatToParts(date).map(p => [p.type, p.value]));
  const dateParts = Object.fromEntries(dateFormatter.formatToParts(date).map(p => [p.type, p.value]));
  return {
    seconds: Number(parts.hour) * 3600 + Number(parts.minute) * 60 + Number(parts.second),
    day: Math.floor(Date.UTC(Number(dateParts.year), Number(dateParts.month) - 1, Number(dateParts.day)) / 86400000)
  };
}

function parseClock(value) {
  return value.split(":").reduce((total, part) => total * 60 + Number(part), 0);
}

function buildDayEvents(day) {
  const rotation = CNT_SCHEDULE.rotations[((day % CNT_SCHEDULE.rotations.length) + CNT_SCHEDULE.rotations.length) % CNT_SCHEDULE.rotations.length];
  const blocks = [...CNT_SCHEDULE.blocks, rotation].sort((a, b) => parseClock(a.start) - parseClock(b.start));
  const programs = [];
  blocks.forEach((block) => {
    let cursor = parseClock(block.start);
    block.items.forEach((id) => {
      const item = CATALOG[id];
      if (!item || !Number.isFinite(item.duration)) return;
      programs.push({ type: "program", item: { id, ...item }, start: cursor, end: cursor + item.duration, block: block.label });
      cursor += item.duration;
    });
  });

  const events = [];
  const usedFillers = new Set();
  let fillerCursor = ((day % CNT_SCHEDULE.fillers.length) + CNT_SCHEDULE.fillers.length) % CNT_SCHEDULE.fillers.length;

  const fillGap = (start, end) => {
    let cursor = start;
    while (cursor < end) {
      const remaining = end - cursor;
      let selectedIndex = -1;
      for (let step = 0; step < CNT_SCHEDULE.fillers.length; step++) {
        const index = (fillerCursor + step) % CNT_SCHEDULE.fillers.length;
        const id = CNT_SCHEDULE.fillers[index];
        const item = CATALOG[id];
        if (!usedFillers.has(id) && item && item.duration <= remaining) {
          selectedIndex = index;
          break;
        }
      }
      if (selectedIndex < 0) break;
      const id = CNT_SCHEDULE.fillers[selectedIndex];
      const item = CATALOG[id];
      events.push({ type: "filler", item: { id, ...item }, start: cursor, end: cursor + item.duration, guideStart: start, guideEnd: end });
      usedFillers.add(id);
      fillerCursor = (selectedIndex + 1) % CNT_SCHEDULE.fillers.length;
      cursor += item.duration;
    }
    if (cursor < end) events.push({ type: "pause", start: cursor, end, guideStart: start, guideEnd: end });
  };

  programs.forEach((program, index) => {
    events.push(program);
    const next = programs[index + 1];
    if (next && next.start > program.end) fillGap(program.end, next.start);
  });
  const last = programs.at(-1);
  const nextDayStart = 86400 + BROADCAST_DAY_START;
  if (last && last.end < nextDayStart) events.push({ type: "offair", start: last.end, end: nextDayStart });
  return events.sort((a, b) => a.start - b.start);
}

function broadcastState(now = new Date()) {
  const madrid = madridParts(now);
  const day = madrid.seconds < BROADCAST_DAY_START ? madrid.day - 1 : madrid.day;
  const position = madrid.seconds < BROADCAST_DAY_START ? madrid.seconds + 86400 : madrid.seconds;
  const events = buildDayEvents(day);
  const index = events.findIndex((event) => position >= event.start && position < event.end);
  const event = events[Math.max(0, index)];
  const nextProgram = events.slice(Math.max(0, index) + 1).find(candidate => candidate.type === "program") || buildDayEvents(day + 1).find(candidate => candidate.type === "program");
  return { onAir: event?.type === "program" || event?.type === "filler", event, index, events, day, position, nextProgram };
}

function formatDuration(seconds) {
  const safe = Math.max(0, Math.floor(seconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  return hours ? `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}` : `${minutes}:${String(secs).padStart(2, "0")}`;
}

function clockFromSeconds(seconds) {
  const normalized = ((seconds % 86400) + 86400) % 86400;
  return `${String(Math.floor(normalized / 3600)).padStart(2, "0")}:${String(Math.floor((normalized % 3600) / 60)).padStart(2, "0")}`;
}

function renderAgeRating(rating) {
  const badge = $("age-badge");
  if (!rating) {
    badge.hidden = true;
    return;
  }
  const normalized = String(rating).toUpperCase().replace("+", "");
  badge.className = `age-badge rating-${normalized.toLowerCase()}`;
  badge.textContent = normalized === "TP" ? "TP" : `+${normalized}`;
  badge.setAttribute("aria-label", normalized === "TP" ? "Apto para todos los públicos" : `No recomendado para menores de ${normalized} años`);
  badge.hidden = false;
}

function renderPlayer(item, offset, key) {
  if (loadedKey === key) return;
  loadedKey = key;
  const stage = $("player-stage");
  stage.replaceChildren();
  $("channel-bug").hidden = true;
  awaitingDriveClick = false;
  document.querySelector(".player-lock").classList.remove("is-open");
  $("sound-help").classList.remove("is-retry", "is-pass-through");
  $("sound-help").textContent = "Iniciar vídeo";

  if (VIDEO_PROVIDER === "html5" && html5Sources[item.driveId]) {
    const video = document.createElement("video");
    video.src = html5Sources[item.driveId];
    video.autoplay = true;
    video.playsInline = true;
    video.controls = false;
    video.setAttribute("controlsList", "nodownload noplaybackrate");
    video.addEventListener("loadedmetadata", () => { video.currentTime = offset; video.play().catch(() => $("sound-help").hidden = false); }, { once: true });
    video.addEventListener("playing", () => { $("channel-bug").hidden = false; });
    stage.append(video);
    $("drive-note").hidden = true;
  } else {
    const iframe = document.createElement("iframe");
    const start = Math.max(0, Math.floor(offset));
    iframe.src = `https://drive.google.com/file/d/${item.driveId}/preview?autoplay=1&start=${start}#t=${start}s`;
    iframe.title = `En directo: ${item.title}`;
    iframe.allow = "autoplay; fullscreen";
    iframe.allowFullscreen = true;
    iframe.tabIndex = 0;
    stage.append(iframe);
    $("drive-note").hidden = false;
    document.querySelector(".player-lock").classList.add("is-open");
    $("sound-help").classList.add("is-pass-through");
    $("sound-help").hidden = false;
    awaitingDriveClick = true;
  }
}

function renderProgramGuide(state) {
  const viewport = $("program-guide-scroll");
  const hourWidth = Math.max(160, viewport.clientWidth / 1.5);
  const nowSeconds = state.day * 86400 + state.position;
  const current = state.event;
  const currentGuideStart = current.guideStart ?? current.start;
  const key = `${state.day}-${currentGuideStart}-${current.type === "filler" ? "pause" : current.type}`;
  if (guideKey === key) {
    $("guide-now-line").style.left = `${((nowSeconds - guideWindowStart) / 3600) * hourWidth}px`;
    return;
  }
  guideKey = key;
  guideWindowStart = state.day * 86400 + currentGuideStart;
  const nominalEnd = guideWindowStart + 86400;
  const allEvents = [state.day, state.day + 1, state.day + 2].flatMap((day) =>
    buildDayEvents(day).map((event) => ({ ...event, absoluteStart: day * 86400 + event.start, absoluteEnd: day * 86400 + event.end }))
  );
  const guideEvents = allEvents.reduce((result, event) => {
    const normalized = event.type === "filler" ? { ...event, type: "pause" } : event;
    const previous = result.at(-1);
    if (previous && previous.type === "pause" && normalized.type === "pause" && previous.absoluteEnd === normalized.absoluteStart) {
      previous.absoluteEnd = normalized.absoluteEnd;
    } else {
      result.push({ ...normalized });
    }
    return result;
  }, []);
  const instances = guideEvents.filter(event => event.absoluteEnd > guideWindowStart && event.absoluteStart < nominalEnd);
  const lastVisible = instances.at(-1);
  const extendedEnd = Math.max(nominalEnd, lastVisible?.absoluteEnd || nominalEnd);

  const timelineWidth = ((extendedEnd - guideWindowStart) / 3600) * hourWidth;
  $("guide-now-line").style.left = `${((nowSeconds - guideWindowStart) / 3600) * hourWidth}px`;
  const track = $("program-guide-track");
  const scale = $("hour-scale");
  const timeline = $("guide-timeline");
  const fragment = document.createDocumentFragment();
  const hourFragment = document.createDocumentFragment();
  timeline.style.width = `${timelineWidth}px`;
  timeline.style.setProperty("--hour-width", `${hourWidth}px`);

  const currentMark = document.createElement("span");
  currentMark.className = "hour-mark is-now";
  currentMark.style.left = "0px";
  currentMark.textContent = clockFromSeconds(guideWindowStart);
  hourFragment.append(currentMark);

  const firstFullHour = (Math.floor(guideWindowStart / 3600) + 1) * 3600;
  for (let hourTime = firstFullHour; hourTime < extendedEnd; hourTime += 3600) {
    const mark = document.createElement("span");
    mark.className = "hour-mark";
    mark.style.left = `${((hourTime - guideWindowStart) / 3600) * hourWidth}px`;
    mark.textContent = `${Math.floor((hourTime % 86400) / 3600)}:00`;
    hourFragment.append(mark);
  }

  instances.forEach((event) => {
      const programStart = event.absoluteStart;
      const programEnd = event.absoluteEnd;
      const visibleDuration = programEnd - programStart;
      const row = document.createElement("article");
      const time = document.createElement("time");
      const title = document.createElement("strong");
      const isCurrent = nowSeconds >= programStart && nowSeconds < programEnd;
      row.className = `guide-item${isCurrent ? " is-current" : ""}${event.type !== "program" ? " is-pause" : ""}`;
      row.setAttribute("role", "listitem");
      const isEmptyPause = event.type === "pause";
      const itemTitle = event.type === "program" ? event.item.title : event.type === "offair" ? "Fin de emisión" : "";
      row.title = isEmptyPause ? "Pausa de emisión" : `${clockFromSeconds(programStart)} · ${itemTitle}`;
      if (isEmptyPause) row.setAttribute("aria-label", "Pausa de emisión");
      row.style.left = `${((programStart - guideWindowStart) / 3600) * hourWidth}px`;
      row.style.width = `${Math.max(2, (visibleDuration / 3600) * hourWidth - 2)}px`;
      if (!isEmptyPause) {
        time.textContent = clockFromSeconds(programStart);
        title.textContent = itemTitle;
        row.append(time, title);
      }
      fragment.append(row);
  });
  scale.replaceChildren(hourFragment);
  track.replaceChildren(fragment);
  requestAnimationFrame(() => {
    viewport.scrollTo({ left: 0, behavior: "smooth" });
  });
}

function renderIntermission(state, key) {
  if (loadedKey !== key) {
    loadedKey = key;
    awaitingDriveClick = false;
    const isOffAir = state.event.type === "offair";
    const stage = $("player-stage");
    stage.replaceChildren();
    const card = document.createElement("div");
    card.className = "off-air";
    card.setAttribute("aria-label", isOffAir ? "Fin de emisión" : "Pausa de emisión");
    card.innerHTML = isOffAir
      ? `<div class="signal-rings" aria-hidden="true"><i></i><i></i><i></i></div><p class="eyebrow">CNT</p><h1>Fin de emisión</h1><p id="break-countdown" class="countdown"></p>`
      : "";
    stage.append(card);
  }
  const remaining = state.event.end - state.position;
  const countdown = $("break-countdown");
  if (countdown) countdown.textContent = state.event.type === "offair"
    ? `Volvemos a las 06:00 · faltan ${formatDuration(remaining)}`
    : `Volvemos en ${formatDuration(remaining)}`;
  $("channel-bug").hidden = true;
  $("age-badge").hidden = true;
  $("sound-help").hidden = true;
  document.querySelector(".player-lock").classList.remove("is-open");
}

function renderComingUp(state) {
  const overlay = $("coming-up");
  const remaining = state.event.end - state.position;
  const visible = state.event.type === "program" && remaining <= 20 && remaining > 12;
  overlay.classList.toggle("is-visible", visible);
  overlay.setAttribute("aria-hidden", String(!visible));
  if (!visible) return;
  $("coming-up-title").textContent = state.nextProgram?.item.title || "Nueva jornada de CNT";
}

function render() {
  if (activeChannel !== "cnt") return;
  const now = new Date();
  const state = broadcastState(now);
  if (!state.event) return;
  const stateKey = `${state.day}-${state.event.start}-${state.event.type}`;
  const next = state.nextProgram;
  $("player-stage").hidden = false;
  $("live-badge").hidden = !state.onAir;
  $("next-label").textContent = "A CONTINUACIÓN";
  $("next-title").textContent = next?.item.title || "Nueva jornada de CNT";
  $("next-time").textContent = next ? clockFromSeconds(next.start) : "06:00";

  if (state.onAir) {
    const itemElapsed = state.position - state.event.start;
    $("status-kicker").textContent = "AHORA EN CNT";
    $("current-title").textContent = state.event.item.title;
    renderAgeRating(state.event.item.rating);
    $("elapsed").textContent = formatDuration(itemElapsed);
    $("remaining").textContent = `−${formatDuration(state.event.end - state.position)}`;
    $("progress-bar").style.width = `${Math.min(100, (itemElapsed / state.event.item.duration) * 100)}%`;
    renderPlayer(state.event.item, itemElapsed, stateKey);
    renderComingUp(state);
  } else {
    const elapsed = state.position - state.event.start;
    const duration = state.event.end - state.event.start;
    $("status-kicker").textContent = state.event.type === "offair" ? "CNT" : "PAUSA DE EMISIÓN";
    $("current-title").textContent = state.event.type === "offair" ? "Fin de emisión" : "Volvemos enseguida";
    $("elapsed").textContent = formatDuration(elapsed);
    $("remaining").textContent = `−${formatDuration(state.event.end - state.position)}`;
    $("progress-bar").style.width = `${Math.min(100, (elapsed / duration) * 100)}%`;
    renderIntermission(state, stateKey);
    $("coming-up").classList.remove("is-visible");
    $("coming-up").setAttribute("aria-hidden", "true");
  }
  renderProgramGuide(state);
}

$("sound-help").addEventListener("click", () => {
  const media = $("player-stage").querySelector("video");
  if (media) {
    media.play();
    $("sound-help").hidden = true;
  }
});

function watchDriveActivation() {
  if (!awaitingDriveClick) return;
  const iframe = $("player-stage").querySelector("iframe");
  if (iframe && document.activeElement === iframe) {
    awaitingDriveClick = false;
    iframe.tabIndex = -1;
    document.querySelector(".player-lock").classList.remove("is-open");
    $("sound-help").hidden = true;
    $("channel-bug").hidden = false;
    $("drive-note").textContent = "El reproductor está bloqueado para mantener la emisión lineal.";
  }
}

$("fullscreen-button").addEventListener("click", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    $("screen").requestFullscreen();
  }
});

function showPlayerControls() {
  $("screen").classList.add("controls-visible");
  clearTimeout(controlsTimer);
  controlsTimer = setTimeout(() => $("screen").classList.remove("controls-visible"), 2000);
}

function hidePlayerControlsSoon() {
  clearTimeout(controlsTimer);
  controlsTimer = setTimeout(() => $("screen").classList.remove("controls-visible"), 2000);
}

$("screen").addEventListener("pointerenter", showPlayerControls);
$("screen").addEventListener("pointermove", showPlayerControls);
$("screen").addEventListener("pointerleave", hidePlayerControlsSoon);
$("screen").addEventListener("touchstart", showPlayerControls, { passive: true });
$("screen").addEventListener("focusin", showPlayerControls);

function setActiveChannel(id, updateHash = true) {
  const channel = CHANNELS[id] || CHANNELS.cnt;
  activeChannel = CHANNELS[id] ? id : "cnt";
  document.documentElement.style.setProperty("--yellow", channel.color);
  document.title = channel.name;
  $("brand-logo").src = `${channel.logo}?v=${logoVersion}`;
  $("brand-logo").alt = channel.name;
  $("channel-bug").src = `${channel.logo}?v=${logoVersion}`;
    $("channel-bug").hidden = true;
    $("age-badge").hidden = true;
  $("coming-up").classList.remove("is-visible");
  $("coming-up").setAttribute("aria-hidden", "true");
  $("guide-title").textContent = channel.name;
  document.querySelector("footer span").textContent = channel.name;
  document.querySelectorAll(".channel-tab").forEach((tab) => {
    const selected = tab.dataset.channel === activeChannel;
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", String(selected));
  });

  if (channel.programmed) {
    $("coming-soon").hidden = true;
    $("player-stage").hidden = false;
    $("progress-track").hidden = false;
    $("time-row").hidden = false;
    document.querySelector(".next-card").hidden = false;
    $("program-guide-scroll").hidden = false;
    $("guide-empty").hidden = true;
    loadedKey = "";
    guideKey = "";
    render();
  } else {
    awaitingDriveClick = false;
    loadedKey = "";
    $("player-stage").replaceChildren();
    $("player-stage").hidden = true;
    $("sound-help").hidden = true;
    $("live-badge").hidden = true;
    $("coming-soon").hidden = false;
    $("coming-soon-title").textContent = channel.name;
    $("status-kicker").textContent = channel.type.toUpperCase();
    $("current-title").textContent = "Las emisiones empezarán próximamente";
    $("progress-track").hidden = true;
    $("time-row").hidden = true;
    document.querySelector(".next-card").hidden = true;
    $("program-guide-scroll").hidden = true;
    $("guide-empty").hidden = false;
  }

  if (updateHash) history.replaceState(null, "", `#${activeChannel}`);
}

document.querySelectorAll(".channel-tab").forEach((tab) => {
  tab.addEventListener("click", () => setActiveChannel(tab.dataset.channel));
});
window.addEventListener("hashchange", () => setActiveChannel(location.hash.slice(1), false));

setActiveChannel(location.hash.slice(1) || "cnt", false);
showPlayerControls();
setInterval(render, 1000);
setInterval(watchDriveActivation, 50);
window.addEventListener("resize", () => { guideKey = ""; });
