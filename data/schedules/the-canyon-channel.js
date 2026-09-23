window.CHANNEL_SCHEDULES = window.CHANNEL_SCHEDULES || {};
(() => {
  const pause = window.SCHEDULE_TOOLS.makeTrailerBreaks(93017);
  const sequence = [
    "movie-tumba-faraon-1", "movie-tumba-faraon-2", pause(180),
    "movie-tumba-faraon-3", "movie-tumba-faraon-4", pause(180),
    "movie-amatista", "movie-amatista-2", pause(180),
    "movie-fort-brimstone", "movie-origen-fort-brimstone", pause(180),
    "movie-caida-fort-brimstone", "caos-strawberry-s01e12", pause(180),
    "movie-poker-de-ases", "movie-el-hotel", "movie-problemas-en-casa",
    pause(180)
  ];
  window.CHANNEL_SCHEDULES.canyon = { mode: "loop", videoMargin: 7, sequence };
})();
