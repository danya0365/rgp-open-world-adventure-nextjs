# 🔧 Complete Refactoring Checklist

สรุปจุดที่ต้อง refactor ทั้งหมด เรียงตามลำดับความสำคัญ

---

## 🚨 PHASE 1: แก้ Bug ด่วน (15 นาที)

### 1.1 ✅ VirtualMapFullView.tsx - handleLocationClick (Line ~259)
```typescript
// เพิ่ม: const spawnPixel = { x: spawnCoords.x * 40, y: spawnCoords.y * 40 };
// แก้: teleportToLocation(location.id, spawnPixel);
```

### 1.2 ✅ VirtualMapFullView.tsx - handleBreadcrumbClick (Line ~281)
```typescript
// เพิ่ม: const spawnPixel = { x: spawnCoords.x * 40, y: spawnCoords.y * 40 };
// แก้: teleportToLocation(location.id, spawnPixel);
```

### 1.3 ✅ virtualMapStore.ts - movePlayer (Line ~317-318)
```typescript
// ลบ: const connTileX = Math.floor(connection.from.coordinates.x / 40);
// แก้: const connTileX = connection.from.coordinates.x;
```

---

## 📝 PHASE 2: Type Definitions (1 ชม)

### 2.1 location.types.ts - ทุก Interface

**แก้ไข 6 interfaces:**
- `LocationConnection` → `coordinates` → `tileCoordinate`
- `NPC` → `coordinates` → `tileCoordinate`
- `Shop` → `coordinates` → `tileCoordinate`
- `Service` → `coordinates` → `tileCoordinate`
- `BattleMap` → `coordinates` → `tileCoordinate`
- `Treasure` → `coordinates` → `tileCoordinate`

### 2.2 virtualMapStore.ts - PlayerPosition (Line ~32)
```typescript
// แก้: coordinates → pixelCoordinate
export interface PlayerPosition {
  locationId: string;
  pixelCoordinate: Coordinates; // แก้ตรงนี้
  facing: Direction;
}
```

### 2.3 virtualMapStore.ts - MovementState (Line ~38)
```typescript
// แก้: currentPath → pathPixelCoordinates
export interface MovementState {
  isMoving: boolean;
  pathPixelCoordinates: Coordinates[]; // แก้ตรงนี้
  currentPathIndex: number;
  movementSpeed: number;
}
```

---

## 🗂️ PHASE 3: Master Data (2 ชม)

### 3.1 locations.master.ts - LOCATION_CONNECTIONS_MASTER

**ค้นหา:** `coordinates:` ทั้งหมดใน connections (~15-20 จุด)  
**แก้เป็น:** `tileCoordinate:`

### 3.2 locations.master.ts - Metadata

**ค้นหาและแก้:**
- `npcs: [` → แก้ `coordinates:` → `tileCoordinate:` (~10 จุด)
- `shops: [` → แก้ `coordinates:` → `tileCoordinate:` (~8 จุด)
- `services: [` → แก้ `coordinates:` → `tileCoordinate:` (~6 จุด)
- `battleMaps: [` → แก้ `coordinates:` → `tileCoordinate:` (~4 จุด)
- `treasures: [` → แก้ `coordinates:` → `tileCoordinate:` (~2 จุด)

---

## 🔧 PHASE 4: Store Functions (1-2 ชม)

### 4.1 virtualMapStore.ts - ทุกฟังก์ชันที่ใช้ playerPosition.coordinates

**ค้นหา:** `playerPosition.coordinates`  
**แก้เป็น:** `playerPosition.pixelCoordinate`

**Functions ที่ต้องแก้:**
- `setPlayerPosition` (Line ~277)
- `movePlayer` (Line ~295)
- `teleportToLocation` (Line ~361)
- `startMovementToTile` (Line ~489)
- `updateMovement` (Line ~558)
- `calculateViewport` (Line ~666)

### 4.2 virtualMapStore.ts - Movement State

**ค้นหา:** `movementState.currentPath`  
**แก้เป็น:** `movementState.pathPixelCoordinates`

**Functions:**
- `startMovementToTile` (Line ~530-540)
- `updateMovement` (Line ~562-634)
- `stopMovement` (Line ~549)

---

## 🎨 PHASE 5: Components (2-3 ชม)

### 5.1 VirtualMapFullView.tsx

**ค้นหาและแก้:**
- `playerPosition.coordinates` → `playerPosition.pixelCoordinate` (~3 จุด)
- `getSpawnFromConnections` → return จาก `connection.to.coordinates` → `connection.to.tileCoordinate`

### 5.2 VirtualMapGrid.tsx

**ค้นหาและแก้:**
- `playerPosition.coordinates` → `playerPosition.pixelCoordinate` (~5 จุด)
- `npc.coordinates` → `npc.tileCoordinate` (ใน map loops)
- `shop.coordinates` → `shop.tileCoordinate`
- `service.coordinates` → `service.tileCoordinate`
- `battle.coordinates` → `battle.tileCoordinate`
- `treasure.coordinates` → `treasure.tileCoordinate`
- `connection.from.coordinates` → `connection.from.tileCoordinate`

### 5.3 NPCMarker.tsx, ShopMarker.tsx, ServiceMarker.tsx, etc.

**ค้นหาและแก้:**
- `npc.coordinates` → `npc.tileCoordinate`
- `shop.coordinates` → `shop.tileCoordinate`
- และอื่นๆ

---

## 🧪 PHASE 6: Hooks (30 นาที)

### 6.1 useKeyboardMovement.ts

**ค้นหา:** `playerPosition.coordinates`  
**แก้เป็น:** `playerPosition.pixelCoordinate`

### 6.2 useMovementAnimation.ts

**ค้นหา:** `movementState.currentPath`  
**แก้เป็น:** `movementState.pathPixelCoordinates`

### 6.3 usePOIInteraction.ts

**ค้นหา:** `playerPosition.coordinates`, `poi.coordinates`  
**แก้เป็น:** `playerPosition.pixelCoordinate`, `poi.tileCoordinate`

---

## 📊 สรุปจำนวนที่ต้องแก้

| ไฟล์ | จำนวนจุดที่ต้องแก้ | ใช้เวลา |
|------|-------------------|---------|
| **location.types.ts** | 8 interfaces | 30 นาที |
| **locations.master.ts** | ~50 จุด | 2 ชม |
| **virtualMapStore.ts** | ~20 จุด | 1.5 ชม |
| **VirtualMapFullView.tsx** | ~5 จุด | 30 นาที |
| **VirtualMapGrid.tsx** | ~15 จุด | 1 ชม |
| **Marker Components** | ~10 จุด | 1 ชม |
| **Hooks** | ~5 จุด | 30 นาที |
| **Total** | **~113 จุด** | **7-8 ชม** |

---

## 🔍 วิธีค้นหาด้วย Find & Replace

### ใช้ VSCode Find & Replace (Regex)

**1. ในไฟล์ Type Definitions:**
```
Find: coordinates: Coordinates
Replace: tileCoordinate: Coordinates
```

**2. ในไฟล์ Master Data:**
```
Find: coordinates: \{ x:
Replace: tileCoordinate: { x:
```

**3. ในไฟล์ Store/Components:**
```
Find: playerPosition\.coordinates
Replace: playerPosition.pixelCoordinate
```

**4. ในไฟล์ Components (POI):**
```
Find: (npc|shop|service|battle|treasure)\.coordinates
Replace: $1.tileCoordinate
```

---

## ✅ Checklist แต่ละ Phase

### Phase 1: Bug Fixes ✅ DONE
- [x] VirtualMapFullView - handleLocationClick
- [x] VirtualMapFullView - handleBreadcrumbClick
- [x] virtualMapStore - movePlayer connection check
- [x] ทดสอบ: Player spawn และ connection trigger

### Phase 2: Type Definitions ✅ DONE
- [x] LocationConnection interface
- [x] NPC, Shop, Service interfaces
- [x] BattleMap, Treasure interfaces
- [x] PlayerPosition interface
- [x] MovementState interface
- [x] ทดสอบ: TypeScript compile

### Phase 3: Master Data ✅ DONE
- [x] LOCATION_CONNECTIONS_MASTER (all ~50 connections)
- [x] NPCs metadata (all locations)
- [x] Shops metadata
- [x] Services metadata
- [x] BattleMaps metadata
- [x] Treasures metadata
- [x] ทดสอบ: TypeScript compile + runtime

### Phase 4: Store Functions ✅ DONE
- [x] setPlayerPosition
- [x] movePlayer
- [x] teleportToLocation
- [x] startMovementToTile
- [x] updateMovement
- [x] calculateViewport
- [x] getVisibleConnections
- [x] ทดสอบ: Movement และ teleport

### Phase 5: Components ✅ DONE
- [x] VirtualMapFullView
- [x] VirtualMapGrid
- [x] NPCMarker
- [x] ShopMarker
- [x] ServiceMarker
- [x] BattleMarker
- [x] TreasureMarker
- [x] Minimap
- [x] ทดสอบ: Rendering และ interactions

### Phase 6: Hooks ✅ DONE
- [x] useKeyboardMovement
- [x] usePOIInteraction
- [x] ทดสอบ: Keyboard controls และ POI interactions

---

## 🎯 Quick Reference

**TILE coordinate** → ใช้ `tileCoordinate`
- Master Data: connections, NPCs, shops, services
- Pathfinding input/output
- Map logic

**PIXEL coordinate** → ใช้ `pixelCoordinate`
- Player position
- Camera position
- Movement path
- Rendering

**แปลง:**
- TILE → PIXEL: `* 40`
- PIXEL → TILE: `Math.floor(value / 40)`

---

**เริ่มจาก Phase 1 แก้ Bug ก่อน แล้วค่อยทำ Phase 2-6 ตามลำดับครับ! 🚀**
