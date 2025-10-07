import { Location } from "@/src/domain/types/location.types";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbProps {
  path: Location[];
  onNavigate?: (locationId: string) => void;
}

export function Breadcrumb({ path, onNavigate }: BreadcrumbProps) {
  if (path.length === 0) return null;

  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      {/* Home Icon */}
      <button
        onClick={() => onNavigate?.("root")}
        className="flex items-center gap-1 text-gray-400 hover:text-purple-400 transition-colors"
        title="กลับหน้าแรก"
      >
        <Home className="w-4 h-4" />
      </button>

      {/* Path */}
      {path.map((location, index) => (
        <div key={location.id} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-gray-600" />
          
          {index === path.length - 1 ? (
            // Current location (not clickable)
            <span className="text-white font-semibold">{location.name}</span>
          ) : (
            // Parent locations (clickable)
            <button
              onClick={() => onNavigate?.(location.id)}
              className="text-gray-400 hover:text-purple-400 transition-colors"
            >
              {location.name}
            </button>
          )}
        </div>
      ))}
    </nav>
  );
}
