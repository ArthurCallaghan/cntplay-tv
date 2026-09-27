// Parrilla lineal de CNT.
window.CHANNEL_SCHEDULES = window.CHANNEL_SCHEDULES || {};
(() => {
  const episodes = (prefix, first, last) => Array.from(
    { length: last - first + 1 }, (_, index) => `${prefix}${String(first + index).padStart(2, "0")}`
  );
  const makeChains = () => [
    [
      episodes("three-kind-s02e", 25, 29),
      ["three-kind-s02e30-1"],
      ["three-kind-s02e30-2"],
      ["three-kind-s02e31", "three-kind-s02e32", "three-kind-s02e34"]
    ],
    [
      episodes("caos-strawberry-s01e", 1, 4),
      episodes("caos-strawberry-s01e", 5, 9),
      episodes("caos-strawberry-s01e", 10, 12)
    ],
    [episodes("paranormal-v01e", 1, 4), episodes("paranormal-v01e", 5, 7)],
    [["movie-origen-fort-brimstone"], ["movie-caida-fort-brimstone"]],
    [["special-summer-sound-4"]],
    [["movie-amatista-2"]]
  ];
  const sequenceForCycle = (cycle) => {
    const chains = makeChains();
    let seed = (20260927 + Math.imul(cycle, 2654435761)) >>> 0;
    const firstChain = ((cycle % 6) + 6) % 6;
    const nextFirstChain = (((cycle + 1) % 6) + 6) % 6;
    const arrange = (remaining, previous = -1, order = []) => {
      if (!remaining.some(Boolean)) {
        return previous !== nextFirstChain || previous === 3 ? order : null;
      }
      const available = remaining.map((count, index) => index).filter(index =>
        remaining[index] && (index !== previous || index === 3) &&
        !(index === 1 && remaining[1] === 1 && remaining[3]) &&
        (order.length || index === firstChain)
      );
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const offset = available.length ? seed % available.length : 0;
      const candidates = available.slice(offset).concat(available.slice(0, offset));
      for (const index of candidates) {
        const rest = [...remaining];
        rest[index]--;
        const result = arrange(rest, index, [...order, index]);
        if (result) return result;
      }
      return null;
    };
    const order = arrange(chains.map(chain => chain.length));
    if (!order) throw new Error("No se ha podido ordenar la parrilla de CNT");
    const blocks = order.map(index => chains[index].shift());
    const adBreak = window.SCHEDULE_TOOLS.makeTrailerBreaks(seed);
    const sequence = [];
    let elapsed = 0;
    let count = 0;
    const pause = () => {
      if (!count) return;
      sequence.push(adBreak(elapsed >= 30 * 60 ? 180 : 120));
      elapsed = 0;
      count = 0;
    };
    blocks.forEach(block => {
      block.forEach(id => {
        const duration = window.CONTENT_CATALOG[id].duration;
        if (count && (duration >= 20 * 60 || elapsed + duration + 10 > 35 * 60)) pause();
        sequence.push(id);
        elapsed += duration + 10;
        count++;
        if (count >= 3 || elapsed >= 30 * 60 || duration >= 20 * 60) pause();
      });
      pause();
    });
    return sequence;
  };
  window.CHANNEL_SCHEDULES.cnt = {
    mode: "loop", videoMargin: 10, sequence: sequenceForCycle(0), sequenceForCycle
  };
})();
