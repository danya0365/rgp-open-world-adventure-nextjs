/**
 * Keyboard Controls Content
 * Pure component that only renders the keyboard controls content
 * Parent component is responsible for wrapping with HUDPanel if needed
 */
export function KeyboardHintContent() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-white font-mono text-[10px]">W</kbd>
          <span>Move North</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-white font-mono text-[10px]">↑</kbd>
          <span>Move North</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-white font-mono text-[10px]">A</kbd>
          <span>Move West</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-white font-mono text-[10px]">←</kbd>
          <span>Move West</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-white font-mono text-[10px]">S</kbd>
          <span>Move South</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-white font-mono text-[10px]">↓</kbd>
          <span>Move South</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-white font-mono text-[10px]">D</kbd>
          <span>Move East</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-white font-mono text-[10px]">→</kbd>
          <span>Move East</span>
        </div>
      </div>
      
      <div className="pt-2 border-t border-slate-700 text-[10px] text-gray-500">
        Hold key for continuous movement
      </div>
    </div>
  );
}
