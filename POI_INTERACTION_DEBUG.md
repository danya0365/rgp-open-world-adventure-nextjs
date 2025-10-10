# 🐛 POI Interaction Debug

## ทดสอบ `isWithinPOIBounds()`

### Test Case 1: Guild 3x4 ที่ตำแหน่ง (3, 5)

```
POI Coordinates: (3, 5)
POI Grid Size: { width: 3, height: 4 }

Grid Layout:
     x: 3  4  5
  y:5  ▢  ▢  ▢
    6  ▢  ▢  ▢
    7  ▢  ▢  ▢
    8  ▢  ▢  ▢
```

**ตำแหน่งที่ควรเจอ POI (return true):**
- (3, 5) ✅ มุมซ้ายบน
- (4, 5) ✅ บนกลาง
- (5, 5) ✅ มุมขวาบน
- (3, 6) ✅ ซ้ายกลาง
- (4, 6) ✅ กลาง
- (5, 6) ✅ ขวากลาง
- (3, 7) ✅ ซ้ายล่าง
- (4, 7) ✅ ล่างกลาง
- (5, 7) ✅ ขวาล่าง
- (3, 8) ✅ มุมซ้ายล่างสุด
- (4, 8) ✅ ล่างกลาง
- (5, 8) ✅ มุมขวาล่างสุด

**ตำแหน่งที่ไม่ควรเจอ POI (return false):**
- (2, 5) ❌ ซ้ายเกิน
- (6, 5) ❌ ขวาเกิน
- (3, 4) ❌ บนเกิน
- (3, 9) ❌ ล่างเกิน

---

## Logic ใน `isWithinPOIBounds()`

```typescript
export function isWithinPOIBounds(
  poiCoords: { x: number; y: number },      // (3, 5)
  poiGridSize: POIGridSize | undefined,     // { width: 3, height: 4 }
  checkCoords: { x: number; y: number }     // ตำแหน่งที่จะเช็ค
): boolean {
  const size = poiGridSize || { width: 1, height: 1 };

  return (
    checkCoords.x >= poiCoords.x &&              // x >= 3
    checkCoords.x < poiCoords.x + size.width &&  // x < 3 + 3 = 6
    checkCoords.y >= poiCoords.y &&              // y >= 5
    checkCoords.y < poiCoords.y + size.height    // y < 5 + 4 = 9
  );
}
```

### ทดสอบ (4, 6):
- `4 >= 3` ✅
- `4 < 6` ✅
- `6 >= 5` ✅
- `6 < 9` ✅
- **Result: true** ✅

### ทดสอบ (6, 5):
- `6 >= 3` ✅
- `6 < 6` ❌ (6 ไม่น้อยกว่า 6)
- **Result: false** ✅

### ทดสอบ (3, 9):
- `3 >= 3` ✅
- `3 < 6` ✅
- `9 >= 5` ✅
- `9 < 9` ❌ (9 ไม่น้อยกว่า 9)
- **Result: false** ✅

---

## ✅ Logic ถูกต้อง!

Function `isWithinPOIBounds()` ทำงานถูกต้องแล้ว

---

## 🔍 ปัญหาที่เป็นไปได้

### 1. **Player Position Calculation**
ตรวจสอบว่า `playerTileX` และ `playerTileY` คำนวณถูกต้องหรือไม่:

```typescript
const playerTileX = Math.floor(playerPosition.coordinates.x / gridSize);
const playerTileY = Math.floor(playerPosition.coordinates.y / gridSize);
```

**ตัวอย่าง:**
- `playerPosition.coordinates.x = 160` (pixels)
- `gridSize = 40` (pixels per tile)
- `playerTileX = Math.floor(160 / 40) = 4` ✅

### 2. **POI Coordinates Format**
ตรวจสอบว่า POI coordinates ใน master data เป็น **tile coordinates** ไม่ใช่ pixel coordinates:

```typescript
// ✅ ถูกต้อง - tile coordinates
{ coordinates: { x: 3, y: 5 }, gridSize: { width: 3, height: 4 } }

// ❌ ผิด - pixel coordinates
{ coordinates: { x: 120, y: 200 }, gridSize: { width: 3, height: 4 } }
```

### 3. **Grid Size Missing**
ถ้า POI ไม่มี `gridSize` จะใช้ default (1x1):

```typescript
// ถ้าไม่มี gridSize
{ coordinates: { x: 3, y: 5 } }
// จะถูกแปลงเป็น
{ coordinates: { x: 3, y: 5 }, gridSize: { width: 1, height: 1 } }
```

---

## 🧪 วิธีทดสอบ

เพิ่ม console.log ใน `usePOIInteraction`:

```typescript
useEffect(() => {
  const playerTileX = Math.floor(playerPosition.coordinates.x / gridSize);
  const playerTileY = Math.floor(playerPosition.coordinates.y / gridSize);
  
  console.log('🧍 Player Tile:', { x: playerTileX, y: playerTileY });
  
  currentLocation.metadata?.services?.forEach(service => {
    const isInside = isWithinPOIBounds(
      service.coordinates, 
      service.gridSize, 
      { x: playerTileX, y: playerTileY }
    );
    console.log(`🏛️ ${service.name}:`, {
      coords: service.coordinates,
      gridSize: service.gridSize,
      isInside
    });
  });
}, [playerPosition, currentLocation, gridSize]);
```
