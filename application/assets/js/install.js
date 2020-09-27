const mozAppsWrapper = ((_) => {
  function _domRequest2Promise(domRequest) {
    return new Promise((resolve, reject) => {
      domRequest.onsuccess = () => resolve(domRequest.result);
      domRequest.onerror = () => reject(domRequest.error);
    });
  }

  /**
   * get a list of all installed apps
   */
  function getAll() {
    return _domRequest2Promise(navigator.mozApps.mgmt.getAll());
  }

  /**
   * Get a list of all installed apps from this origin.
   * For example, if you call this on the Firefox Marketplace,
   * you will get the list of apps installed by the Firefox Marketplace.
   */
  function getInstalled() {
    return _domRequest2Promise(navigator.mozApps.getInstalled());
  }

  return { getAll, getInstalled };
})();

///////////////
//download file
///////////////
function download_file(url) {
  var xhttp = new XMLHttpRequest({ mozSystem: true });

  xhttp.open("GET", url, true);
  xhttp.withCredentials = true;
  xhttp.responseType = "blob";

  xhttp.onload = function () {
    if (xhttp.readyState === xhttp.DONE && xhttp.status === 200) {
      var blob = xhttp.response;

      //create file
      let sdcard = navigator.getDeviceStorages("sdcard");

      sdcard.forEach(function (item, index) {
        if (item.default == true) {
          let file = new Blob([blob], { type: "application/zip" });
          let request = sdcard[index].addNamed(file, "app.zip");

          request.onsuccess = function () {
            let name = this.result.name;
            console.log(
              'File "' +
                name +
                '" successfully wrote on the sdcard storage area'
            );
          };

          request.onerror = function (e) {
            console.log(JSON.stringify(e));
          };
        }
        return;
      });
    }
  };

  xhttp.onerror = function () {
    toaster(" status: " + xhttp.status + xhttp.getAllResponseHeaders(), 3000);
  };

  xhttp.send(null);
}

const { install } = ((_) => {
  var path, sdcard;
  var initialized = false;

  try {
    var sdcard = navigator.getDeviceStorage("sdcard");
    sdcard.addEventListener("change", function (event) {
      console.log("sdcard change event", event, event.path);
      let reason = event.reason;
      //toaster(reason, 2000);
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
      console.log("Unable to get the file: " + this.error);
    };
  }

  function installPkg(packageFile) {
    if (!initialized) throw new Error("install module is not initialized yet");
    navigator.mozApps.mgmt
      .import(packageFile)
      .then(function (e) {
        bottom_bar("options", "", "open");
        deleteFile();
        window_status = "post_installation";

        console.info("Installation was successfull", arguments);
        BackendApi.count_download(app_slug);
        toaster(
          "<br><br><br><br>THANK YOU<br> for installing the app.<br><br> If you like it I would be happy about a donation, press the option button.<br><br><br><br><br><br>",
          6000
        );
      })
      .catch((error) => {
        console.error(error);
        deleteFile();
        //alert("Installation error: " + error.name + " " + error.message);
        if (error.name === "AppAlreadyInstalled") {
          alert("Error: App Already Installed.");
        }

        if (error.name === "InvalidPrivilegeLevel") {
          alert(
            "Error: You probably need to do the priviliged factory reset first."
          );
          // TODO open an guide that explains it, with links to a backup guide.
        }
      });
    // todo? check if app was installed:
    // mozAppsWrapper.getInstalled().then(apps => console.log(apps));
  }

  /////////////////////////////////
  //delete file after installation
  ////////////////////////////////
  function deleteFile() {
    let sdcard = navigator.getDeviceStorages("sdcard");
    sdcard.forEach(function (item, index) {
      if (item.default == true) {
        let requestDel = sdcard[index].delete("app.zip");

        requestDel.onsuccess = function () {
          if (notification == "notification") {
            console.log(
              'File "' +
                name +
                '" successfully deleted frome the sdcard storage area'
            );
          }
        };

        requestDel.onerror = function () {
          console.log("Unable to delete the file: " + this.error);
        };
      }
    });
  }

  return { install, installPkg };
})();
