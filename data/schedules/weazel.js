window.CHANNEL_SCHEDULES = window.CHANNEL_SCHEDULES || {};
(() => {
  const episodes = (season, total) => Array.from({ length: total }, (_, index) => `three-kind-s${season}e${String(index + 1).padStart(2, "0")}`);
  const season1 = episodes("01", 14);
  const season2 = [...episodes("02", 29), "three-kind-s02e30-1", "three-kind-s02e30-2", ...episodes("02", 34).slice(30)];
  const ads = [
    ["trailer-three-kind-s01", "trailer-three-kind-s02"],
    ["trailer-caos-s01", "teaser-paranormal-prologo"],
    ["trailer-paranormal-v01"],
    []
  ];
  let breakIndex = 0;
  const adBreak = () => {
    const items = ads[breakIndex++ % ads.length];
    const duration = items.length > 1 ? 240 : items.includes("trailer-paranormal-v01") ? 180 : 120;
    return { type: "adBreak", duration, items };
  };
  const distribute = (items) => {
    const sequence = [];
    items.forEach((id, index) => {
      sequence.push(id);
      if ((index + 1) % 4 === 0 && index + 1 < items.length) sequence.push(adBreak());
    });
    return sequence;
  };
  window.CHANNEL_SCHEDULES.weazel = {
    mode: "loop",
    videoMargin: 5,
    sequence: [...distribute(season1), adBreak(), ...distribute(season2), adBreak()]
  };
})();
