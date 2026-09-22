window.CHANNEL_SCHEDULES = window.CHANNEL_SCHEDULES || {};
(() => {
  const movies = [
    "movie-tumba-faraon-1", "movie-tumba-faraon-2", "movie-tumba-faraon-3", "movie-tumba-faraon-4",
    "movie-amatista", "movie-amatista-2",
    "movie-fort-brimstone", "movie-origen-fort-brimstone", "movie-caida-fort-brimstone",
    "movie-poker-de-ases", "movie-el-hotel", "movie-problemas-en-casa"
  ];
  const ads = [
    ["trailer-caos-s01", "teaser-paranormal-prologo"],
    [],
    ["trailer-paranormal-v01"],
    [],
    ["trailer-three-kind-s01", "trailer-three-kind-s02"],
    []
  ];
  const sequence = [];
  movies.forEach((id, index) => {
    sequence.push(id);
    const items = ads[index % ads.length];
    const duration = items.length > 1 ? 240 : items.includes("trailer-paranormal-v01") ? 180 : 120;
    sequence.push({ type: "adBreak", duration, items });
  });
  window.CHANNEL_SCHEDULES.canyon = { mode: "loop", videoMargin: 5, sequence };
})();
