import React, { useEffect, useCallback, useState } from "react";
import peer from "../service/peer"; // Ensure this is correctly implemented
import { useSocket } from "../contexts/SocketProvider";
import '../index.css';

const RoomPage = () => {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`Email ${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream); // Set my stream first
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
  }, [remoteSocketId, socket]);

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call from ${from}`, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    if (myStream) {
      for (const track of myStream.getTracks()) {
        peer.peer.addTrack(track, myStream);
      }
    }
  }, [myStream]);

  const handleMuteAudio = () => {
    const audioTrack = myStream.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsAudioMuted(!audioTrack.enabled);
    }
  };

  const handleMuteVideo = () => {
    const videoTrack = myStream.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoMuted(!videoTrack.enabled);
    }
  };

  const handleScreenShare = async () => {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    const screenTrack = screenStream.getVideoTracks()[0];
    if (myStream) {
      const sender = peer.peer.getSenders().find((s) => s.track.kind === "video");
      if (sender) sender.replaceTrack(screenTrack);

      screenTrack.onended = () => {
        const videoTrack = myStream.getVideoTracks()[0];
        if (sender) sender.replaceTrack(videoTrack);
      };
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      setChatMessages((prev) => [...prev, { sender: "Me", text: message }]);
      setMessage("");
    }
  };

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams[0];
      console.log("Received remote stream");
      setRemoteStream(remoteStream);
    });
  }, []);

  return (
    
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="text-3xl font-bold text-orange-500">Hello, Tailwind!</div>

      <h1 className="text-3xl font-bold mb-4">Room Page</h1>
      <h4 className="text-lg mb-4">
        {remoteSocketId ? "Connected" : "No one in the room"}
      </h4>
      <div className="flex gap-4">
        {remoteSocketId && (
          <button
            onClick={handleCallUser}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Call
          </button>
        )}
        <button
          onClick={handleMuteAudio}
          className={`${
            isAudioMuted ? "bg-red-600" : "bg-green-600"
          } px-4 py-2 rounded hover:opacity-80`}
        >
          {isAudioMuted ? "Unmute Audio" : "Mute Audio"}
        </button>
        <button
          onClick={handleMuteVideo}
          className={`${
            isVideoMuted ? "bg-red-600" : "bg-green-600"
          } px-4 py-2 rounded hover:opacity-80`}
        >
          {isVideoMuted ? "Unmute Video" : "Mute Video"}
        </button>
        <button
          onClick={handleScreenShare}
          className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600"
        >
          Share Screen
        </button>
        <button
          onClick={() => setRemoteSocketId(null)}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          End Call
        </button>
      </div>
      <div className="mt-6 flex flex-col gap-4 lg:flex-row">
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2">My Stream</h2>
          {myStream ? (
            <video
              playsInline
              muted
              autoPlay
              className="w-72 h-40 bg-black rounded"
              ref={(video) => {
                if (video) {
                  video.srcObject = myStream;
                }
              }}
            />
          ) : (
            <div className="w-72 h-40 bg-gray-800 flex items-center justify-center rounded">
              <p>No Stream</p>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-semibold mb-2">Remote Stream</h2>
          {remoteStream ? (
            <video
              playsInline
              autoPlay
              className="w-72 h-40 bg-black rounded"
              ref={(video) => {
                if (video) {
                  video.srcObject = remoteStream;
                }
              }}
            />
          ) : (
            <div className="w-72 h-40 bg-gray-800 flex items-center justify-center rounded">
              <p>No Stream</p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 w-full lg:w-2/3 bg-gray-800 p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Chat</h3>
        <div className="h-40 overflow-y-auto bg-gray-700 p-2 rounded mb-4">
          {chatMessages.length > 0 ? (
            chatMessages.map((msg, idx) => (
              <p key={idx} className="text-sm">
                <strong>{msg.sender}:</strong> {msg.text}
              </p>
            ))
          ) : (
            <p className="text-sm text-gray-400">No messages yet.</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-4 py-2 rounded bg-gray-700 text-white outline-none"
            placeholder="Type a message"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
