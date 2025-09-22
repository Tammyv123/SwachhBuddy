import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, Bell, Globe } from "lucide-react";

const Settings = () => {
  return (
    <div className="min-h-screen bg-green-50 p-6">
      <h1 className="text-3xl font-bold text-green-900 mb-6">Settings</h1>
      <p className="text-green-800 mb-8">
        Customize your preferences to make your experience more eco-friendly and sustainable.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Theme */}
        <Card className="bg-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5 text-yellow-500" /> Theme
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span>Dark Mode</span>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <span>Eco Light Mode</span>
              <Badge variant="secondary" className="text-xs">
                Recommended
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-green-700" /> Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span>Email Alerts</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Push Notifications</span>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card className="bg-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" /> Language
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-800 mb-2">Select your preferred language:</p>
            <select className="w-full border border-green-300 rounded-md p-2 bg-green-50 text-green-900">
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="bn">বাংলা</option>
              <option value="ta">தமிழ்</option>
              <option value="te">తెలుగు</option>
              <option value="mr">मराठी</option>
              <option value="gu">ગુજરાતી</option>
              <option value="kn">ಕನ್ನಡ</option>
            </select>
          </CardContent>
        </Card>

        {/* Account */}
        <Card className="bg-green-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-purple-600" /> Account
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span>Change Password</span>
              <button className="text-green-700 font-medium">Update</button>
            </div>
            <div className="flex items-center justify-between">
              <span>Delete Account</span>
              <button className="text-red-600 font-medium">Delete</button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;