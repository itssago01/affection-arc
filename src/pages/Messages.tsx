
import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import ConversationList from "@/components/messaging/ConversationList";
import Conversation from "@/components/messaging/Conversation";
import EmptyConversation from "@/components/messaging/EmptyConversation";
import { useMessages } from "@/hooks/useMessages";

const Messages = () => {
  const { id } = useParams();
  const {
    newMessage,
    setNewMessage,
    activeConversation,
    matches,
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
    formatDate,
  } = useMessages(id);

  return (
    <div className="min-h-screen bg-background pt-16 pb-20 md:pb-0">
      <Navbar />
      
      <main className="container max-w-6xl mx-auto h-[calc(100vh-64px-80px)] md:h-[calc(100vh-64px)] flex flex-col md:flex-row">
        <ConversationList 
          matches={matches} 
          activeId={id} 
          formatDate={formatDate}
        />
        
        {activeConversation ? (
          <Conversation
            conversation={activeConversation}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            isRecording={isRecording}
            selectedFile={selectedFile}
            attachmentType={attachmentType}
            handleSendMessage={handleSendMessage}
            handleSendVoiceMessage={handleSendVoiceMessage}
            handleFileSelected={handleFileSelected}
            handleCancelAttachment={handleCancelAttachment}
            handleMessageReaction={handleMessageReaction}
            handleDeleteMessage={handleDeleteMessage}
            handleStartRecording={handleStartRecording}
            handleStopRecording={handleStopRecording}
            handleCancelRecording={handleCancelRecording}
          />
        ) : (
          <EmptyConversation />
        )}
      </main>
    </div>
  );
};

export default Messages;
