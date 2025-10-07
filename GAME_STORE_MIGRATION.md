# 🎮 Game Store Migration - Centralized State Management

**Last Updated**: 2025-10-07

---

## 📋 สรุปการเปลี่ยนแปลง

### ปัญหาเดิม
- ❌ ใช้ `partyStore` แยกต่างหาก
- ❌ State ไม่ sync กันระหว่างหน้า
- ❌ ไม่มีการตรวจสอบ validation
- ❌ ไม่มี centralized state management

### แก้ไขแล้ว
- ✅ สร้าง `gameStore` แบบ centralized
- ✅ Migrate `partyStore` เข้า `gameStore`
- ✅ เพิ่ม game progress tracking
- ✅ เพิ่ม inventory management
- ✅ เพิ่ม event logging
- ✅ เพิ่ม validation methods
- ✅ State sync ทุกหน้า

---

## 🏗️ Game Store Structure

### 1. Party Management
```typescript
interface PartyMember {
  character: Character;
  position: number; // 0-3
  isLeader: boolean;
}

// Actions
- addToParty()
- removeFromParty()
- swapPartyMembers()
- setLeader()
- clearParty()
- isInParty()
- getPartyMember()
```

### 2. Inventory Management
```typescript
interface InventoryItem {
  itemId: string;
  quantity: number;
  equippedBy?: string; // Character ID
}

// State
- inventory: InventoryItem[]
- gold: number

// Actions
- addItem()
- removeItem()
- equipItem()
- unequipItem()
- addGold()
- removeGold()
```

### 3. Game Progress
```typescript
interface GameProgress {
  currentLocationId: string | null;
  discoveredLocations: string[];
  completedQuests: string[];
  activeQuests: string[];
  unlockedCharacters: string[];
  gameStarted: boolean;
  lastSaveTime: string;
}

// Actions
- setCurrentLocation()
- discoverLocation()
- isLocationDiscovered()
- completeQuest()
- startQuest()
- unlockCharacter()
- startGame()
```

### 4. Event Logging
```typescript
interface GameEvent {
  id: string;
  type: "quest" | "battle" | "discovery" | "dialogue";
  timestamp: string;
  data: Record<string, unknown>;
}

// Actions
- addEvent()
- clearEvents()
```

### 5. Validation
```typescript
// Validation Methods
- canEnterPartyPage() → always true
- canEnterWorldMap() → requires party.length > 0
```

---

## 🔄 Migration Changes

### Files Updated

#### 1. **Created**: `/src/stores/gameStore.ts`
- ✅ Centralized state management
- ✅ All game state in one place
- ✅ Zustand + persist middleware
- ✅ Helper functions

#### 2. **Updated**: `/src/presentation/components/characters/CharactersView.tsx`
```diff
- import { usePartyStore } from "@/src/stores/partyStore";
+ import { useGameStore } from "@/src/stores/gameStore";

- const { addToParty, isInParty, party } = usePartyStore();
+ const { addToParty, isInParty, party } = useGameStore();
```

#### 3. **Updated**: `/src/presentation/presenters/party/usePartyPresenter.ts`
```diff
- import { usePartyStore } from "@/src/stores/partyStore";
+ import { useGameStore } from "@/src/stores/gameStore";

- const { party, addToParty, ... } = usePartyStore();
+ const { party, addToParty, ... } = useGameStore();
```

#### 4. **Updated**: `/src/presentation/components/party/PartyView.tsx`
```diff
- import { getPartyStats, getPartySynergy } from "@/src/stores/partyStore";
+ import { useGameStore, getPartyStats, getPartySynergy } from "@/src/stores/gameStore";
```

#### 5. **Updated**: `/src/presentation/components/world/WorldView.tsx`
```diff
- import { usePartyStore, getPartyStats } from "@/src/stores/partyStore";
+ import { useGameStore, getPartyStats } from "@/src/stores/gameStore";

- const { party } = usePartyStore();
+ const { party, setCurrentLocation } = useGameStore();

// Auto-save current location
if (currentLocation) {
  saveCurrentLocation(currentLocation.id);
}
```

---

## ✅ Validation Flow

### 1. Characters Page → Party Page
```typescript
// Always accessible
canEnterPartyPage() // → true
```

### 2. Party Page → World Map
```typescript
// Requires party
canEnterWorldMap() // → party.length > 0

// If no party
if (party.length === 0) {
  // Show warning screen
  // Redirect to /characters or /party
}
```

### 3. World Map
```typescript
// Check party on mount
if (party.length === 0) {
  return <NoPartyWarning />;
}

// Show party display
<PartyDisplay party={party} stats={partyStats} />
```

---

## 📊 State Persistence

### LocalStorage Key
```
"game-storage"
```

### Persisted Data
```typescript
{
  party: PartyMember[],
  inventory: InventoryItem[],
  gold: number,
  progress: GameProgress
  // events are NOT persisted (too large)
}
```

### Auto-Save
- ✅ เมื่อเพิ่ม/ลบตัวละครจากทีม
- ✅ เมื่อเปลี่ยน location
- ✅ เมื่อเพิ่ม/ลบไอเทม
- ✅ เมื่อทำ quest
- ✅ เมื่อค้นพบสถานที่

---

## 🎯 Usage Examples

### 1. Add Character to Party
```typescript
const { addToParty, party } = useGameStore();

const handleAddToParty = (character: Character) => {
  if (party.length >= 4) {
    alert("ทีมเต็มแล้ว!");
    return;
  }
  
  const success = addToParty(character);
  if (success) {
    router.push("/party");
  }
};
```

### 2. Check if Can Enter World Map
```typescript
const { canEnterWorldMap, party } = useGameStore();

if (!canEnterWorldMap()) {
  return <NoPartyWarning />;
}

// Show world map
return <WorldMapContent />;
```

### 3. Track Current Location
```typescript
const { setCurrentLocation, progress } = useGameStore();

// When entering a location
const handleEnterLocation = (locationId: string) => {
  setCurrentLocation(locationId);
  // Auto-discovers location
  // Auto-logs event
};

// Check if discovered
const isDiscovered = progress.discoveredLocations.includes(locationId);
```

### 4. Manage Inventory
```typescript
const { addItem, inventory, gold } = useGameStore();

// Add item
addItem("potion_hp", 5);

// Check inventory
const potions = inventory.find(i => i.itemId === "potion_hp");
console.log(`You have ${potions?.quantity || 0} HP potions`);

// Check gold
console.log(`Gold: ${gold}`);
```

### 5. Quest Management
```typescript
const { startQuest, completeQuest, progress } = useGameStore();

// Start quest
startQuest("quest_main_001");

// Check active quests
const isActive = progress.activeQuests.includes("quest_main_001");

// Complete quest
completeQuest("quest_main_001");

// Check completed
const isCompleted = progress.completedQuests.includes("quest_main_001");
```

---

## 🔧 Helper Functions

### Party Helpers
```typescript
import { getPartyLeader, getPartyStats, getPartySynergy } from "@/src/stores/gameStore";

const leader = getPartyLeader(party);
const stats = getPartyStats(party);
const synergies = getPartySynergy(party);

console.log(`Leader: ${leader?.character.name}`);
console.log(`Total HP: ${stats.totalHp}`);
console.log(`Synergies: ${synergies.join(", ")}`);
```

---

## 🚀 Benefits

### 1. Centralized State
- ✅ ทุก state อยู่ที่เดียว
- ✅ ง่ายต่อการ debug
- ✅ ง่ายต่อการ maintain

### 2. State Synchronization
- ✅ State sync ทุกหน้าอัตโนมัติ
- ✅ ไม่ต้องส่ง props ข้ามหน้า
- ✅ Real-time updates

### 3. Validation
- ✅ ตรวจสอบ party ก่อนเข้า world map
- ✅ ป้องกัน invalid state
- ✅ Better UX

### 4. Event Logging
- ✅ Track player actions
- ✅ Debug ง่ายขึ้น
- ✅ Analytics ready

### 5. Persistence
- ✅ Auto-save ทุกการเปลี่ยนแปลง
- ✅ Refresh ไม่หาย
- ✅ Resume game ได้

---

## 📝 Next Steps

### Phase 1: Current (✅ DONE)
- ✅ Create gameStore
- ✅ Migrate partyStore
- ✅ Add validation
- ✅ Update all pages

### Phase 2: Inventory System (Next)
- [ ] Implement inventory UI
- [ ] Item management
- [ ] Equipment system

### Phase 3: Quest System
- [ ] Quest log UI
- [ ] Quest tracking
- [ ] Quest rewards

### Phase 4: Battle System
- [ ] Battle state management
- [ ] Turn management
- [ ] Battle events

---

## 🎮 Testing

### Test Scenarios

#### 1. Party Management
```
1. เลือกตัวละคร → เพิ่มเข้าทีม
2. Refresh หน้า → ทีมยังอยู่
3. ลบตัวละคร → ทีมอัพเดท
4. เพิ่มครบ 4 คน → ไม่สามารถเพิ่มได้
```

#### 2. Navigation Flow
```
1. ไม่มีทีม → เข้า /world → แสดงเตือน
2. มีทีม → เข้า /world → เข้าได้
3. เปลี่ยนหน้า → state ยังอยู่
```

#### 3. Location Tracking
```
1. เข้า location → auto-save
2. Refresh → location ยังอยู่
3. ดู discovered locations → ถูกต้อง
```

---

## 🔍 Debugging

### View Current State
```typescript
const state = useGameStore.getState();
console.log("Party:", state.party);
console.log("Progress:", state.progress);
console.log("Inventory:", state.inventory);
console.log("Events:", state.events);
```

### Reset Game
```typescript
const { resetGame } = useGameStore();
resetGame(); // Clear all state
```

### Clear LocalStorage
```javascript
localStorage.removeItem("game-storage");
location.reload();
```

---

## 📚 References

- **Store**: `/src/stores/gameStore.ts`
- **Types**: Defined in gameStore.ts
- **Helpers**: `getPartyLeader`, `getPartyStats`, `getPartySynergy`
- **Persistence**: Zustand persist middleware

---

## ✅ Summary

**สิ่งที่ทำเสร็จ**:
1. ✅ สร้าง centralized gameStore
2. ✅ Migrate partyStore → gameStore
3. ✅ เพิ่ม inventory management
4. ✅ เพิ่ม game progress tracking
5. ✅ เพิ่ม event logging
6. ✅ เพิ่ม validation methods
7. ✅ อัพเดททุกหน้าให้ใช้ gameStore
8. ✅ State sync ทุกหน้า

**ผลลัพธ์**:
- ✅ State management ที่ดีขึ้น
- ✅ Code maintainability สูงขึ้น
- ✅ Easier to debug
- ✅ Ready for future features

**พร้อมใช้งาน!** 🎉
