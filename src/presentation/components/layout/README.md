# GameLayout System

ระบบ Layout สำหรับเกม RPG ที่ออกแบบให้เป็น Full Screen Layout พร้อม HUD Overlays

## 📦 Components

### 1. GameLayout
Main layout wrapper ที่ใช้สำหรับทุกหน้าในเกม

**Features:**
- ✅ Fixed full screen (`fixed inset-0`)
- ✅ Prevents body scroll
- ✅ Glass morphism design
- ✅ Responsive header with game stats
- ✅ Flexible content area

**Usage:**
```tsx
import { GameLayout } from "@/src/presentation/components/layout";

export default function MyPage() {
  return (
    <GameLayout>
      {/* Your content */}
    </GameLayout>
  );
}
```

**Props:**
- `children`: ReactNode - Content to render
- `hideHeader?`: boolean - Hide header (default: false)
- `hideNavigation?`: boolean - Hide navigation menu (default: false)
- `className?`: string - Additional classes

---

### 2. GameLayoutContent
Scrollable content wrapper - ใช้สำหรับ content ที่ต้อง scroll ได้

**Usage:**
```tsx
<GameLayout>
  <GameLayoutContent>
    {/* Scrollable content */}
    <div>Your page content here</div>
  </GameLayoutContent>
</GameLayout>
```

**Props:**
- `children`: ReactNode - Content to render
- `centered?`: boolean - Center content (default: false)
- `className?`: string - Additional classes

---

### 3. GameLayoutOverlay
Container สำหรับ HUD overlays - ใช้สำหรับ panels ที่แสดงแบบ overlay

**Usage:**
```tsx
<GameLayout>
  <GameLayoutContent>
    {/* Main content */}
  </GameLayoutContent>
  
  <GameLayoutOverlay>
    {/* HUD Panels */}
    <HUDPanel position="top-left">...</HUDPanel>
    <HUDPanel position="top-right">...</HUDPanel>
  </GameLayoutOverlay>
</GameLayout>
```

---

### 4. GameHeader
Header component พร้อม navigation และ player stats

**Features:**
- Player stats (Level, Gold, Party Size)
- Responsive navigation menu
- Mobile menu toggle
- Settings button

**Props:**
- `onMenuToggle?`: (isOpen: boolean) => void - Menu toggle callback
- `hideNavigation?`: boolean - Hide navigation (default: false)

---

### 5. HUDPanel
Reusable HUD panel component - ใช้สำหรับแสดง overlay panels

**Features:**
- 4 position options (top-left, top-right, bottom-left, bottom-right)
- Toggleable (can close and reopen)
- Scrollable content
- Glass morphism design

**Usage:**
```tsx
<HUDPanel
  title="Party Members"
  icon={<Users className="w-5 h-5" />}
  position="top-left"
  onClose={() => setShowPanel(false)}
  maxWidth="350px"
  maxHeight="400px"
>
  {/* Panel content */}
</HUDPanel>
```

**Props:**
- `title?`: string - Panel title
- `icon?`: ReactNode - Icon next to title
- `children`: ReactNode - Panel content
- `position?`: "top-left" | "top-right" | "bottom-left" | "bottom-right"
- `closable?`: boolean - Show close button (default: true)
- `onClose?`: () => void - Close callback
- `className?`: string - Additional classes
- `maxHeight?`: string - Max height (default: "500px")
- `maxWidth?`: string - Max width (default: "400px")
- `defaultOpen?`: boolean - Initial open state (default: true)

---

### 6. HUDPanelToggle
Button to show closed HUD panels

**Usage:**
```tsx
{!showPanel ? (
  <HUDPanelToggle
    label="Party"
    icon={<Users className="w-4 h-4" />}
    onClick={() => setShowPanel(true)}
    position="top-left"
  />
) : (
  <HUDPanel position="top-left" onClose={() => setShowPanel(false)}>
    {/* Panel content */}
  </HUDPanel>
)}
```

---

## 🎯 Complete Example

```tsx
"use client";

import {
  GameLayout,
  GameLayoutContent,
  GameLayoutOverlay,
  HUDPanel,
  HUDPanelToggle,
} from "@/src/presentation/components/layout";
import { Users, Scroll } from "lucide-react";
import { useState } from "react";

export default function MyGamePage() {
  const [showParty, setShowParty] = useState(true);
  const [showQuests, setShowQuests] = useState(true);

  return (
    <GameLayout>
      {/* Scrollable Main Content */}
      <GameLayoutContent>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white">My Page</h1>
          {/* Your page content */}
        </div>
      </GameLayoutContent>

      {/* HUD Overlays */}
      <GameLayoutOverlay>
        {/* Party Panel */}
        {showParty ? (
          <HUDPanel
            title="Party"
            icon={<Users className="w-5 h-5" />}
            position="top-left"
            onClose={() => setShowParty(false)}
          >
            <div className="space-y-2">
              {/* Party members */}
            </div>
          </HUDPanel>
        ) : (
          <HUDPanelToggle
            label="Party"
            icon={<Users className="w-4 h-4" />}
            onClick={() => setShowParty(true)}
            position="top-left"
          />
        )}

        {/* Quest Panel */}
        {showQuests ? (
          <HUDPanel
            title="Quests"
            icon={<Scroll className="w-5 h-5" />}
            position="top-right"
            onClose={() => setShowQuests(false)}
          >
            <div className="space-y-2">
              {/* Quest list */}
            </div>
          </HUDPanel>
        ) : (
          <HUDPanelToggle
            label="Quests"
            icon={<Scroll className="w-4 h-4" />}
            onClick={() => setShowQuests(true)}
            position="top-right"
          />
        )}
      </GameLayoutOverlay>
    </GameLayout>
  );
}
```

---

## 🎨 Design Patterns

### Pattern 1: Simple Page (No HUD)
```tsx
<GameLayout>
  <GameLayoutContent centered>
    <div>Centered content</div>
  </GameLayoutContent>
</GameLayout>
```

### Pattern 2: Page with HUD
```tsx
<GameLayout>
  <GameLayoutContent>
    <div>Scrollable content</div>
  </GameLayoutContent>
  
  <GameLayoutOverlay>
    <HUDPanel position="top-left">...</HUDPanel>
  </GameLayoutOverlay>
</GameLayout>
```

### Pattern 3: Full Screen (No Scroll)
```tsx
<GameLayout>
  <div className="absolute inset-0 flex items-center justify-center">
    <div>Full screen content</div>
  </div>
</GameLayout>
```

---

## 📝 Notes

1. **Body Scroll**: GameLayout จะ lock `document.body.overflow` เป็น `hidden` อัตโนมัติ
2. **Pointer Events**: GameLayoutOverlay ใช้ `pointer-events-none` เพื่อให้ click through ได้ แต่ children จะมี `pointer-events-auto`
3. **Responsive**: ทุก component รองรับ responsive design
4. **Performance**: ใช้ backdrop-blur และ glass morphism อย่างมีประสิทธิภาพ

---

## 🚀 Demo

ดูตัวอย่างการใช้งานได้ที่: `/game-layout-demo`

หรือเปิด: http://localhost:3000/game-layout-demo

---

## 🔄 Migration Guide

### Before (Old Layout):
```tsx
<div className="min-h-screen p-8">
  <div>Content</div>
</div>
```

### After (New Layout):
```tsx
<GameLayout>
  <GameLayoutContent>
    <div className="max-w-7xl mx-auto">
      <div>Content</div>
    </div>
  </GameLayoutContent>
</GameLayout>
```
