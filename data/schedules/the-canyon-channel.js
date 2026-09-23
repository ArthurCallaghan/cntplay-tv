window.CHANNEL_SCHEDULES = window.CHANNEL_SCHEDULES || {};
(() => {
  const pause = (trailer) => ({ type: "adBreak", duration: 120, items: [trailer] });
  const sequence = [
    "movie-tumba-faraon-1", "movie-tumba-faraon-2", pause("trailer-tumba-faraon"),
    "movie-tumba-faraon-3", "movie-tumba-faraon-4", pause("trailer-tumba-faraon-2"),
    "movie-amatista", "movie-amatista-2", pause("trailer-amatista-2"),
    "movie-fort-brimstone", "movie-origen-fort-brimstone", pause("trailer-three-kind-s01"),
    "movie-caida-fort-brimstone", "caos-strawberry-s01e12", pause("trailer-caos-s01"),
    "movie-poker-de-ases", "movie-el-hotel", pause("trailer-el-hotel"),
    "movie-problemas-en-casa", pause("trailer-paranormal-v01")
  ];
  window.CHANNEL_SCHEDULES.canyon = { mode: "loop", videoMargin: 5, sequence };
})();
