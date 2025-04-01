
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/common/Button";
import { Mic, MicOff, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface VoiceRecorderProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onCancelRecording: () => void;
  onSendRecording: (blob: Blob, duration: number) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  isRecording,
  onStartRecording,
  onStopRecording,
  onCancelRecording,
  onSendRecording,
}) => {
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingState, setRecordingState] = useState<"inactive" | "recording" | "paused" | "stopped">("inactive");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Start timer for recording duration
  useEffect(() => {
    if (isRecording && recordingState === "recording") {
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, recordingState]);
  
  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        setRecordingState("stopped");
        
        // Stop all tracks on the stream to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setRecordingState("recording");
      setRecordingTime(0);
      onStartRecording();
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Error",
        description: "Couldn't access microphone. Please check your permissions.",
        variant: "destructive"
      });
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === "recording") {
      mediaRecorderRef.current.stop();
      onStopRecording();
    }
  };
  
  // Cancel recording
  const cancelRecording = () => {
    if (mediaRecorderRef.current) {
      if (recordingState === "recording") {
        mediaRecorderRef.current.stop();
      }
      
      setRecordingState("inactive");
      setAudioBlob(null);
      setRecordingTime(0);
      onCancelRecording();
      
      // Ensure we stop all tracks on any active stream
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    }
  };
  
  // Send recording
  const sendRecording = () => {
    if (audioBlob) {
      onSendRecording(audioBlob, recordingTime);
      setRecordingState("inactive");
      setAudioBlob(null);
      setRecordingTime(0);
    }
  };
  
  return (
    <div className={cn(
      "flex items-center transition-all duration-300",
      isRecording ? "w-full gap-2" : ""
    )}>
      {recordingState === "inactive" ? (
        <Button
          variant={isRecording ? "destructive" : "ghost"}
          size="icon"
          className={isRecording ? "" : "text-muted-foreground hover:text-foreground"}
          onClick={startRecording}
          type="button"
        >
          <Mic className={`w-5 h-5 ${isRecording ? "animate-pulse" : ""}`} />
          <span className="sr-only">Record voice message</span>
        </Button>
      ) : (
        <>
          {recordingState === "recording" ? (
            <>
              <div className="flex-grow flex items-center gap-2">
                <MicOff
                  className="w-5 h-5 text-destructive animate-pulse cursor-pointer"
                  onClick={stopRecording}
                />
                <div className="h-2 bg-muted rounded-full flex-grow">
                  <div className="h-full bg-destructive rounded-full animate-pulse" style={{ width: "100%" }}></div>
                </div>
                <span className="text-xs text-muted-foreground">{formatTime(recordingTime)}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={cancelRecording}
                type="button"
                className="text-muted-foreground"
              >
                <X className="w-5 h-5" />
                <span className="sr-only">Cancel recording</span>
              </Button>
            </>
          ) : (
            <>
              <div className="flex-grow flex items-center gap-2">
                <div className="text-xs text-muted-foreground">Voice message ({formatTime(recordingTime)})</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={cancelRecording}
                type="button"
                className="text-muted-foreground"
              >
                <X className="w-5 h-5" />
                <span className="sr-only">Cancel recording</span>
              </Button>
              <Button
                variant="primary"
                size="icon"
                onClick={sendRecording}
                type="button"
              >
                <Send className="w-5 h-5" />
                <span className="sr-only">Send recording</span>
              </Button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default VoiceRecorder;
