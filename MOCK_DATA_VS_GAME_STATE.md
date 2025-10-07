# 📊 Mock Data vs Game State - Architecture Guide

**Last Updated**: 2025-10-07

---

## 🎯 หลักการสำคัญ

### ✅ Mock Data = Master Data (ข้อมูลคงที่)
- **ไม่เปลี่ยนแปลง** ตลอดเกม
- เป็น **template** หรือ **definition**
- อยู่ใน `/src/data/mock/`
- **ไม่เก็บ state** ของผู้เล่น

### ✅ Game State = Player Data (ข้อมูลผู้เล่น)
- **เปลี่ยนแปลงได้** ตามการเล่น
- เก็บใน **Zustand** (`gameStore`)
- **Persist** ใน LocalStorage
- เก็บ **progress** และ **choices** ของผู้เล่น

---

## 📋 ตัวอย่างเปรียบเทียบ

### 1. Characters (ตัวละคร)

#### ❌ ผิด: เก็บ state ใน mock data
```typescript
// ❌ ไม่ควรทำ
export const mockCharacters = [
  {
    id: "char-001",
    name: "Arthur",
    isPlayable: true,
    isInParty: true,        // ❌ นี่คือ state!
    isUnlocked: false,      // ❌ นี่คือ state!
    currentHp: 450,         // ❌ นี่คือ state!
  }
];
```

#### ✅ ถูก: แยก master data และ game state
```typescript
// ✅ Mock Data (Master Data)
export const mockCharacters = [
  {
    id: "char-001",
    name: "Arthur",
    class: "warrior",
    stats: {
      maxHp: 500,           // ✅ ค่าพื้นฐาน
      maxMp: 100,
      atk: 80,
    },
    isPlayable: true,       // ✅ คุณสมบัติคงที่
    isRecruitable: false,   // ✅ คุณสมบัติคงที่
  }
];

// ✅ Game State (Zustand)
gameStore = {
  party: [                  // ✅ ใครอยู่ในทีม
    {
      character: mockCharacters[0],
      position: 0,
      isLeader: true,
    }
  ],
  progress: {
    selectedCharacters: ["char-001"],  // ✅ เคยเลือกใคร
    unlockedCharacters: [],            // ✅ ปลดล็อคใคร
  }
}
```

---

### 2. Locations (สถานที่)

#### ❌ ผิด: เก็บ state ใน mock data
```typescript
// ❌ ไม่ควรทำ
export const mockLocations = [
  {
    id: "loc-001",
    name: "Silverhold",
    isDiscovered: true,     // ❌ นี่คือ state!
    isVisited: false,       // ❌ นี่คือ state!
    isCurrent: true,        // ❌ นี่คือ state!
  }
];
```

#### ✅ ถูก: แยก master data และ game state
```typescript
// ✅ Mock Data (Master Data)
export const mockLocations = [
  {
    id: "loc-001",
    name: "Silverhold",
    type: "city",
    level: 1,
    isDiscoverable: true,   // ✅ สามารถค้นพบได้หรือไม่
    isFastTravelPoint: true,// ✅ คุณสมบัติคงที่
  }
];

// ✅ Game State (Zustand)
gameStore = {
  progress: {
    currentLocationId: "loc-001",           // ✅ อยู่ที่ไหน
    discoveredLocations: ["loc-001"],       // ✅ ค้นพบที่ไหนบ้าง
  }
}
```

---

### 3. Items (ไอเทม)

#### ❌ ผิด: เก็บ state ใน mock data
```typescript
// ❌ ไม่ควรทำ
export const mockItems = [
  {
    id: "item-001",
    name: "HP Potion",
    quantity: 5,            // ❌ นี่คือ state!
    isOwned: true,          // ❌ นี่คือ state!
    equippedBy: "char-001", // ❌ นี่คือ state!
  }
];
```

#### ✅ ถูก: แยก master data และ game state
```typescript
// ✅ Mock Data (Master Data)
export const mockItems = [
  {
    id: "item-001",
    name: "HP Potion",
    type: "consumable",
    effect: { hp: 50 },     // ✅ ผลกระทบคงที่
    price: 50,              // ✅ ราคาคงที่
    rarity: "common",       // ✅ คุณสมบัติคงที่
  }
];

// ✅ Game State (Zustand)
gameStore = {
  inventory: [              // ✅ มีไอเทมอะไรบ้าง
    {
      itemId: "item-001",
      quantity: 5,          // ✅ มีกี่ชิ้น
      equippedBy: "char-001", // ✅ ใครใส่อยู่
    }
  ],
  gold: 1000,              // ✅ เงินที่มี
}
```

---

### 4. Quests (เควสต์)

#### ❌ ผิด: เก็บ state ใน mock data
```typescript
// ❌ ไม่ควรทำ
export const mockQuests = [
  {
    id: "quest-001",
    name: "The Beginning",
    isActive: true,         // ❌ นี่คือ state!
    isCompleted: false,     // ❌ นี่คือ state!
    progress: 50,           // ❌ นี่คือ state!
  }
];
```

#### ✅ ถูก: แยก master data และ game state
```typescript
// ✅ Mock Data (Master Data)
export const mockQuests = [
  {
    id: "quest-001",
    name: "The Beginning",
    type: "main",
    objectives: [           // ✅ เป้าหมายคงที่
      { id: "obj-001", description: "Talk to NPC" }
    ],
    rewards: {              // ✅ รางวัลคงที่
      exp: 100,
      gold: 50,
    }
  }
];

// ✅ Game State (Zustand)
gameStore = {
  progress: {
    activeQuests: ["quest-001"],      // ✅ เควสต์ที่กำลังทำ
    completedQuests: [],              // ✅ เควสต์ที่เสร็จแล้ว
  }
}
```

---

## 🏗️ Architecture Pattern

### Data Flow

```
┌─────────────────────────────────────────┐
│         Mock Data (Master Data)         │
│         /src/data/mock/                 │
│                                         │
│  • Characters (templates)               │
│  • Locations (definitions)              │
│  • Items (catalog)                      │
│  • Quests (blueprints)                  │
│                                         │
│  ✅ Read-only                           │
│  ✅ Never changes                       │
└─────────────────┬───────────────────────┘
                  │
                  │ Reference
                  ▼
┌─────────────────────────────────────────┐
│      Game State (Player Data)           │
│      /src/stores/gameStore.ts           │
│                                         │
│  • party (who's in team)                │
│  • inventory (what player owns)         │
│  • progress (what player did)           │
│  • events (what happened)               │
│                                         │
│  ✅ Mutable                             │
│  ✅ Persisted                           │
└─────────────────────────────────────────┘
```

---

## 📝 Implementation Rules

### Rule 1: Mock Data เป็น Read-Only
```typescript
// ✅ ถูก: อ่านจาก mock data
const character = mockCharacters.find(c => c.id === "char-001");

// ❌ ผิด: แก้ไข mock data
mockCharacters[0].isInParty = true;  // ❌ ห้าม!
```

### Rule 2: Game State เป็น Single Source of Truth
```typescript
// ✅ ถูก: เช็ค state จาก gameStore
const isInParty = gameStore.party.some(m => m.character.id === "char-001");

// ❌ ผิด: เช็ค state จาก mock data
const isInParty = mockCharacters[0].isInParty;  // ❌ ไม่มี property นี้!
```

### Rule 3: ใช้ Mock Data เป็น Reference
```typescript
// ✅ ถูก: ใช้ mock data เป็น template
const addToParty = (characterId: string) => {
  const character = mockCharacters.find(c => c.id === characterId);
  if (character) {
    gameStore.party.push({
      character,  // ✅ Reference ไปที่ mock data
      position: 0,
      isLeader: true,
    });
  }
};
```

### Rule 4: Persist เฉพาะ Game State
```typescript
// ✅ ถูก: Persist game state
localStorage.setItem("game-storage", JSON.stringify({
  party: gameStore.party,
  inventory: gameStore.inventory,
  progress: gameStore.progress,
}));

// ❌ ผิด: Persist mock data
localStorage.setItem("characters", JSON.stringify(mockCharacters));  // ❌ ไม่ต้อง!
```

---

## 🎯 Current Implementation

### ✅ ที่ทำถูกแล้ว

#### 1. Mock Data (Master Data)
```typescript
// /src/data/mock/characters.mock.ts
export const mockCharacters: Character[] = [
  {
    id: "char-001",
    name: "Arthur",
    class: "warrior",
    stats: { maxHp: 500, maxMp: 100, ... },
    isPlayable: true,       // ✅ คุณสมบัติคงที่
    isRecruitable: false,   // ✅ คุณสมบัติคงที่
  }
];
```

#### 2. Game State (Zustand)
```typescript
// /src/stores/gameStore.ts
export const useGameStore = create<GameState>()(
  persist((set, get) => ({
    party: [],                    // ✅ ทีมปัจจุบัน
    inventory: [],                // ✅ ไอเทมที่มี
    gold: 1000,                   // ✅ เงินที่มี
    progress: {
      currentLocationId: null,    // ✅ ตำแหน่งปัจจุบัน
      discoveredLocations: [],    // ✅ สถานที่ที่ค้นพบ
      completedQuests: [],        // ✅ เควสต์ที่เสร็จ
      activeQuests: [],           // ✅ เควสต์ที่กำลังทำ
      unlockedCharacters: [],     // ✅ ตัวละครที่ปลดล็อค
      selectedCharacters: [],     // ✅ ตัวละครที่เคยเลือก
      gameStarted: false,
      lastSaveTime: "",
    },
    events: [],                   // ✅ เหตุการณ์ที่เกิดขึ้น
  }))
);
```

---

## 🔍 Validation Examples

### ตัวอย่างที่ 1: เช็คว่าเคยเลือกตัวละครหรือยัง

#### ❌ ผิด: เช็คจาก mock data
```typescript
// ❌ ไม่ถูกต้อง
const hasCharacters = mockCharacters.filter(c => c.isPlayable).length > 0;
// ปัญหา: mock data มีอยู่แล้ว ไม่ได้บอกว่าผู้เล่นเลือกหรือยัง
```

#### ✅ ถูก: เช็คจาก game state
```typescript
// ✅ ถูกต้อง
const hasEverSelectedCharacter = progress.selectedCharacters.length > 0;
// ✅ บอกว่าผู้เล่นเคยเลือกตัวละครหรือยัง
```

---

### ตัวอย่างที่ 2: เช็คว่าสถานที่ถูกค้นพบหรือยัง

#### ❌ ผิด: เช็คจาก mock data
```typescript
// ❌ ไม่ถูกต้อง
const isDiscovered = mockLocations.find(l => l.id === locationId)?.isDiscovered;
// ปัญหา: mock data ไม่ควรมี isDiscovered
```

#### ✅ ถูก: เช็คจาก game state
```typescript
// ✅ ถูกต้อง
const isDiscovered = progress.discoveredLocations.includes(locationId);
// ✅ บอกว่าผู้เล่นค้นพบสถานที่นี้หรือยัง
```

---

### ตัวอย่างที่ 3: เช็คว่ามีไอเทมหรือไม่

#### ❌ ผิด: เช็คจาก mock data
```typescript
// ❌ ไม่ถูกต้อง
const hasPotion = mockItems.find(i => i.id === "potion-hp")?.quantity > 0;
// ปัญหา: mock data ไม่ควรมี quantity
```

#### ✅ ถูก: เช็คจาก game state
```typescript
// ✅ ถูกต้อง
const potion = inventory.find(i => i.itemId === "potion-hp");
const hasPotion = potion && potion.quantity > 0;
// ✅ บอกว่าผู้เล่นมี HP Potion หรือไม่
```

---

## 📊 Summary

### Mock Data (Master Data)
| ✅ ควรมี | ❌ ไม่ควรมี |
|---------|-------------|
| id, name, description | isInParty, isSelected |
| stats (maxHp, maxMp) | currentHp, currentMp |
| isPlayable, isRecruitable | isUnlocked, isOwned |
| price, rarity | quantity, equippedBy |
| type, class, element | isActive, isCompleted |

### Game State (Player Data)
| ✅ ควรมี | ❌ ไม่ควรมี |
|---------|-------------|
| party, inventory | character definitions |
| progress, events | item catalog |
| currentLocationId | location definitions |
| discoveredLocations | quest blueprints |
| selectedCharacters | skill templates |

---

## ✅ Checklist

เมื่อเพิ่ม feature ใหม่ ให้ถามตัวเองว่า:

- [ ] ข้อมูลนี้เปลี่ยนแปลงตามการเล่นหรือไม่?
  - ✅ ใช่ → เก็บใน `gameStore`
  - ❌ ไม่ → เก็บใน `mock data`

- [ ] ข้อมูลนี้เป็นของผู้เล่นหรือไม่?
  - ✅ ใช่ → เก็บใน `gameStore.progress`
  - ❌ ไม่ → เก็บใน `mock data`

- [ ] ข้อมูลนี้ต้อง persist หรือไม่?
  - ✅ ใช่ → เก็บใน `gameStore`
  - ❌ ไม่ → อาจเป็น temporary state

- [ ] ข้อมูลนี้เป็น template/definition หรือไม่?
  - ✅ ใช่ → เก็บใน `mock data`
  - ❌ ไม่ → เก็บใน `gameStore`

---

## 🚀 Best Practices

1. **Mock Data = Read-Only**: ไม่แก้ไข mock data ตลอดเกม
2. **Game State = Single Source**: เช็ค state จาก gameStore เท่านั้น
3. **Reference, Not Copy**: ใช้ reference ไปที่ mock data แทนการ copy
4. **Persist Smart**: Persist เฉพาะ game state, ไม่ persist mock data
5. **Separate Concerns**: แยก master data และ player data ให้ชัดเจน

---

## 📝 Migration Completed

### ✅ สิ่งที่แก้ไขแล้ว

1. เพิ่ม `progress.selectedCharacters` ใน gameStore
2. Track `selectedCharacters` เมื่อ `addToParty`
3. เช็ค `hasEverSelectedCharacter` จาก `progress.selectedCharacters`
4. ไม่เช็คจาก mock data หรือ events อีกต่อไป

### ✅ ผลลัพธ์

- ✅ Mock data เป็น master data อย่างแท้จริง
- ✅ Game state เป็น single source of truth
- ✅ Validation ถูกต้องและชัดเจน
- ✅ Architecture สะอาดและ maintainable

---

**พร้อมใช้งาน!** 🎉
