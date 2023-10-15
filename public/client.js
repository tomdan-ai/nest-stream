// public/client.js

const videoElement = document.getElementById('webcam');
const startRecordingButton = document.getElementById('startRecording');
const stopRecordingButton = document.getElementById('stopRecording');

let mediaRecorder;
let chunks = [];

navigator.mediaDevices
  .getUserMedia({ video: true })
  .then(function (stream) {
    videoElement.srcObject = stream;
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (e) {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = function () {
      const blob = new Blob(chunks, { type: 'video/webm' });
      chunks = [];

      const formData = new FormData();
      formData.append('videoData', blob);

      // Send the video data as a POST request to your Nest.js server
      fetch('/video/stream', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            console.log('Video data sent successfully.');
          } else {
            console.error('Failed to send video data.');
          }
        })
        .catch((error) => {
          console.error('Error sending video data:', error);
        });
    };
  })
  .catch(function (error) {
    console.error('Error accessing the webcam:', error);
  });

startRecordingButton.addEventListener('click', function () {
  mediaRecorder.start();
  startRecordingButton.disabled = true;
  stopRecordingButton.disabled = false;
});

stopRecordingButton.addEventListener('click', function () {
  mediaRecorder.stop();
  startRecordingButton.disabled = false;
  stopRecordingButton.disabled = true;
});
