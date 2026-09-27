window.CHANNEL_SCHEDULES = window.CHANNEL_SCHEDULES || {};
(() => {
  const episodes = (season, total) => Array.from({ length: total }, (_, index) => `three-kind-s${season}e${String(index + 1).padStart(2, "0")}`);
  const season1 = episodes("01", 14);
  const season2 = [...episodes("02", 29), "three-kind-s02e30-1", "three-kind-s02e30-2", ...episodes("02", 34).slice(30)];
  const adBreak = window.SCHEDULE_TOOLS.makeTrailerBreaks(81173);
  const distribute = (items) => {
    const sequence = [];
    let sinceBreak = 0;
    items.forEach((id) => {
      const isLong = window.CONTENT_CATALOG[id].duration >= 20 * 60;
      if (isLong && sinceBreak > 0) {
        sequence.push(adBreak(180));
        sinceBreak = 0;
      }
      sequence.push(id);
      if (isLong) {
        sequence.push(adBreak(180));
        sinceBreak = 0;
      } else if (++sinceBreak >= 3) {
        sequence.push(adBreak(180));
        sinceBreak = 0;
      }
    });
    if (sequence.at(-1)?.type !== "adBreak") sequence.push(adBreak(180));
    return sequence;
  };
  window.CHANNEL_SCHEDULES.weazel = {
    mode: "loop",
    videoMargin: 10,
    sequence: [...distribute(season1), ...distribute(season2)]
  };
})();
