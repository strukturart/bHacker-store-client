const qr = ((_) => {
  let start_scan = function (callback) {
    document.getElementById("qr-screen").style.display = "block";

    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        { audio: false, video: { width: 400, height: 400 } },
        function (stream) {
          var video = document.querySelector("video");
          video.srcObject = stream;

          video.onloadedmetadata = function (e) {
            video.play();

            var barcodeCanvas = document.createElement("canvas");
            let intv = setInterval(() => {
              barcodeCanvas.width = video.videoWidth;
              barcodeCanvas.height = video.videoHeight;
              var barcodeContext = barcodeCanvas.getContext("2d");
              var imageWidth = video.videoWidth,
                imageHeight = video.videoHeight;
              barcodeContext.drawImage(video, 0, 0, imageWidth, imageHeight);

              var imageData = barcodeContext.getImageData(
                0,
                0,
                imageWidth,
                imageHeight
              );
              var idd = imageData.data;

              let code = jsQR(idd, imageWidth, imageHeight);

              if (code) {
                callback(code.data);
                document.getElementById("qr-screen").style.display = "none";
                video.getTracks().forEach((track) => track.stop());
              }

              var check_stream = setInterval(function () {
                if (
                  document.getElementById("qr-screen").style.display == "none"
                ) {
                  video.getTracks().forEach((video) => video.stop());
                  alert("");
                  clearInterval(check_stream);
                }
              }, 1000);
            }, 1000);
          };
        },
        function (err) {
          console.log("The following error occurred: " + err.name);
        }
      );
    } else {
      console.log("getUserMedia not supported");
    }
  };

  return { start_scan };
})();
