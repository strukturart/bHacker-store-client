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
    create_user(localStorage.getItem("userId"), localStorage.getItem("userId"));
    return userId;

    //return the id
  } else {
    return userId;
  }
}

get_userId();

////create user
let max_tryout = 5;
let i = 0;

function create_user(username, logintoken) {
  // Creating a XHR object
  let xhr = new XMLHttpRequest({ mozSystem: true });
  let url = "https://bhackers.uber.space/srs/v1/createuser";

  // open a connection
  xhr.open("POST", url, true);

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log(this.responseText);
    } else {
      console.log(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
    }
  };

  xhr.onerror = function () {
    // only triggers if the request couldn't be made at all
    i++;
    if (i < max_tryout) {
      localStorage.removeItem("userId");
      get_userId();
    }
    if (i == max_tryout) {
      localStorage.removeItem("userId");
      toaster(`Network Error`, 3000);
    }
  };

  const json = {
    username: username,
    logintoken: logintoken,
  };

  // Sending data with the request
  xhr.send(JSON.stringify(json));
}

function send_rating(
  username,
  logintoken,
  appid_slug,
  appid,
  points,
  description,
  callback
) {
  let xhr = new XMLHttpRequest({ mozSystem: true });
  let url = "https://bhackers.uber.space/srs/v1/ratings/" + appid_slug + "/add";

  xhr.open("POST", url, true);

  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onload = function () {
    if ((xhr.readyState === 4 && xhr.status === 200) || xhr.status === 201) {
      // Print received data from server
      //console.log(this.responseText);
    } else {
      //console.log(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
    }
    callback(xhr.status);
  };

  xhr.onerror = function () {
    // only triggers if the request couldn't be made at all
    //alert(`Network Error`);
    callback("Network Error");
  };

  // Converting JSON data to string
  let json = {
    username: username,
    logintoken: logintoken,
    appid: appid,
    points: points,
    description: description,
  };

  // Sending data with the request
  xhr.send(JSON.stringify(json));
}

function get_ratings(app_slug, callback) {
  let xhr = new XMLHttpRequest({ mozSystem: true });
  let url = "https://bhackers.uber.space/srs/v1/ratings/" + app_slug;

  xhr.open("GET", url, true);

  xhr.responseType = "json";

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      callback(xhr.response);
    } else {
      //callback(xhr.status);
      //console.log(`Error ${xhr.status}: ${xhr.statusText}`); // e.g. 404: Not Found
    }
  };

  xhr.onerror = function () {
    // only triggers if the request couldn't be made at all
    //alert(`Network Error`);
    callback("Network Error");
  };

  // Sending data with the request
  xhr.send("");
}
