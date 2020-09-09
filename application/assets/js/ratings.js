const DownloadCounter = (() => {
  let downloadCounts = {};

  function load() {
    return new Promise((res, rej) => {
      BackendApi.getDownloadCounts()
        .then((d) => (downloadCounts = d))
        .then(res)
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
