$(window).on('load', function() {


  console.log(userUploadedVideos);
  var blocks = [];
  for (var i = 0; i < userUploadedVideos.length; i++) {
    blocks.push('<div class="user_video">');
    blocks.push('<video width="100" src="' + userUploadedVideos[i].url + '"</video>');

    blocks.push('</div>');
  }

  console.log(blocks, 'blocks!!!');
  $('#user_uploaded_videos').append($(blocks.join('')));
  $('#giphy_videos').append($(blocks.join('')));
  $('#pexel_videos').append($(blocks.join('')));

})


var userUploadedVideos = [

  {
    'name': 'Video 1',
    'url': 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    'name': 'Video 2',
    'url': 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    'name': 'Video 3',
    'url': 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },


];


function startCamera() {
  let constraintObj = {
    audio: false,
    video: {
      facingMode: "user",
      width: {
        min: 640,
        ideal: 1280,
        max: 1920
      },
      height: {
        min: 480,
        ideal: 720,
        max: 1080
      }
    }
  };

  //handle older browsers that might implement getUserMedia in some way
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
    navigator.mediaDevices.getUserMedia = function(constraintObj) {
      let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      }
      return new Promise(function(resolve, reject) {
        getUserMedia.call(navigator, constraintObj, resolve, reject);
      });
    }
  } else {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        devices.forEach(device => {
          console.log(device.kind.toUpperCase(), device.label);
          //, device.deviceId
        })
      })
      .catch(err => {
        console.log(err.name, err.message);
      })
  }


  navigator.mediaDevices.getUserMedia(constraintObj)
    .then(function(mediaStreamObj) {
      //connect the media stream to the first video element
      let video = document.getElementById('recordVideo');
      if ("srcObject" in video) {
        video.srcObject = mediaStreamObj;
      } else {
        //old version
        video.src = window.URL.createObjectURL(mediaStreamObj);
      }

      video.onloadedmetadata = function(ev) {
        //show in the video element what is being captured by the webcam
        video.play();
      };

      //add listeners for saving video/audio
      let start = document.getElementById('btnStart');
      let stop = document.getElementById('btnStop');
      let retakeVideo = document.getElementById('btnRetake');
      let finalVideo = document.getElementById('btnSubmitVid');
      let vidSave = document.getElementById('vid2');
      let mediaRecorder = new MediaRecorder(mediaStreamObj);
      let chunks = [];

      start.addEventListener('click', (ev) => {
        mediaRecorder.start();
        document.getElementById('btnStop').style.display = "block";
        document.getElementById('btnStart').style.display = "none";
        document.getElementById('stop_recording_header').style.display = "block";
        document.getElementById('start_recording_header').style.display = "none";

        console.log(mediaRecorder.state);
      })
      retakeVideo.addEventListener('click', (ev) => {
        mediaRecorder.start();
        document.getElementById('btnStop').style.display = "none";
        document.getElementById('btnStart').style.display = "block";
        document.getElementById('recordVideo').style.display = "block";
        document.getElementById('stop_recording_header').style.display = "none";
        document.getElementById('start_recording_header').style.display = "block";
        document.getElementById('record_video_captions').style.display = "block";
        document.getElementById('recording_headers_timer').style.display = "block";

        document.getElementById('vid2').style.display = "none";
        document.getElementById('finalButtons').style.display = "none";
        document.getElementById('retake_header').style.display = "none";
        document.getElementById('submit_header').style.display = "none";
        console.log(mediaRecorder.state);
      })
      stop.addEventListener('click', (ev) => {
        mediaRecorder.stop();
        document.getElementById('btnStop').style.display = "none";
        document.getElementById('btnStart').style.display = "none";
        document.getElementById('recordVideo').style.display = "none";
        document.getElementById('stop_recording_header').style.display = "none";
        document.getElementById('vid2').style.display = "block";
        document.getElementById('record_video_captions').style.display = "none";
        document.getElementById('recording_headers_timer').style.display = "none";

        document.getElementById('finalButtons').style.display = "block";
        document.getElementById('retake_header').style.display = "block";
        document.getElementById('submit_header').style.display = "block";
        console.log(mediaRecorder.state);
      });
      mediaRecorder.ondataavailable = function(ev) {
        chunks.push(ev.data);
      }
      mediaRecorder.onstop = (ev) => {
        let blob = new Blob(chunks, {
          'type': 'video/mp4;'
        });
        chunks = [];
        let videoURL = window.URL.createObjectURL(blob);
        vidSave.src = videoURL;
      }
    })
    .catch(function(err) {
      console.log(err.name, err.message);
    });
    document.getElementById("minute").innerHTML = '0';
    document.getElementById("seconds").innerHTML = '0';


}

let hour = 0;
 let minute = 0;
 let seconds = 0;
 let totalSeconds = 0;

 let intervalId = null;

function startTimer() {
  ++totalSeconds;
  hour = Math.floor(totalSeconds /3600);
  minute = Math.floor((totalSeconds - hour*3600)/60);
  seconds = totalSeconds - (hour*3600 + minute*60);

  document.getElementById("minute").innerHTML =minute;
  document.getElementById("seconds").innerHTML =seconds;
}

document.getElementById('btnStart').addEventListener('click', () => {
  intervalId = setInterval(startTimer, 1000);
})

document.getElementById('btnStop').addEventListener('click', () => {
  if (intervalId)
    clearInterval(intervalId);
});


document.getElementById('btnRetake').addEventListener('click', () => {
   totalSeconds = 0;
   document.getElementById("minute").innerHTML = '0';
   document.getElementById("seconds").innerHTML = '0';
});


let closeButton = document.getElementById("closeButton");
let stopButton = document.getElementById("btnStop");
let preview = document.getElementById("recordVideo");

closeButton.addEventListener("click", function() {
  stopRecording(preview.srcObject);
}, false);
// stopButton.addEventListener("click", function() {
//   stopRecording(preview.srcObject);
// }, false);

function stopRecording(stream) {
  stream.getTracks().forEach(track => track.stop());
}


function openVideoAudioTextPane() {
  hideFormButtons();

  document.getElementById('videoAudioTextPane').style.display = "block";

}

function openChoicesPane() {
  hideFormButtons();

  document.getElementById('choicesPane').style.display = "block";

}

function openLinkPane() {
  hideFormButtons();
  document.getElementById('linkPane').style.display = "block";

}

function hideFormButtons() {
  document.getElementById('formButtons').style.display = "none";
  document.getElementById('openForms').style.display = "block";

}

function hideForms() {
  document.getElementById('openForms').style.display = "none";
  document.getElementById('formButtons').style.display = "block";
  document.getElementById('videoAudioTextPane').style.display = "none";
  document.getElementById('choicesPane').style.display = "none";
  document.getElementById('linkPane').style.display = "none";

}

// function checkContactDetails(){
//   var checkBox = document.getElementById("checkContactDetails");
//
//   var form = document.getElementById("contactDetailsForm");
//
//   if (checkBox.checked == true) {
//     form.style.display = "block";
//   } else {
//     form.style.display = "none";
//   }
// }


$('#colorpicker').on('change', function() {
	$('#hexcolor').val(this.value);
});
$('#hexcolor').on('change', function() {
  $('#colorpicker').val(this.value);
});



$("#preview_button_desktop").click(function(){
  console.log('here!!');

  $("#mobile_preview").hide();
  $("#desktop_preview").show();
this.style.color = "#448bff";

document.getElementById('preview_button_mobile').style.color = "#5e676f";

});

$("#preview_button_mobile").click(function(){

  console.log('here!!');
  $("#mobile_preview").show();
  $("#desktop_preview").hide();
  this.style.color = "#448bff";
  document.getElementById('preview_button_desktop').style.color = "#5e676f";

});
