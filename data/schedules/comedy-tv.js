window.CHANNEL_SCHEDULES = window.CHANNEL_SCHEDULES || {};
(() => {
  const range = (prefix, total) => Array.from({ length: total }, (_, index) => `${prefix}${String(index + 1).padStart(2, "0")}`);
  const collections = [range("mis-amigos-s01e", 8), range("paranormal-prologo-e", 7), range("caos-strawberry-s01e", 12), range("paranormal-v01e", 7)];
  const adBreak = window.SCHEDULE_TOOLS.makeTrailerBreaks(27451);
  const sequence = [];
  collections.forEach((collection) => {
    collection.forEach((id, index) => {
      sequence.push(id);
      if ((index + 1) % 4 === 0 && index + 1 < collection.length) sequence.push(adBreak(180));
    });
    sequence.push(adBreak(180));
  });
  window.CHANNEL_SCHEDULES.comedy = { mode: "loop", videoMargin: 7, sequence };
})();
