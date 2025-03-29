
import React from "react";
import Navbar from "@/components/layout/Navbar";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { useProfile } from "@/hooks/useProfile";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePhotos from "@/components/profile/ProfilePhotos";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfileActions from "@/components/profile/ProfileActions";

const Profile = () => {
  const {
    profile,
    tempProfile,
    isEditing,
    handleEdit,
    handleSave,
    handleCancel,
    handleInputChange,
    handleInterestChange,
    handleLogout
  } = useProfile();

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      <div className="container max-w-4xl pt-20 px-4 md:px-6">
        <div className="mt-8">
          <AnimatedContainer animation="fade-in" className="space-y-8">
            <ProfileHeader 
              isEditing={isEditing}
              handleEdit={handleEdit}
              handleSave={handleSave}
              handleCancel={handleCancel}
            />

            <ProfilePhotos 
              images={profile.images}
              isEditing={isEditing}
            />

            <ProfileInfo
              profile={profile}
              tempProfile={tempProfile}
              isEditing={isEditing}
              handleInputChange={handleInputChange}
              handleInterestChange={handleInterestChange}
            />

            <ProfileActions 
              handleLogout={handleLogout}
            />
          </AnimatedContainer>
        </div>
      </div>
    </div>
  );
};

export default Profile;
