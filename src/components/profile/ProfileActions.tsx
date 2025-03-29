
import React from "react";
import { Button } from "@/components/common/Button";
import { User, Heart, Mail, LogOut } from "lucide-react";

interface ProfileActionsProps {
  handleLogout: () => Promise<void>;
}

const ProfileActions = ({ handleLogout }: ProfileActionsProps) => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-medium mb-4">Account</h3>
      <div className="space-y-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground"
          icon={<User className="w-4 h-4" />}
        >
          Account Settings
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground"
          icon={<Heart className="w-4 h-4" />}
        >
          Dating Preferences
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground"
          icon={<Mail className="w-4 h-4" />}
        >
          Notification Settings
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-destructive"
          icon={<LogOut className="w-4 h-4" />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default ProfileActions;
