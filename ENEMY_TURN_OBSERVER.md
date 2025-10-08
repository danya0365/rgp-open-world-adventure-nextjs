# Enemy Turn Observer Implementation

## Overview
สร้างฟังก์ชัน observer ใหม่ที่จะตรวจสอบและเรียก `playEnemyTurn` อัตโนมัติเมื่อถึงเทิร์นของศัตรู โดยมีดีเลย์ 0.5 วินาทีก่อนทำ action

## Changes Made

### 1. Added `observeEnemyTurn` Function
**File:** `/src/stores/battleStore.ts`

เพิ่มฟังก์ชัน `observeEnemyTurn` ที่ทำหน้าที่:
- ตรวจสอบว่าเป็นเทิร์นของศัตรูหรือไม่ (`!currentUnit.isAlly`)
- ตรวจสอบว่าการต่อสู้ยังดำเนินอยู่ (`phase === "battle"`)
- ตรวจสอบว่ายูนิตยังไม่ได้ทำแอคชัน (`!currentUnit.hasActed`)
- ถ้าเงื่อนไขทั้งหมดเป็นจริง จะเรียก `playEnemyTurn()` หลังจาก 500ms

```typescript
observeEnemyTurn: () => {
  const state = get();
  const currentUnit = state.getCurrentUnit();

  // Check if it's enemy's turn and battle is still ongoing
  if (
    currentUnit &&
    !currentUnit.isAlly &&
    state.phase === "battle" &&
    !currentUnit.hasActed
  ) {
    // Delay enemy action by 0.5 seconds for better UX
    setTimeout(() => {
      get().playEnemyTurn();
    }, 500);
  }
},
```

### 2. Auto-trigger in `endTurn`
เพิ่มการเรียก `observeEnemyTurn()` ที่ท้ายฟังก์ชัน `endTurn()` เพื่อให้ตรวจสอบทุกครั้งที่มีการเปลี่ยนเทิร์น:

```typescript
// Observe and trigger enemy turn if needed
get().observeEnemyTurn();
```

### 3. Auto-trigger in `initBattle`
เพิ่มการเรียก `observeEnemyTurn()` ที่ท้ายฟังก์ชัน `initBattle()` เพื่อจัดการกรณีที่เทิร์นแรกเป็นของศัตรู:

```typescript
// Observe and trigger enemy turn if the first unit is an enemy
get().observeEnemyTurn();
```

### 4. Cleanup in Presenter
**File:** `/src/presentation/presenters/battle/useBattlePresenter.ts`

ลบ `useEffect` ที่เคยใช้สำหรับ auto-play enemy turn ออก เพราะตอนนี้จัดการโดย observer ใน store แล้ว

## How It Works

### Flow Diagram
```
1. Player ends turn
   ↓
2. endTurn() is called
   ↓
3. Turn changes to next unit
   ↓
4. observeEnemyTurn() is called
   ↓
5. Check if current unit is enemy
   ↓
6. If yes: Wait 500ms → playEnemyTurn()
   ↓
7. Enemy performs AI action
   ↓
8. Enemy ends turn
   ↓
9. Back to step 2 (loop until player's turn)
```

### Key Benefits

1. **Centralized Logic**: การจัดการ enemy turn อยู่ใน store เดียว ไม่กระจายไปตาม components
2. **Automatic**: ไม่ต้องเรียก `playEnemyTurn()` manually จาก UI
3. **Better UX**: มีดีเลย์ 0.5 วินาทีทำให้ผู้เล่นเห็นการเปลี่ยนเทิร์นชัดเจน
4. **Reliable**: ทำงานทุกครั้งที่เปลี่ยนเทิร์น รวมถึงเทิร์นแรกของเกม

## Testing

เพื่อทดสอบว่าระบบทำงานถูกต้อง:

1. เริ่มการต่อสู้ใหม่
2. ถ้าเทิร์นแรกเป็นของศัตรู → ศัตรูควรทำ action อัตโนมัติหลัง 0.5 วินาที
3. เมื่อผู้เล่นจบเทิร์น → ถ้าเทิร์นถัดไปเป็นของศัตรู ควรทำ action อัตโนมัติ
4. ศัตรูควรทำ action ต่อเนื่องจนกว่าจะถึงเทิร์นของผู้เล่น

## Notes

- ดีเลย์ 500ms สามารถปรับได้ตามต้องการใน `observeEnemyTurn()`
- ฟังก์ชัน `playEnemyTurn()` ยังคงเป็น public method สามารถเรียกใช้ manual ได้ (เช่น จากปุ่ม debug)
- Observer จะไม่ทำงานถ้า `phase !== "battle"` (เช่น victory/defeat)
