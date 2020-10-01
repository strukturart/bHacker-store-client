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
//if the user open the app first time
//create userID and store it in local storage
//every time whe the user open the app check if the local storage var exist
// if not recreate the userId
function createUserId() {
    let random = Math.random().toString(36).substr(2, 9);
    random = random.toString();
    let timestamp = Date.now();
    timestamp = timestamp.toString();
    let userId = random + timestamp;
    return userId;
}

function get_userId() {
    let userId = localStorage.getItem("userId");

    //if id not set - do it
    if (userId == null) {
        localStorage.setItem("userId", createUserId());
        create_user(userId, userId);
        alert(userId);
        return userId;

        //return the id
    } else {
        return userId;
    }
}

get_userId();

send_rating(
    get_userId(),
    get_userId(),
    "rss-reader",
    3,
    "comment test",
    "rss-reader"
);

////create user

function create_user(_username, _logintoken) {
    // Creating a XHR object
    let xhr = new XMLHttpRequest({ mozSystem: true });
    let url = "https://bhackers.uber.space/srs/v1/createuser";

    // open a connection
    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(this.responseText);
        } else {
            console.log(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
        }
    };

    xhr.onerror = function() {
        // only triggers if the request couldn't be made at all
        alert(`Network Error`);
    };

    const json = {
        username: _username,
        logintoken: _logintoken,
    };

    // Sending data with the request
    xhr.send(JSON.stringify(json));
}

function send_rating(
    _username,
    _logintoken,
    _appid,
    _points,
    _description,
    _appid_slug
) {
    let xhr = new XMLHttpRequest({ mozSystem: true });
    let url =
        "https://bhackers.uber.space/srs/v1/ratings/" + _appid_slug + "/add";

    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // Print received data from server
            console.log(this.responseText);
        } else {
            console.log(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
        }
    };

    xhr.onerror = function() {
        // only triggers if the request couldn't be made at all
        alert(`Network Error`);
    };

    // Converting JSON data to string
    let json = {
        username: _username,
        logintoken: _logintoken,
        appid: _appid,
        points: _points,
        description: _description,
    };

    // Sending data with the request
    xhr.send(JSON.stringify(json));
}

//