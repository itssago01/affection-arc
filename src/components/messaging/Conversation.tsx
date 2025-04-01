
import React, { useRef, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import MessageBubble from "@/components/messaging/MessageBubble";
import VoiceRecorder from "@/components/messaging/VoiceRecorder";
import FileAttachment from "@/components/messaging/FileAttachment";
import { Conversation as ConversationType } from "@/hooks/useMessages";

type ConversationProps = {
  conversation: ConversationType;
  newMessage: string;
  setNewMessage: (message: string) => void;
  isRecording: boolean;
  selectedFile: File | null;
  attachmentType: "file" | "image" | null;
  handleSendMessage: () => void;
  handleSendVoiceMessage: (blob: Blob, duration: number) => void;
  handleFileSelected: (file: File) => void;
  handleCancelAttachment: () => void;
  handleMessageReaction: (messageId: string, reaction: "heart" | "thumbsUp" | "laugh" | null) => void;
  handleDeleteMessage: (messageId: string) => void;
  handleStartRecording: () => void;
  handleStopRecording: () => void;
  handleCancelRecording: () => void;
};

const Conversation: React.FC<ConversationProps> = ({
  conversation,
  newMessage,
  setNewMessage,
  isRecording,
  selectedFile,
  attachmentType,
  handleSendMessage,
  handleSendVoiceMessage,
  handleFileSelected,
  handleCancelAttachment,
  handleMessageReaction,
  handleDeleteMessage,
  handleStartRecording,
  handleStopRecording,
  handleCancelRecording,
}) => {
  const navigate = useNavigate();
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  return (
    <div className="flex-1 flex flex-col">
      <div className="p-4 border-b border-border flex items-center">
        <Button 
          variant="ghost" 
          size="icon"
          className="md:hidden mr-2"
          onClick={() => navigate("/messages")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img 
            src={conversation.image} 
            alt={conversation.name} 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center">
            <h2 className="font-medium">{conversation.name}, {conversation.age}</h2>
            {conversation.isTyping && (
              <span className="ml-2 text-xs text-muted-foreground animate-pulse">
                typing...
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map((message) => (
          <MessageBubble 
            key={message.id} 
            message={message}
            onReaction={handleMessageReaction}
            onDelete={handleDeleteMessage}
          />
        ))}
        <div ref={messageEndRef} />
      </div>
      
      <div className="p-4 border-t border-border">
        {selectedFile ? (
          <div className="flex items-center mb-2">
            <FileAttachment 
              onFileSelected={handleFileSelected}
              onCancel={handleCancelAttachment}
              isAttaching={!!selectedFile}
              attachmentType={attachmentType}
            />
          </div>
        ) : isRecording ? (
          <div className="flex items-center">
            <VoiceRecorder 
              isRecording={isRecording}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              onCancelRecording={handleCancelRecording}
              onSendRecording={handleSendVoiceMessage}
            />
          </div>
        ) : (
          <div className="flex items-center">
            <FileAttachment 
              onFileSelected={handleFileSelected}
              onCancel={handleCancelAttachment}
              isAttaching={false}
              attachmentType={null}
            />
            
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 mx-2 rounded-full bg-muted/50 border border-border focus:ring-primary/20"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            
            <VoiceRecorder 
              isRecording={isRecording}
              onStartRecording={handleStartRecording}
              onStopRecording={handleStopRecording}
              onCancelRecording={handleCancelRecording}
              onSendRecording={handleSendVoiceMessage}
            />
            
            <Button 
              variant={newMessage.trim() ? "primary" : "ghost"}
              size="icon"
              onClick={handleSendMessage}
              disabled={!newMessage.trim() && !selectedFile}
              icon={<Send className="w-5 h-5" />}
            >
              <span className="sr-only">Send</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversation;
