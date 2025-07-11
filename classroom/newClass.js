import { auth, collection, db, doc, getDoc, getDocs, setDoc, query, onAuthStateChanged, onSnapshot, updateDoc, deleteDoc, arrayUnion } from "../auth/config.js";

const roomId = new URLSearchParams(window.location.search).get("roomId");
const localVideo = document.getElementById('localVideo');
const remoteDiv = document.getElementById('remoteVideos');
let localStream = null;

onAuthStateChanged(auth, async user => {
    if(user){
        const userId = user.uid;
        localStream = await navigator.mediaDevices.getUserMedia({video: true, audio: true});
        localVideo.srcObject = localStream;
        joinRoom(userId);
    } else{
        window.location.href = '../auth/login.html';
    }
})

async function joinRoom(userId) {
    const peerRef = doc(db, 'rooms', roomId, "peers", userId);
    await setDoc(peerRef, {
        joinedAt: Date.now(),
        lastSeen: Date.now(),
    });
    trackLastSeen(userId);
    const userRef = doc(db, 'users', userId);
    const type = (await getDoc(userRef)).data().type;
    if(type === "teacher"){
        deleteConnection()
    }
    createConnection(userId);
}


async function createConnection(userId) {
    const peerList = query(collection(db, 'rooms', roomId, 'peers'));
    onSnapshot(peerList, snap => {        
        snap.forEach(async peerDoc => {          
            if (peerDoc.id !== userId) {
                const connectionRef = doc(db, 'rooms', roomId, 'connections', `${userId.localeCompare(peerDoc.id) <= 0 ? `${userId}-${peerDoc.id}` : `${peerDoc.id}-${userId}`}`);
                const connectionDoc = await getDoc(connectionRef);
                if (!connectionDoc.exists()) {
                    await setDoc(connectionRef, {
                        offer: {},
                        answer: {},
                        candidates: {}
                    })
                }                
                webRTCFunctioning(userId, peerDoc.id);
            }
        });
    })
}

async function webRTCFunctioning(userId, peerId) {
    console.log("Self:", userId);
    console.log("Peer:", peerId);
    
    const connectionRef = doc(db, 'rooms', roomId, 'connections', `${userId.localeCompare(peerId) <= 0 ? `${userId}-${peerId}` : `${peerId}-${userId}`}`);
    const peerConnection = new RTCPeerConnection({
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            {
                urls: "turn:openrelay.metered.ca:80",
                username: "openrelayproject",
                credential: "openrelayproject"
            },
            {
                urls: "turn:openrelay.metered.ca:443",
                username: "openrelayproject",
                credential: "openrelayproject"
            },
            {
                urls: "turn:openrelay.metered.ca:443?transport=tcp",
                username: "openrelayproject",
                credential: "openrelayproject"
            }
        ]
    });
    localStream.getTracks().forEach(track => {        
        peerConnection.addTrack(track, localStream)
    })

    const addedCandidates = new Set();

    if(userId.localeCompare(peerId) <= 0){
        console.log("offer", peerConnection.signalingState);
        
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        await updateDoc(connectionRef, {
            offer: offer,
            answer: {},
            candidates: {}
        })
        onSnapshot(connectionRef, async snap => {
            const data = snap.data();
            if(data?.answer && Object.keys(data.answer).length >= 1){
                if(peerConnection.signalingState !== "stable"){
                    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
                }
            }
        const candidatesList = snap.data().candidates[peerId];
        candidatesList?.forEach(async candidate => {
            if(!addedCandidates.has(candidate)){
                const parsedCandidate = new RTCIceCandidate(JSON.parse(candidate));
                peerConnection.addIceCandidate(parsedCandidate);
                addedCandidates.add(candidate);
            }
        })
    })
    } else {
        let i = 0;
        onSnapshot(connectionRef, async snap => {
            console.log("answer", peerConnection.signalingState);
            
            const data = snap.data();
            
            if ( Object.keys(data.offer).length > 0 && Object.keys(data.answer).length < 1) {           
                console.log(i++);
                try {
                    console.log(peerConnection);                   
                    let answer;
                    await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
                    if (peerConnection.signalingState == "have-remote-offer") {
                        answer = await peerConnection.createAnswer();                    
                        await peerConnection.setLocalDescription(answer);
                    }
                    await updateDoc(connectionRef, {
                        answer: answer || {},
                    });
                } catch (error) {
                    console.log(error);   
                }
            }
            const candidatesList = snap.data().candidates[peerId];
            candidatesList?.forEach(async candidate => {
                if(!addedCandidates.has(candidate)){
                    const parsedCandidate = new RTCIceCandidate(JSON.parse(candidate));
                    peerConnection.addIceCandidate(parsedCandidate);
                    addedCandidates.add(candidate);
                }
            })
        })
    }

    peerConnection.onicecandidate = async e => {        
        if(e.candidate){            
            const candidateStr = JSON.stringify(e.candidate.toJSON())
            await updateDoc(connectionRef, {
                [`candidates.${userId}`]: arrayUnion(candidateStr)
            })            
        }
    };
    const addedStreams = new Set();
    peerConnection.ontrack = event => {
        console.log("ontrack fired", event);
        const remoteStream = event.streams[0];
        
        if(!addedStreams.has(remoteStream.id)){
            const video = document.createElement('video');
            video.srcObject = remoteStream;
            video.autoplay = true;
            video.playsInline = true;
            video.muted = true; // Ensure not muted
            video.style.width = "320px"; // For visibility
            video.style.height = "240px";
            remoteDiv.appendChild(video);
            console.log("Appended remote video", video, remoteDiv);
            addedStreams.add(remoteStream.id)
        }
    }
}

async function deleteConnection() {
    const peerList = query(collection(db, 'rooms', roomId, "peers"));
    onSnapshot(peerList, snap => {
        snap.forEach(async doc => {
            if((Date.now() - doc?.data()?.lastSeen) > 2000000){
                await deleteDoc(doc?.ref);
            }
        });       
    });
}

function trackLastSeen(userId) {
    setInterval(async () => {
        await updateDoc(doc(db, 'rooms', roomId, 'peers', userId), {
            lastSeen: Date.now()
        })
    }, 500000)
}