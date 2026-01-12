import { BarChart3, TrendingUp, Users, Eye, AlertCircle } from 'lucide-react';

export default function AnalyticsPage() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Website Analytics</h1>
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          Live Status: Active
        </span>
      </div>

      {/* Google Analytics Integration Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900">Google Analytics 4</h3>
            <p className="text-sm text-slate-500 mb-4">
              Dữ liệu được thu thập qua mã đo lường: <code className="bg-slate-100 px-2 py-1 rounded">{gaId || 'Chưa cấu hình'}</code>
            </p>
            
            {gaId === 'G-H5QF4BKTEW' ? (
              <div className="text-sm text-green-600 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Mã khớp với cấu hình Google
              </div>
            ) : (
              <div className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Cảnh báo: Mã trong file .env ({gaId || 'Chưa có'}) khác với mã trên Google (G-H5QF4BKTEW)
              </div>
            )}
            
            <a 
              href="https://analytics.google.com/" 
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center text-sm text-blue-600 hover:underline"
            >
              Xem báo cáo chi tiết trên Google &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* Mock Stats (Placeholder) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200">
           <div className="flex items-center gap-2 mb-2">
             <Users className="w-4 h-4 text-slate-400" />
             <span className="text-sm font-medium text-slate-500">Người dùng mới</span>
           </div>
           <div className="text-2xl font-bold">1,240</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200">
           <div className="flex items-center gap-2 mb-2">
             <Eye className="w-4 h-4 text-slate-400" />
             <span className="text-sm font-medium text-slate-500">Lượt xem trang</span>
           </div>
           <div className="text-2xl font-bold">8,502</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200">
           <div className="flex items-center gap-2 mb-2">
             <TrendingUp className="w-4 h-4 text-slate-400" />
             <span className="text-sm font-medium text-slate-500">Tỷ lệ thoát</span>
           </div>
           <div className="text-2xl font-bold">42.3%</div>
        </div>
      </div>
    </div>
  );
}
