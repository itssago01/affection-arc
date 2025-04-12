
import React from "react";
import Navbar from "@/components/layout/Navbar";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { useProfile } from "@/hooks/useProfile";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfilePhotos from "@/components/profile/ProfilePhotos";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ProfilePreferences from "@/components/profile/ProfilePreferences";
import ProfileActions from "@/components/profile/ProfileActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings } from "lucide-react";

const Profile = () => {
  const {
    profile,
    tempProfile,
    isEditing,
    activeTab,
    setActiveTab,
    handleEdit,
    handleSave,
    handleCancel,
    handleInputChange,
    handleInterestChange,
    handleToggleInterest,
    handleAddInterest,
    handlePreferenceChange,
    handleAgeRangeChange,
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

            <Tabs 
              defaultValue="info" 
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as "info" | "preferences")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Profile Info</span>
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Dating Preferences</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="mt-4">
                <ProfileInfo
                  profile={profile}
                  tempProfile={tempProfile}
                  isEditing={isEditing}
                  handleInputChange={handleInputChange}
                  handleInterestChange={handleInterestChange}
                  handleToggleInterest={handleToggleInterest}
                  handleAddInterest={handleAddInterest}
                />
              </TabsContent>
              
              <TabsContent value="preferences" className="mt-4">
                {profile.datingPreferences && (
                  <ProfilePreferences
                    preferences={profile.datingPreferences}
                    isEditing={isEditing}
                    handlePreferenceChange={handlePreferenceChange}
                    handleAgeRangeChange={handleAgeRangeChange}
                  />
                )}
              </TabsContent>
            </Tabs>

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
