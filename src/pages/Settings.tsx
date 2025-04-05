
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import AnimatedContainer from "@/components/common/AnimatedContainer";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/common/Button";
import { useNavigate } from "react-router-dom";
import { BellRing, Shield, Eye, Moon, LogOut, Heart, MessageSquare, User, Info, Sun, Palette } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

const Settings = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    notifications: {
      newMatches: true,
      messages: true,
      appUpdates: false,
    },
    privacy: {
      showOnlineStatus: true,
      showLastActive: true,
      profileVisibility: "public",
    },
    appearance: {
      darkMode: theme === "dark",
      reducedMotion: false,
    }
  });

  const handleSettingToggle = (category: string, setting: string) => {
    if (category === "appearance" && setting === "darkMode") {
      // Toggle between light and dark theme
      const newDarkModeSetting = !settings.appearance.darkMode;
      setTheme(newDarkModeSetting ? "dark" : "light");
      
      setSettings((prev) => ({
        ...prev,
        appearance: {
          ...prev.appearance,
          darkMode: newDarkModeSetting,
        },
      }));
    } else {
      setSettings((prev) => ({
        ...prev,
        [category]: {
          ...prev[category as keyof typeof prev],
          [setting]: !prev[category as keyof typeof prev][setting as keyof typeof prev[keyof typeof prev]],
        },
      }));
    }
    
    toast.success(`Setting updated successfully`);
  };

  const handleThemeChange = (selectedTheme: "light" | "dark" | "colorful") => {
    setTheme(selectedTheme);
    
    // Update the darkMode setting to stay in sync
    setSettings((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        darkMode: selectedTheme === "dark",
      },
    }));
    
    toast.success(`${selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)} theme applied`);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("You've been logged out");
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Navbar />
      <div className="container max-w-4xl mx-auto pt-20 px-4 md:px-6">
        <AnimatedContainer animation="fade-in" className="space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>

          <Tabs defaultValue="notifications" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-6 rounded-full">
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>

            <TabsContent value="notifications" className="space-y-4">
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-medium mb-4 flex items-center">
                  <BellRing className="w-5 h-5 mr-2" /> Notification Settings
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Matches</p>
                      <p className="text-sm text-muted-foreground">Get notified when you match with someone</p>
                    </div>
                    <Switch 
                      checked={settings.notifications.newMatches} 
                      onCheckedChange={() => handleSettingToggle("notifications", "newMatches")} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Messages</p>
                      <p className="text-sm text-muted-foreground">Get notified when you receive new messages</p>
                    </div>
                    <Switch 
                      checked={settings.notifications.messages} 
                      onCheckedChange={() => handleSettingToggle("notifications", "messages")} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">App Updates</p>
                      <p className="text-sm text-muted-foreground">Get notified about new features and updates</p>
                    </div>
                    <Switch 
                      checked={settings.notifications.appUpdates} 
                      onCheckedChange={() => handleSettingToggle("notifications", "appUpdates")} 
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-4">
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-medium mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2" /> Privacy Settings
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Online Status</p>
                      <p className="text-sm text-muted-foreground">Show when you're active on the app</p>
                    </div>
                    <Switch 
                      checked={settings.privacy.showOnlineStatus} 
                      onCheckedChange={() => handleSettingToggle("privacy", "showOnlineStatus")} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Last Active</p>
                      <p className="text-sm text-muted-foreground">Show when you were last active</p>
                    </div>
                    <Switch 
                      checked={settings.privacy.showLastActive} 
                      onCheckedChange={() => handleSettingToggle("privacy", "showLastActive")} 
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4">
              <div className="bg-card rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-medium mb-4 flex items-center">
                  <Eye className="w-5 h-5 mr-2" /> Appearance Settings
                </h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-muted-foreground">Toggle dark mode on or off</p>
                    </div>
                    <Switch 
                      checked={settings.appearance.darkMode} 
                      onCheckedChange={() => handleSettingToggle("appearance", "darkMode")} 
                    />
                  </div>
                  <div>
                    <p className="font-medium mb-2">Theme</p>
                    <div className="grid grid-cols-3 gap-3">
                      <Button 
                        variant={theme === "light" ? "default" : "outline"} 
                        className="flex flex-col items-center p-3 h-auto"
                        onClick={() => handleThemeChange("light")}
                      >
                        <Sun className="h-6 w-6 mb-1" />
                        <span className="text-xs">Light</span>
                      </Button>
                      <Button 
                        variant={theme === "dark" ? "default" : "outline"} 
                        className="flex flex-col items-center p-3 h-auto"
                        onClick={() => handleThemeChange("dark")}
                      >
                        <Moon className="h-6 w-6 mb-1" />
                        <span className="text-xs">Dark</span>
                      </Button>
                      <Button 
                        variant={theme === "colorful" ? "default" : "outline"} 
                        className="flex flex-col items-center p-3 h-auto"
                        onClick={() => handleThemeChange("colorful")}
                      >
                        <Palette className="h-6 w-6 mb-1" />
                        <span className="text-xs">Colorful</span>
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Reduced Motion</p>
                      <p className="text-sm text-muted-foreground">Reduce animations for accessibility</p>
                    </div>
                    <Switch 
                      checked={settings.appearance.reducedMotion} 
                      onCheckedChange={() => handleSettingToggle("appearance", "reducedMotion")} 
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="bg-card rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2" /> Account Actions
            </h2>
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground"
                icon={<Shield className="w-4 h-4" />}
                onClick={() => navigate("/account/security")}
              >
                Security Settings
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground"
                icon={<Heart className="w-4 h-4" />}
                onClick={() => navigate("/preferences")}
              >
                Dating Preferences
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
        </AnimatedContainer>
      </div>
    </div>
  );
};

export default Settings;
