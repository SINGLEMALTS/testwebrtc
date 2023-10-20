const socket = io();
let localvideo = document.getElementById("local");
const remotevideo = document.querySelector("#remote");
let userStream;
const url = new URL(location.href);
const room = url.searchParams.get("roomname");
let created = false;
let rtcPeerConnection;

let iceServers = {
    iceServers: [
        // { urls: "stun:stun.l.google.com:19302" },
        // { urls: "stun:stun.services.mozilla.com:3478" }
        // { urls: "turn:test1.povice.com" },
        // {
        //     urls: ["turn:test1.povice.com:3478?transport=tcp"],
        //     username: "povice",
        //     credential: "povice1004",
        // },
        // {
        //     urls: ["turn:test1.povice.com:3478?transport=tcp"],
        //     username: "povice",
        //     credential: "povice1004",
        // },
    ],
};

console.log(room);
console.log("!");
socket.emit("join", room);

socket.on("created", () => {
    created = true;
    console.log(created);
    navigator.mediaDevices
        .getUserMedia({
            video: true,
            audio: true,
        })
        .then((stream) => {
            userStream = stream;
            localvideo.srcObject = stream;
            localvideo.onloadedmetadata = () => {
                localvideo.play();
            };
        });
});

socket.on("joined", () => {
    created = false;
    console.log(created);
    navigator.mediaDevices
        .getUserMedia({
            video: true,
            audio: true,
        })
        .then((stream) => {
            userStream = stream;
            localvideo.srcObject = stream;
            localvideo.onloadedmetadata = () => {
                localvideo.play();
                socket.emit("ready", room);
            };
        });
});
socket.on("full", () => {
    alert("room is full ");
});

socket.on("ready", () => {
    if (created) {
        rtcPeerConnection = new RTCPeerConnection(iceServers);
        rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
        rtcPeerConnection.ontrack = onTrackFunction;
        rtcPeerConnection.addTrack(userStream.getTracks()[0], userStream);
        rtcPeerConnection.addTrack(userStream.getTracks()[1], userStream);
        rtcPeerConnection.createOffer().then((offer) => {
            rtcPeerConnection.setLocalDescription(offer);
            socket.emit("offer", offer, room);
        });
    }
});

socket.on("offer", (offer) => {
    if (!created) {
        rtcPeerConnection = new RTCPeerConnection(iceServers);
        rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
        rtcPeerConnection.ontrack = onTrackFunction;
        rtcPeerConnection.addTrack(userStream.getTracks()[0], userStream);
        rtcPeerConnection.addTrack(userStream.getTracks()[1], userStream);
        rtcPeerConnection.setRemoteDescription(offer);
        rtcPeerConnection.createAnswer().then((answer) => {
            rtcPeerConnection.setLocalDescription(answer);
            socket.emit("answer", answer, room);
        });
    }
});
socket.on("answer", (answer) => {
    if (created) {
        rtcPeerConnection.setRemoteDescription(answer);
    }
});

socket.on("candidate", (candidate) => {
    const Candidate = new RTCIceCandidate(candidate);
    console.log(Candidate);
    rtcPeerConnection.addIceCandidate(Candidate);
});

function OnIceCandidateFunction(event) {
    console.log("event : " + event);

    if (event.candidate) {
        socket.emit("candidate", event.candidate, room);
    }
}

function onTrackFunction(event) {
    remotevideo.srcObject = event.streams[0];
    remotevideo.onloadeddata = () => {
        remotevideo.play();
    };
}
