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

const { install } = ((_) => {
    var path, sdcard;
    var initialized = false;

    try {
        var sdcard = navigator.getDeviceStorage("sdcard");
        sdcard.addEventListener("change", function(event) {
            console.log("sdcard change event", event, event.path);
            let reason = event.reason;
            toaster(reason, 2000);
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

        request.onsuccess = function() {
            var file = this.result;
            console.log(this.result);
            installPkg(file);
        };

        request.onerror = function() {
            alert("Unable to get the file: " + this.error);
        };
    }

    function installPkg(packageFile) {
        if (!initialized) throw new Error("install module is not initialized yet");
        navigator.mozApps.mgmt
            .import(packageFile)
            .then(function(e) {
                bottom_bar("options", "", "open");
                console.log(e);
                var request = window.navigator.mozApps.getAll();
                request.onerror = function(e) {
                    console.log("Error calling getInstalled: " + request.error.name);
                };
                request.onsuccess = function(e) {
                    console.log("Success, number of apps: " + request.result.length);
                    var appsRecord = request.result;
                    console.log(appsRecord)
                };

                console.info("Installation was successfull", arguments);
                BackendApi.count_download(app_slug);
                toaster(
                    "<br><br><br><br>THANK YOU<br> for installing the app.<br><br> If you like it I would be happy about a donation, press the option button.<br><br><br><br><br><br>",
                    6000
                );
            })
            .catch((error) => {
                console.error(error);
                alert("Installation error: " + error.name + " " + error.message);
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

    return { install, installPkg };
})();