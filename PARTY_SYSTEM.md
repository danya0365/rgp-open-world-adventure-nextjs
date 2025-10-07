# 🎮 Party Management System

## Overview
Complete party management system with character selection, team composition, and synergy indicators.

---

## ✅ Features Implemented

### 1. Party Store (Zustand)
**Location**: `/src/stores/partyStore.ts`

#### State Management:
- **Party Members**: Max 4 characters
- **Position System**: 0-3 slots
- **Leader System**: First member is auto-leader
- **Persistence**: LocalStorage via Zustand persist

#### Actions:
```typescript
addToParty(character, position?)     // Add character to party
removeFromParty(characterId)         // Remove from party
swapPartyMembers(pos1, pos2)        // Swap positions
setLeader(characterId)               // Set party leader
clearParty()                         // Clear all members
isInParty(characterId)               // Check if in party
getPartyMember(position)             // Get member at position
```

#### Helper Functions:
```typescript
getPartyLeader(party)                // Get leader
getPartyStats(party)                 // Get total HP, MP, avg level
getPartySynergy(party)               // Calculate team synergies
```

---

### 2. PartySlot Component
**Location**: `/src/presentation/components/party/PartySlot.tsx`

#### Features:
- **Empty Slot**: Clickable to select character
- **Filled Slot**: Shows character info
- **Leader Badge**: Crown icon for leader
- **Remove Button**: X button to remove
- **Stats Display**: HP, ATK, DEF
- **Element Badges**: Character elements
- **Position Indicator**: Slot number

#### Props:
```typescript
interface PartySlotProps {
  position: number;              // 0-3
  member: PartyMember | null;    // Party member or null
  onRemove?: (id: string) => void;
  onSelect?: (position: number) => void;
  isSelecting?: boolean;
}
```

---

### 3. Party Page
**Location**: `/app/party/page.tsx`

#### Sections:

**Header**:
- Page title
- Back to characters link
- Description

**Party Stats Summary** (4 cards):
- Members count (X/4)
- Total HP
- Total MP
- Average Level

**Team Synergy**:
- Elemental Diversity (3+ elements)
- Balanced Team (all different classes)
- Healer Support (has Priest/Paladin)
- Tank Protection (has Warrior/Paladin)
- High Damage (has Mage/Archer/Assassin)

**Party Slots** (4 slots):
- Grid layout (responsive)
- Click empty slot to select
- Click character to add
- Remove button on filled slots

**Available Characters**:
- Shows playable characters not in party
- Click to add to party
- Disabled when party is full

**Character Selection Modal**:
- Opens when clicking empty slot
- Grid of available characters
- Click to select for specific slot

---

## 🎯 User Experience

### Party Selection Flow:
1. **View Party Page** - See current party (empty initially)
2. **Click Empty Slot** - Opens character selection modal
3. **Select Character** - Character added to slot
4. **View Stats** - See updated party stats and synergies
5. **Remove if needed** - Click X to remove character
6. **Repeat** - Fill up to 4 slots

### Alternative Flow:
1. **Click Available Character** - Adds to first empty slot
2. **Auto-positioned** - Finds first available slot

---

## 🎨 Design Features

### Visual Indicators:
- **Leader Badge**: Gold crown icon
- **Element Colors**: Fire (Red), Water (Cyan), etc.
- **Synergy Badges**: Purple sparkle badges
- **Empty Slots**: Dashed border, hover effect

### Responsive Layout:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 4 columns

### Animations:
- Hover scale on slots
- Smooth transitions
- Modal fade in/out

---

## 📊 Party Synergies

### Automatic Detection:

**Elemental Diversity**:
- Requires 3+ different elements
- Bonus: Versatile damage types

**Balanced Team**:
- All members have different classes
- Bonus: Well-rounded capabilities

**Healer Support**:
- Has Priest or Paladin
- Bonus: Sustain in battles

**Tank Protection**:
- Has Warrior or Paladin
- Bonus: Frontline defense

**High Damage**:
- Has Mage, Archer, or Assassin
- Bonus: Burst damage potential

---

## 🔧 Technical Details

### State Persistence:
```typescript
// Zustand persist middleware
persist(
  (set, get) => ({ /* state */ }),
  { name: "party-storage" }
)
```

### Party Stats Calculation:
```typescript
const stats = {
  totalHp: sum of all maxHp,
  totalMp: sum of all maxMp,
  avgLevel: average of all levels,
  memberCount: party.length
}
```

### Synergy Detection:
```typescript
// Check elements
const elements = new Set(party.flatMap(m => m.character.elements));
if (elements.size >= 3) synergies.push("Elemental Diversity");

// Check classes
const classes = new Set(party.map(m => m.character.class));
if (classes.size === party.length) synergies.push("Balanced Team");
```

---

## 🚀 Usage Example

### Navigate to Party Page:
```bash
npm run dev
```
Visit: `http://localhost:3000/party`

### Features Available:
1. ✅ View empty party slots (4 slots)
2. ✅ Click slot to select character
3. ✅ See available characters
4. ✅ Add characters to party
5. ✅ View party stats (HP, MP, Level)
6. ✅ See team synergies
7. ✅ Remove characters
8. ✅ Leader indicator
9. ✅ Persistent state (localStorage)

---

## 📝 Code Structure

```
/app/party/
  └── page.tsx                    # Party management page

/src/stores/
  └── partyStore.ts              # Zustand party store

/src/presentation/components/party/
  └── PartySlot.tsx              # Party slot component

/src/domain/types/
  └── character.types.ts         # Character types (existing)
```

---

## 🎯 Integration Points

### With Character System:
- Uses `mockCharacters` from mock data
- Uses `getPlayableCharacters()` helper
- Uses `CharacterCard` component

### With Component Library:
- Uses `Button` component
- Uses `Modal` component
- Uses UI design tokens

### With State Management:
- Zustand store with persistence
- LocalStorage for party data
- Reactive updates

---

## 💡 Future Enhancements

### Planned Features:
- [ ] **Drag & Drop**: Reorder party members
- [ ] **Formation System**: Tactical positioning
- [ ] **Party Presets**: Save/load party compositions
- [ ] **Team Bonuses**: Class-specific synergies
- [ ] **Equipment View**: See party equipment
- [ ] **Total Stats**: Combined party statistics
- [ ] **Party Skills**: Team-based abilities

---

## ✨ Key Features

- ✅ Party selection (max 4 characters)
- ✅ Position-based slots (0-3)
- ✅ Leader system (auto-assigned)
- ✅ Party stats summary (HP, MP, Level)
- ✅ Team synergy detection (5 types)
- ✅ Character selection modal
- ✅ Remove from party
- ✅ Available characters display
- ✅ Persistent state (localStorage)
- ✅ Responsive design
- ✅ Clean UI (minimal clutter)
- ✅ Integration with character system
- ✅ Navigation from landing page

---

## 🎮 Ready to Use!

Party Management System is complete and ready! You can:
- Select up to 4 characters
- View party stats and synergies
- Manage team composition
- See visual indicators

**Next Steps**: Build World Map Navigation or Quest System! 🗺️📜
