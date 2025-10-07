# 🎨 RPG Open World Adventure - Design System

## Overview
Complete design system for RPG Fantasy game with Tailwind CSS v4 and custom components.

---

## 🎯 Design Principles

1. **Fantasy Theme First** - Dark fantasy aesthetic with magical elements
2. **Mobile-First** - Responsive design for all devices
3. **Performance** - Optimized animations and transitions
4. **Accessibility** - Clear contrast and readable text
5. **Consistency** - Unified design language across all components

---

## 🎨 Color Palette

### Primary Colors
- **Magic Blue**: `#3b82f6` - Primary actions and highlights
- **Mystic Purple**: `#9333ea` - Secondary actions and magic
- **Royal Gold**: `#eab308` - Legendary items and achievements
- **Enchanted Pink**: `#ec4899` - Special effects and highlights

### Elemental Colors (6 Elements)
- **Fire**: `#ef4444` - Red/Crimson
- **Water**: `#06b6d4` - Cyan/Blue
- **Earth**: `#22c55e` - Green
- **Wind**: `#14b8a6` - Teal/Cyan
- **Light**: `#f59e0b` - Amber/Gold
- **Dark**: `#475569` - Slate/Gray

### Status Colors
- **HP (Health)**: 
  - Critical (<25%): `#dc2626` (Red)
  - Low (<50%): `#f59e0b` (Amber)
  - Normal (>50%): `#22c55e` (Green)
- **MP (Mana)**: `#06b6d4` (Cyan)
- **Stamina**: `#f59e0b` (Amber)
- **EXP**: `#9333ea` (Purple)

### Rarity Colors
- **Common**: `#9ca3af` (Gray)
- **Uncommon**: `#22c55e` (Green)
- **Rare**: `#3b82f6` (Blue)
- **Epic**: `#a855f7` (Purple)
- **Legendary**: `#f59e0b` (Gold)
- **Mythic**: `#ec4899` (Pink)

### Background Colors
- **Primary**: `#0f172a` (Dark Slate)
- **Secondary**: `#1e293b` (Slate 800)
- **Tertiary**: `#334155` (Slate 700)

---

## 📦 Component Library

### 1. Button Component
**Location**: `/src/presentation/components/ui/Button.tsx`

**Variants**:
- `primary` - Purple to Pink gradient
- `secondary` - Blue to Cyan gradient
- `action` - Amber to Orange gradient
- `danger` - Red to Rose gradient
- `ghost` - Transparent with border
- `outline` - Border only

**Sizes**: `sm`, `md`, `lg`, `xl`

**Features**:
- Loading state with spinner
- Hover scale animation
- Shadow glow effects
- Disabled state

**Usage**:
```tsx
import { Button } from "@/src/presentation/components/ui";

<Button variant="primary" size="lg">
  <Sword className="w-5 h-5" />
  Start Adventure
</Button>
```

---

### 2. Card Component
**Location**: `/src/presentation/components/ui/Card.tsx`

**Variants**:
- `default` - Slate background
- `character` - Purple gradient
- `item` - Blue gradient
- `quest` - Amber gradient
- `enemy` - Red gradient
- `skill` - Cyan gradient

**Sub-components**:
- `CardHeader`
- `CardTitle`
- `CardDescription`
- `CardContent`
- `CardFooter`

**Features**:
- Glow effect option
- Hover scale animation
- Backdrop blur
- Border animations

**Usage**:
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/src/presentation/components/ui";

<Card variant="character" glow>
  <CardHeader>
    <CardTitle>Warrior</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Level 50 Hero</p>
  </CardContent>
</Card>
```

---

### 3. ProgressBar Component
**Location**: `/src/presentation/components/ui/ProgressBar.tsx`

**Types**:
- `hp` - Health bar (Red/Amber/Green based on percentage)
- `mp` - Mana bar (Cyan)
- `stamina` - Stamina bar (Amber)
- `exp` - Experience bar (Purple)
- `default` - Generic bar (Blue)

**Sizes**: `sm`, `md`, `lg`

**Features**:
- Dynamic color based on value
- Animated fill
- Label and percentage display
- Glow effects

**Usage**:
```tsx
import { ProgressBar } from "@/src/presentation/components/ui";

<ProgressBar value={750} max={1000} type="hp" />
<ProgressBar value={320} max={500} type="mp" />
```

---

### 4. Modal Component
**Location**: `/src/presentation/components/ui/Modal.tsx`

**Sizes**: `sm`, `md`, `lg`, `xl`, `full`

**Features**:
- Backdrop blur
- ESC key to close
- Click outside to close
- Smooth animations
- Custom header/footer

**Sub-components**:
- `ModalHeader`
- `ModalTitle`
- `ModalDescription`
- `ModalFooter`

**Usage**:
```tsx
import { Modal } from "@/src/presentation/components/ui";

<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Inventory"
  size="lg"
>
  <p>Modal content here</p>
</Modal>
```

---

### 5. Stats Component
**Location**: `/src/presentation/components/ui/Stats.tsx`

**Variants**:
- `default` - Slate
- `primary` - Purple
- `success` - Green
- `warning` - Amber
- `danger` - Red
- `info` - Blue

**Sizes**: `sm`, `md`, `lg`

**Features**:
- Icon support
- Hover animation
- Color-coded backgrounds
- Responsive layout

**Usage**:
```tsx
import { Stats } from "@/src/presentation/components/ui";
import { Heart } from "lucide-react";

<Stats
  icon={<Heart className="w-full h-full" />}
  label="Total HP"
  value="1,250"
  variant="danger"
/>
```

---

## 🎭 Animations & Effects

### Transitions
- **Fast**: 150ms
- **Normal**: 300ms
- **Slow**: 500ms
- **Slower**: 1000ms

### Hover Effects
- Scale: `hover:scale-105`
- Glow: Shadow with color
- Border: Color intensity change

### Gradients
- `gradient-magic`: Blue to Purple
- `gradient-fire`: Amber to Red
- `gradient-water`: Cyan to Blue
- `gradient-earth`: Green to Dark Green
- `gradient-wind`: Teal to Cyan
- `gradient-light`: Yellow to Amber
- `gradient-dark`: Slate to Dark Slate
- `gradient-fantasy`: Indigo to Purple to Pink
- `gradient-legendary`: Amber to Pink to Purple

---

## 📏 Spacing & Sizing

### Spacing Scale
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

### Border Radius
- `sm`: 6px
- `md`: 8px
- `lg`: 12px
- `xl`: 16px
- `2xl`: 24px
- `full`: 9999px

---

## 🎮 Z-Index Layers
- Base: 0
- Dropdown: 1000
- Sticky: 1020
- Fixed: 1030
- Modal Backdrop: 1040
- Modal: 1050
- Popover: 1060
- Tooltip: 1070
- Notification: 1080

---

## 📱 Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## 🚀 Usage

### Import Components
```tsx
import {
  Button,
  Card,
  ProgressBar,
  Modal,
  Stats
} from "@/src/presentation/components/ui";
```

### Demo Page
Visit `/components-demo` to see all components in action.

---

## 📝 Next Steps

1. ✅ Design System Complete
2. ✅ Component Library Complete
3. 🔄 Create Mock Data
4. 🔄 Build Game UI Pages
5. 🔄 Implement Combat System UI
6. 🔄 Character Management UI

---

## 🎨 Theme Files

- **Main Theme**: `/public/styles/rpg-theme.css`
- **Components**: `/src/presentation/components/ui/`
- **Utilities**: `/lib/utils.ts`
- **Demo**: `/app/components-demo/page.tsx`
