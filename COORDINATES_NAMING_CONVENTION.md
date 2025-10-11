# 🎯 Coordinate System - Naming Convention Guide

## วิธีแก้ปัญหาที่ง่ายที่สุด: **ใช้ชื่อที่ชัดเจน!**

แทนที่จะสร้าง type system ใหม่ทั้งหมด เราจะเริ่มด้วยการ**เปลี่ยนชื่อตัวแปร**ให้บอกชัดเจนว่าเป็น tile หรือ pixel

---

## 📜 กฎการตั้งชื่อ (Naming Rules)

### ✅ กฎที่ 1: ใช้ `tileCoordinate` สำหรับ tile coordinates

```typescript
// ❌ BAD - ไม่ชัดเจน
const coordinates = { x: 10, y: 7 };
const spawn = { x: 10, y: 7 };
const pos = { x: 10, y: 7 };

// ✅ GOOD - ชัดเจนว่าเป็น tile
const tileCoordinate = { x: 10, y: 7 };
const spawnTileCoordinate = { x: 10, y: 7 };
const npcTileCoordinate = { x: 10, y: 7 };
```

### ✅ กฎที่ 2: ใช้ `pixelCoordinate` สำหรับ pixel coordinates

```typescript
// ❌ BAD - ไม่ชัดเจน
const coordinates = { x: 400, y: 280 };
const position = { x: 400, y: 280 };
const pos = { x: 400, y: 280 };

// ✅ GOOD - ชัดเจนว่าเป็น pixel
const pixelCoordinate = { x: 400, y: 280 };
const playerPixelCoordinate = { x: 400, y: 280 };
const spawnPixelCoordinate = { x: 400, y: 280 };
```

### ✅ กฎที่ 3: สำหรับ properties ใน object/interface

```typescript
// ❌ BAD - Interface ไม่ชัดเจน
interface Connection {
  from: {
    locationId: string;
    coordinates: { x: number; y: number }; // ไม่รู้ว่า tile หรือ pixel?
  };
  to: {
    locationId: string;
    coordinates: { x: number; y: number }; // ไม่รู้ว่า tile หรือ pixel?
  };
}

// ✅ GOOD - ชัดเจนว่าเป็น tile
interface Connection {
  from: {
    locationId: string;
    tileCoordinate: { x: number; y: number }; // ✅ ชัดเจน!
  };
  to: {
    locationId: string;
    tileCoordinate: { x: number; y: number }; // ✅ ชัดเจน!
  };
}

// ✅ GOOD - ชัดเจนว่าเป็น pixel
interface PlayerPosition {
  locationId: string;
  pixelCoordinate: { x: number; y: number }; // ✅ ชัดเจน!
  facing: Direction;
}
```

---

## 🔧 Refactoring Plan แบบ Step-by-Step

### Phase 1: แก้ Bug ด่วนก่อน (ไม่ต้องเปลี่ยนชื่อ)

#### Bug #1: VirtualMapFullView.tsx - handleLocationClick

```typescript
// File: src/presentation/components/virtual-map/VirtualMapFullView.tsx
// Line: ~242-268

const handleLocationClick = (location: Location) => {
  console.log(`[VirtualMapFullView] Location clicked:`, location.id);

  if (!discoveredLocations.has(location.id)) {
    console.log(`  ℹ️ Auto-discovering location: ${location.id}`);
    discoverLocation(location.id);
  }

  console.log(`  ✓ Teleporting to ${location.id}`);

  // Find connection to get spawn point
  const spawnCoords = currentLocationData
    ? getSpawnFromConnections(currentLocationData.id, location.id)
    : { x: 10, y: 7 }; // TILE coordinates from master data

  // ❌ BUG: ส่ง TILE แต่ function ต้องการ PIXEL!
  // teleportToLocation(location.id, spawnCoords);

  // ✅ FIX: แปลง TILE → PIXEL ก่อนส่ง
  const spawnPixel = {
    x: spawnCoords.x * 40, // TILE → PIXEL
    y: spawnCoords.y * 40,
  };
  teleportToLocation(location.id, spawnPixel);

  // Update URL to match new location
  const fromId = currentLocationData?.id;
  router.push(
    fromId
      ? `/virtual-world/${location.id}?from=${fromId}`
      : `/virtual-world/${location.id}`
  );
};
```

#### Bug #2: VirtualMapFullView.tsx - handleBreadcrumbClick

```typescript
// File: src/presentation/components/virtual-map/VirtualMapFullView.tsx
// Line: ~270-285

const handleBreadcrumbClick = (location: Location) => {
  console.log(`[VirtualMapFullView] Breadcrumb clicked:`, location.id);
  console.log(`  ✓ Teleporting to ${location.id}`);

  // For breadcrumbs (going back), spawn at center
  const spawnCoords = { x: 10, y: 7 }; // TILE

  // ❌ BUG: ส่ง TILE แต่ function ต้องการ PIXEL!
  // teleportToLocation(location.id, spawnCoords);

  // ✅ FIX: แปลง TILE → PIXEL ก่อนส่ง
  const spawnPixel = {
    x: spawnCoords.x * 40, // TILE → PIXEL
    y: spawnCoords.y * 40,
  };
  teleportToLocation(location.id, spawnPixel);

  // Update URL to match new location
  router.push(`/virtual-world/${location.id}`);
};
```

#### Bug #3: virtualMapStore.ts - movePlayer

```typescript
// File: src/stores/virtualMapStore.ts
// Line: ~295-349

movePlayer: (coordinates) => {
  const currentPosition = get().playerPosition;
  set({
    playerPosition: {
      ...currentPosition,
      coordinates, // PIXEL coordinates
    },
  });
  get().visitTile(currentPosition.locationId, coordinates);
  get().setCameraPosition(coordinates);

  // Check for connection triggers
  const connections = getLocationConnections(currentPosition.locationId);

  for (const connection of connections) {
    if (connection.from.locationId !== currentPosition.locationId) continue;

    // ❌ BUG: Master data เป็น TILE อยู่แล้ว แต่โค้ดแปลง PIXEL → TILE อีกรอบ!
    // const connTileX = Math.floor(connection.from.coordinates.x / 40);
    // const connTileY = Math.floor(connection.from.coordinates.y / 40);

    // ✅ FIX: Master data เป็น TILE อยู่แล้ว ไม่ต้องแปลง!
    const connTileX = connection.from.coordinates.x; // TILE
    const connTileY = connection.from.coordinates.y; // TILE

    // แปลง player PIXEL → TILE
    const playerTileX = Math.floor(coordinates.x / 40); // PIXEL → TILE
    const playerTileY = Math.floor(coordinates.y / 40);

    if (connTileX === playerTileX && connTileY === playerTileY) {
      console.log(`[Store] Player stepped on connection:`, connection.id);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("connection-trigger", {
            detail: {
              connectionId: connection.id,
              toLocationId: connection.to.locationId,
            },
          })
        );
      }
      break;
    }
  }

  // Sync to gameStore
  useGameStore.getState().setPlayerWorldPosition({
    locationId: currentPosition.locationId,
    x: coordinates.x, // PIXEL
    y: coordinates.y,
    facing: currentPosition.facing,
  });
},
```

---

### Phase 2: เปลี่ยนชื่อตัวแปรใน Master Data

#### ไฟล์: `locations.master.ts`

```typescript
// ❌ BEFORE - ไม่ชัดเจน
export const LOCATION_CONNECTIONS_MASTER: LocationConnection[] = [
  {
    id: "conn-2",
    from: {
      locationId: "city-silverhold",
      coordinates: { x: 10, y: 7 }, // tile หรือ pixel? ไม่รู้!
      gridSize: { width: 1, height: 1 },
    },
    to: {
      locationId: "building-guild-hall",
      coordinates: { x: 7, y: 0 }, // tile หรือ pixel? ไม่รู้!
    },
    connectionType: "entrance",
    isLocked: false,
    isTwoWay: true,
  },
];
```

```typescript
// ✅ AFTER - ชัดเจน!
export const LOCATION_CONNECTIONS_MASTER: LocationConnection[] = [
  {
    id: "conn-2",
    from: {
      locationId: "city-silverhold",
      tileCoordinate: { x: 10, y: 7 }, // ✅ ชัดเจนว่าเป็น TILE!
      gridSize: { width: 1, height: 1 },
    },
    to: {
      locationId: "building-guild-hall",
      tileCoordinate: { x: 7, y: 0 }, // ✅ ชัดเจนว่าเป็น TILE!
    },
    connectionType: "entrance",
    isLocked: false,
    isTwoWay: true,
  },
];
```

#### Update Type Definition

```typescript
// File: src/domain/types/location.types.ts

// ❌ BEFORE
export interface LocationConnection {
  id: string;
  from: {
    locationId: string;
    coordinates: Coordinates; // ไม่ชัดเจน!
    gridSize?: POIGridSize;
  };
  to: {
    locationId: string;
    coordinates: Coordinates; // ไม่ชัดเจน!
  };
  // ...
}

// ✅ AFTER
export interface LocationConnection {
  id: string;
  from: {
    locationId: string;
    tileCoordinate: Coordinates; // ✅ ชัดเจนว่าเป็น TILE!
    gridSize?: POIGridSize;
  };
  to: {
    locationId: string;
    tileCoordinate: Coordinates; // ✅ ชัดเจนว่าเป็น TILE!
  };
  // ...
}
```

---

### Phase 3: เปลี่ยนชื่อใน Store

#### ไฟล์: `virtualMapStore.ts`

```typescript
// ❌ BEFORE
export interface PlayerPosition {
  locationId: string;
  coordinates: Coordinates; // ไม่ชัดเจน!
  facing: "north" | "south" | "east" | "west";
}

// ✅ AFTER
export interface PlayerPosition {
  locationId: string;
  pixelCoordinate: Coordinates; // ✅ ชัดเจนว่าเป็น PIXEL!
  facing: "north" | "south" | "east" | "west";
}
```

#### Update Functions

```typescript
// ❌ BEFORE
movePlayer: (coordinates) => {
  const currentPosition = get().playerPosition;
  set({
    playerPosition: {
      ...currentPosition,
      coordinates, // ไม่ชัดเจน!
    },
  });
  // ...
},

// ✅ AFTER
movePlayer: (pixelCoordinate) => {
  const currentPosition = get().playerPosition;
  set({
    playerPosition: {
      ...currentPosition,
      pixelCoordinate, // ✅ ชัดเจนว่าเป็น PIXEL!
    },
  });
  // ...
},
```

---

### Phase 4: เปลี่ยนชื่อใน Components

#### ไฟล์: `VirtualMapFullView.tsx`

```typescript
// ❌ BEFORE - ตัวแปรไม่ชัดเจน
const getSpawnFromConnections = (
  fromLocationId: string,
  toLocationId: string
): { x: number; y: number } => {
  const connections = getLocationConnections(fromLocationId);

  const forward = connections.find(
    (conn) =>
      conn.from.locationId === fromLocationId &&
      conn.to.locationId === toLocationId
  );
  if (forward) {
    return forward.to.coordinates; // tile หรือ pixel?
  }

  // ...
  return { x: 10, y: 7 }; // tile หรือ pixel?
};

// ✅ AFTER - ชัดเจนว่าเป็น TILE
const getSpawnTileCoordinate = (
  fromLocationId: string,
  toLocationId: string
): { x: number; y: number } => {
  const connections = getLocationConnections(fromLocationId);

  const forward = connections.find(
    (conn) =>
      conn.from.locationId === fromLocationId &&
      conn.to.locationId === toLocationId
  );
  if (forward) {
    return forward.to.tileCoordinate; // ✅ ชัดเจนว่าเป็น TILE!
  }

  // ...
  return { x: 10, y: 7 }; // ✅ ชัดเจนว่าเป็น TILE!
};
```

```typescript
// ❌ BEFORE - ตัวแปรไม่ชัดเจน
const handleLocationClick = (location: Location) => {
  const spawnCoords = currentLocationData
    ? getSpawnFromConnections(currentLocationData.id, location.id)
    : { x: 10, y: 7 };

  teleportToLocation(location.id, spawnCoords); // BUG!
};

// ✅ AFTER - ชัดเจนและถูกต้อง
const handleLocationClick = (location: Location) => {
  // Get spawn position (TILE)
  const spawnTileCoordinate = currentLocationData
    ? getSpawnTileCoordinate(currentLocationData.id, location.id)
    : { x: 10, y: 7 };

  // Convert TILE → PIXEL
  const spawnPixelCoordinate = {
    x: spawnTileCoordinate.x * 40,
    y: spawnTileCoordinate.y * 40,
  };

  // Teleport (requires PIXEL)
  teleportToLocation(location.id, spawnPixelCoordinate);
};
```

---

## 📋 Checklist การ Refactor

### ✅ Phase 1: แก้ Bug ด่วน (ทำได้ทันที - 15 นาที)
- [ ] แก้ `handleLocationClick` - เพิ่ม `* 40` ก่อนส่ง `teleportToLocation`
- [ ] แก้ `handleBreadcrumbClick` - เพิ่ม `* 40` ก่อนส่ง `teleportToLocation`
- [ ] แก้ `movePlayer` - ลบ `/ 40` ออกจาก connection coordinates
- [ ] ทดสอบ: Player spawn และ connection trigger

### ✅ Phase 2: Rename Master Data (1-2 ชั่วโมง)
- [ ] เปลี่ยน `coordinates` → `tileCoordinate` ใน `LocationConnection` type
- [ ] เปลี่ยนใน `LOCATION_CONNECTIONS_MASTER`
- [ ] เปลี่ยนใน NPC/Shop/Service metadata (`coordinates` → `tileCoordinate`)
- [ ] ทดสอบ: Compile และรันแอพ

### ✅ Phase 3: Rename Store (1-2 ชั่วโมง)
- [ ] เปลี่ยน `PlayerPosition.coordinates` → `PlayerPosition.pixelCoordinate`
- [ ] เปลี่ยนทุกที่ที่เรียกใช้ `playerPosition.coordinates`
- [ ] เปลี่ยน parameter `coordinates` → `pixelCoordinate` ในฟังก์ชัน
- [ ] ทดสอบ: Movement และ camera

### ✅ Phase 4: Rename Components (2-3 ชั่วโมง)
- [ ] เปลี่ยนชื่อฟังก์ชัน `getSpawnFromConnections` → `getSpawnTileCoordinate`
- [ ] เปลี่ยนชื่อตัวแปรทั้งหมดใน components
- [ ] เพิ่ม comment บอกว่าเป็น TILE หรือ PIXEL
- [ ] ทดสอบ: ทุกฟีเจอร์

---

## 🎯 ตัวอย่างการตั้งชื่อที่ดี

### สำหรับ Variables

```typescript
// ✅ ชัดเจนว่าเป็น TILE
const playerTileX = 10;
const playerTileY = 7;
const spawnTileCoordinate = { x: 10, y: 7 };
const npcTileCoordinate = { x: 15, y: 8 };
const connectionTileCoordinate = { x: 3, y: 5 };

// ✅ ชัดเจนว่าเป็น PIXEL
const playerPixelX = 400;
const playerPixelY = 280;
const spawnPixelCoordinate = { x: 400, y: 280 };
const cameraPixelCoordinate = { x: 800, y: 600 };
```

### สำหรับ Functions

```typescript
// ✅ Function name บอกชัดเจนว่า return TILE
function getSpawnTileCoordinate(from: string, to: string): Coordinates {
  // returns TILE coordinate
}

// ✅ Function name บอกชัดเจนว่า return PIXEL
function getPlayerPixelCoordinate(): Coordinates {
  // returns PIXEL coordinate
}

// ✅ Function name บอกชัดเจนว่ารับ TILE และ return PIXEL
function tileToPixel(tileCoord: Coordinates): Coordinates {
  return {
    x: tileCoord.x * 40,
    y: tileCoord.y * 40,
  };
}
```

### สำหรับ Interfaces/Types

```typescript
// ✅ Property names ชัดเจน
interface LocationConnection {
  from: {
    locationId: string;
    tileCoordinate: Coordinates; // TILE
  };
  to: {
    locationId: string;
    tileCoordinate: Coordinates; // TILE
  };
}

interface PlayerPosition {
  locationId: string;
  pixelCoordinate: Coordinates; // PIXEL
  facing: Direction;
}

interface NPC {
  id: string;
  tileCoordinate: Coordinates; // TILE
  name: string;
}
```

---

## 🔄 Migration Strategy

### วิธีการ Refactor ทีละส่วนโดยไม่ให้เสีย

1. **สร้าง property ใหม่ควบคู่กับเก่า**
```typescript
// Step 1: เพิ่ม property ใหม่ (ไม่ลบเก่า)
interface LocationConnection {
  from: {
    locationId: string;
    coordinates: Coordinates; // เก่า (เก็บไว้ก่อน)
    tileCoordinate?: Coordinates; // ใหม่ (optional ก่อน)
  };
}
```

2. **อัพเดทโค้ดทีละส่วน**
```typescript
// Step 2: เขียนโค้ดใหม่ให้ใช้ property ใหม่
const tileCoord = connection.from.tileCoordinate || connection.from.coordinates;
```

3. **ลบ property เก่าออกเมื่อแน่ใจว่าไม่มีใครใช้แล้ว**
```typescript
// Step 3: ลบเก่าออก
interface LocationConnection {
  from: {
    locationId: string;
    tileCoordinate: Coordinates; // เหลือแค่ตัวใหม่
  };
}
```

---

## 📊 สรุป: ตัวแปรไหนใช้ชื่ออะไร

| ตัวแปร/Context | ใช้ชื่อ | ตัวอย่าง |
|---------------|---------|----------|
| Master Data - Connection | `tileCoordinate` | `connection.from.tileCoordinate` |
| Master Data - NPC/Shop | `tileCoordinate` | `npc.tileCoordinate` |
| Player Position | `pixelCoordinate` | `playerPosition.pixelCoordinate` |
| Camera Position | `pixelCoordinate` | `cameraPixelCoordinate` |
| Pathfinding Input | `tileX`, `tileY` | `startTileX, startTileY` |
| Pathfinding Output | `tileX`, `tileY` | `path[i].tileX` |
| Rendering Position | `pixelX`, `pixelY` | `leftPixel, topPixel` |
| Spawn from Master | `tileCoordinate` | `spawnTileCoordinate` |
| Spawn for Player | `pixelCoordinate` | `spawnPixelCoordinate` |

---

## ⚡ Quick Start

### ทำตามขั้นตอนนี้เพื่อเริ่มต้น:

1. **แก้ Bug 3 จุด (15 นาที)**
   - VirtualMapFullView: handleLocationClick
   - VirtualMapFullView: handleBreadcrumbClick  
   - virtualMapStore: movePlayer

2. **ทดสอบว่าแอพยังทำงานได้**
   - Player spawn ถูกต้อง
   - Connection trigger ทำงาน

3. **เริ่ม Rename ทีละไฟล์**
   - locations.master.ts (Master Data ก่อน)
   - virtualMapStore.ts (Store ตาม)
   - VirtualMapFullView.tsx (Components สุดท้าย)

4. **ทดสอบหลังแต่ละ Phase**

---

## ✅ ข้อดีของวิธีนี้

- ✅ **ง่าย** - แค่เปลี่ยนชื่อ ไม่ต้องสร้าง type system ใหม่
- ✅ **ชัดเจน** - อ่านโค้ดแล้วรู้ทันทีว่า tile หรือ pixel
- ✅ **ปลอดภัย** - Refactor ทีละส่วน ไม่เสียทั้งระบบ
- ✅ **ใช้ได้ทันที** - ไม่ต้องรอ refactor ใหญ่
- ✅ **Backward Compatible** - เก็บ property เก่าไว้ก่อนได้

---

**เริ่มจาก Phase 1 ก่อนเลย แก้ Bug 3 จุด จะเห็นผลทันที! 🚀**
