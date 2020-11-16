const LastUpdateFile =
  "https://banana-hackers.gitlab.io/store-db/lastUpdate.txt";

const server_list = [
  "https://banana-hackers.gitlab.io/store-db/data.json",
  "https://bananahackers.github.io/store-db/data.json",
];

const SimpleRatingServerInstance = "https://bhackers.uber.space/srs/v1";

const BackendApi = (() => {
  const TIMEOUT_ERROR = "TimeOutError";
  const FORBIDDEN_ERROR = "ForbidddenError";

  let statusCallback = () => {};

  function fetchData(url) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest({ mozSystem: true });
      xhr.open("GET", url);
      xhr.timeout = 4000; // time in milliseconds

      xhr.ontimeout = function (e) {
        reject(TIMEOUT_ERROR);
      };

      xhr.onload = function () {
        if (xhr.status == 200) {
          resolve(xhr.responseText);
        }
        if (xhr.status == 403) {
          // access forbidden
          reject(FORBIDDEN_ERROR);
        }
        // analyze HTTP status of the response
        if (xhr.status != 200) {
          reject(new Error(`Error ${xhr.status}: ${xhr.statusText}`)); // e.g. 404: Not Found
        }
      };

      xhr.onerror = function (err) {
        reject(err);
      };
      xhr.send();
    });
  }

  function _saveData(dataString) {
    const json = JSON.parse(dataString);
    if (json.version !== 2) {
      throw "Incompatible Data, try updating the app";
    }
    if (json.generated_at < localStorage.getItem("DATA_Timestamp")) {
      throw "Older Data than current data, please contact the developers this should not happen";
    }
    localStorage.setItem("DATA", JSON.stringify(json));
    localStorage.setItem("DATA_Timestamp", json.generated_at);
  }

  function _update() {
    return new Promise((resolve, reject) => {
      const done = (data) => {
        try {
          _saveData(data);
          console.log("Got data", data);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      fetchData(server_list[0])
        .then(done)
        .catch((error) => {
          statusCallback("First Server wasn't reachable, trying backup");
          console.error(error);
          fetchData(server_list[1]).then(done).catch(reject);
        });
    });
  }

  /**
   * @returns {Promise<boolean>} returns a promise wrapped boolean whether there is a new update, fails if the network request fails
   */
  function checkForNewVersion() {
    console.log("Checking for newer data.");
    return new Promise((resolve, reject) => {
      fetchData(LastUpdateFile)
        .then((response) => {
          const ts = Number(response);
          resolve(ts > localStorage.getItem("DATA_Timestamp"));
        })
        .catch(reject);
    });
  }

  /**
   * public function which has checks to check whether an update should be started
   */
  function update(forceUpdate = false) {
    return new Promise((resolve, reject) => {
      if (!navigator.onLine) {
        reject(new Error("No internet connection"));
      } else if (forceUpdate) {
        _update().then(resolve).catch(reject);
      } else if (!getData()) {
        // update if we dont have data
        _update().then(resolve).catch(reject);
      } else {
        // try checking the version number
        checkForNewVersion()
          .then((newVersionExists) => {
            if (newVersionExists) {
              _update().then(resolve).catch(reject);
            } else {
              console.log("no new version of the data availible");
              resolve();
            }
          })
          .catch((err) => {
            console.log(err);
            // we couldn't check for versions,
            // either we have no connection or the update page is blocked, so try updating anyway.
            _update().then(resolve).catch(reject);
          });
      }
    });
  }

  function getData() {
    const string = localStorage.getItem("DATA");
    if (string) return JSON.parse(string);
    else return null;
  }

  /**
   * Counts a download.
   * @param {string} appId id/slug of the app that was downloaded
   */
  function count_download(appId) {
    const url = `${SimpleRatingServerInstance}/download_counter/count/${appId}`;
    let xhttp = new XMLHttpRequest({ mozSystem: true });
    xhttp.open("GET", url, true);
    xhttp.timeout = 2000;
    xhttp.send(null);
  }

  function getDownloadCounts() {
    return new Promise((resolve, reject) => {
      fetchData(`${SimpleRatingServerInstance}/download_counter`)
        .then((data) => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (error) {
            reject(error);
          }
        })
        .catch(reject);
    });
  }

  return {
    update,
    getData,
    setStatusCallback: (cb) => (statusCallback = cb),
    count_download,
    getDownloadCounts,
  };
})();
