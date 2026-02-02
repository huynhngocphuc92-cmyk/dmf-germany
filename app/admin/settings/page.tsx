import { Settings, Save, Server, Globe, Mail, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Information */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Globe className="w-5 h-5 text-slate-600" />
            </div>
            <h3 className="font-semibold text-slate-900">General Information</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Site Name</label>
              <input
                type="text"
                defaultValue="DMF Germany"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
              <input
                type="email"
                defaultValue={process.env.CONTACT_EMAIL || "contact@dmf.edu.vn"}
                readOnly
                className="w-full px-3 py-2 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg cursor-not-allowed"
              />
              <p className="text-xs text-slate-400 mt-1">Managed in .env file</p>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Server className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900">System Status</h3>
          </div>

          <div className="space-y-4">
            <StatusItem
              label="Supabase Database"
              status="Connected"
              color="text-green-600 bg-green-50"
            />
            <StatusItem
              label="SMTP Email Service"
              status="Active"
              color="text-green-600 bg-green-50"
            />
            <StatusItem
              label="Google Analytics"
              status={process.env.NEXT_PUBLIC_GA_ID ? "Connected" : "Missing"}
              color={
                process.env.NEXT_PUBLIC_GA_ID
                  ? "text-green-600 bg-green-50"
                  : "text-red-600 bg-red-50"
              }
            />
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 lg:col-span-2">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Security & Environment</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-slate-200 rounded-lg">
              <p className="text-sm text-slate-500">Google Analytics ID</p>
              <p className="font-mono text-sm font-medium mt-1">
                {process.env.NEXT_PUBLIC_GA_ID || "Not set"}
              </p>
            </div>
            <div className="p-4 border border-slate-200 rounded-lg">
              <p className="text-sm text-slate-500">Node Environment</p>
              <p className="font-mono text-sm font-medium mt-1 uppercase">{process.env.NODE_ENV}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusItem({ label, status, color }: { label: string; status: string; color: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>{status}</span>
    </div>
  );
}
