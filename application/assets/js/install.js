const { install, installPkg } = ((_) => {
  var path, sdcard;
  var initialized = false;

  try {
    var sdcard = navigator.getDeviceStorage("sdcard");
    sdcard.addEventListener("change", function (event) {
      // var reason = event.reason;
      path = event.path;
      install(path);
    });
    var initialized = true;
  } catch (error) {
    console.error("initialisation of sdcard failed:", error);
  }

  function install(param) {
    if (!initialized) throw new Error("install module is not initialized yet");

    var request = sdcard.get(param);

    request.onsuccess = function () {
      var file = this.result;
      installPkg(file);
    };

    request.onerror = function () {
      alert("Unable to get the file: " + this.error);
    };
  }

  function installPkg(packageFile) {
    if (!initialized) throw new Error("install module is not initialized yet");
    navigator.mozApps.mgmt
      .import(packageFile)
      .then(function () {
        download_counter();
        toaster(
          "<br><br><br><br>THANK YOU<br> for installing the app.<br><br> If you like it I would be happy about a donation, press the option button.<br><br><br><br><br><br>",
          6000
        );
      })
      .catch((e) => {
        alert("Installation error: " + e.name + " " + e.message);
      });
    let appGetter = navigator.mozApps.mgmt.getAll();
    appGetter.onsuccess = function () {
      let apps = appGetter.result;
    };
    appGetter.onerror = function (e) {};
  }

  function download_counter() {
    const url =
      "https://bhackers.uber.space/srs/v1/download_counter/count/" + app_slug;
    let xhttp = new XMLHttpRequest({ mozSystem: true });

    xhttp.open("GET", url, true);
    xhttp.withCredentials = true;
    xhttp.timeout = 2000;

    xhttp.responseType = "json";

    xhttp.send(null);

    xhttp.onload = function () {
      if (xhttp.readyState === xhttp.DONE && xhttp.status === 200) {
        let data = xhttp.response;
      }
    };
  }
})();
