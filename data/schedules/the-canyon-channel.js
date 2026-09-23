window.CHANNEL_SCHEDULES = window.CHANNEL_SCHEDULES || {};
(() => {
  const pause = (duration, trailers) => ({ type: "adBreak", duration, items: trailers });
  const sequence = [
    "movie-tumba-faraon-1", "movie-tumba-faraon-2", pause(120, ["trailer-tumba-faraon"]),
    "movie-tumba-faraon-3", "movie-tumba-faraon-4", pause(120, ["trailer-tumba-faraon-2"]),
    "movie-amatista", "movie-amatista-2", pause(120, ["trailer-amatista-2"]),
    "movie-fort-brimstone", "movie-origen-fort-brimstone", pause(120, ["trailer-three-kind-s01"]),
    "movie-caida-fort-brimstone", "caos-strawberry-s01e12", pause(120, ["trailer-caos-s01"]),
    "movie-poker-de-ases", "movie-el-hotel", "movie-problemas-en-casa",
    pause(120, ["trailer-el-hotel"])
  ];
  window.CHANNEL_SCHEDULES.canyon = { mode: "loop", videoMargin: 7, sequence };
})();
