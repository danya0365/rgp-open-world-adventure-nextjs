# 🎮 RPG Open World Adventure - Game Flow

**Last Updated**: 2025-10-07

---

## 🗺️ ลำดับการเล่นเกม (Current Flow)

### 1. หน้าแรก (Landing Page)
**URL**: `http://localhost:3000/`

**สิ่งที่ทำได้**:
- ✅ ดูข้อมูลเกม (Title, Description, Features)
- ✅ ดู Stats (Dynamic Grid Combat, 20+ Locations, 8 Characters, 100+ Items)
- ✅ คลิก "จัดการทีม" → ไปหน้า Party Management
- ✅ คลิก "ตัวละคร" → ไปหน้า Characters

---

### 2. หน้าตัวละคร (Characters Page)
**URL**: `http://localhost:3000/characters`

**สิ่งที่ทำได้**:
- ✅ ดูตัวละครทั้งหมด (8 ตัว)
- ✅ กรองตามคลาส (Warrior, Mage, Priest, Archer, Assassin, Paladin)
- ✅ กรองเฉพาะตัวละครที่เล่นได้
- ✅ ดู Stats Summary (ทั้งหมด, เล่นได้, รีครูทได้, Legendary+)
- ✅ คลิกตัวละครเพื่อดูรายละเอียด (Modal)
- ✅ คลิก "← หน้าแรก" → กลับหน้าแรก
- ✅ คลิก "จัดการทีม →" → ไปหน้า Party Management

**ข้อมูลในตัวละคร**:
- ชื่อ, คลาส, ระดับ, Rarity
- HP, MP, ATK, DEF, INT, AGI, LUK
- ธาตุ (Elements)
- ความสัมพันธ์ธาตุ (Elemental Affinities)
- สกิล (Skills)
- ประวัติ (Backstory)

---

### 3. หน้าจัดการทีม (Party Management)
**URL**: `http://localhost:3000/party`

**สิ่งที่ทำได้**:
- ✅ เลือกตัวละครเข้าทีม (สูงสุด 4 ตัว)
- ✅ ดู Party Stats (สมาชิก, Total HP, Total MP, Avg Level)
- ✅ ดู Team Synergy (5 types):
  - Elemental Diversity (3+ elements)
  - Balanced Team (different classes)
  - Healer Support (Priest/Paladin)
  - Tank Protection (Warrior/Paladin)
  - High Damage (Mage/Archer/Assassin)
- ✅ เพิ่มตัวละครเข้าทีม (2 วิธี):
  1. คลิกช่องว่าง → เลือกจาก Modal
  2. คลิกตัวละครด้านล่าง → เพิ่มเข้าช่องว่างแรก
- ✅ ลบตัวละครออกจากทีม (คลิก X)
- ✅ ดู Leader Badge (ตัวแรกเป็น Leader)
- ✅ ข้อมูลถูกบันทึกใน LocalStorage (Refresh ไม่หาย)
- ✅ คลิก "← หน้าแรก" → กลับหน้าแรก
- ✅ คลิก "← ตัวละคร" → กลับหน้าตัวละคร

---

## 🎯 Flow Chart

```
┌─────────────────────────────────────────┐
│         Landing Page (/)                │
│                                         │
│  [จัดการทีม]  [ตัวละคร]               │
└──────┬──────────────┬───────────────────┘
       │              │
       │              ▼
       │    ┌─────────────────────────────┐
       │    │   Characters (/characters)  │
       │    │                             │
       │    │  • ดูตัวละครทั้งหมด        │
       │    │  • กรองตามคลาส             │
       │    │  • ดูรายละเอียด             │
       │    │                             │
       │    │  [← หน้าแรก] [จัดการทีม →]│
       │    └──────┬──────────────────────┘
       │           │
       ▼           ▼
┌─────────────────────────────────────────┐
│         Party (/party)                  │
│                                         │
│  • เลือกตัวละคร 4 ตัว                  │
│  • ดู Stats & Synergy                   │
│  • จัดการทีม                           │
│                                         │
│  [← หน้าแรก] [← ตัวละคร]              │
└─────────────────────────────────────────┘
```

---

## 🎮 วิธีเล่น (Step by Step)

### ขั้นตอนที่ 1: เริ่มเกม
1. เปิด `http://localhost:3000/`
2. อ่านข้อมูลเกม
3. เลือกเมนู:
   - **"จัดการทีม"** → ไปจัดทีมเลย
   - **"ตัวละคร"** → ดูตัวละครก่อน

---

### ขั้นตอนที่ 2: ดูตัวละคร
1. คลิก **"ตัวละคร"** จากหน้าแรก
2. ดูตัวละครทั้งหมด (8 ตัว)
3. กรองตามคลาสที่ต้องการ
4. คลิกตัวละครเพื่อดูรายละเอียด
5. เมื่อพอใจแล้ว คลิก **"จัดการทีม →"**

---

### ขั้นตอนที่ 3: จัดการทีม
1. คลิก **"จัดการทีม"** จากหน้าแรกหรือหน้าตัวละคร
2. เห็นช่องว่าง 4 ช่อง (Slot 1-4)
3. เลือกตัวละครเข้าทีม:
   - **วิธีที่ 1**: คลิกช่องว่าง → เลือกจาก Modal
   - **วิธีที่ 2**: คลิกตัวละครด้านล่าง
4. ดู Party Stats อัพเดท (HP, MP, Level)
5. ดู Team Synergy (ถ้ามี)
6. ลบตัวละครได้ด้วยปุ่ม X
7. Refresh หน้า → ข้อมูลยังอยู่ (LocalStorage)

---

## 📋 Features ที่ใช้ได้ (Current)

### ✅ หน้าแรก (Landing)
- [x] แสดงข้อมูลเกม
- [x] Stats cards
- [x] Navigation ไป Characters
- [x] Navigation ไป Party

### ✅ หน้าตัวละคร (Characters)
- [x] แสดงตัวละครทั้งหมด
- [x] กรองตามคลาส
- [x] กรองเฉพาะที่เล่นได้
- [x] Stats summary
- [x] Character detail modal
- [x] Navigation ไป Party
- [x] Navigation กลับหน้าแรก

### ✅ หน้าจัดการทีม (Party)
- [x] เลือกตัวละคร 4 ตัว
- [x] Party stats summary
- [x] Team synergy detection
- [x] เพิ่ม/ลบตัวละคร
- [x] Leader indicator
- [x] LocalStorage persistence
- [x] Navigation กลับหน้าแรก
- [x] Navigation กลับหน้าตัวละคร

---

## 🚧 Features ที่ยังไม่มี (Coming Soon)

### ⏳ World Map (กำลังจะทำ)
- [ ] ดูแผนที่โลก
- [ ] เดินทางระหว่างสถานที่
- [ ] ค้นพบสถานที่ใหม่
- [ ] Fast travel

### ⏳ Quest System
- [ ] ดู Quest log
- [ ] รับ Quest
- [ ] ทำ Quest
- [ ] รับรางวัล

### ⏳ Combat System
- [ ] เข้าสู่การต่อสู้
- [ ] Dynamic Tactical Grid
- [ ] ใช้สกิล
- [ ] ระบบเทิร์น

### ⏳ Inventory
- [ ] ดูไอเทม
- [ ] ใช้ไอเทม
- [ ] จัดการอุปกรณ์

---

## 🎯 Navigation Map

```
หน้าแรก (/)
├── จัดการทีม → /party
│   ├── ← หน้าแรก → /
│   └── ← ตัวละคร → /characters
│
└── ตัวละคร → /characters
    ├── ← หน้าแรก → /
    └── จัดการทีม → /party
```

---

## 💡 Tips

### การเลือกทีม
1. **Balanced Team**: เลือกคนละคลาส (Warrior, Mage, Priest, Archer)
2. **Elemental Diversity**: เลือกหลายธาตุ (Fire, Water, Earth, Wind)
3. **Role Coverage**: 
   - Tank (Warrior/Paladin)
   - Healer (Priest/Paladin)
   - DPS (Mage/Archer/Assassin)

### ตัวละครแนะนำ
- **Arthur** (Warrior) - Tank, Fire element
- **Luna** (Mage) - Magic DPS, Water element
- **Elena** (Priest) - Healer, Light element
- **Raven** (Archer) - Physical DPS, Wind element

---

## 🔄 Data Persistence

### LocalStorage
- **Party Data**: บันทึกอัตโนมัติ
- **Key**: `party-storage`
- **Refresh**: ข้อมูลไม่หาย

### การรีเซ็ต
- เปิด DevTools → Application → Local Storage
- ลบ `party-storage`
- Refresh หน้า

---

## 🚀 Quick Start

```bash
# Start dev server
npm run dev

# Open browser
http://localhost:3000/

# Flow
1. หน้าแรก → คลิก "ตัวละคร"
2. ดูตัวละคร → คลิก "จัดการทีม"
3. เลือกตัวละคร 4 ตัว
4. ดู Team Synergy
5. Done! 🎉
```

---

## 📝 Notes

- **Mock Data**: ใช้ข้อมูลจำลอง (ยังไม่มี Backend)
- **Clean Architecture**: ทุกหน้าใช้ Presenter Pattern
- **SEO**: Server Components สำหรับ SEO
- **Responsive**: รองรับ Mobile, Tablet, Desktop

---

## 🎮 Ready to Play!

เกมพร้อมเล่นแล้ว! เริ่มจาก:
1. ดูตัวละคร → `/characters`
2. จัดทีม → `/party`
3. รอ World Map & Quest System ต่อไป! 🗺️📜
