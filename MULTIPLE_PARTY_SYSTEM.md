# 🎮 Multiple Party System - Dragon Quest Tact Style

**Created**: 2025-10-07
**Status**: Planning Phase

---

## 📋 Overview

เปลี่ยนจากระบบ **Single Party** (4 คน) เป็น **Multiple Parties** (ไม่จำกัดจำนวน party) แบบ Dragon Quest Tact

---

## 🎯 Key Features

### 1. Unlimited Parties
- สร้าง party ได้ไม่จำกัด
- แต่ละ party มี 4 slots
- ตั้งชื่อ party ได้ (e.g., "Main Team", "Boss Team", "Farm Team")

### 2. Character Sharing
- ตัวละครเดียวกันสามารถอยู่ใน **หลาย party** ได้
- ไม่มีข้อจำกัดว่าตัวละครต้องอยู่ใน party เดียว

### 3. Active Party
- มี **1 party ที่ active** ในแต่ละเวลา
- Active party คือ party ที่ใช้ในการต่อสู้
- สลับ active party ได้ตลอดเวลา

### 4. Party Management
- Create party (with custom name)
- Delete party
- Rename party
- Copy party (duplicate configuration)
- Reorder parties

---

## 🏗️ Data Structure

### Current (Single Party)
```typescript
gameStore {
  party: PartyMember[] // max 4
}

interface PartyMember {
  character: Character;
  position: number; // 0-3
  isLeader: boolean;
}
```

### New (Multiple Parties)
```typescript
gameStore {
  parties: Party[] // unlimited
  activePartyId: string
}

interface Party {
  id: string; // UUID
  name: string; // "Main Team", "Boss Team", etc.
  members: PartyMember[]; // max 4
  isActive: boolean;
  formation: string; // "offensive", "defensive", "balanced"
  createdAt: string;
  updatedAt: string;
}

interface PartyMember {
  characterId: string; // Reference to recruited character
  position: number; // 0-3
  isLeader: boolean;
}
```

---

## 🎨 UI Design

### Party List View
```
┌─────────────────────────────────────────┐
│  Party Management                       │
├─────────────────────────────────────────┤
│                                         │
│  [+ Create New Party]                   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ ⭐ Main Team (Active)           │   │
│  │ 4/4 members                     │   │
│  │ [Arthur] [Luna] [Raven] [Kiro] │   │
│  │ [Edit] [Rename] [Copy]          │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Boss Team                       │   │
│  │ 4/4 members                     │   │
│  │ [Selena] [Elena] [Kaiden] [...] │   │
│  │ [Edit] [Rename] [Copy] [Delete] │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Farm Team                       │   │
│  │ 2/4 members                     │   │
│  │ [Morgan] [Arthur] [ ] [ ]       │   │
│  │ [Edit] [Rename] [Copy] [Delete] │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Party Editor View
```
┌─────────────────────────────────────────┐
│  Edit Party: Main Team                  │
│  [Rename] [Copy] [Delete] [Set Active]  │
├─────────────────────────────────────────┤
│                                         │
│  Party Slots (4/4)                      │
│  ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐
│  │👑     │ │       │ │       │ │       │
│  │Arthur │ │ Luna  │ │ Raven │ │ Kiro  │
│  │ Lv 10 │ │ Lv 8  │ │ Lv 9  │ │ Lv 7  │
│  │[Remove│ │[Remove│ │[Remove│ │[Remove│
│  └───────┘ └───────┘ └───────┘ └───────┘
│                                         │
│  Available Characters                   │
│  [Filter: All] [Sort: Level]            │
│  ┌───────┐ ┌───────┐ ┌───────┐         │
│  │Selena │ │ Elena │ │Kaiden │         │
│  │ Lv 10 │ │ Lv 9  │ │ Lv 8  │         │
│  │[Add]  │ │[Add]  │ │[Add]  │         │
│  └───────┘ └───────┘ └───────┘         │
│                                         │
│  Team Stats & Synergy                   │
│  HP: 2000 | ATK: 320 | DEF: 180        │
│  ✅ Elemental Diversity                 │
│  ✅ Balanced Team                       │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🔧 Implementation Plan

### Phase 1: Data Structure Refactor
**Estimated Time**: 1 day

**Tasks**:
- [ ] Create `Party` interface
- [ ] Update `gameStore` to use `parties: Party[]`
- [ ] Add `activePartyId: string`
- [ ] Migrate existing single party to first party
- [ ] Add party CRUD methods:
  - `createParty(name: string): Party`
  - `deleteParty(partyId: string): void`
  - `renameParty(partyId: string, newName: string): void`
  - `copyParty(partyId: string, newName: string): Party`
  - `setActiveParty(partyId: string): void`
  - `getActiveParty(): Party | null`
  - `addToParty(partyId: string, character: Character, position?: number): boolean`
  - `removeFromParty(partyId: string, characterId: string): void`

### Phase 2: UI Components
**Estimated Time**: 2 days

**Components to Create**:
- [ ] `PartyList.tsx` - List of all parties
- [ ] `PartyCard.tsx` - Individual party card
- [ ] `PartyEditor.tsx` - Edit party composition
- [ ] `CreatePartyModal.tsx` - Create new party
- [ ] `RenamePartyModal.tsx` - Rename party
- [ ] `PartyTabs.tsx` - Tab navigation between parties

**Components to Update**:
- [ ] `PartyView.tsx` - Show party list instead of single party
- [ ] `PartySlot.tsx` - Update to work with party ID
- [ ] `WorldView.tsx` - Use active party

### Phase 3: Business Logic
**Estimated Time**: 1 day

**Updates**:
- [ ] `PartyPresenter.ts` - Support multiple parties
- [ ] `usePartyPresenter.ts` - Handle party CRUD
- [ ] Update all party-related calculations to use active party

### Phase 4: Testing & Polish
**Estimated Time**: 1 day

**Tasks**:
- [ ] Test party creation/deletion
- [ ] Test character sharing across parties
- [ ] Test active party switching
- [ ] Test party copy feature
- [ ] Test persistence (LocalStorage)
- [ ] Polish UI/UX
- [ ] Add animations

---

## 📊 Migration Strategy

### Step 1: Backward Compatibility
```typescript
// On first load, migrate old single party to new structure
if (oldPartyExists && !newPartiesExist) {
  const mainParty: Party = {
    id: generateId(),
    name: "Main Team",
    members: oldParty.map(member => ({
      characterId: member.character.id,
      position: member.position,
      isLeader: member.isLeader
    })),
    isActive: true,
    formation: "balanced",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  gameStore.parties = [mainParty];
  gameStore.activePartyId = mainParty.id;
}
```

### Step 2: Default Parties
```typescript
// Create default parties for new users
const defaultParties = [
  { name: "Main Team", members: [] },
  { name: "Boss Team", members: [] },
  { name: "Farm Team", members: [] }
];
```

---

## 🎮 User Flow

### Creating a New Party
```
1. Click "+ Create New Party"
2. Enter party name
3. Click "Create"
4. → New empty party created
5. Click "Edit" to add characters
```

### Editing a Party
```
1. Click "Edit" on party card
2. → Open party editor
3. Add/remove characters
4. Drag to reorder
5. Set leader
6. Click "Save"
```

### Switching Active Party
```
1. Click "Set Active" on party card
2. → Party becomes active
3. → Used in battles
4. → Shown in world map
```

### Copying a Party
```
1. Click "Copy" on party card
2. Enter new name
3. Click "Copy"
4. → Duplicate party created with same members
```

---

## 🔍 Benefits

### For Players
- ✅ Prepare multiple teams for different situations
- ✅ Quick team switching without re-arranging
- ✅ Experiment with different compositions
- ✅ Save favorite team setups

### For Game Design
- ✅ Encourage diverse team building
- ✅ Support different play styles
- ✅ Enable specialized teams (Boss, Farm, PvP)
- ✅ Better character utilization

---

## 📝 Notes

- **Character Sharing**: Same character can be in multiple parties (like Dragon Quest Tact)
- **Active Party**: Only one party is active at a time
- **Party Limit**: No limit on number of parties (but UI should handle many parties)
- **Default Parties**: Create 3 default parties for new users
- **Persistence**: All parties saved in LocalStorage
- **Validation**: Must have at least 1 party, cannot delete last party

---

## 🚀 Ready to Implement!

**Total Estimated Time**: 5 days
**Priority**: High (Core Feature)
**Dependencies**: None (can start immediately)

**Next Step**: Start with Phase 1 (Data Structure Refactor)
