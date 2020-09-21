const DownloadCounter = (() => {
  let downloadCounts = {};

  function load() {
    return new Promise((res, rej) => {
      BackendApi.getDownloadCounts()
        .then((d) => {
          if (typeof downloadCounts !== "object") {
            console.error(
              "DownloadCounter.load",
              "invalid format",
              downloadCounts
            );
            rej(new Error("Invalid Format"));
          }
          downloadCounts = d;
          res();
        })
        .catch(rej);
    });
  }

  function getForApp(appId) {
    return downloadCounts[appId] || -1;
  }
  return {
    load,
    getForApp,
  };
})();
