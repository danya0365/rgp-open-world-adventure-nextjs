"use client";

import { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useGameStore } from "@/src/stores/gameStore";
import type { LootBoxDefinition } from "@/src/domain/types/lootbox.types";
import type { LootBoxOpenResult } from "@/src/application/services/lootbox/LootBoxService";
import { LootBoxOptionCard } from "../molecules/LootBoxOptionCard";
import { Button } from "@/src/presentation/components/ui/Button";
import { LootBoxOpeningOverlay } from "./LootBoxOpeningOverlay";

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

export function LootBoxPanel() {
  const {
    gold,
    lootboxState,
    listLootBoxes,
    openLootBox,
  } = useGameStore(
    useShallow((state) => ({
      gold: state.gold,
      lootboxState: state.lootbox,
      listLootBoxes: state.listLootBoxes,
      openLootBox: state.openLootBox,
    }))
  );

  const lootBoxes = useMemo(() => listLootBoxes(), [listLootBoxes]);
  const [selectedLootBoxId, setSelectedLootBoxId] = useState<string | null>(null);
  const [selectedCostType, setSelectedCostType] = useState<string | undefined>();
  const [isOpening, setIsOpening] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showOpeningOverlay, setShowOpeningOverlay] = useState(false);
  const [openingResult, setOpeningResult] = useState<LootBoxOpenResult | null>(null);
  const [feedback, setFeedback] = useState<
    | {
        type: "success" | "error";
        message: string;
      }
    | null
  >(null);
  const history = lootboxState.history.slice().reverse();

  useEffect(() => {
    if (!selectedLootBoxId && lootBoxes.length > 0) {
      setSelectedLootBoxId(lootBoxes[0].id);
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
      lootboxState.stepState[selectedLootBox.id] ?? selectedLootBox.stepConfigs?.[0]?.step
    );
  }, [lootboxState.stepState, selectedLootBox]);

  const availableCostOptions = useMemo(() => {
    if (!selectedLootBox) {
      return [];
    }
    if (selectedLootBox.type === "stepup" && activeStep) {
      const stepCost = selectedLootBox.stepConfigs?.find((step) => step.step === activeStep)?.cost;
      return stepCost ? [stepCost] : [];
    }
    return selectedLootBox.costOptions;
  }, [selectedLootBox, activeStep]);

  useEffect(() => {
    if (availableCostOptions.length === 0) {
      setSelectedCostType(undefined);
      return;
    }
    if (!selectedCostType || !availableCostOptions.some((cost) => cost.type === selectedCostType)) {
      setSelectedCostType(availableCostOptions[0]?.type);
    }
  }, [availableCostOptions, selectedCostType]);

  const currentCostOption = useMemo(() => {
    if (!availableCostOptions.length) {
      return undefined;
    }
    return availableCostOptions.find((cost) => cost.type === selectedCostType) ?? availableCostOptions[0];
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

  const handleSelectLootBox = (lootBox: LootBoxDefinition) => {
    setSelectedLootBoxId(lootBox.id);
    setFeedback(null);
  };

  const renderHistoryItem = (result: LootBoxOpenResult) => {
    return (
      <div
        key={result.rollId}
        className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-white/80"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-semibold text-white/90">{result.lootBox.name}</span>
          <span className="text-white/50">#{result.rollId.slice(0, 6)}</span>
        </div>
        <div className="mt-2 space-y-1">
          {result.rewards.map((reward) => {
            const rarityKey = reward.rarity ?? reward.item.rarity;
            return (
              <div
                key={`${result.rollId}-${reward.item.id}`}
                className="flex items-center justify-between gap-2 rounded-md bg-black/30 px-2 py-1"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                      rarityBadgeClass[rarityKey] ?? "bg-slate-700/40 text-white/70"
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
              {gold.toLocaleString()} <span className="text-sm text-yellow-200">Gold</span>
            </p>
          </div>
          {currentCostOption?.type === "ticket" && currentCostOption.ticketId ? (
            <div className="text-right">
              <p className="text-sm font-semibold text-white/80">Ticket: {currentCostOption.ticketId}</p>
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

      <section className="grid gap-3 md:grid-cols-[260px_minmax(0,1fr)]">
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-white/70">เลือกกล่อง</h3>
          <div className="grid gap-2">
            {lootBoxes.map((lootBox) => {
              const stepLabel =
                lootBox.type === "stepup"
                  ? `ขั้น ${
                      lootboxState.stepState[lootBox.id] ?? lootBox.stepConfigs?.[0]?.step ?? 1
                    }`
                  : undefined;
              return (
                <LootBoxOptionCard
                  key={lootBox.id}
                  lootBox={lootBox}
                  isSelected={lootBox.id === selectedLootBoxId}
                  onSelect={() => handleSelectLootBox(lootBox)}
                  stepLabel={stepLabel}
                />
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-black/30 p-4">
          {selectedLootBox ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedLootBox.name}</h2>
                  <p className="text-sm text-white/60">เปิดไปแล้ว {openedCount} ครั้ง</p>
                  {activeStep ? (
                    <p className="text-xs text-purple-200">ขั้นปัจจุบัน: {activeStep}</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableCostOptions.map((cost) => (
                    <Button
                      key={cost.type}
                      variant={cost.type === selectedCostType ? "primary" : "ghost"}
                      size="sm"
                      onClick={() => setSelectedCostType(cost.type)}
                      disabled={availableCostOptions.length === 1}
                    >
                      {cost.type === "gold" && `${cost.amount.toLocaleString()} Gold`}
                      {cost.type === "ticket" && `Ticket x${cost.amount}`}
                      {cost.type !== "gold" && cost.type !== "ticket" && cost.type}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white/80">
                <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/50">
                  ตารางรางวัลหลัก
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedLootBox.rewardTable.map((entry) => {
                    return (
                      <div
                        key={`${entry.itemId}-${entry.weight}`}
                        className="rounded-lg border border-white/10 bg-black/40 px-3 py-2"
                      >
                        <p className="text-sm font-semibold text-white/80">{entry.itemId}</p>
                        <p className="text-[11px] text-white/50">
                          อัตรา: {((entry.weight / selectedLootBox.rewardTable.reduce((sum, e) => sum + e.weight, 0)) * 100).toFixed(1)}%
                        </p>
                        {entry.rarity ? (
                          <p className="text-[11px] text-white/40">ระดับ: {rarityLabels[entry.rarity]}</p>
                        ) : null}
                        {entry.featured ? (
                          <p className="text-[11px] text-amber-300/80">Featured</p>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>

              {feedback ? (
                <div
                  className={
                    feedback.type === "success"
                      ? "mt-3 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200"
                      : "mt-3 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
                  }
                >
                  {feedback.message}
                </div>
              ) : null}

              <Button
                variant="action"
                size="lg"
                className="self-start"
                disabled={!canAfford || isOpening || isAnimating || showOpeningOverlay}
                onClick={handleOpen}
              >
                {canAfford ? "เปิดกล่อง" : "สกุลเงินไม่พอ"}
              </Button>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-white/50">
              ไม่มีข้อมูลกล่องสุ่ม
            </div>
          )}
        </div>
      </section>

      <section className="flex-1 overflow-hidden rounded-xl border border-white/10 bg-black/40 p-4">
        <h3 className="text-sm font-semibold text-white/70">ประวัติการเปิดล่าสุด</h3>
        {history.length === 0 ? (
          <p className="mt-3 text-sm text-white/50">ยังไม่มีประวัติการเปิดกล่อง</p>
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
