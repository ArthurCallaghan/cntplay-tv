window.CHANNEL_SCHEDULES = window.CHANNEL_SCHEDULES || {};
(() => {
  const range = (prefix, total) => Array.from({ length: total }, (_, index) => `${prefix}${String(index + 1).padStart(2, "0")}`);
  const collections = [range("mis-amigos-s01e", 8), range("paranormal-prologo-e", 7), range("caos-strawberry-s01e", 12), range("paranormal-v01e", 7)];
  const ads = [
    ["teaser-paranormal-prologo", "trailer-caos-s01"],
    ["trailer-paranormal-v01"],
    ["trailer-three-kind-s01", "trailer-three-kind-s02"],
    []
  ];
  let breakIndex = 0;
  const adBreak = () => {
    const items = ads[breakIndex++ % ads.length];
    const duration = items.length > 1 ? 240 : items.includes("trailer-paranormal-v01") ? 180 : 120;
    return { type: "adBreak", duration, items };
  };
  const sequence = [];
  collections.forEach((collection) => {
    collection.forEach((id, index) => {
      sequence.push(id);
      if ((index + 1) % 4 === 0 && index + 1 < collection.length) sequence.push(adBreak());
    });
    sequence.push(adBreak());
  });
  window.CHANNEL_SCHEDULES.comedy = { mode: "loop", videoMargin: 5, sequence };
})();
