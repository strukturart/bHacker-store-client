var path;


window.addEventListener('DOMContentLoaded', function() {
    var sdcard = navigator.getDeviceStorage('sdcard');

    sdcard.addEventListener("change", function(event) {
        var reason = event.reason;
        var path = event.path;

        install(path)

    });

    function install(param) {

        var request = sdcard.get(param);

        request.onsuccess = function() {
            var file = this.result;
            //alert("Get the file: " + file.name);
            installPkg(file)
        }

        request.onerror = function() {
            //alert("Unable to get the file: " + this.error);
        }
    }



    function fparts(fName) {
        let parts = fName.split('/')
        let basename = parts.pop()
        return { dirname: parts.join('/'), basename: basename }
    }






    function installPkg(packageFile) {
        navigator.mozApps.mgmt.import(packageFile).then(function() {
            alert('Installation successful!')
        }).catch(e => {
            alert('Installation error: ' + e.name + ' ' + e.message)
        })
        let appGetter = navigator.mozApps.mgmt.getAll()
        appGetter.onsuccess = function() {
            let apps = appGetter.result
            alert.dir(apps)
        }
        appGetter.onerror = function(e) {
            alert.dir(this.error)
        }
    }





}, false)