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

//todo
//create unique username
function createUserId() {
  let random = Math.random().toString(36).substr(2, 9);
  random = random.toString();
  let timestamp = Date.now();
  timestamp = timestamp.toString();
  let userId = random + timestamp;
  return userId;
}

//if the user open the app first time
//create userID and store it in local storage
//every time whe the user open the app check if the local storage var exist
// if not recreate the userId
