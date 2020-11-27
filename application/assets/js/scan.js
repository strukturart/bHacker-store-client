let start_scan = function(callback) {



    document.getElementById("qr-screen").style.display = "block"

    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

    if (navigator.getUserMedia) {
        navigator.getUserMedia({ audio: false, video: { width: 400, height: 400 } },
            function(stream) {
                var video = document.querySelector('video');
                video.srcObject = stream;

                var track = stream.getTracks()[0];
                video.onloadedmetadata = function(e) {
                    video.play();

                    var barcodeCanvas = document.createElement("canvas");
                    let intv = setInterval(() => {

                        barcodeCanvas.width = video.videoWidth;
                        barcodeCanvas.height = video.videoHeight;
                        var barcodeContext = barcodeCanvas.getContext('2d');
                        var imageWidth = video.videoWidth,
                            imageHeight = video.videoHeight;
                        barcodeContext.drawImage(video, 0, 0, imageWidth, imageHeight);

                        var imageData = barcodeContext.getImageData(0, 0, imageWidth, imageHeight);
                        var idd = imageData.data;
                        console.log(idd)

                        let code = jsQR(idd, imageWidth, imageHeight);

                        if (code) {
                            callback(code.data)
                        }

                    }, 1000);



                };
            },
            function(err) {
                console.log("The following error occurred: " + err.name);
            }
        );
    } else {
        console.log("getUserMedia not supported");
    }


}