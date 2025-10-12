# TODO: Encounter-Disabling Items Implementation

## Overview
เพิ่มระบบไอเท็มที่สามารถป้องกันหรือลดโอกาสการเจอศัตรูระหว่างการสำรวจ (Exploration Items)

## Examples of Items
- **Holy Water** (น้ำมนต์) - ลดโอกาสเจอศัตรู 50% เป็นเวลา 100 steps
- **Repel** (สเปรย์ไล่ศัตรู) - ป้องกันศัตรูที่เลเวลต่ำกว่า 100%
- **Stealth Cloak** (เสื้อคลุมล่องหน) - ป้องกันการเจอศัตรูทั้งหมด 50 steps
- **Monster Bait** (เหยื่อล่อศัตรู) - เพิ่มโอกาสเจอศัตรู 200% เป็นเวลา 50 steps

---

## Implementation Checklist

### 1. ✅ Type Definitions (Already Added TODO Comments)

#### `/src/domain/types/encounter.types.ts`
```typescript
export interface EncounterModifier {
  id: string;
  name: string;
  type: "item" | "skill" | "buff";
  rateMultiplier: number;
  duration?: number;
  icon?: string;
  // TODO: Add this field
  disableEncounters?: boolean; // If true, completely disable encounters
}
```

#### `/src/domain/types/item.types.ts`
```typescript
export interface ItemEffect {
  type: "heal" | "damage" | "buff" | "debuff" | "restore";
  value: number;
  target: "self" | "ally" | "enemy" | "all-allies" | "all-enemies";
  duration?: number;
  // TODO: Add this field
  encounterEffect?: {
    type: "reduce-rate" | "disable" | "increase-rate";
    multiplier?: number;
    duration?: number; // Duration in steps
  };
}
```

---

### 2. ⏳ Store Logic Updates

#### `/src/stores/virtualMapStore.ts`

**A. `checkForEncounter()` - Line 751-756**
```typescript
// TODO: Check for items/skills that disable encounters completely
// Example: Holy Water, Repel, Stealth Mode
// const hasEncounterBlocker = state.activeModifiers.some(m => m.disableEncounters);
// if (hasEncounterBlocker) {
//   return null;
// }
```

**Implementation Steps:**
1. Check if any active modifier has `disableEncounters: true`
2. If yes, return `null` (no encounter)
3. Log the item name for debugging

**B. `resetEncounterSteps()` - Line 832-838**
```typescript
// TODO: Check for items/skills that disable encounters
// If player has encounter-blocking items, set stepsUntilEncounter to 999
// const hasEncounterBlocker = state.activeModifiers.some(m => m.disableEncounters);
// if (hasEncounterBlocker) {
//   set({ stepCount: 0, stepsUntilEncounter: 999 });
//   return;
// }
```

**Implementation Steps:**
1. Check if any active modifier has `disableEncounters: true`
2. If yes, set `stepsUntilEncounter` to 999 (effectively infinite)
3. Prevent normal encounter calculation

---

### 3. ⏳ Item Master Data

#### `/src/data/master/items.master.ts` (Create if not exists)

**Example Items:**
```typescript
export const EXPLORATION_ITEMS: Consumable[] = [
  {
    id: "item-holy-water",
    name: "Holy Water",
    nameEn: "Holy Water",
    type: "consumable",
    rarity: "uncommon",
    description: "ลดโอกาสเจอศัตรูลง 50% เป็นเวลา 100 ก้าว",
    icon: "💧",
    stackable: true,
    maxStack: 99,
    buyPrice: 500,
    sellPrice: 250,
    effects: [
      {
        type: "buff",
        value: 0,
        target: "self",
        encounterEffect: {
          type: "reduce-rate",
          multiplier: 0.5, // 50% encounter rate
          duration: 100, // 100 steps
        },
      },
    ],
  },
  {
    id: "item-stealth-cloak",
    name: "Stealth Cloak",
    nameEn: "Stealth Cloak",
    type: "consumable",
    rarity: "rare",
    description: "ป้องกันการเจอศัตรูทั้งหมดเป็นเวลา 50 ก้าว",
    icon: "🧥",
    stackable: true,
    maxStack: 10,
    buyPrice: 2000,
    sellPrice: 1000,
    effects: [
      {
        type: "buff",
        value: 0,
        target: "self",
        encounterEffect: {
          type: "disable",
          duration: 50, // 50 steps
        },
      },
    ],
  },
  {
    id: "item-monster-bait",
    name: "Monster Bait",
    nameEn: "Monster Bait",
    type: "consumable",
    rarity: "common",
    description: "เพิ่มโอกาสเจอศัตรู 200% เป็นเวลา 50 ก้าว (ใช้สำหรับฟาร์ม EXP)",
    icon: "🥩",
    stackable: true,
    maxStack: 99,
    buyPrice: 300,
    sellPrice: 150,
    effects: [
      {
        type: "buff",
        value: 0,
        target: "self",
        encounterEffect: {
          type: "increase-rate",
          multiplier: 2.0, // 200% encounter rate
          duration: 50, // 50 steps
        },
      },
    ],
  },
];
```

---

### 4. ⏳ Item Usage Logic

#### `/src/stores/gameStore.ts` or `/src/stores/inventoryStore.ts`

**Add Function: `useExplorationItem(itemId: string)`**
```typescript
useExplorationItem: (itemId: string) => {
  const item = getItemById(itemId);
  
  if (!item || item.type !== "consumable") {
    return false;
  }
  
  const encounterEffect = item.effects?.[0]?.encounterEffect;
  if (!encounterEffect) {
    return false;
  }
  
  // Create EncounterModifier from item effect
  const modifier: EncounterModifier = {
    id: `modifier-${item.id}-${Date.now()}`,
    name: item.name,
    type: "item",
    rateMultiplier: encounterEffect.multiplier || 0,
    duration: encounterEffect.duration,
    icon: item.icon,
    disableEncounters: encounterEffect.type === "disable",
  };
  
  // Add modifier to virtualMapStore
  useVirtualMapStore.getState().addEncounterModifier(modifier);
  
  // Remove item from inventory
  get().removeItem(itemId, 1);
  
  return true;
}
```

---

### 5. ⏳ UI Components

#### A. Inventory Item Usage Button
- Add "Use" button for exploration items in inventory
- Show current active modifiers
- Display remaining steps/duration

#### B. Active Modifiers Display (HUD)
```typescript
// /src/presentation/components/hud/ActiveModifiersDisplay.tsx
export function ActiveModifiersDisplay() {
  const { activeModifiers } = useVirtualMapStore();
  
  return (
    <div className="space-y-2">
      {activeModifiers.map((modifier) => (
        <div key={modifier.id} className="flex items-center gap-2 bg-slate-800 p-2 rounded">
          <span>{modifier.icon}</span>
          <div>
            <div className="text-sm font-semibold">{modifier.name}</div>
            <div className="text-xs text-gray-400">
              {modifier.duration ? `${modifier.duration} steps remaining` : "Permanent"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

#### C. Quick Item Slot (Hotkey)
- Add quick slot for exploration items (e.g., press "I" to use)
- Show item icon and remaining quantity
- Show active effect duration

---

### 6. ⏳ Testing Checklist

- [ ] Holy Water reduces encounter rate by 50%
- [ ] Stealth Cloak completely prevents encounters
- [ ] Monster Bait increases encounter rate by 200%
- [ ] Duration counts down correctly with each step
- [ ] Multiple modifiers stack correctly
- [ ] Modifiers expire after duration ends
- [ ] Safe zones (isActive: false) still prevent encounters even with Monster Bait
- [ ] UI shows active modifiers correctly
- [ ] Items are consumed from inventory when used
- [ ] Cannot use item if inventory is empty

---

## Priority Order

1. **High Priority** - Core Logic
   - [ ] Update `EncounterModifier` type with `disableEncounters` field
   - [ ] Implement check in `checkForEncounter()`
   - [ ] Implement check in `resetEncounterSteps()`

2. **Medium Priority** - Item System
   - [ ] Create exploration items in master data
   - [ ] Implement `useExplorationItem()` function
   - [ ] Add item usage logic to inventory

3. **Low Priority** - UI/UX
   - [ ] Create Active Modifiers Display component
   - [ ] Add quick item slot with hotkey
   - [ ] Add visual feedback when item is used
   - [ ] Add sound effects for item usage

---

## Notes

- ระบบนี้ควรทำงานร่วมกับ `EncounterModifier` ที่มีอยู่แล้ว
- `rateMultiplier = 0` และ `disableEncounters = true` ควรให้ผลลัพธ์เหมือนกัน (ป้องกัน encounter)
- ควรมี UI แสดงสถานะของ active modifiers ให้ผู้เล่นเห็น
- ควรมีเสียงและ animation เมื่อใช้ไอเท็ม
- ควรมี tutorial หรือ tooltip อธิบายการใช้งาน

---

## Related Files

- `/src/domain/types/encounter.types.ts` - EncounterModifier type
- `/src/domain/types/item.types.ts` - ItemEffect type
- `/src/stores/virtualMapStore.ts` - Encounter logic
- `/src/stores/gameStore.ts` - Inventory management
- `/src/data/master/items.master.ts` - Item master data
- `/src/utils/encounterUtils.ts` - Encounter calculation utilities
