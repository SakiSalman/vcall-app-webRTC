let s1 = document.getElementById("s1");
let s2 = document.getElementById("s2");
let call_btn = document.getElementById("call-btn");
let video_btn = document.getElementById("video-btn");
let audio_btn = document.getElementById("audio-btn");
let srcreen_btn = document.getElementById("srcreen-btn");

let peerConn;
let localStream;
let remoteStream;

// Server Initialization

let servers = {
  iceServers: [
    {
      urls: ["stun:stun1.1.google.com:19302", "stun:stun2.2.google.com:19302"],
    },
  ],
};

// GET lOCAL Stream

const localStreamInit = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  s2.srcObject = localStream;
  localStream.getAudioTracks()[0].enabled = false;
};

// create Offer Function
const createOffer = async () => {
  peerConn = new RTCPeerConnection(servers);

  // Get remote Stream
  remoteStream = new MediaStream();

  s1.srcObject = remoteStream;

  localStream.getTracks().forEach((track) => {
    peerConn.addTrack(track, localStream);
  });

  peerConn.ontrack = async (event) => {
    event.streams[0].getTracks.forEach((track) => {
      remoteStream.addTrack(track);
    });
  };
  // check ice cendidate

  peerConn.onicecandidate = async (e) => {
    if (e.candidate) {
      document.getElementById("offer_sdp").value = JSON.stringify(
        peerConn.localDescription
      );
    }
  };

  // create Offer
  let offer = await peerConn.createOffer();
  document.getElementById("offer_sdp").value = JSON.stringify(offer);
  await peerConn.setLocalDescription(offer);
};
// create answer Function
const createAnswer = async () => {
  peerConn = new RTCPeerConnection(servers);

  // Get remote Stream
  remoteStream = new MediaStream();

  s1.srcObject = remoteStream;

  localStream.getTracks().forEach((track) => {
    peerConn.addTrack(track, localStream);
  });

  peerConn.ontrack = async (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };
  // check ice cendidate

  peerConn.onicecandidate = async (e) => {
    if (e.candidate) {
      document.getElementById("answer_sdp").value = JSON.stringify(
        peerConn.localDescription
      );
    }
  };

  // recieve Offer
  let offer = document.getElementById("offer_sdp").value;
  offer = JSON.parse(offer);

  await peerConn.setRemoteDescription(offer);

  // create Offer
  let answer = await peerConn.createAnswer();
  document.getElementById("answer_sdp").value = JSON.stringify(answer);
  await peerConn.setLocalDescription(answer);
};

// add answer
const addAnswer = async () => {
  let answer = document.getElementById("addanswer-sdp").value;
  answer = JSON.parse(answer);
  await peerConn.setRemoteDescription(answer);
};

localStreamInit();

// handle Create offer with onclick
document.getElementById("create_offer").onclick = () => {
  createOffer();
};
// handle answer with onclick
document.getElementById("create_answer").onclick = () => {
  createAnswer();
};
// handle Add answer with onclick
document.getElementById("add_answer").onclick = () => {
  addAnswer();
};

// handle vido tracks with onclick
let cameraStatus = true;
video_btn.onclick = () => {
  cameraStatus = !cameraStatus;
  localStream.getVideoTracks()[0].enabled = cameraStatus;
  video_btn.classList.toggle("active");
};
// handle audio tracks with onclick
let audioStatus = true;
audio_btn.onclick = () => {
  audioStatus = !audioStatus;
  localStream.getAudioTracks()[0].enabled = audioStatus;
  audio_btn.classList.toggle("active");
};
