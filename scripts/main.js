/**
 * Sufia's Loot Tracker — PF2e Party Treasure by Level (GM Core Table 10-9 & Fundamental Runes)
 * SPDX-License-Identifier: MIT
 * Pathfinder 2e Remaster Table 10-9 & Fundamental Runes mechanics licensed under the ORC License (see LICENSE).
 *
 * Data Storage:
 * Strictly stored on the PF2e `party` Actor using Foundry Flags:
 *   actor.getFlag("sufias-loot-tracker", "treasure-data")
 *   actor.setFlag("sufias-loot-tracker", "treasure-data", { 1: {...}, ..., 20: {...} })
 */

const MODULE_ID = "sufias-loot-tracker";
const FLAG_KEY = "treasure-data";

/**
 * Standard PF2e Gold Pieces compendium UUID for dragging GP stacks into Loot containers
 */
const GOLD_PIECES_UUID = "Compendium.pf2e.equipment-srd.Item.B6B7tBWJSqOBz5zz";

/**
 * GM Core Table 10-9: Party Treasure by Level (Levels 1–20)
 */
export const PARTY_TREASURE_MATRIX = {
  1:  { totalGp: 175,    permanent: [{ level: 2, count: 2 }, { level: 1, count: 2 }], consumables: [{ level: 2, count: 2 }, { level: 1, count: 3 }], currencyGp: 40,     extraPcGp: 10,    note: "Many 1st-level permanent items should be items from Chapter 6 of Player Core instead of magic items." },
  2:  { totalGp: 300,    permanent: [{ level: 3, count: 2 }, { level: 2, count: 2 }], consumables: [{ level: 3, count: 2 }, { level: 2, count: 2 }, { level: 1, count: 2 }], currencyGp: 70,     extraPcGp: 18 },
  3:  { totalGp: 500,    permanent: [{ level: 4, count: 2 }, { level: 3, count: 2 }], consumables: [{ level: 4, count: 2 }, { level: 3, count: 2 }, { level: 2, count: 2 }], currencyGp: 120,    extraPcGp: 30 },
  4:  { totalGp: 850,    permanent: [{ level: 5, count: 2 }, { level: 4, count: 2 }], consumables: [{ level: 5, count: 2 }, { level: 4, count: 2 }, { level: 3, count: 2 }], currencyGp: 200,    extraPcGp: 50 },
  5:  { totalGp: 1350,   permanent: [{ level: 6, count: 2 }, { level: 5, count: 2 }], consumables: [{ level: 6, count: 2 }, { level: 5, count: 2 }, { level: 4, count: 2 }], currencyGp: 320,    extraPcGp: 80 },
  6:  { totalGp: 2000,   permanent: [{ level: 7, count: 2 }, { level: 6, count: 2 }], consumables: [{ level: 7, count: 2 }, { level: 6, count: 2 }, { level: 5, count: 2 }], currencyGp: 500,    extraPcGp: 125 },
  7:  { totalGp: 2900,   permanent: [{ level: 8, count: 2 }, { level: 7, count: 2 }], consumables: [{ level: 8, count: 2 }, { level: 7, count: 2 }, { level: 6, count: 2 }], currencyGp: 720,    extraPcGp: 180 },
  8:  { totalGp: 4000,   permanent: [{ level: 9, count: 2 }, { level: 8, count: 2 }], consumables: [{ level: 9, count: 2 }, { level: 8, count: 2 }, { level: 7, count: 2 }], currencyGp: 1000,   extraPcGp: 250 },
  9:  { totalGp: 5700,   permanent: [{ level: 10, count: 2 }, { level: 9, count: 2 }], consumables: [{ level: 10, count: 2 }, { level: 9, count: 2 }, { level: 8, count: 2 }], currencyGp: 1400,   extraPcGp: 350 },
  10: { totalGp: 8000,   permanent: [{ level: 11, count: 2 }, { level: 10, count: 2 }], consumables: [{ level: 11, count: 2 }, { level: 10, count: 2 }, { level: 9, count: 2 }], currencyGp: 2000,   extraPcGp: 500 },
  11: { totalGp: 11500,  permanent: [{ level: 12, count: 2 }, { level: 11, count: 2 }], consumables: [{ level: 12, count: 2 }, { level: 11, count: 2 }, { level: 10, count: 2 }], currencyGp: 2800,   extraPcGp: 700 },
  12: { totalGp: 16500,  permanent: [{ level: 13, count: 2 }, { level: 12, count: 2 }], consumables: [{ level: 13, count: 2 }, { level: 12, count: 2 }, { level: 11, count: 2 }], currencyGp: 4000,   extraPcGp: 1000 },
  13: { totalGp: 25000,  permanent: [{ level: 14, count: 2 }, { level: 13, count: 2 }], consumables: [{ level: 14, count: 2 }, { level: 13, count: 2 }, { level: 12, count: 2 }], currencyGp: 6000,   extraPcGp: 1500 },
  14: { totalGp: 36500,  permanent: [{ level: 15, count: 2 }, { level: 14, count: 2 }], consumables: [{ level: 15, count: 2 }, { level: 14, count: 2 }, { level: 13, count: 2 }], currencyGp: 9000,   extraPcGp: 2250 },
  15: { totalGp: 54500,  permanent: [{ level: 16, count: 2 }, { level: 15, count: 2 }], consumables: [{ level: 16, count: 2 }, { level: 15, count: 2 }, { level: 14, count: 2 }], currencyGp: 13000,  extraPcGp: 3250 },
  16: { totalGp: 82500,  permanent: [{ level: 17, count: 2 }, { level: 16, count: 2 }], consumables: [{ level: 17, count: 2 }, { level: 16, count: 2 }, { level: 15, count: 2 }], currencyGp: 20000,  extraPcGp: 5000 },
  17: { totalGp: 128000, permanent: [{ level: 18, count: 2 }, { level: 17, count: 2 }], consumables: [{ level: 18, count: 2 }, { level: 17, count: 2 }, { level: 16, count: 2 }], currencyGp: 30000,  extraPcGp: 7500 },
  18: { totalGp: 208000, permanent: [{ level: 19, count: 2 }, { level: 18, count: 2 }], consumables: [{ level: 19, count: 2 }, { level: 18, count: 2 }, { level: 17, count: 2 }], currencyGp: 48000,  extraPcGp: 12000 },
  19: { totalGp: 355000, permanent: [{ level: 20, count: 2 }, { level: 19, count: 2 }], consumables: [{ level: 20, count: 2 }, { level: 19, count: 2 }, { level: 18, count: 2 }], currencyGp: 80000,  extraPcGp: 20000 },
  20: { totalGp: 490000, permanent: [{ level: 20, count: 4 }],                       consumables: [{ level: 20, count: 4 }, { level: 19, count: 2 }], currencyGp: 140000, extraPcGp: 35000 }
};

/**
 * Fundamental Weapon & Armor Runes by Level (GM Core pg. 226, 236 & War of Immortals pg. 148–149)
 * 4 copies of each rune must be distributed (one per player across 4 players).
 */
export const FUNDAMENTAL_RUNES_BY_LEVEL = {
  2: [
    { name: "Weapon Potency (+1)", level: 2, price: "35 gp", rarity: "Common", usage: "Etched onto a weapon", source: "GM Core pg. 236" }
  ],
  4: [
    { name: "Striking", level: 4, price: "65 gp", rarity: "Common", usage: "Etched onto a weapon", source: "GM Core pg. 236" }
  ],
  5: [
    { name: "Armor Potency (+1)", level: 5, price: "160 gp", rarity: "Common", usage: "Etched onto armor", source: "GM Core pg. 226" }
  ],
  8: [
    { name: "Resilient", level: 8, price: "340 gp", rarity: "Common", usage: "Etched onto armor", source: "GM Core pg. 226" }
  ],
  10: [
    { name: "Weapon Potency (+2)", level: 10, price: "935 gp", rarity: "Common", usage: "Etched onto a weapon", source: "GM Core pg. 236" }
  ],
  11: [
    { name: "Armor Potency (+2)", level: 11, price: "1,060 gp", rarity: "Common", usage: "Etched onto armor", source: "GM Core pg. 226" }
  ],
  12: [
    { name: "Striking (Greater)", level: 12, price: "1,065 gp", rarity: "Common", usage: "Etched onto a weapon", source: "GM Core pg. 236" }
  ],
  14: [
    { name: "Resilient (Greater)", level: 14, price: "3,440 gp", rarity: "Common", usage: "Etched onto armor", source: "GM Core pg. 226" }
  ],
  16: [
    { name: "Weapon Potency (+3)", level: 16, price: "8,935 gp", rarity: "Common", usage: "Etched onto a weapon", source: "GM Core pg. 236" }
  ],
  18: [
    { name: "Armor Potency (+3)", level: 18, price: "20,560 gp", rarity: "Common", usage: "Etched onto armor", source: "GM Core pg. 226" }
  ],
  19: [
    { name: "Striking (Major)", level: 19, price: "31,065 gp", rarity: "Common", usage: "Etched onto a weapon", source: "GM Core pg. 236" }
  ],
  20: [
    { name: "Resilient (Major)", level: 20, price: "49,440 gp", rarity: "Common", usage: "Etched onto armor", source: "GM Core pg. 226" },
    { name: "Mythic Striking", level: 20, price: "70,000 gp", rarity: "Rare", usage: "Etched onto a weapon", source: "War of Immortals pg. 149" },
    { name: "Mythic Weapon Potency", level: 20, price: "70,000 gp", rarity: "Rare", usage: "Etched onto a weapon", source: "War of Immortals pg. 149" },
    { name: "Mythic Armor Potency", level: 20, price: "70,000 gp", rarity: "Rare", usage: "Etched onto armor", source: "War of Immortals pg. 148" },
    { name: "Mythic Resilient", level: 20, price: "70,000 gp", rarity: "Rare", usage: "Etched onto armor", source: "War of Immortals pg. 149" }
  ]
};

/**
 * Builds the 4-player fundamental rune slots for a given level
 */
function createDefaultFundamentalRuneSlots(level) {
  const templates = FUNDAMENTAL_RUNES_BY_LEVEL[level] || [];
  const slots = [];
  for (const rune of templates) {
    for (let playerNum = 1; playerNum <= 4; playerNum++) {
      slots.push({
        uuid: "",
        name: rune.name,
        playerLabel: `Player ${playerNum}`,
        level: rune.level,
        price: rune.price,
        rarity: rune.rarity,
        usage: rune.usage,
        type: "permanent",
        distributed: false
      });
    }
  }
  return slots;
}

/**
 * Builds the default slot structure for a single level from PARTY_TREASURE_MATRIX & FUNDAMENTAL_RUNES_BY_LEVEL
 */
function createDefaultLevelSlots(level) {
  const spec = PARTY_TREASURE_MATRIX[level];
  const permanentItems = [];
  for (const group of spec.permanent) {
    for (let i = 0; i < group.count; i++) {
      permanentItems.push({
        uuid: "",
        name: `[Unrolled Slot] Level ${group.level} Permanent Item`,
        level: group.level,
        price: "",
        type: "permanent",
        distributed: false
      });
    }
  }

  const consumables = [];
  for (const group of spec.consumables) {
    for (let i = 0; i < group.count; i++) {
      consumables.push({
        uuid: "",
        name: `[Unrolled Slot] Level ${group.level} Consumable`,
        level: group.level,
        price: "",
        type: "consumable",
        distributed: false
      });
    }
  }

  const currency = [
    {
      uuid: GOLD_PIECES_UUID,
      name: `[Unrolled Split] ${spec.currencyGp.toLocaleString()} gp Budget (Click Generate Currency & Valuables)`,
      level: 0,
      price: `${spec.currencyGp.toLocaleString()} gp`,
      type: "treasure",
      distributed: false
    }
  ];

  const fundamentalRunes = createDefaultFundamentalRuneSlots(level);

  return {
    permanentItems,
    consumables,
    currency,
    fundamentalRunes,
    bonusLoot: []
  };
}

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

let activeTrackerInstance = null;

export class PartyTreasureTrackerApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(partyActor, options = {}) {
    super(options);
    this.actor = partyActor;
    this.activeLevel = Number(partyActor?.system?.details?.level?.value) || 1;
    if (this.activeLevel < 1 || this.activeLevel > 20) this.activeLevel = 1;
  }

  static DEFAULT_OPTIONS = {
    id: "sufias-loot-tracker-app",
    tag: "div",
    window: {
      title: "Sufia's Loot Tracker — Party Treasure by Level",
      icon: "fa-solid fa-coins",
      resizable: true
    },
    position: {
      width: 960,
      height: 780
    },
    actions: {
      selectLevel: PartyTreasureTrackerApp.#onSelectLevel,
      generatePermanent: PartyTreasureTrackerApp.#onGeneratePermanent,
      generateConsumables: PartyTreasureTrackerApp.#onGenerateConsumables,
      generateCurrency: PartyTreasureTrackerApp.#onGenerateCurrency,
      distributeItem: PartyTreasureTrackerApp.#onDistributeItem,
      undoDistributeItem: PartyTreasureTrackerApp.#onUndoDistributeItem,
      addBonusLoot: PartyTreasureTrackerApp.#onAddBonusLoot,
      removeBonusLoot: PartyTreasureTrackerApp.#onRemoveBonusLoot,
      openItemSheet: PartyTreasureTrackerApp.#onOpenItemSheet
    }
  };

  static PARTS = {
    main: {
      template: `modules/${MODULE_ID}/templates/treasure-tracker.hbs`
    }
  };

  /**
   * Ensures actor flag structure contains keys 1..20 with permanentItems, consumables, currency, fundamentalRunes, bonusLoot
   * and resolves Compendium UUIDs for Fundamental Runes if not yet linked.
   */
  async ensureFlagStructure() {
    let flagData = this.actor.getFlag(MODULE_ID, FLAG_KEY);
    let needsSave = false;

    if (!flagData || typeof flagData !== "object") {
      flagData = {};
      needsSave = true;
    }

    const cloned = foundry.utils.deepClone(flagData);
    for (let lvl = 1; lvl <= 20; lvl++) {
      if (!cloned[lvl] || !Array.isArray(cloned[lvl].permanentItems)) {
        cloned[lvl] = createDefaultLevelSlots(lvl);
        needsSave = true;
      } else if (!Array.isArray(cloned[lvl].fundamentalRunes)) {
        cloned[lvl].fundamentalRunes = createDefaultFundamentalRuneSlots(lvl);
        needsSave = true;
      }
    }

    // Resolve Fundamental Rune compendium UUIDs on the active level so they are clickable & draggable
    const activeRunes = cloned[this.activeLevel]?.fundamentalRunes;
    if (Array.isArray(activeRunes) && activeRunes.some((r) => !r.uuid)) {
      const pack = game.packs?.get("pf2e.equipment-srd");
      if (pack) {
        const index = await pack.getIndex({ fields: ["name"] });
        for (const runeSlot of activeRunes) {
          if (!runeSlot.uuid) {
            const match = index.find(
              (e) => e.name.toLowerCase() === runeSlot.name.toLowerCase()
            );
            if (match) {
              runeSlot.uuid = match.uuid;
              needsSave = true;
            }
          }
        }
      }
    }

    if (needsSave && game.user?.isGM) {
      await this.actor.setFlag(MODULE_ID, FLAG_KEY, cloned);
    }
    return cloned;
  }

  async _prepareContext() {
    const flagData = await this.ensureFlagStructure();
    const currentLevelData = flagData[this.activeLevel] || createDefaultLevelSlots(this.activeLevel);
    const spec = PARTY_TREASURE_MATRIX[this.activeLevel];

    // Map party player character names to the 4 Fundamental Rune player labels if available
    const partyMembers = (this.actor?.members || []).filter(
      (m) => m.type === "character" && !m.traits?.has?.("eidolon") && !m.traits?.has?.("minion")
    );
    if (Array.isArray(currentLevelData.fundamentalRunes) && partyMembers.length > 0) {
      currentLevelData.fundamentalRunes = currentLevelData.fundamentalRunes.map((slot, idx) => {
        const pc = partyMembers[idx % 4];
        return {
          ...slot,
          playerLabel: pc ? pc.name : slot.playerLabel || `Player ${(idx % 4) + 1}`
        };
      });
    }

    const levels = Array.from({ length: 20 }, (_, i) => {
      const lvl = i + 1;
      const ld = flagData[lvl];
      const allMand = [
        ...(ld?.permanentItems || []),
        ...(ld?.consumables || []),
        ...(ld?.currency || []),
        ...(ld?.fundamentalRunes || [])
      ];
      const distCount = allMand.filter((e) => e.distributed).length;
      const hasRunes = Array.isArray(ld?.fundamentalRunes) && ld.fundamentalRunes.length > 0;
      return {
        level: lvl,
        active: lvl === this.activeLevel,
        progress: `${distCount}/${allMand.length}`,
        hasRunes
      };
    });

    return {
      actorName: this.actor.name,
      activeLevel: this.activeLevel,
      levels,
      hasFundamentalRunes:
        Array.isArray(currentLevelData.fundamentalRunes) &&
        currentLevelData.fundamentalRunes.length > 0,
      prescription: {
        ...spec,
        totalGpFormatted: spec.totalGp.toLocaleString(),
        currencyGpFormatted: spec.currencyGp.toLocaleString(),
        extraPcGpFormatted: spec.extraPcGp.toLocaleString(),
        permanentSummary: spec.permanent.map((p) => `${p.count}x Lv ${p.level}`).join(", "),
        consumableSummary: spec.consumables.map((c) => `${c.count}x Lv ${c.level}`).join(", ")
      },
      levelData: currentLevelData
    };
  }

  /**
   * Wire HTML5 Drag-and-Drop (both dragging items OUT into a PF2e Loot Actor sheet
   * and dragging items FROM Compendiums/Sidebar INTO any container in the tracker)
   */
  _onRender(context, options) {
    super._onRender(context, options);
    const root = this.element;
    if (!root) return;

    // 1. Outgoing dragstart: Allow dragging items into PF2e Loot Containers / Actor Sheets
    const draggableRows = root.querySelectorAll(".loot-row[draggable='true']");
    for (const row of draggableRows) {
      row.addEventListener("dragstart", (event) => {
        const uuid = row.dataset.uuid;
        if (!uuid) return;
        const dragPayload = {
          type: "Item",
          uuid
        };
        event.dataTransfer.setData("text/plain", JSON.stringify(dragPayload));
      });
    }

    // 2. Incoming dragover / drop: Allow dragging Foundry Items into any container in this window
    const containers = root.querySelectorAll(".loot-container[data-drop-category]");
    for (const container of containers) {
      container.addEventListener("dragover", (event) => {
        event.preventDefault();
        container.classList.add("drag-hover");
      });
      container.addEventListener("dragleave", () => {
        container.classList.remove("drag-hover");
      });
      container.addEventListener("drop", async (event) => {
        event.preventDefault();
        container.classList.remove("drag-hover");
        if (!game.user?.isGM) return;

        let data;
        try {
          data = JSON.parse(event.dataTransfer.getData("text/plain"));
        } catch {
          return;
        }
        if (data?.type !== "Item" || !data.uuid) return;

        const doc = await fromUuid(data.uuid);
        if (!doc) return;

        const category = container.dataset.dropCategory;
        const gpPrice = doc.system?.price?.value?.gp ?? 0;
        const itemLevel = doc.system?.level?.value ?? this.activeLevel;

        const flagData = await this.ensureFlagStructure();
        const targetList = flagData[this.activeLevel]?.[category];
        if (!Array.isArray(targetList)) return;

        // If dropped onto a specific unrolled slot row, replace that slot; otherwise append
        const targetRow = event.target.closest(".loot-row[data-index]");
        const newEntry = {
          uuid: doc.uuid,
          name: doc.name,
          level: itemLevel,
          price: gpPrice > 0 ? `${gpPrice.toLocaleString()} gp` : "",
          type:
            doc.type === "consumable"
              ? "consumable"
              : doc.type === "treasure"
              ? "treasure"
              : "permanent",
          distributed: false
        };

        if (targetRow && category !== "bonusLoot") {
          const rowIndex = Number(targetRow.dataset.index);
          if (targetList[rowIndex] && !targetList[rowIndex].distributed) {
            targetList[rowIndex] = {
              ...targetList[rowIndex],
              ...newEntry
            };
          } else {
            targetList.push(newEntry);
          }
        } else {
          targetList.push(newEntry);
        }

        await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
        await this.render();
      });
    }
  }

  static async #onSelectLevel(event, target) {
    this.activeLevel = Number(target.dataset.level) || 1;
    await this.render();
  }

  /**
   * Section 1 Button: Generate Mandatory Permanent Items for the active level
   */
  static async #onGeneratePermanent(event, target) {
    if (!game.user?.isGM) return;
    const level = this.activeLevel;
    const spec = PARTY_TREASURE_MATRIX[level];
    const pack = game.packs.get("pf2e.equipment-srd");
    if (!pack) {
      ui.notifications.error("Compendium pf2e.equipment-srd not found in this world.");
      return;
    }

    const index = await pack.getIndex({
      fields: ["system.level.value", "system.price.value", "type", "system.traits.rarity"]
    });

    const pickRandom = (itemLevel) => {
      const pool = index.filter((entry) => {
        const entryLvl = entry.system?.level?.value ?? 0;
        const rarity = entry.system?.traits?.rarity ?? "common";
        return (
          entryLvl === itemLevel &&
          ["weapon", "armor", "equipment", "shield"].includes(entry.type) &&
          rarity === "common"
        );
      });
      if (!pool.length) return null;
      return pool[Math.floor(Math.random() * pool.length)];
    };

    const permanentItems = [];
    for (const slotGroup of spec.permanent) {
      for (let i = 0; i < slotGroup.count; i++) {
        const doc = pickRandom(slotGroup.level);
        const gp = doc?.system?.price?.value?.gp ?? 0;
        permanentItems.push({
          uuid: doc ? doc.uuid : "",
          name: doc ? doc.name : `Level ${slotGroup.level} Permanent Item`,
          level: slotGroup.level,
          price: gp > 0 ? `${gp.toLocaleString()} gp` : "",
          type: "permanent",
          distributed: false
        });
      }
    }

    const flagData = await this.ensureFlagStructure();
    flagData[level].permanentItems = permanentItems;
    await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
    await this.render();
  }

  /**
   * Section 2 Button: Generate Mandatory Consumables for the active level
   */
  static async #onGenerateConsumables(event, target) {
    if (!game.user?.isGM) return;
    const level = this.activeLevel;
    const spec = PARTY_TREASURE_MATRIX[level];
    const pack = game.packs.get("pf2e.equipment-srd");
    if (!pack) {
      ui.notifications.error("Compendium pf2e.equipment-srd not found in this world.");
      return;
    }

    const index = await pack.getIndex({
      fields: ["system.level.value", "system.price.value", "type", "system.traits.rarity"]
    });

    const pickRandom = (itemLevel) => {
      const pool = index.filter((entry) => {
        const entryLvl = entry.system?.level?.value ?? 0;
        const rarity = entry.system?.traits?.rarity ?? "common";
        return entryLvl === itemLevel && entry.type === "consumable" && rarity === "common";
      });
      if (!pool.length) return null;
      return pool[Math.floor(Math.random() * pool.length)];
    };

    const consumables = [];
    for (const slotGroup of spec.consumables) {
      for (let i = 0; i < slotGroup.count; i++) {
        const doc = pickRandom(slotGroup.level);
        const gp = doc?.system?.price?.value?.gp ?? 0;
        consumables.push({
          uuid: doc ? doc.uuid : "",
          name: doc ? doc.name : `Level ${slotGroup.level} Consumable`,
          level: slotGroup.level,
          price: gp > 0 ? `${gp.toLocaleString()} gp` : "",
          type: "consumable",
          distributed: false
        });
      }
    }

    const flagData = await this.ensureFlagStructure();
    flagData[level].consumables = consumables;
    await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
    await this.render();
  }

  /**
   * Section 3 Button: Generate Currency / Valuables
   * Always randomly splits the target currency GP between Treasure items and Gold Coins (GP)
   * so that the total sum strictly equals spec.currencyGp.
   */
  static async #onGenerateCurrency(event, target) {
    if (!game.user?.isGM) return;
    const level = this.activeLevel;
    const spec = PARTY_TREASURE_MATRIX[level];
    const pack = game.packs.get("pf2e.equipment-srd");
    if (!pack) {
      ui.notifications.error("Compendium pf2e.equipment-srd not found in this world.");
      return;
    }

    const index = await pack.getIndex({
      fields: ["system.level.value", "system.price.value", "type", "system.traits.rarity"]
    });

    const coinNames = ["copper pieces", "silver pieces", "gold pieces", "platinum pieces"];
    const treasures = index.filter((e) => {
      const gpVal = e.system?.price?.value?.gp ?? 0;
      const isCoin = coinNames.includes((e.name || "").toLowerCase());
      return e.type === "treasure" && !isCoin && gpVal > 0 && gpVal < spec.currencyGp;
    });

    const currency = [];
    // Randomly allocate 30% to 75% of the total currency budget to sellable Treasure items
    const splitRatio = 0.3 + Math.random() * 0.45;
    let treasureBudget = Math.max(1, Math.floor(spec.currencyGp * splitRatio));
    let totalSpentOnTreasure = 0;
    let attempts = 0;

    while (treasureBudget > 0 && attempts < 6) {
      attempts++;
      const affordable = treasures.filter(
        (t) =>
          (t.system?.price?.value?.gp ?? 0) <= treasureBudget &&
          (t.system?.price?.value?.gp ?? 0) >= Math.max(1, Math.floor(treasureBudget * 0.15))
      );
      if (!affordable.length) break;

      const chosen = affordable[Math.floor(Math.random() * affordable.length)];
      const gpPrice = chosen.system.price.value.gp;
      currency.push({
        uuid: chosen.uuid,
        name: chosen.name,
        level: chosen.system?.level?.value ?? 1,
        price: `${gpPrice.toLocaleString()} gp`,
        type: "treasure",
        distributed: false
      });
      treasureBudget -= gpPrice;
      totalSpentOnTreasure += gpPrice;
    }

    const remainingGoldGp = spec.currencyGp - totalSpentOnTreasure;
    if (remainingGoldGp > 0) {
      currency.push({
        uuid: GOLD_PIECES_UUID,
        name: `${remainingGoldGp.toLocaleString()} gp (Gold Coins)`,
        level: 0,
        price: `${remainingGoldGp.toLocaleString()} gp`,
        type: "treasure",
        distributed: false
      });
    }

    const flagData = await this.ensureFlagStructure();
    flagData[level].currency = currency;
    await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
    await this.render();
  }

  /**
   * Marks an item as distributed: true in the party actor's flags and re-renders to cross it out
   */
  static async #onDistributeItem(event, target) {
    if (!game.user.isGM) return;
    const { category, index } = target.dataset;
    const flagData = await this.ensureFlagStructure();
    const list = flagData[this.activeLevel]?.[category];
    if (!list || !list[Number(index)]) return;

    list[Number(index)].distributed = true;
    await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
    await this.render();
  }

  /**
   * Restores a distributed item back to active (undistributed) state
   */
  static async #onUndoDistributeItem(event, target) {
    if (!game.user.isGM) return;
    const { category, index } = target.dataset;
    const flagData = await this.ensureFlagStructure();
    const list = flagData[this.activeLevel]?.[category];
    if (!list || !list[Number(index)]) return;

    list[Number(index)].distributed = false;
    await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
    await this.render();
  }

  /**
   * Appends custom item UUIDs or raw GP values to the bonusLoot array
   */
  static async #onAddBonusLoot(event, target) {
    if (!game.user.isGM) return;
    const form = this.element.querySelector(".bonus-loot-form");
    const uuidOrGp = form?.querySelector("[name='bonusInput']")?.value?.trim() || "";
    let customName = form?.querySelector("[name='bonusName']")?.value?.trim() || "";
    let itemLevel = Number(form?.querySelector("[name='bonusLevel']")?.value) || this.activeLevel;
    if (!uuidOrGp && !customName) return;

    let resolvedUuid = "";
    let resolvedType = "treasure";
    let resolvedPrice = "";

    if (uuidOrGp.startsWith("Compendium.") || uuidOrGp.startsWith("Item.")) {
      resolvedUuid = uuidOrGp;
      try {
        const doc = await fromUuid(resolvedUuid);
        if (doc) {
          customName = customName || doc.name;
          itemLevel = doc.system?.level?.value ?? itemLevel;
          const gp = doc.system?.price?.value?.gp ?? 0;
          if (gp > 0) resolvedPrice = `${gp.toLocaleString()} gp`;
          resolvedType =
            doc.type === "consumable"
              ? "consumable"
              : doc.type === "treasure"
              ? "treasure"
              : "permanent";
        }
      } catch {
        // Keep manual name if UUID lookup fails
      }
    }

    const flagData = await this.ensureFlagStructure();
    flagData[this.activeLevel].bonusLoot.push({
      uuid: resolvedUuid || GOLD_PIECES_UUID,
      name: customName || uuidOrGp,
      level: itemLevel,
      price: resolvedPrice,
      type: resolvedType,
      distributed: false
    });

    await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
    await this.render();
  }

  static async #onRemoveBonusLoot(event, target) {
    if (!game.user.isGM) return;
    const index = Number(target.dataset.index);
    const flagData = await this.ensureFlagStructure();
    const list = flagData[this.activeLevel]?.bonusLoot;
    if (!Array.isArray(list)) return;

    list.splice(index, 1);
    await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
    await this.render();
  }

  static async #onOpenItemSheet(event, target) {
    const uuid = target.dataset.uuid;
    if (!uuid) return;
    const doc = await fromUuid(uuid);
    if (doc?.sheet) {
      doc.sheet.render(true);
    }
  }
}

/**
 * Resolves the world's active PF2e Party Actor and opens the Party Treasure Tracker (GM Only)
 */
export async function openPartyTreasureTracker() {
  if (!game.user?.isGM) {
    ui.notifications.warn("Only a Gamemaster can access Party Treasure by Level.");
    return;
  }

  let partyActor = game.actors?.party ?? game.actors?.find((a) => a.type === "party");
  if (!partyActor) {
    partyActor = await Actor.create({ name: "Party", type: "party" });
  }

  if (!partyActor) {
    ui.notifications.error("No PF2e Party actor found in this world.");
    return;
  }

  if (!activeTrackerInstance || activeTrackerInstance.actor?.id !== partyActor.id) {
    activeTrackerInstance = new PartyTreasureTrackerApp(partyActor);
  }
  activeTrackerInstance.render(true);
}

/**
 * Inject GM-only button into the main left-hand Scene Controls bar under Journal Notes ("notes").
 * Compatible with Foundry VTT v13 / v14 (Record/Object structure) and Foundry VTT v12 (Array structure).
 */
Hooks.on("getSceneControlButtons", (controls) => {
  const toolConfig = {
    name: "sufias-loot-tracker",
    title: "Party Treasure by Level",
    icon: "fa-solid fa-coins",
    visible: Boolean(game.user?.isGM),
    button: true,
    onChange: () => openPartyTreasureTracker(),
    onClick: () => openPartyTreasureTracker()
  };

  if (!Array.isArray(controls) && controls?.notes) {
    if (Array.isArray(controls.notes.tools)) {
      controls.notes.tools.push(toolConfig);
    } else if (controls.notes.tools && typeof controls.notes.tools === "object") {
      const order = Object.keys(controls.notes.tools).length + 1;
      controls.notes.tools["sufias-loot-tracker"] = {
        ...toolConfig,
        order
      };
    }
    return;
  }

  if (Array.isArray(controls)) {
    const notesControl = controls.find((c) => c.name === "notes");
    if (notesControl && Array.isArray(notesControl.tools)) {
      notesControl.tools.push(toolConfig);
    }
  }
});

/**
 * Also keep the GM-only header button on the PF2e Party Sheet
 */
Hooks.on("getActorSheetHeaderButtons", (sheet, buttons) => {
  if (!game.user?.isGM || sheet.actor?.type !== "party") return;
  buttons.unshift({
    label: "Party Treasure by Level",
    class: "sufias-loot-tracker-btn",
    icon: "fa-solid fa-coins",
    onclick: () => new PartyTreasureTrackerApp(sheet.actor).render(true)
  });
});

Hooks.on("getHeaderControlsApplicationV2", (app, controls) => {
  if (!game.user?.isGM || app.actor?.type !== "party") return;
  controls.push({
    icon: "fa-solid fa-coins",
    label: "Party Treasure by Level",
    action: "openSufiasLootTracker",
    onClick: () => new PartyTreasureTrackerApp(app.actor).render(true)
  });
});
