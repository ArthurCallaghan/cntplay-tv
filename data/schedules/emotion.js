window.CHANNEL_SCHEDULES = window.CHANNEL_SCHEDULES || {};
(() => {
  const sequence = window.SCHEDULE_TOOLS.shuffled(
    Object.keys(window.CONTENT_CATALOG).filter((id) =>
      ["trailer", "music"].includes(window.CONTENT_CATALOG[id].category)
    ),
    38017
  );

  window.CHANNEL_SCHEDULES.emotion = {
    mode: "loop",
    videoMargin: 7,
    testing: true,
    sequence: [{
      type: "group",
      title: "Bucle de Pruebas",
      items: sequence
    }]
  };
})();
