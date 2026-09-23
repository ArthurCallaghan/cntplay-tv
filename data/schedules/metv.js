window.CHANNEL_SCHEDULES = window.CHANNEL_SCHEDULES || {};
(() => {
  const adBreak = window.SCHEDULE_TOOLS.makeTrailerBreaks(44219);
  const music = window.SCHEDULE_TOOLS.shuffled([
    "music-devuelveme-a-mi-chica", "music-dont-stop-believin", "music-havana",
    "music-have-you-ever-seen-the-rain", "music-im-outta-love", "music-livin-on-a-prayer",
    "music-livin-on-a-prayer-2", "music-manchild", "music-manchild-espresso",
    "music-mystical-magical", "music-somethings-got-a-hold-on-me", "music-the-boys-are-back-in-town",
    "music-training-season", "music-waka-waka", "music-you-belong-with-me"
  ], 61573);
  const groupSizes = [2, 3, 2, 3, 2, 3];
  let musicCursor = 0;
  const groups = groupSizes.map((size) => {
    const items = music.slice(musicCursor, musicCursor + size);
    musicCursor += size;
    return { type: "group", title: "Contenido Musical de Three of a Kind", items };
  });
  const summers = [1, 2, 3, 4].map((number) => `special-summer-sound-${number}`);
  const sequence = [];
  groups.forEach((group, index) => {
    const summer = summers[index % summers.length];
    sequence.push(summer, adBreak(180), group, adBreak(180));
  });
  window.CHANNEL_SCHEDULES.metv = {
    mode: "loop",
    videoMargin: 10,
    sequence
  };
})();
