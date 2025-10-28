"use client";

import Pattern from "@/components/landing/pattern";
import React from "react";
import AgoraRTC, {
  IAgoraRTCClient,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
  IAgoraRTCRemoteUser,
} from "agora-rtc-sdk-ng";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@/components/ui/button";

export default function LiveStreamComponent() {
  const wallet = useWallet();
  const clientRef = React.useRef<IAgoraRTCClient | null>(null);
  const [localAudioTrack, setLocalAudioTrack] =
    React.useState<IMicrophoneAudioTrack | null>(null);
  const [localVideoTrack, setLocalVideoTrack] =
    React.useState<ICameraVideoTrack | null>(null);
  const [isJoined, setIsJoined] = React.useState(false);
  const [role, setRole] = React.useState<"host" | "audience" | null>(null);
  const [remoteUsers, setRemoteUsers] = React.useState<
    Map<number | string, IAgoraRTCRemoteUser>
  >(new Map());

  const localVideoRef = React.useRef<HTMLDivElement>(null);
  const remoteVideosRef = React.useRef<HTMLDivElement>(null);

  const appId = "4e6f289c926245849b9426c759d22d4b";
  const channel = "test";
  const token =
    "007eJxTYMgV2Lb5Q3iGyrQ3UquyBdzaK5a0TmTNZZCYfedH8OEtvQ8UGExSzdKMLCyTLY3MjExMLUwskyxNjMySzU0tU4yMUkySImv+ZzQEMjKE2l5kZGSAQBCfhaEktbiEgQEAJyUfEw==";
  const uid = 0;

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    
    AgoraRTC.setLogLevel(4);
    
    const client = AgoraRTC.createClient({ 
      mode: "live", 
      codec: "vp8",
    });
    clientRef.current = client;

    client.on("user-published", async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      console.log("User published:", user.uid, mediaType);

      if (mediaType === "video") {
        setRemoteUsers((prev) => new Map(prev).set(user.uid, user));
      }

      if (mediaType === "audio") {
        user.audioTrack?.play();
      }
    });

    client.on("user-unpublished", (user, mediaType) => {
      console.log("User unpublished:", user.uid, mediaType);
      if (mediaType === "video") {
        setRemoteUsers((prev) => {
          const newMap = new Map(prev);
          newMap.delete(user.uid);
          return newMap;
        });
      }
    });

    client.on("user-joined", (user) => {
      console.log("User joined:", user.uid);
    });

    client.on("user-left", (user) => {
      console.log("User left:", user.uid);
      setRemoteUsers((prev) => {
        const newMap = new Map(prev);
        newMap.delete(user.uid);
        return newMap;
      });
    });

    return () => {
      client.removeAllListeners();
    };
  }, []);

  React.useEffect(() => {
    if (localVideoTrack && localVideoRef.current) {
      localVideoTrack.play(localVideoRef.current);
      console.log("Local video playing");
    }
    return () => {
      if (localVideoTrack && localVideoRef.current) {
        localVideoTrack.stop();
      }
    };
  }, [localVideoTrack]);

  React.useEffect(() => {
    remoteUsers.forEach((user) => {
      const container = document.getElementById(`remote-${user.uid}`);
      if (user.videoTrack && container) {
        user.videoTrack.play(container);
      }
    });
  }, [remoteUsers]);

  async function createLocalTracks() {
    try {
      const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      const videoTrack = await AgoraRTC.createCameraVideoTrack();
      
      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);
      
      if (localVideoRef.current) {
        videoTrack.play(localVideoRef.current);
        console.log("Playing local video immediately");
      }
      
      return { audioTrack, videoTrack };
    } catch (error) {
      console.error("Error creating local tracks:", error);
      throw error;
    }
  }

  async function joinAsHost() {
    try {
      if (!clientRef.current) return;

      const { audioTrack, videoTrack } = await createLocalTracks();
      
      await clientRef.current.join(appId, channel, token, uid);
      await clientRef.current.setClientRole("host");
      await clientRef.current.publish([audioTrack, videoTrack]);

      setIsJoined(true);
      setRole("host");
      console.log("Host joined and published tracks.");
    } catch (error) {
      console.error("Error joining as host:", error);
    }
  }

  async function joinAsAudience() {
    try {
      if (!clientRef.current) return;
      await clientRef.current.join(appId, channel, token, uid);
      const clientRoleOptions = { level: 2 };
      await clientRef.current.setClientRole("audience", clientRoleOptions);

      setIsJoined(true);
      setRole("audience");
      console.log("Audience joined.");
    } catch (error) {
      console.error("Error joining as audience:", error);
    }
  }

  async function leaveChannel() {
    try {
      if (localAudioTrack) {
        localAudioTrack.close();
        setLocalAudioTrack(null);
      }
      if (localVideoTrack) {
        localVideoTrack.close();
        setLocalVideoTrack(null);
      }

      if (clientRef.current) {
        await clientRef.current.leave();
      }

      setRemoteUsers(new Map());
      setIsJoined(false);
      setRole(null);
      console.log("Left the channel.");
    } catch (error) {
      console.error("Error leaving channel:", error);
    }
  }

  return (
    <div className="max-w-7xl mx-auto relative min-h-[90vh] border-x">
      <Pattern />

      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold mb-4">Live Streaming</h1>
        <div className="flex gap-4">
          <Button onClick={joinAsHost} disabled={isJoined} id="host-join">
            Join as Host
          </Button>
          <Button
            onClick={joinAsAudience}
            disabled={isJoined}
            variant="outline"
            id="audience-join"
          >
            Join as Audience
          </Button>
          <Button
            onClick={leaveChannel}
            disabled={!isJoined}
            variant="destructive"
            id="leave"
          >
            Leave Channel
          </Button>
        </div>
        {isJoined && (
          <p className="mt-4 text-sm text-muted-foreground">
            Joined as: <span className="font-semibold">{role}</span> | UID:{" "}
            {uid}
          </p>
        )}
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {role === "host" && localVideoTrack && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Local Video (You)</h2>
            <div
              ref={localVideoRef}
              id={String(uid)}
              className="w-full aspect-video bg-black border rounded-lg overflow-hidden"
            />
          </div>
        )}

        {role === "host" && !localVideoTrack && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Local Video (You)</h2>
            <div className="w-full aspect-video bg-muted border rounded-lg overflow-hidden flex items-center justify-center text-muted-foreground">
              Loading camera...
            </div>
          </div>
        )}

        <div className="space-y-2 lg:col-span-2">
          <h2 className="text-lg font-semibold">
            Remote Users ({remoteUsers.size})
          </h2>
          <div
            ref={remoteVideosRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {Array.from(remoteUsers.values()).map((user) => (
              <div key={user.uid} className="space-y-1">
                <p className="text-sm text-muted-foreground">User {user.uid}</p>
                <div
                  id={`remote-${user.uid}`}
                  className="w-full aspect-video bg-muted border rounded-lg overflow-hidden"
                >
                  {!user.videoTrack && (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      Audio only
                    </div>
                  )}
                </div>
              </div>
            ))}
            {remoteUsers.size === 0 && (
              <div className="col-span-full text-center text-muted-foreground py-10">
                No remote users yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
