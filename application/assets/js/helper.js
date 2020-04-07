function notify(param_title, param_text, param_silent, requireInteraction) {

    var options = {
        body: param_text,
        silent: param_silent,
        requireInteraction: requireInteraction


    }

    var action = {
        actions: [{
            action: 'archive',
            title: 'Archive'
        }]
    }




    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(param_title, options);



    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function(permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(param_title, options, action);

            }
        });
    }

}



//silent notification
function toaster(text, time) {


    $("div#toast").html(text)

    $("div#toast").animate({ top: "0px" }, 1000, "linear", function() {
        $("div#toast").delay(time).animate({ top: "-110vh" }, 1000);

    });

}


//check if internet connection 
function check_iconnection() {


    if (navigator.onLine) {


    } else {
        toaster("No Internet connection");
    }
}


//wake up screen
function screenWakeLock(param1) {
    if (param1 == "lock") {
        lock = window.navigator.requestWakeLock("screen");

        lock.onsuccess = function() {
            toaster("screen-lock", 10000);

        };

        lock.onerror = function() {
            alert("An error occurred: " + this.error.name);
        };
    }

    if (param1 == "unlock") {
        if (lock.topic == "screen") {
            lock.unlock();
        }
    }
}





//remove alarms
function remove_alarms() {
    var request = navigator.mozAlarms.getAll();

    request.onsuccess = function() {


        this.result.forEach(function(alarm) {

            navigator.mozAlarms.remove(alarm.id);


        });
        console.log('operation successful:' + this.result.length + 'alarms pending');
    };

    request.onerror = function() {
        console.log("An error occurred: " + this.error.name);
    };
}


//set alarm
function setAlarm() {

    //alarm 3min later
    let alarmDate = moment() + 180000;
    //This the date to schedule the alarm
    var myDate = new Date(moment(alarmDate).format("MMMM D, YYYY HH:mm:ss"));

    // This is arbitrary data pass to the alarm
    var data = {
        foo: "bar"
    }

    // The "honorTimezone" string is what make the alarm honoring it
    var request = navigator.mozAlarms.add(myDate, "honorTimezone", data);

    request.onsuccess = function() {
        toaster("The alarm has been scheduled", 10000);
        // alarmId = this.result;

    };

    request.onerror = function() {
        alert("An error occurred: " + this.error.name);
    };

}





//get all alarms
function getAlarm() {
    localStorage.setItem('test', 'get');
    var cat = localStorage.getItem('test');
    alert(cat)
    var request = navigator.mozAlarms.getAll();

    request.onsuccess = function() {

        screenWakeLock('lock')
        if (navigator.mozPower.screenEnabled === false) {
            navigator.mozPower.screenEnabled = true;
        }

        this.result.forEach(function(alarm) {
            console.log('Id: ' + alarm.id);
            alert('date: ' + alarm.date);
            console.log('respectTimezone: ' + alarm.respectTimezone);
            console.log('data: ' + JSON.stringify(alarm.data));
        });
    };

    request.onerror = function() {
        alert("An error occurred: " + this.error.name);
    };

}


//alarm listener
navigator.mozSetMessageHandler("alarm", function(mozAlarm) {
    //var getData = JSON.stringify(mozAlarm.data)
    localStorage.setItem('test', 'run');

    screenWakeLock("lock");
    if (navigator.mozPower.screenEnabled === false) {
        navigator.mozPower.screenEnabled = true;
    }

    notify("alarm", "Start", true);

});