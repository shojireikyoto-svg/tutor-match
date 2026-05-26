export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-slate-500 flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <div className="font-bold text-indigo-900 flex items-center gap-2">
            <span className="bg-indigo-600 text-white font-black text-xs px-1.5 py-0.5 rounded">UR</span>
            Uni-Relay
          </div>
          <p className="mt-1">京都学生の引越し家具・家電マッチング</p>
          <p className="mt-1 text-xs">大学メール（*.ac.jp）での登録が必要です</p>
        </div>
        <div className="text-slate-400 text-xs self-end">
          © {new Date().getFullYear()} Uni-Relay
        </div>
      </div>
    </footer>
  );
}
