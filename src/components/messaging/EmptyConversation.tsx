
import React from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { Button } from "@/components/common/Button";

const EmptyConversation: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Heart className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>
        <h2 className="text-xl font-semibold mb-2">No conversation selected</h2>
        <p className="text-muted-foreground mb-4">
          Select a conversation from the sidebar or start matching with new people
        </p>
        <Button 
          onClick={() => navigate("/matches")}
          icon={<Heart className="w-4 h-4" />}
          iconPosition="left"
        >
          View Matches
        </Button>
      </div>
    </div>
  );
};

export default EmptyConversation;
