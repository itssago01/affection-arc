
import React from "react";
import { Button } from "@/components/common/Button";
import { Edit, Save } from "lucide-react";

interface ProfileHeaderProps {
  isEditing: boolean;
  handleEdit: () => void;
  handleSave: () => void;
  handleCancel: () => void;
}

const ProfileHeader = ({
  isEditing,
  handleEdit,
  handleSave,
  handleCancel
}: ProfileHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button 
              variant="outline" 
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              icon={<Save className="w-4 h-4" />}
            >
              Save
            </Button>
          </>
        ) : (
          <Button 
            variant="outline" 
            onClick={handleEdit}
            icon={<Edit className="w-4 h-4" />}
          >
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
