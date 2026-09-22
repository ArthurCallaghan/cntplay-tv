window.CHANNEL_SCHEDULES = window.CHANNEL_SCHEDULES || {};
(() => {
  const adBreak = (items = [], duration = 120) => ({ type: "adBreak", duration, items });
  window.CHANNEL_SCHEDULES.metv = {
    mode: "loop",
    videoMargin: 5,
    sequence: [
      "special-summer-sound-1",
      adBreak(["trailer-caos-s01", "teaser-paranormal-prologo"], 240),
      { type: "group", title: "Contenido Musical de Three of a Kind", items: ["music-devuelveme-a-mi-chica", "music-dont-stop-believin", "music-havana"] },
      adBreak([], 120),
      "special-summer-sound-2",
      adBreak(["trailer-three-kind-s01", "trailer-three-kind-s02"], 240),
      { type: "group", title: "Contenido Musical de Three of a Kind", items: ["music-have-you-ever-seen-the-rain", "music-im-outta-love", "music-livin-on-a-prayer"] },
      adBreak([], 120),
      "special-summer-sound-3",
      adBreak(["trailer-paranormal-v01"], 240),
      { type: "group", title: "Contenido Musical de Three of a Kind", items: ["music-livin-on-a-prayer-2", "music-manchild", "music-manchild-espresso"] },
      adBreak([], 120),
      "special-summer-sound-4",
      adBreak(["trailer-caos-s01", "trailer-three-kind-s02"], 270),
      { type: "group", title: "Contenido Musical de Three of a Kind", items: ["music-mystical-magical", "music-somethings-got-a-hold-on-me", "music-the-boys-are-back-in-town"] },
      adBreak([], 120),
      "special-summer-sound-1",
      adBreak(["teaser-paranormal-prologo", "trailer-three-kind-s01"], 240),
      { type: "group", title: "Contenido Musical de Three of a Kind", items: ["music-training-season", "music-waka-waka", "music-you-belong-with-me"] },
      adBreak([], 120)
    ]
  };
})();
