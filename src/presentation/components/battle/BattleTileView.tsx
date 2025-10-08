import { cn } from "@/lib/utils";
import { BattleMapTile } from "@/src/domain/types/battle.types";
import { BattleUnitState } from "@/src/stores/battleStore";

const isDebug = false;

// Tile component with new design
const BattleTileView = ({
  x,
  y,
  tile,
  isObstacle,
  isInMoveRange,
  isInAttackRange,
  isCurrent,
  unit,
  onClick,
  isAllyTurn,
}: {
  x: number;
  y: number;
  tile?: BattleMapTile;
  isObstacle: boolean;
  isInMoveRange: boolean;
  isInAttackRange: boolean;
  isCurrent: boolean;
  unit: BattleUnitState | null;
  onClick: (x: number, y: number) => void;
  isAllyTurn: boolean;
}) => {
  const isUnwalkable = (tile && !tile.isWalkable) ?? true;
  const getTileStyle = () => {
    // Base style
    let style = "relative transform transition-all duration-200 ";

    switch (tile?.type) {
      case "grass":
        style += "bg-green-600 hover:bg-green-500 ";
        break;
      case "water":
        style += "bg-blue-500 hover:bg-blue-400 ";
        break;
      case "mountain":
        style += "bg-stone-500 hover:bg-stone-400 ";
        break;
      case "lava":
        style += "bg-red-600 hover:bg-red-500 animate-pulse ";
        break;
      case "ice":
        style += "bg-cyan-200 hover:bg-cyan-100 ";
        break;
      case "poison":
        style += "bg-purple-600 hover:bg-purple-500 ";
        break;
      default:
        style += "bg-slate-700 hover:bg-slate-600 ";
    }

    if (isObstacle || isUnwalkable) {
      style += "bg-slate-700 opacity-70 cursor-not-allowed ";
    }

    return style;
  };

  const renderRangeOverlay = () => {
    return (
      <>
        {/* Move Range Overlay */}
        {isInMoveRange && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full bg-blue-500/50"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center m-2">
              <div className="w-full h-full border-2 border-blue-400/50 rounded-sm">
                <span className="text-2xl">👣</span>
              </div>
            </div>
          </div>
        )}

        {/* Attack Range Overlay */}
        {isInAttackRange && (
          <div className="absolute inset-0 flex items-center justify-center m-2">
            <div className="w-3/4 h-3/4 bg-red-500/20 border-2 border-red-400/70 rounded-full flex items-center justify-center">
              <span className="text-red-400 text-xl">⚔️</span>
            </div>
          </div>
        )}
      </>
    );
  };

  const getTileIcon = () => {
    if (!tile) return null;
    switch (tile.type) {
      case "water":
        return "💧";
      case "mountain":
        return "⛰️";
      case "lava":
        return "🌋";
      case "ice":
        return "🧊";
      case "poison":
        return "☠️";
      default:
        return "";
    }
  };

  const getUnitStyle = () => {
    if (!unit) return "";
    return unit.isAlly
      ? "bg-blue-500 shadow-lg shadow-blue-500/30"
      : "bg-red-500 shadow-lg shadow-red-500/30";
  };

  const renderCurrentIndicator = () => {
    if (!isCurrent) return null;
    if (!isAllyTurn)
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full w-full h-full border-b-2 border-dashed border-orange-600"></div>
        </div>
      );
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-spin rounded-full w-full h-full border-b-2 border-dashed border-yellow-600"></div>
      </div>
    );
  };

  return (
    <button
      onClick={() => onClick(x, y)}
      className={`aspect-square relative transition-all duration-300 ${getTileStyle()}`}
      disabled={isObstacle || isUnwalkable}
    >
      {/* Tile Pattern Overlay */}
      <div className="absolute inset-0">
        {tile?.type === "grass" && (
          <div className="absolute inset-0 bg-[url('/grass-pattern.svg')]"></div>
        )}
        {tile?.type === "water" && (
          <div className="absolute inset-0 bg-[url('/water-pattern.svg')] animate-float"></div>
        )}
        {tile?.type === "mountain" && (
          <div className="absolute inset-0 bg-[url('/mountain-pattern.svg')] animate-float"></div>
        )}
        {tile?.type === "lava" && (
          <div className="absolute inset-0 bg-[url('/lava-pattern.svg')] animate-float"></div>
        )}
        {tile?.type === "ice" && (
          <div className="absolute inset-0 bg-[url('/ice-pattern.svg')] animate-float"></div>
        )}
        {tile?.type === "poison" && (
          <div className="absolute inset-0 bg-[url('/poison-pattern.svg')] animate-float"></div>
        )}
      </div>

      {/* Range Overlays */}
      {renderRangeOverlay()}

      {/* Tile Icon */}
      {!unit && getTileIcon() && (
        <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-70">
          {getTileIcon()}
        </div>
      )}

      {/* Grid Coordinates (debug) */}
      <span
        className={cn(
          "absolute top-0 left-1 text-[8px] text-white/50 font-mono",
          !isDebug && "hidden"
        )}
      >
        {x},{y}
      </span>

      {/* Unit */}
      {unit && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`
              w-10 h-10 rounded-full flex items-center justify-center text-xl
              text-white font-bold shadow-lg transform transition-transform
              hover:scale-110 ${getUnitStyle()}
            `}
          >
            {unit.isAlly ? "🦸" : "👹"}
          </div>
        </div>
      )}

      {/* HP Bar for units */}
      {unit && (
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/30">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{
              width: `${(unit.currentHp / unit.character.stats.maxHp) * 100}%`,
            }}
          ></div>
        </div>
      )}

      {/* Current Indicator */}
      {renderCurrentIndicator()}

      {/* Hover Effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-20 bg-white transition-opacity duration-200"></div>
    </button>
  );
};

export default BattleTileView;
