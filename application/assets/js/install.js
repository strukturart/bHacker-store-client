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

//const { install } = ((_) =>
const install = (() => {
  function download_file(url, app_slug) {
    var xhttp = new XMLHttpRequest({ mozSystem: true });
    document.getElementById("loading").style.display = "block";
    xhttp.open("GET", url, true);
    xhttp.withCredentials = true;
    xhttp.responseType = "blob";

    xhttp.onload = function () {
      if (xhttp.readyState === xhttp.DONE && xhttp.status === 200) {
        let blob = xhttp.response;
        let file = new Blob([blob], { type: "application/zip" });
        installPkg(file);
        installPkg(
          "https://github.com/strukturart/o.map/blob/master/build/omap-test.zip"
        );
        BackendApi.count_download(app_slug);
      } else {
        alert("can't download app");
      }
    };

    xhttp.onerror = function () {
      alert("can't download app");
      toaster(" status: " + xhttp.status + xhttp.getAllResponseHeaders(), 3000);
      document.getElementById("loading").style.display = "none";
    };

    xhttp.send(null);
  }

  function installPkg(packageFile) {
    if (!navigator.mozApps.mgmt.import()) {
      alert("This KaiOs version do not support import()");
      return false;
    }

    /*
                  

                    let req_install = window.navigator.mozApps.install(packageFile);

                    req_install.onsuccess = function() {
                        document.getElementById("loading").style.display = "none";
                        alert("success");
                    };

                    req_install.onerror = function(error) {
                        document.getElementById("loading").style.display = "none";
                        alert(JSON.stringify(error));
                    };
*/

    navigator.mozApps.mgmt
      .import(packageFile)
      .then(function (e) {
        bottom_bar("options", "", "open");
        after_installation = true;

        console.info("Installation was successfull", arguments);
        document.getElementById("loading").style.display = "none";
        alert("App installed successfully.");
      })
      .catch((error) => {
        document.getElementById("loading").style.display = "none";

        if (error.name === "noMetadata") {
          alert("Installation error: noMetadata");
        }
        if (error.name === "AppAlreadyInstalled") {
          alert("Installation error: App Already Installed.");
        }

        if (error.name === "InvalidPrivilegeLevel") {
          alert(
            "Installation error: You probably need to do the priviliged factory reset first."
          );
          // TODO open an guide that explains it, with links to a backup guide.
        }
      });
  }

  return { installPkg, download_file };
})();
