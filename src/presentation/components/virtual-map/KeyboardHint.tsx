import { Keyboard } from "lucide-react";

/**
 * Visual hint for keyboard controls
 * Shows WASD/Arrow key instructions
 */
export function KeyboardHint() {
  return (
    <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-lg px-4 py-3 max-w-xs pointer-events-none z-50">
      <div className="flex items-center gap-2 mb-2">
        <Keyboard className="w-4 h-4 text-purple-400" />
        <h3 className="text-xs font-bold text-white">Keyboard Controls</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-gray-400">
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-white font-mono">W</kbd>
          <span>Move North</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-white font-mono">↑</kbd>
          <span>Move North</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-white font-mono">A</kbd>
          <span>Move West</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-white font-mono">←</kbd>
          <span>Move West</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-white font-mono">S</kbd>
          <span>Move South</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-white font-mono">↓</kbd>
          <span>Move South</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-white font-mono">D</kbd>
          <span>Move East</span>
        </div>
        <div className="flex items-center gap-1.5">
          <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-600 rounded text-white font-mono">→</kbd>
          <span>Move East</span>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-slate-700 text-[9px] text-gray-500">
        Hold key for continuous movement
      </div>
    </div>
  );
}
