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

const { install } = ((_) => {

    function download_file(url, app_slug) {
        var xhttp = new XMLHttpRequest({ mozSystem: true });
        document.getElementById("loading").style.display = "block";
        xhttp.open("GET", url, true);
        xhttp.withCredentials = true;
        xhttp.responseType = "blob";

        xhttp.onload = function() {
            if (xhttp.readyState === xhttp.DONE && xhttp.status === 200) {
                let blob = xhttp.response;
                let file = new Blob([blob], { type: "application/zip" });
                installPkg(file);
                BackendApi.count_download(app_slug);
            } else {
                alert("can't download app");
            }
        };

        xhttp.onerror = function() {
            toaster(" status: " + xhttp.status + xhttp.getAllResponseHeaders(), 3000);
            document.getElementById("loading").style.display = "none";
        };

        xhttp.send(null);
    }



    function installPkg(packageFile) {
        navigator.mozApps.mgmt
            .import(packageFile)
            .then(function(e) {
                bottom_bar("options", "", "open");
                window_status = "post_installation";

                console.info("Installation was successfull", arguments);
                document.getElementById("loading").style.display = "none";
                toaster(
                    "<br><br><br><br>THANK YOU<br> for installing the app.<br><br> If you like it I would be happy about a donation, press the option button.<br><br><br><br><br><br>",
                    6000
                );
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
        // todo? check if app was installed:
        // mozAppsWrapper.getInstalled().then(apps => console.log(apps));
    }

    return { installPkg, download_file };
})();