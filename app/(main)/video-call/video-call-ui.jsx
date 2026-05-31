"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  User,
} from "lucide-react";
import { toast } from "sonner";

export default function VideoCall({ sessionId, token }) {
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const sessionRef = useRef(null);
  const publisherRef = useRef(null);

  const router = useRouter();

  const appId = process.env.NEXT_PUBLIC_VONAGE_APPLICATION_ID;

  // Handle script load
  const handleScriptLoad = () => {
    setScriptLoaded(true);
    if (!window.OT) {
      toast.error("Failed to load Vonage Video API");
      setIsLoading(false);
      return;
    }
    initializeSession();
  };

  // Initialize video session
  const initializeSession = () => {
    if (!appId || !sessionId || !token) {
      toast.error("Missing required video call parameters");
      router.push("/appointments");
      return;
    }

    console.log({ appId, sessionId, token });

    try {
      // Initialize the session
      sessionRef.current = window.OT.initSession(appId, sessionId);

      // Subscribe to new streams
      sessionRef.current.on("streamCreated", (event) => {
        console.log(event, "New stream created");

        sessionRef.current.subscribe(
          event.stream,
          "subscriber",
          {
            insertMode: "append",
            width: "100%",
            height: "100%",
          },
          (error) => {
            if (error) {
              toast.error("Error connecting to other participant's stream");
            }
          }
        );
      });

      // Handle session events
      sessionRef.current.on("sessionConnected", () => {
        setIsConnected(true);
        setIsLoading(false);

        publisherRef.current = window.OT.initPublisher(
          "publisher",
          {
            insertMode: "replace",
            width: "100%",
            height: "100%",
            publishAudio: isAudioEnabled,
            publishVideo: isVideoEnabled,
          },
          (error) => {
            if (error) {
              console.error("Publisher error:", error);
              toast.error("Error initializing your camera and microphone");
            } else {
              console.log("Publisher initialized successfully");
            }
          }
        );
      });

      sessionRef.current.on("sessionDisconnected", () => {
        setIsConnected(false);
      });

      // Connect to the session
      sessionRef.current.connect(token, (error) => {
        if (error) {
          toast.error("Error connecting to video session");
        } else {
          if (publisherRef.current) {
            sessionRef.current.publish(publisherRef.current, (error) => {
              if (error) {
                console.log("Error publishing stream:", error);
                toast.error("Error publishing your stream");
              } else {
                console.log("Stream published successfully");
              }
            });
          }
        }
      });
    } catch (error) {
      toast.error("Failed to initialize video call");
      setIsLoading(false);
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (publisherRef.current) {
      publisherRef.current.publishVideo(!isVideoEnabled);
      setIsVideoEnabled((prev) => !prev);
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (publisherRef.current) {
      publisherRef.current.publishAudio(!isAudioEnabled);
      setIsAudioEnabled((prev) => !prev);
    }
  };

  // End call
  const endCall = () => {
    if (publisherRef.current) {
      publisherRef.current.destroy();
      publisherRef.current = null;
    }
    if (sessionRef.current) {
      sessionRef.current.disconnect();
      sessionRef.current = null;
    }
    router.push("/appointments");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (publisherRef.current) {
        publisherRef.current.destroy();
      }
      if (sessionRef.current) {
        sessionRef.current.disconnect();
      }
    };
  }, []);

  if (!sessionId || !token || !appId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Invalid Video Call
          </h1>
          <p className="text-muted-foreground mb-6 text-sm sm:text-base">
            Missing required parameters for the video call.
          </p>
          <Button
            onClick={() => router.push("/appointments")}
            className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
          >
            Back to Appointments
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://unpkg.com/@vonage/client-sdk-video@latest/dist/js/opentok.js"
        onLoad={handleScriptLoad}
        onError={() => {
          toast.error("Failed to load video call script");
          setIsLoading(false);
        }}
      />

      {/* Full viewport wrapper so it fills screen on all devices */}
      <div className="min-h-screen flex flex-col px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">

        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 flex-shrink-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
            Video Consultation
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            {isConnected
              ? "Connected"
              : isLoading
              ? "Connecting..."
              : "Connection failed"}
          </p>
        </div>

        {/* Loading state */}
        {isLoading && !scriptLoaded ? (
          <div className="flex flex-col items-center justify-center flex-1 py-12">
            <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 text-emerald-400 animate-spin mb-4" />
            <p className="text-white text-base sm:text-lg text-center px-4">
              Loading video call components...
            </p>
          </div>
        ) : (
          <div className="flex flex-col flex-1 gap-4 sm:gap-6">

            {/* Video grid — stacked on mobile, side by side on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 flex-1">

              {/* Publisher — Your video */}
              <div className="border border-emerald-900/20 rounded-lg overflow-hidden flex flex-col">
                <div className="bg-emerald-900/10 px-3 py-2 text-emerald-400 text-xs sm:text-sm font-medium flex-shrink-0">
                  You
                </div>
                <div
                  id="publisher"
                  className="w-full flex-1 bg-muted/30"
                  style={{ minHeight: "200px", height: "clamp(200px, 35vw, 420px)" }}
                >
                  {!scriptLoaded && (
                    <div className="flex items-center justify-center h-full">
                      <div className="bg-muted/20 rounded-full p-6 sm:p-8">
                        <User className="h-10 w-10 sm:h-12 sm:w-12 text-emerald-400" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Subscriber — Other participant */}
              <div className="border border-emerald-900/20 rounded-lg overflow-hidden flex flex-col">
                <div className="bg-emerald-900/10 px-3 py-2 text-emerald-400 text-xs sm:text-sm font-medium flex-shrink-0">
                  Other Participant
                </div>
                <div
                  id="subscriber"
                  className="w-full flex-1 bg-muted/30"
                  style={{ minHeight: "200px", height: "clamp(200px, 35vw, 420px)" }}
                >
                  {(!isConnected || !scriptLoaded) && (
                    <div className="flex items-center justify-center h-full">
                      <div className="bg-muted/20 rounded-full p-6 sm:p-8">
                        <User className="h-10 w-10 sm:h-12 sm:w-12 text-emerald-400" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex-shrink-0 pb-2 sm:pb-4">
              <div className="flex justify-center items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={toggleVideo}
                  className={`rounded-full p-0 h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center ${
                    isVideoEnabled
                      ? "border-emerald-900/30"
                      : "bg-red-900/20 border-red-900/30 text-red-400"
                  }`}
                  disabled={!publisherRef.current}
                >
                  {isVideoEnabled
                    ? <Video className="h-5 w-5 sm:h-6 sm:w-6" />
                    : <VideoOff className="h-5 w-5 sm:h-6 sm:w-6" />
                  }
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={toggleAudio}
                  className={`rounded-full p-0 h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center ${
                    isAudioEnabled
                      ? "border-emerald-900/30"
                      : "bg-red-900/20 border-red-900/30 text-red-400"
                  }`}
                  disabled={!publisherRef.current}
                >
                  {isAudioEnabled
                    ? <Mic className="h-5 w-5 sm:h-6 sm:w-6" />
                    : <MicOff className="h-5 w-5 sm:h-6 sm:w-6" />
                  }
                </Button>

                <Button
                  variant="destructive"
                  size="lg"
                  onClick={endCall}
                  className="rounded-full p-0 h-12 w-12 sm:h-14 sm:w-14 flex items-center justify-center bg-red-600 hover:bg-red-700"
                >
                  <PhoneOff className="h-5 w-5 sm:h-6 sm:w-6" />
                </Button>
              </div>

              <div className="text-center space-y-1">
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {isVideoEnabled ? "Camera on" : "Camera off"} •
                  {isAudioEnabled ? " Microphone on" : " Microphone off"}
                </p>
                <p className="text-muted-foreground text-xs sm:text-sm px-4">
                  When you&apos;re finished with your consultation, click the red
                  button to end the call
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
}