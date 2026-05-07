export default function Footer() {
  return (
    <footer className="border-t border-amber-100 bg-amber-50/50 mt-16 mb-16 md:mb-0">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-stone-600 flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <div className="font-bold text-amber-900">🌸 合格のはな</div>
          <p className="mt-1">中学受験家庭教師マッチングサービス</p>
        </div>
        <div className="text-stone-500">
          © {new Date().getFullYear()} 合格のはな
        </div>
      </div>
    </footer>
  );
}
