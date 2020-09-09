const { install } = ((_) => {
  var path, sdcard;
  var initialized = false;

  try {
    var sdcard = navigator.getDeviceStorage("sdcard");
    sdcard.addEventListener("change", function (event) {
      // var reason = event.reason;
      path = event.path;
      install(path);
    });
    initialized = true;
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
        BackendApi.count_download(app_slug);
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

  return { install, installPkg };
})();
