# 📍 Coordinates Refactoring Plan

## 🎯 เป้าหมาย

**ลบ `coordinates` ออกจาก Location และใช้ LocationConnection แทน**

---

## ✅ สิ่งที่ทำแล้ว

### **1. แก้ Types**
- ✅ ลบ `coordinates?` จาก `Location` interface
- ✅ แก้ `LocationConnection` ให้ใช้ `from` และ `to` แทน `fromLocationId` และ `toLocationId`

```typescript
// ❌ เดิม
export interface LocationConnection {
  fromLocationId: string;
  toLocationId: string;
  coordinates?: Coordinates;
}

// ✅ ใหม่
export interface LocationConnection {
  from: {
    locationId: string;
    coordinates: Coordinates; // ตำแหน่งบน parent map
  };
  to: {
    locationId: string;
    coordinates: Coordinates; // ตำแหน่งบน child map
  };
}
```

### **2. ลบ coordinates จาก Master Data (บางส่วน)**
- ✅ world-aethoria
- ✅ continent-northern
- ✅ continent-eastern
- ✅ region-frostpeak
- ✅ region-elven-forest
- ✅ area-crystal-valley
- ✅ city-silverhold
- ✅ city-elvenheim
- ✅ building-guild-hall
- ✅ building-magic-tower

---

## ⏳ สิ่งที่ต้องทำต่อ

### **Phase 1: ลบ coordinates ที่เหลือ**
- [ ] Floors (floor-guild-1f, floor-guild-2f, etc.)
- [ ] Rooms (room-meeting-1, room-meeting-2, etc.)
- [ ] Dungeons
- [ ] Battle Maps

### **Phase 2: แก้ LOCATION_CONNECTIONS**
ต้องแก้จาก:
```typescript
{
  id: "conn-1",
  fromLocationId: "area-crystal-valley",
  toLocationId: "city-silverhold",
  coordinates: { x: 10, y: 7 },
  ...
}
```

เป็น:
```typescript
{
  id: "conn-1",
  from: {
    locationId: "area-crystal-valley",
    coordinates: { x: 10, y: 7 } // ตำแหน่ง entrance บน parent map
  },
  to: {
    locationId: "city-silverhold",
    coordinates: { x: 10, y: 7 } // ตำแหน่ง spawn point บน child map
  },
  ...
}
```

### **Phase 3: แก้โค้ดที่ใช้ location.coordinates**
ไฟล์ที่ต้องแก้:
- [ ] `VirtualMapFullView.tsx` - ใช้ connection.from.coordinates แทน
- [ ] `WorldMapView.tsx` - ใช้ connection แทน
- [ ] `WorldView.tsx` - ใช้ connection แทน
- [ ] Components อื่นๆ ที่อ้างถึง `location.coordinates`

### **Phase 4: แก้ Logic การหา Coordinates**
สร้าง helper function:
```typescript
// Get entrance coordinates for a location on parent map
function getLocationEntranceCoordinates(
  locationId: string,
  connections: LocationConnection[]
): Coordinates | null {
  const conn = connections.find(c => c.to.locationId === locationId);
  return conn?.from.coordinates || null;
}

// Get spawn point for a location
function getLocationSpawnPoint(
  locationId: string,
  connections: LocationConnection[]
): Coordinates {
  const conn = connections.find(c => c.to.locationId === locationId);
  return conn?.to.coordinates || { x: 0, y: 0 }; // default center
}
```

---

## 📝 ตัวอย่างการใช้งานใหม่

### **1. แสดง Location บนแผนที่**
```typescript
// ❌ เดิม
const locationMarker = {
  position: location.coordinates, // ไม่มีแล้ว!
  name: location.name
};

// ✅ ใหม่
const connection = connections.find(c => c.to.locationId === location.id);
const locationMarker = {
  position: connection?.from.coordinates || { x: 0, y: 0 },
  name: location.name
};
```

### **2. เข้าสู่ Location**
```typescript
// ✅ ใหม่
const connection = connections.find(c => 
  c.from.locationId === currentLocationId && 
  c.to.locationId === targetLocationId
);

if (connection) {
  // Spawn player at connection.to.coordinates
  spawnPlayer(connection.to.coordinates);
}
```

---

## 🎯 ประโยชน์

1. **ไม่ซ้ำซ้อน** - coordinates อยู่ที่เดียว (ใน Connection)
2. **ยืดหยุ่น** - Location สามารถมีหลาย entrance
3. **ชัดเจน** - แยก entrance (from) และ spawn point (to)
4. **ถูกต้อง** - ตรงตาม concept ของ Connection

---

## 📊 Progress

- [x] Phase 0: แก้ Types (100%)
- [x] Phase 1: ลบ coordinates (50% - เหลือ Floors, Rooms, Dungeons)
- [ ] Phase 2: แก้ LOCATION_CONNECTIONS (0%)
- [ ] Phase 3: แก้โค้ดที่ใช้ (0%)
- [ ] Phase 4: สร้าง Helper Functions (0%)

**Overall: 25%**

---

**Next Action:** ลบ coordinates ที่เหลือใน Floors, Rooms, Dungeons
