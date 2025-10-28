"use client";

import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { animated, useTrail, useSpring, config } from "@react-spring/web";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGameStore } from "@/src/stores/gameStore";
import type { LootBoxOpenResult } from "@/src/application/services/lootbox/LootBoxService";
import { ITEMS_MASTER_MAP } from "@/src/data/master/items.master";
import { LootBoxOptionCard } from "../molecules/LootBoxOptionCard";
import { Button } from "@/src/presentation/components/ui/Button";
import { LootBoxOpeningOverlay } from "./lootbox-opener/LootBoxOpeningOverlay";

const rarityLabels: Record<string, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
  mythic: "Mythic",
};

const rarityBadgeClass: Record<string, string> = {
  common: "lootbox-rarity-common",
  uncommon: "lootbox-rarity-uncommon",
  rare: "lootbox-rarity-rare",
  epic: "lootbox-rarity-epic",
  legendary: "lootbox-rarity-legendary",
  mythic: "lootbox-rarity-mythic",
};

const itemTypeLabels: Record<string, string> = {
  weapon: "อาวุธ",
  armor: "เกราะ",
  accessory: "เครื่องประดับ",
  consumable: "ไอเทมใช้แล้ว",
  material: "วัสดุ",
  key: "ไอเทมกุญแจ",
  quest: "ไอเทมเควส",
};

const rarityAccent: Record<
  string,
  { gradient: string; border: string; glow: string; pill: string }
> = {
  common: {
    gradient: "from-slate-800/70 via-slate-900/80 to-slate-950/90",
    border: "border-slate-600/40",
    glow: "rgba(148,163,184,0.35)",
    pill: "bg-slate-700/60",
  },
  uncommon: {
    gradient: "from-emerald-900/60 via-emerald-800/70 to-slate-950/90",
    border: "border-emerald-500/40",
    glow: "rgba(16,185,129,0.35)",
    pill: "bg-emerald-600/50",
  },
  rare: {
    gradient: "from-sky-900/60 via-indigo-900/70 to-slate-950/90",
    border: "border-sky-500/40",
    glow: "rgba(59,130,246,0.4)",
    pill: "bg-sky-600/50",
  },
  epic: {
    gradient: "from-violet-900/60 via-purple-900/70 to-slate-950/90",
    border: "border-purple-500/40",
    glow: "rgba(168,85,247,0.45)",
    pill: "bg-purple-600/50",
  },
  legendary: {
    gradient: "from-amber-900/60 via-orange-900/70 to-slate-950/90",
    border: "border-amber-500/40",
    glow: "rgba(245,158,11,0.45)",
    pill: "bg-amber-600/50",
  },
  mythic: {
    gradient: "from-rose-900/60 via-red-900/70 to-slate-950/90",
    border: "border-rose-500/40",
    glow: "rgba(239,68,68,0.45)",
    pill: "bg-rose-600/50",
  },
};

export function LootBoxPanel() {
  const { gold, lootboxState, listLootBoxes, openLootBox } = useGameStore(
    useShallow((state) => ({
      gold: state.gold,
      lootboxState: state.lootbox,
      listLootBoxes: state.listLootBoxes,
      openLootBox: state.openLootBox,
    }))
  );

  const lootBoxes = useMemo(() => listLootBoxes(), [listLootBoxes]);
  const [selectedLootBoxId, setSelectedLootBoxId] = useState<string | null>(
    null
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCostType, setSelectedCostType] = useState<
    string | undefined
  >();
  const [isOpening, setIsOpening] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showOpeningOverlay, setShowOpeningOverlay] = useState(false);
  const [openingResult, setOpeningResult] = useState<LootBoxOpenResult | null>(
    null
  );
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [rewardSlideIndex, setRewardSlideIndex] = useState(0);
  const history = lootboxState.history.slice().reverse();

  const slideProps = useSpring({
    transform: `translateX(-${currentIndex * 100}%)`,
    config: config.gentle,
  });

  useEffect(() => {
    if (!selectedLootBoxId && lootBoxes.length > 0) {
      setSelectedLootBoxId(lootBoxes[0].id);
    }
  }, [lootBoxes, selectedLootBoxId]);

  useEffect(() => {
    if (lootBoxes.length === 0) {
      setCurrentIndex(0);
      return;
    }
    if (!selectedLootBoxId) {
      return;
    }
    const index = lootBoxes.findIndex((box) => box.id === selectedLootBoxId);
    if (index >= 0) {
      setCurrentIndex(index);
    }
  }, [lootBoxes, selectedLootBoxId]);

  const selectedLootBox = useMemo(() => {
    return lootBoxes.find((box) => box.id === selectedLootBoxId) ?? null;
  }, [lootBoxes, selectedLootBoxId]);

  const activeStep = useMemo(() => {
    if (!selectedLootBox || selectedLootBox.type !== "stepup") {
      return undefined;
    }
    return (
      lootboxState.stepState[selectedLootBox.id] ??
      selectedLootBox.stepConfigs?.[0]?.step
    );
  }, [lootboxState.stepState, selectedLootBox]);

  const availableCostOptions = useMemo(() => {
    if (!selectedLootBox) {
      return [];
    }
    if (selectedLootBox.type === "stepup" && activeStep) {
      const stepCost = selectedLootBox.stepConfigs?.find(
        (step) => step.step === activeStep
      )?.cost;
      return stepCost ? [stepCost] : [];
    }
    return selectedLootBox.costOptions;
  }, [selectedLootBox, activeStep]);

  useEffect(() => {
    if (availableCostOptions.length === 0) {
      setSelectedCostType(undefined);
      return;
    }
    if (
      !selectedCostType ||
      !availableCostOptions.some((cost) => cost.type === selectedCostType)
    ) {
      setSelectedCostType(availableCostOptions[0]?.type);
    }
  }, [availableCostOptions, selectedCostType]);

  const currentCostOption = useMemo(() => {
    if (!availableCostOptions.length) {
      return undefined;
    }
    return (
      availableCostOptions.find((cost) => cost.type === selectedCostType) ??
      availableCostOptions[0]
    );
  }, [availableCostOptions, selectedCostType]);

  const ticketCount = useMemo(() => {
    if (!currentCostOption || currentCostOption.type !== "ticket") {
      return 0;
    }
    const ticketId = currentCostOption.ticketId ?? "";
    return lootboxState.tickets[ticketId] ?? 0;
  }, [currentCostOption, lootboxState.tickets]);

  const canAfford = useMemo(() => {
    if (!currentCostOption) {
      return false;
    }
    switch (currentCostOption.type) {
      case "gold":
        return gold >= currentCostOption.amount;
      case "ticket":
        return ticketCount >= currentCostOption.amount;
      default:
        return false;
    }
  }, [currentCostOption, gold, ticketCount]);

  const pityProgress = useMemo(() => {
    if (!selectedLootBox || !selectedLootBox.pityConfig) {
      return null;
    }
    const { counterId, guaranteeAt } = selectedLootBox.pityConfig;
    const current = lootboxState.pityCounters[counterId] ?? 0;
    return {
      current,
      guaranteeAt,
      remaining: Math.max(guaranteeAt - current, 0),
    };
  }, [lootboxState.pityCounters, selectedLootBox]);

  const openedCount = useMemo(() => {
    if (!selectedLootBox) {
      return 0;
    }
    return lootboxState.openedCount[selectedLootBox.id] ?? 0;
  }, [lootboxState.openedCount, selectedLootBox]);

  const rewardEntries = useMemo(() => {
    return selectedLootBox?.rewardTable ?? [];
  }, [selectedLootBox]);

  const rewardTableTotalWeight = useMemo(() => {
    if (!selectedLootBox) {
      return 0;
    }
    return selectedLootBox.rewardTable.reduce(
      (sum, entry) => sum + entry.weight,
      0
    );
  }, [selectedLootBox]);

  const [animateRewards, setAnimateRewards] = useState(true);

  useEffect(() => {
    setAnimateRewards(false);
    setRewardSlideIndex(0);
    const timeout = setTimeout(() => setAnimateRewards(true), 40);
    return () => clearTimeout(timeout);
  }, [selectedLootBox?.id]);

  const rewardTrail = useTrail(rewardEntries.length, {
    opacity: animateRewards ? 1 : 0,
    y: animateRewards ? 0 : 24,
    config: { tension: 240, friction: 26, mass: 1 },
  });

  const handleOpen = () => {
    if (!selectedLootBox || !currentCostOption || !canAfford || isOpening) {
      return;
    }
    setIsOpening(true);
    try {
      const response = openLootBox({
        lootBoxId: selectedLootBox.id,
        costType: currentCostOption.type,
        step: activeStep,
      });
      if (!response) {
        setFeedback({ type: "error", message: "ไม่สามารถเปิดกล่องได้" });
        return;
      }
      if ("error" in response) {
        setFeedback({ type: "error", message: response.message });
        return;
      }
      const rewardText = response.rewards
        .map((reward) => `${reward.item.name} x${reward.quantity}`)
        .join(", ");
      setOpeningResult(response);
      setShowOpeningOverlay(true);
      setFeedback({
        type: "success",
        message: rewardText ? `ได้รับ ${rewardText}` : "เปิดสำเร็จ",
      });
    } finally {
      setIsOpening(false);
    }
  };

  const selectLootBoxByIndex = (index: number) => {
    if (lootBoxes.length === 0) {
      return;
    }
    const normalizedIndex =
      ((index % lootBoxes.length) + lootBoxes.length) % lootBoxes.length;
    const target = lootBoxes[normalizedIndex];
    if (!target) {
      return;
    }
    setCurrentIndex(normalizedIndex);
    setSelectedLootBoxId(target.id);
    setFeedback(null);
  };

  const handlePrevious = () => {
    selectLootBoxByIndex(currentIndex - 1);
  };

  const handleNext = () => {
    selectLootBoxByIndex(currentIndex + 1);
  };

  const renderHistoryItem = (result: LootBoxOpenResult) => {
    return (
      <div
        key={result.rollId}
        className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-white/80"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-semibold text-white/90">
            {result.lootBox.name}
          </span>
          <span className="text-white/50">#{result.rollId.slice(0, 6)}</span>
        </div>
        <div className="mt-2 space-y-1">
          {result.rewards.map((reward, index) => {
            const rarityKey = reward.rarity ?? reward.item.rarity;
            return (
              <div
                key={`${result.rollId}-${reward.item.id}-${index}`}
                className="flex items-center justify-between gap-2 rounded-md bg-black/30 px-2 py-1"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                      rarityBadgeClass[rarityKey] ??
                      "bg-slate-700/40 text-white/70"
                    }`}
                  >
                    {rarityLabels[rarityKey] ?? rarityKey}
                  </span>
                  <span>{reward.item.name}</span>
                  {reward.guaranteeSource ? (
                    <span className="text-[10px] text-amber-300/80">
                      ({reward.guaranteeSource})
                    </span>
                  ) : null}
                </div>
                <span className="text-white/60">x{reward.quantity}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <LootBoxOpeningOverlay
        isOpen={showOpeningOverlay}
        result={openingResult}
        onClose={() => {
          setShowOpeningOverlay(false);
          setOpeningResult(null);
          setIsAnimating(false);
        }}
        onAnimationStart={() => setIsAnimating(true)}
        onAnimationFinish={() => setIsAnimating(false)}
      />

      <div className="flex h-full flex-col gap-4 text-white">
        <header className="flex flex-col gap-3 rounded-xl border border-white/15 bg-black/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white/80">สกุลเงิน</p>
              <p className="text-xl font-bold text-yellow-300">
                {gold.toLocaleString()}{" "}
                <span className="text-sm text-yellow-200">Gold</span>
              </p>
            </div>
            {currentCostOption?.type === "ticket" &&
            currentCostOption.ticketId ? (
              <div className="text-right">
                <p className="text-sm font-semibold text-white/80">
                  Ticket: {currentCostOption.ticketId}
                </p>
                <p className="text-xl font-bold text-sky-300">
                  {ticketCount}
                  <span className="ml-1 text-sm text-sky-200">ใบ</span>
                </p>
              </div>
            ) : null}
          </div>
          {pityProgress ? (
            <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-3 text-sm">
              <p className="font-semibold text-purple-200">Pity Progress</p>
              <p className="text-purple-100">
                เปิดไป {pityProgress.current}/{pityProgress.guaranteeAt} ครั้ง
                {pityProgress.remaining > 0
                  ? ` • เหลือ ${pityProgress.remaining} ครั้งการันตี`
                  : " • การันตีครั้งถัดไป!"}
              </p>
            </div>
          ) : null}
        </header>

        <section className="flex flex-col gap-4">
          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-white/70">
                เลือกกล่อง
              </h3>
              {selectedLootBox && selectedLootBox.type === "stepup" && activeStep ? (
                <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-medium text-purple-200">
                  ขั้นปัจจุบัน: {activeStep}
                </span>
              ) : null}
            </div>

            {lootBoxes.length === 0 ? (
              <div className="mt-4 flex h-32 items-center justify-center text-white/50">
                ไม่มีข้อมูลกล่องสุ่ม
              </div>
            ) : (
              <>
                <div className="mt-4 overflow-hidden">
                  <animated.div style={slideProps} className="flex">
                    {lootBoxes.map((lootBox, index) => {
                      const stepLabel =
                        lootBox.type === "stepup"
                          ? `ขั้น ${
                              lootboxState.stepState[lootBox.id] ??
                              lootBox.stepConfigs?.[0]?.step ??
                              1
                            }`
                          : undefined;
                      const isActive = index === currentIndex;
                      const displayLootBox =
                        isActive && selectedLootBox && selectedLootBox.id === lootBox.id
                          ? selectedLootBox
                          : null;
                      return (
                        <div key={lootBox.id} className="min-w-full px-1 pb-2">
                          <LootBoxOptionCard
                            lootBox={lootBox}
                            isSelected={isActive}
                            onSelect={() => selectLootBoxByIndex(index)}
                            stepLabel={stepLabel}
                          >
                            {displayLootBox ? (
                              <div className="flex h-[420px] flex-col">
                                {/* Header Section - Fixed Height */}
                                <div className="flex-shrink-0 space-y-2 border-b border-white/10 pb-3">
                                  <div className="flex items-start justify-between gap-3 text-white">
                                    <div>
                                      <h2 className="text-lg font-bold text-white">
                                        {displayLootBox.name}
                                      </h2>
                                      <p className="text-xs text-white/60">
                                        เปิดไปแล้ว {openedCount} ครั้ง
                                        {activeStep ? ` • ขั้น ${activeStep}` : ""}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {availableCostOptions.map((cost) => (
                                      <Button
                                        key={cost.type}
                                        variant={
                                          cost.type === selectedCostType ? "primary" : "ghost"
                                        }
                                        size="sm"
                                        onClick={() => setSelectedCostType(cost.type)}
                                        disabled={availableCostOptions.length === 1}
                                      >
                                        {cost.type === "gold" &&
                                          `${cost.amount.toLocaleString()} Gold`}
                                        {cost.type === "ticket" && `Ticket x${cost.amount}`}
                                        {cost.type !== "gold" &&
                                          cost.type !== "ticket" &&
                                          cost.type}
                                      </Button>
                                    ))}
                                  </div>
                                </div>

                                {/* Rewards Carousel Section - Fixed Height */}
                                <div className="flex-1 overflow-hidden py-3">
                                  <div className="flex h-full flex-col">
                                    <div className="mb-3 flex items-center justify-between">
                                      <h4 className="text-xs font-semibold uppercase tracking-wide text-white/50">
                                        ตารางรางวัลหลัก ({rewardSlideIndex + 1}/{rewardEntries.length})
                                      </h4>
                                      <div className="flex gap-2">
                                        <button
                                          type="button"
                                          onClick={() => setRewardSlideIndex(Math.max(0, rewardSlideIndex - 1))}
                                          disabled={rewardSlideIndex === 0}
                                          className="rounded-lg bg-white/10 p-1.5 text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30"
                                        >
                                          <ChevronLeft className="h-4 w-4" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setRewardSlideIndex(Math.min(rewardEntries.length - 1, rewardSlideIndex + 1))}
                                          disabled={rewardSlideIndex === rewardEntries.length - 1}
                                          className="rounded-lg bg-white/10 p-1.5 text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30"
                                        >
                                          <ChevronRight className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </div>
                                    
                                    <div className="relative flex-1 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                                      {rewardEntries.length > 0 ? (
                                        (() => {
                                          const entry = rewardEntries[rewardSlideIndex];
                                          const spring = rewardTrail[rewardSlideIndex];
                                          const item = ITEMS_MASTER_MAP[entry.itemId];
                                          const itemName = item?.name ?? entry.itemId;
                                          const itemTypeLabel = item
                                            ? itemTypeLabels[item.type] ?? item.type
                                            : null;
                                          const rarityKey = entry.rarity ?? item?.rarity ?? "common";
                                          const rarityLabel = rarityLabels[rarityKey] ?? rarityKey;
                                          const accent = rarityAccent[rarityKey] ?? rarityAccent.common;
                                          const weightPercent =
                                            rewardTableTotalWeight > 0
                                              ? ((entry.weight / rewardTableTotalWeight) * 100).toFixed(1)
                                              : "0.0";
                                          const quantityText = entry.quantity
                                            ? entry.quantity.min === entry.quantity.max
                                              ? `x${entry.quantity.min}`
                                              : `x${entry.quantity.min}-${entry.quantity.max}`
                                            : null;
                                          return (
                                            <animated.div
                                              key={`${entry.itemId}-${entry.weight}`}
                                              style={{
                                                opacity: spring.opacity,
                                                transform: spring.y.to((y) => `translateY(${y}px)`),
                                                boxShadow: `0 0 28px ${accent.glow}`,
                                              }}
                                              className={`group relative h-full overflow-hidden rounded-lg border ${accent.border} bg-gradient-to-br ${accent.gradient} p-4 transition-transform duration-200`}
                                            >
                                              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-60" style={{ background: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.25), transparent 55%)" }} />
                                              <div className="relative flex h-full flex-col gap-3">
                                                <div className="flex items-start justify-between gap-3">
                                                  <div className="flex-1">
                                                    <p className="text-xl font-bold text-white drop-shadow-sm">
                                                      {itemName}
                                                    </p>
                                                    <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px]">
                                                      {itemTypeLabel ? (
                                                        <span className={`rounded-full px-2 py-0.5 text-white/90 ${accent.pill}`}>
                                                          {itemTypeLabel}
                                                        </span>
                                                      ) : null}
                                                      <span className={`rounded-full px-2 py-0.5 text-white ${accent.pill}`}>
                                                        {rarityLabel}
                                                      </span>
                                                      <span className={`rounded-full px-2 py-0.5 text-white/70 ${accent.pill}`}>
                                                        อัตรา {weightPercent}%
                                                      </span>
                                                      {quantityText ? (
                                                        <span className={`rounded-full px-2 py-0.5 text-white/70 ${accent.pill}`}>
                                                          จำนวน {quantityText}
                                                        </span>
                                                      ) : null}
                                                    </div>
                                                  </div>
                                                  {entry.featured ? (
                                                    <div className="shrink-0 rounded-full bg-amber-500/90 px-3 py-1 text-[10px] font-semibold text-black shadow-lg">
                                                      ★ Featured
                                                    </div>
                                                  ) : null}
                                                </div>

                                                <div className="flex-1 overflow-y-auto">
                                                  <p className="text-xs leading-relaxed text-white/90">
                                                    {item?.description ?? "ไม่พบข้อมูลใน master data"}
                                                  </p>
                                                </div>

                                                <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[10px] text-white/60">
                                                  <span>ID: {entry.itemId}</span>
                                                  {item?.sellPrice !== undefined ? (
                                                    <span className="text-yellow-300/80">
                                                      ขายได้ {item.sellPrice.toLocaleString()} Gold
                                                    </span>
                                                  ) : null}
                                                </div>
                                              </div>
                                            </animated.div>
                                          );
                                        })()
                                      ) : (
                                        <div className="flex h-full items-center justify-center text-white/50">
                                          ไม่มีรางวัล
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Action Section - Fixed Height */}
                                <div className="flex-shrink-0 space-y-2 border-t border-white/10 pt-3">
                                  {feedback ? (
                                    <div
                                      className={
                                        feedback.type === "success"
                                          ? "rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-200"
                                          : "rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-200"
                                      }
                                    >
                                      {feedback.message}
                                    </div>
                                  ) : null}

                                  <Button
                                    variant="action"
                                    size="lg"
                                    className="w-full"
                                    disabled={
                                      !canAfford || isOpening || isAnimating || showOpeningOverlay
                                    }
                                    onClick={handleOpen}
                                  >
                                    {canAfford ? "เปิดกล่อง" : "สกุลเงินไม่พอ"}
                                  </Button>
                                </div>
                              </div>
                            ) : null}
                          </LootBoxOptionCard>
                        </div>
                      );
                    })}
                  </animated.div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="p-2 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={lootBoxes.length <= 1}
                  >
                    <span className="sr-only">ก่อนหน้า</span>
                    <ChevronLeft className="h-6 w-6" />
                  </button>

                  <div className="flex gap-2">
                    {lootBoxes.map((lootBox, index) => (
                      <button
                        key={lootBox.id}
                        type="button"
                        onClick={() => selectLootBoxByIndex(index)}
                        className={`h-2 rounded-full transition-all ${
                          index === currentIndex
                            ? "w-8 bg-purple-500"
                            : "w-2 bg-white/30 hover:w-4 hover:bg-white/50"
                        }`}
                        aria-label={lootBox.name}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="p-2 text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={lootBoxes.length <= 1}
                  >
                    <span className="sr-only">ถัดไป</span>
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="flex-1 overflow-hidden rounded-xl border border-white/10 bg-black/40 p-4">
          <h3 className="text-sm font-semibold text-white/70">
            ประวัติการเปิดล่าสุด
          </h3>
          {history.length === 0 ? (
            <p className="mt-3 text-sm text-white/50">
              ยังไม่มีประวัติการเปิดกล่อง
            </p>
          ) : (
            <div className="mt-3 flex h-[260px] flex-col gap-3 overflow-y-auto pr-2">
              {history.map(renderHistoryItem)}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
