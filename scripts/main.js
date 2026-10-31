/**
 * Sufia's Loot Tracker — PF2e Party Treasure by Level (GM Core Table 10-9 & Fundamental Runes)
 * SPDX-License-Identifier: MIT
 * Pathfinder 2e Remaster Table 10-9 & Fundamental Runes mechanics licensed under the ORC License (see LICENSE).
 *
 * Data Storage:
 * Strictly stored on the PF2e `party` Actor using Foundry Flags:
 *   actor.getFlag("sufias-loot-tracker", "treasure-data")
 *   actor.setFlag("sufias-loot-tracker", "treasure-data", { 1: {...}, ..., 20: {...}, randomRoller: {...} })
 */

const MODULE_ID = "sufias-loot-tracker";
const FLAG_KEY = "treasure-data";

/**
 * Standard PF2e Gold Pieces compendium UUID & icon for dragging GP stacks into Loot containers
 */
const GOLD_PIECES_UUID = "Compendium.pf2e.equipment-srd.Item.B6B7tBWJSqOBz5zz";
const GOLD_PIECES_ICON = "systems/pf2e/icons/equipment/treasure/currency/gold-pieces.webp";
const DEFAULT_CLUTTER_SLOTS = 4;

/**
 * Rarity ordering and relative weights for weighted random loot generation
 */
const RARITY_ORDER = ["common", "uncommon", "rare", "unique"];
const RARITY_WEIGHTS = {
  common: 70,
  uncommon: 20,
  rare: 8,
  unique: 2
};

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
 * Formats PF2e item price objects or numbers into a readable string
 */
function formatItemPrice(entry) {
  const val = entry?.system?.price?.value;
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val.toString === "function" && val.constructor?.name !== "Object") {
    const str = val.toString();
    if (str && str !== "[object Object]") return str;
  }
  const gp = Number(val.gp ?? 0);
  const pp = Number(val.pp ?? 0);
  const sp = Number(val.sp ?? 0);
  const cp = Number(val.cp ?? 0);
  const totalGp = gp + pp * 10;
  if (totalGp > 0) return `${totalGp.toLocaleString()} gp`;
  if (sp > 0) return `${sp.toLocaleString()} sp`;
  if (cp > 0) return `${cp.toLocaleString()} cp`;
  return "";
}

/**
 * Finds the user's `world.clutter` compendium pack
 */
function getClutterPack() {
  if (!game.packs) return null;
  return (
    game.packs.get("world.clutter") ||
    game.packs.find(
      (p) =>
        p.collection?.toLowerCase() === "world.clutter" ||
        p.metadata?.name?.toLowerCase() === "clutter" ||
        p.metadata?.label?.toLowerCase() === "clutter" ||
        p.title?.toLowerCase() === "clutter"
    ) ||
    null
  );
}

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
        img: "",
        name: rune.name,
        runeTemplateName: rune.name,
        playerLabel: `Player ${playerNum}`,
        level: rune.level,
        price: rune.price,
        rarity: rune.rarity,
        usage: rune.usage,
        type: "permanent",
        blank: false,
        distributed: false
      });
    }
  }
  return slots;
}

/**
 * Builds default Clutter Loot slots for a given level
 */
function createDefaultClutterSlots(level, count = DEFAULT_CLUTTER_SLOTS) {
  const slots = [];
  for (let i = 0; i < count; i++) {
    slots.push({
      uuid: "",
      img: "",
      name: "[Unrolled Slot] Clutter Item",
      level,
      price: "",
      type: "clutter",
      blank: false,
      distributed: false
    });
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
        img: "",
        name: `[Unrolled Slot] Level ${group.level} Permanent Item`,
        level: group.level,
        price: "",
        type: "permanent",
        blank: false,
        distributed: false
      });
    }
  }

  const consumables = [];
  for (const group of spec.consumables) {
    for (let i = 0; i < group.count; i++) {
      consumables.push({
        uuid: "",
        img: "",
        name: `[Unrolled Slot] Level ${group.level} Consumable`,
        level: group.level,
        price: "",
        type: "consumable",
        blank: false,
        distributed: false
      });
    }
  }

  const currency = [
    {
      uuid: GOLD_PIECES_UUID,
      img: GOLD_PIECES_ICON,
      name: `[Unrolled Split] ${spec.currencyGp.toLocaleString()} gp Budget (Click Generate Currency & Valuables)`,
      level: 0,
      price: `${spec.currencyGp.toLocaleString()} gp`,
      type: "treasure",
      blank: false,
      distributed: false
    }
  ];

  const fundamentalRunes = createDefaultFundamentalRuneSlots(level);
  const clutterLoot = createDefaultClutterSlots(level);

  return {
    permanentItems,
    consumables,
    currency,
    fundamentalRunes,
    clutterLoot,
    bonusLoot: []
  };
}

/**
 * Default state for the Random Loot Roller tab
 */
function createDefaultRandomRollerState() {
  return {
    trait: "",
    minLevel: 1,
    maxLevel: 20,
    maxRarity: "rare",
    count: 5,
    items: []
  };
}

/**
 * Weighted random selection by PF2e rarity tier (Common: 70, Uncommon: 20, Rare: 8, Unique: 2)
 */
function pickWeightedByRarity(candidates, maxRarity) {
  if (!candidates.length) return null;
  const maxIdx = RARITY_ORDER.indexOf(maxRarity);
  const allowedRarities = RARITY_ORDER.slice(0, maxIdx >= 0 ? maxIdx + 1 : 4);

  const buckets = {};
  for (const r of allowedRarities) {
    buckets[r] = [];
  }
  for (const item of candidates) {
    const r = (item.system?.traits?.rarity || "common").toLowerCase();
    if (buckets[r]) {
      buckets[r].push(item);
    }
  }

  const nonEmptyRarities = allowedRarities.filter((r) => buckets[r].length > 0);
  if (!nonEmptyRarities.length) return null;

  const totalWeight = nonEmptyRarities.reduce((sum, r) => sum + (RARITY_WEIGHTS[r] || 1), 0);
  let roll = Math.random() * totalWeight;
  let chosenRarity = nonEmptyRarities[0];
  for (const r of nonEmptyRarities) {
    roll -= RARITY_WEIGHTS[r] || 1;
    if (roll <= 0) {
      chosenRarity = r;
      break;
    }
  }

  const pool = buckets[chosenRarity];
  return pool[Math.floor(Math.random() * pool.length)];
}

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

let activeTrackerInstance = null;

export class PartyTreasureTrackerApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(partyActor, options = {}) {
    super(options);
    this.actor = partyActor;
    this.activeLevel = Number(partyActor?.system?.details?.level?.value) || 1;
    if (this.activeLevel < 1 || this.activeLevel > 20) this.activeLevel = 1;
    this.activeTab = "level"; // "level" | "randomRoller"
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
      width: 980,
      height: 800
    },
    actions: {
      selectLevel: PartyTreasureTrackerApp.#onSelectLevel,
      selectRandomRollerTab: PartyTreasureTrackerApp.#onSelectRandomRollerTab,
      generatePermanent: PartyTreasureTrackerApp.#onGeneratePermanent,
      generateConsumables: PartyTreasureTrackerApp.#onGenerateConsumables,
      generateCurrency: PartyTreasureTrackerApp.#onGenerateCurrency,
      generateClutter: PartyTreasureTrackerApp.#onGenerateClutter,
      addClutterSlot: PartyTreasureTrackerApp.#onAddClutterSlot,
      toggleDistribute: PartyTreasureTrackerApp.#onToggleDistribute,
      rerollItem: PartyTreasureTrackerApp.#onRerollItem,
      clearItem: PartyTreasureTrackerApp.#onClearItem,
      addBonusLoot: PartyTreasureTrackerApp.#onAddBonusLoot,
      rollCustomLoot: PartyTreasureTrackerApp.#onRollCustomLoot,
      clearCustomLootResults: PartyTreasureTrackerApp.#onClearCustomLootResults,
      sendRollerItemToBonus: PartyTreasureTrackerApp.#onSendRollerItemToBonus,
      openItemSheet: PartyTreasureTrackerApp.#onOpenItemSheet
    }
  };

  static PARTS = {
    main: {
      template: `modules/${MODULE_ID}/templates/treasure-tracker.hbs`
    }
  };

  /**
   * Ensures actor flag structure contains keys 1..20 with permanentItems, consumables, currency, fundamentalRunes, clutterLoot, bonusLoot,
   * plus randomRoller state, and resolves Compendium UUIDs & icons for Fundamental Runes and existing items.
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
      } else {
        if (!Array.isArray(cloned[lvl].fundamentalRunes)) {
          cloned[lvl].fundamentalRunes = createDefaultFundamentalRuneSlots(lvl);
          needsSave = true;
        }
        if (!Array.isArray(cloned[lvl].clutterLoot)) {
          cloned[lvl].clutterLoot = createDefaultClutterSlots(lvl);
          needsSave = true;
        }
        if (!Array.isArray(cloned[lvl].bonusLoot)) {
          cloned[lvl].bonusLoot = [];
          needsSave = true;
        }
      }
    }

    if (!cloned.randomRoller || typeof cloned.randomRoller !== "object") {
      cloned.randomRoller = createDefaultRandomRollerState();
      needsSave = true;
    }

    // Resolve Fundamental Rune compendium UUIDs & missing item icons on the active level
    const activeLvlObj = cloned[this.activeLevel];
    if (activeLvlObj) {
      const pack = game.packs?.get("pf2e.equipment-srd");
      if (pack) {
        const activeRunes = activeLvlObj.fundamentalRunes || [];
        const needsRuneLookup = activeRunes.some((r) => !r.blank && (!r.uuid || !r.img));
        if (needsRuneLookup) {
          const index = await pack.getIndex({ fields: ["name", "img"] });
          for (const runeSlot of activeRunes) {
            if (runeSlot.blank) continue;
            if (!runeSlot.uuid || !runeSlot.img) {
              const targetName = (runeSlot.runeTemplateName || runeSlot.name || "").toLowerCase();
              const match = index.find((e) => e.name.toLowerCase() === targetName);
              if (match) {
                runeSlot.uuid = match.uuid;
                runeSlot.img = match.img || runeSlot.img || "";
                needsSave = true;
              }
            }
          }
        }
      }

      // Ensure Gold Coins have their coin icon and any UUID-linked item without img gets its icon resolved
      const categories = ["permanentItems", "consumables", "currency", "fundamentalRunes", "clutterLoot", "bonusLoot"];
      for (const cat of categories) {
        for (const item of activeLvlObj[cat] || []) {
          if (item.blank) continue;
          if (item.uuid === GOLD_PIECES_UUID && !item.img) {
            item.img = GOLD_PIECES_ICON;
            needsSave = true;
          } else if (item.uuid && !item.img) {
            try {
              const doc = await fromUuid(item.uuid);
              if (doc?.img) {
                item.img = doc.img;
                needsSave = true;
              }
            } catch {
              // Ignore missing compendium links
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
        active: this.activeTab === "level" && lvl === this.activeLevel,
        progress: `${distCount}/${allMand.length}`,
        hasRunes
      };
    });

    const clutterPack = getClutterPack();
    const roller = flagData.randomRoller || createDefaultRandomRollerState();

    return {
      actorName: this.actor.name,
      activeLevel: this.activeLevel,
      activeTab: this.activeTab,
      isRandomRollerTab: this.activeTab === "randomRoller",
      levels,
      clutterPackAvailable: Boolean(clutterPack),
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
      levelData: currentLevelData,
      randomRoller: {
        ...roller,
        rarityOptions: [
          { value: "common", label: "Common Only", selected: roller.maxRarity === "common" },
          { value: "uncommon", label: "Up to Uncommon", selected: roller.maxRarity === "uncommon" },
          { value: "rare", label: "Up to Rare", selected: roller.maxRarity === "rare" },
          { value: "unique", label: "Up to Unique", selected: roller.maxRarity === "unique" }
        ]
      }
    };
  }

  /**
   * Wire HTML5 Drag-and-Drop (both dragging items OUT into a PF2e Loot Actor sheet
   * and dragging items FROM Compendiums/Sidebar INTO any container or blank slot in the tracker)
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

    // 2. Incoming dragover / drop: Allow dragging Foundry Items into any container or slot in this window
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
        const itemLevel = doc.system?.level?.value ?? this.activeLevel;
        const priceStr = formatItemPrice(doc);

        const flagData = await this.ensureFlagStructure();
        const targetList =
          category === "randomRoller"
            ? flagData.randomRoller?.items
            : flagData[this.activeLevel]?.[category];
        if (!Array.isArray(targetList)) return;

        // If dropped onto a specific slot row, replace that slot; otherwise append
        const targetRow = event.target.closest(".loot-row[data-index]");
        const newEntry = {
          uuid: doc.uuid,
          img: doc.img || "",
          name: doc.name,
          level: itemLevel,
          price: priceStr,
          rarity: (doc.system?.traits?.rarity || "common").toLowerCase(),
          type:
            doc.type === "consumable"
              ? "consumable"
              : doc.type === "treasure"
              ? "treasure"
              : "permanent",
          blank: false,
          distributed: false
        };

        if (targetRow) {
          const rowIndex = Number(targetRow.dataset.index);
          if (targetList[rowIndex]) {
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
    this.activeTab = "level";
    this.activeLevel = Number(target.dataset.level) || 1;
    await this.render();
  }

  static async #onSelectRandomRollerTab() {
    this.activeTab = "randomRoller";
    await this.render();
  }

  /**
   * Section 1 Button: Generate Mandatory Permanent Items for the active level
   */
  static async #onGeneratePermanent() {
    if (!game.user?.isGM) return;
    const level = this.activeLevel;
    const spec = PARTY_TREASURE_MATRIX[level];
    const pack = game.packs.get("pf2e.equipment-srd");
    if (!pack) {
      ui.notifications.error("Compendium pf2e.equipment-srd not found in this world.");
      return;
    }

    const index = await pack.getIndex({
      fields: ["img", "system.level.value", "system.price.value", "type", "system.traits.rarity"]
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
        permanentItems.push({
          uuid: doc ? doc.uuid : "",
          img: doc?.img || "",
          name: doc ? doc.name : `Level ${slotGroup.level} Permanent Item`,
          level: slotGroup.level,
          price: doc ? formatItemPrice(doc) : "",
          type: "permanent",
          blank: false,
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
  static async #onGenerateConsumables() {
    if (!game.user?.isGM) return;
    const level = this.activeLevel;
    const spec = PARTY_TREASURE_MATRIX[level];
    const pack = game.packs.get("pf2e.equipment-srd");
    if (!pack) {
      ui.notifications.error("Compendium pf2e.equipment-srd not found in this world.");
      return;
    }

    const index = await pack.getIndex({
      fields: ["img", "system.level.value", "system.price.value", "type", "system.traits.rarity"]
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
        consumables.push({
          uuid: doc ? doc.uuid : "",
          img: doc?.img || "",
          name: doc ? doc.name : `Level ${slotGroup.level} Consumable`,
          level: slotGroup.level,
          price: doc ? formatItemPrice(doc) : "",
          type: "consumable",
          blank: false,
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
   * Randomly splits the target currency GP between Treasure items and Gold Coins (GP)
   * so that the total sum strictly equals spec.currencyGp.
   */
  static async #onGenerateCurrency() {
    if (!game.user?.isGM) return;
    const level = this.activeLevel;
    const spec = PARTY_TREASURE_MATRIX[level];
    const pack = game.packs.get("pf2e.equipment-srd");
    if (!pack) {
      ui.notifications.error("Compendium pf2e.equipment-srd not found in this world.");
      return;
    }

    const index = await pack.getIndex({
      fields: ["img", "system.level.value", "system.price.value", "type", "system.traits.rarity"]
    });

    const coinNames = ["copper pieces", "silver pieces", "gold pieces", "platinum pieces"];
    const treasures = index.filter((e) => {
      const gpVal = e.system?.price?.value?.gp ?? 0;
      const isCoin = coinNames.includes((e.name || "").toLowerCase());
      return e.type === "treasure" && !isCoin && gpVal > 0 && gpVal < spec.currencyGp;
    });

    const currency = [];
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
        img: chosen.img || "",
        name: chosen.name,
        level: chosen.system?.level?.value ?? 1,
        price: `${gpPrice.toLocaleString()} gp`,
        type: "treasure",
        blank: false,
        distributed: false
      });
      treasureBudget -= gpPrice;
      totalSpentOnTreasure += gpPrice;
    }

    const remainingGoldGp = spec.currencyGp - totalSpentOnTreasure;
    if (remainingGoldGp > 0) {
      currency.push({
        uuid: GOLD_PIECES_UUID,
        img: GOLD_PIECES_ICON,
        name: `${remainingGoldGp.toLocaleString()} gp (Gold Coins)`,
        level: 0,
        price: `${remainingGoldGp.toLocaleString()} gp`,
        type: "treasure",
        blank: false,
        distributed: false
      });
    }

    const flagData = await this.ensureFlagStructure();
    flagData[level].currency = currency;
    await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
    await this.render();
  }

  /**
   * Section 4 Button: Generate Clutter Loot from `world.clutter` compendium
   */
  static async #onGenerateClutter() {
    if (!game.user?.isGM) return;
    const pack = getClutterPack();
    if (!pack) {
      ui.notifications.warn("Compendium 'world.clutter' was not found in this world.");
      return;
    }

    const index = await pack.getIndex({
      fields: ["img", "system.level.value", "system.price.value", "type", "system.traits.rarity"]
    });
    const entries = Array.from(index);
    if (!entries.length) {
      ui.notifications.warn("Compendium 'world.clutter' is currently empty.");
      return;
    }

    const flagData = await this.ensureFlagStructure();
    const level = this.activeLevel;
    const existingCount = flagData[level]?.clutterLoot?.length || DEFAULT_CLUTTER_SLOTS;
    const slotCount = Math.max(1, existingCount);

    const clutterLoot = [];
    for (let i = 0; i < slotCount; i++) {
      const picked = entries[Math.floor(Math.random() * entries.length)];
      clutterLoot.push({
        uuid: picked.uuid,
        img: picked.img || "",
        name: picked.name,
        level: picked.system?.level?.value ?? 0,
        price: formatItemPrice(picked),
        type: "clutter",
        blank: false,
        distributed: false
      });
    }

    flagData[level].clutterLoot = clutterLoot;
    await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
    await this.render();
  }

  /**
   * Adds an extra Clutter slot (and immediately rolls an item from `world.clutter` if available)
   */
  static async #onAddClutterSlot() {
    if (!game.user?.isGM) return;
    const flagData = await this.ensureFlagStructure();
    const level = this.activeLevel;
    const pack = getClutterPack();

    let newSlot = {
      uuid: "",
      img: "",
      name: "[Unrolled Slot] Clutter Item",
      level: 0,
      price: "",
      type: "clutter",
      blank: false,
      distributed: false
    };

    if (pack) {
      const index = await pack.getIndex({
        fields: ["img", "system.level.value", "system.price.value", "type"]
      });
      const entries = Array.from(index);
      if (entries.length > 0) {
        const picked = entries[Math.floor(Math.random() * entries.length)];
        newSlot = {
          uuid: picked.uuid,
          img: picked.img || "",
          name: picked.name,
          level: picked.system?.level?.value ?? 0,
          price: formatItemPrice(picked),
          type: "clutter",
          blank: false,
          distributed: false
        };
      }
    }

    flagData[level].clutterLoot.push(newSlot);
    await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
    await this.render();
  }

  /**
   * Toggles the `distributed` state of an item via its checkbox
   */
  static async #onToggleDistribute(event, target) {
    if (!game.user?.isGM) return;
    const { category, index } = target.dataset;
    const flagData = await this.ensureFlagStructure();
    const list =
      category === "randomRoller"
        ? flagData.randomRoller?.items
        : flagData[this.activeLevel]?.[category];
    const idx = Number(index);
    if (!Array.isArray(list) || !list[idx]) return;

    list[idx].distributed = !list[idx].distributed;
    await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
    await this.render();
  }

  /**
   * Rerolls a single item slot in place
   */
  static async #onRerollItem(event, target) {
    if (!game.user?.isGM) return;
    const { category, index } = target.dataset;
    const idx = Number(index);
    const flagData = await this.ensureFlagStructure();
    const list =
      category === "randomRoller"
        ? flagData.randomRoller?.items
        : flagData[this.activeLevel]?.[category];
    if (!Array.isArray(list) || !list[idx]) return;

    const currentSlot = list[idx];
    const targetLevel = Number(currentSlot.level ?? this.activeLevel);

    if (category === "clutterLoot") {
      const clutterPack = getClutterPack();
      if (!clutterPack) {
        ui.notifications.warn("Compendium 'world.clutter' was not found in this world.");
        return;
      }
      const indexData = await clutterPack.getIndex({
        fields: ["img", "system.level.value", "system.price.value", "type"]
      });
      const entries = Array.from(indexData);
      if (!entries.length) {
        ui.notifications.warn("Compendium 'world.clutter' is empty.");
        return;
      }
      const picked = entries[Math.floor(Math.random() * entries.length)];
      list[idx] = {
        ...currentSlot,
        uuid: picked.uuid,
        img: picked.img || "",
        name: picked.name,
        level: picked.system?.level?.value ?? 0,
        price: formatItemPrice(picked),
        blank: false,
        distributed: false
      };
    } else if (category === "fundamentalRunes") {
      const templates = FUNDAMENTAL_RUNES_BY_LEVEL[this.activeLevel] || [];
      const templateRune = templates[Math.floor(idx / 4)] || templates[0];
      const runeName = currentSlot.runeTemplateName || templateRune?.name || currentSlot.name;
      const pack = game.packs.get("pf2e.equipment-srd");
      let resolvedUuid = "";
      let resolvedImg = "";
      if (pack && runeName) {
        const indexData = await pack.getIndex({ fields: ["name", "img"] });
        const match = indexData.find((e) => e.name.toLowerCase() === runeName.toLowerCase());
        if (match) {
          resolvedUuid = match.uuid;
          resolvedImg = match.img || "";
        }
      }
      list[idx] = {
        ...currentSlot,
        uuid: resolvedUuid,
        img: resolvedImg,
        name: runeName,
        runeTemplateName: runeName,
        level: templateRune?.level ?? targetLevel,
        price: templateRune?.price ?? currentSlot.price,
        rarity: templateRune?.rarity ?? currentSlot.rarity ?? "Common",
        usage: templateRune?.usage ?? currentSlot.usage ?? "",
        blank: false,
        distributed: false
      };
    } else if (category === "randomRoller") {
      const pack = game.packs.get("pf2e.equipment-srd");
      if (!pack) return;
      const roller = flagData.randomRoller || createDefaultRandomRollerState();
      const candidates = await PartyTreasureTrackerApp.#queryRollerCandidates(pack, roller);
      if (!candidates.length) {
        ui.notifications.warn("No matching items found for current filter settings.");
        return;
      }
      const picked = pickWeightedByRarity(candidates, roller.maxRarity);
      if (picked) {
        list[idx] = {
          uuid: picked.uuid,
          img: picked.img || "",
          name: picked.name,
          level: picked.system?.level?.value ?? 0,
          price: formatItemPrice(picked),
          rarity: (picked.system?.traits?.rarity || "common").toLowerCase(),
          type: picked.type,
          blank: false,
          distributed: false
        };
      }
    } else {
      // permanentItems, consumables, currency, or bonusLoot
      const pack = game.packs.get("pf2e.equipment-srd");
      if (!pack) {
        ui.notifications.error("Compendium pf2e.equipment-srd not found in this world.");
        return;
      }
      const indexData = await pack.getIndex({
        fields: ["img", "system.level.value", "system.price.value", "type", "system.traits.rarity"]
      });

      let pool = [];
      if (category === "consumables") {
        pool = indexData.filter(
          (e) =>
            (e.system?.level?.value ?? 0) === targetLevel &&
            e.type === "consumable" &&
            (e.system?.traits?.rarity ?? "common") === "common"
        );
      } else if (category === "currency") {
        const spec = PARTY_TREASURE_MATRIX[this.activeLevel];
        const coinNames = ["copper pieces", "silver pieces", "gold pieces", "platinum pieces"];
        pool = indexData.filter((e) => {
          const gpVal = e.system?.price?.value?.gp ?? 0;
          const isCoin = coinNames.includes((e.name || "").toLowerCase());
          return e.type === "treasure" && !isCoin && gpVal > 0 && gpVal <= spec.currencyGp;
        });
      } else {
        pool = indexData.filter(
          (e) =>
            (e.system?.level?.value ?? 0) === targetLevel &&
            ["weapon", "armor", "equipment", "shield"].includes(e.type) &&
            (e.system?.traits?.rarity ?? "common") === "common"
        );
      }

      if (!pool.length) {
        ui.notifications.warn(`No matching items found at Level ${targetLevel}.`);
        return;
      }

      const picked = pool[Math.floor(Math.random() * pool.length)];
      list[idx] = {
        ...currentSlot,
        uuid: picked.uuid,
        img: picked.img || "",
        name: picked.name,
        level: picked.system?.level?.value ?? targetLevel,
        price: formatItemPrice(picked),
        blank: false,
        distributed: false
      };
    }

    await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
    await this.render();
  }

  /**
   * Deletes an individual item, leaving its slot blank so another item can be dragged in or rerolled
   */
  static async #onClearItem(event, target) {
    if (!game.user?.isGM) return;
    const { category, index } = target.dataset;
    const idx = Number(index);
    const flagData = await this.ensureFlagStructure();
    const list =
      category === "randomRoller"
        ? flagData.randomRoller?.items
        : flagData[this.activeLevel]?.[category];
    if (!Array.isArray(list) || !list[idx]) return;

    const current = list[idx];

    // If a bonusLoot slot is already blank and clicked again, remove the extra row
    if (category === "bonusLoot" && current.blank) {
      list.splice(idx, 1);
    } else {
      list[idx] = {
        uuid: "",
        img: "",
        name: "[Blank Slot]",
        level: current.level ?? this.activeLevel,
        price: "",
        type: current.type || "permanent",
        playerLabel: current.playerLabel || "",
        runeTemplateName:
          current.runeTemplateName || (category === "fundamentalRunes" ? current.name : ""),
        usage: current.usage || "",
        rarity: current.rarity || "",
        blank: true,
        distributed: false
      };
    }

    await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
    await this.render();
  }

  /**
   * Appends custom item UUIDs or raw GP values to the bonusLoot array
   */
  static async #onAddBonusLoot() {
    if (!game.user?.isGM) return;
    const form = this.element.querySelector(".bonus-loot-form");
    const uuidOrGp = form?.querySelector("[name='bonusInput']")?.value?.trim() || "";
    let customName = form?.querySelector("[name='bonusName']")?.value?.trim() || "";
    let itemLevel = Number(form?.querySelector("[name='bonusLevel']")?.value) || this.activeLevel;
    if (!uuidOrGp && !customName) return;

    let resolvedUuid = "";
    let resolvedImg = "";
    let resolvedType = "treasure";
    let resolvedPrice = "";

    if (uuidOrGp.startsWith("Compendium.") || uuidOrGp.startsWith("Item.")) {
      resolvedUuid = uuidOrGp;
      try {
        const doc = await fromUuid(resolvedUuid);
        if (doc) {
          customName = customName || doc.name;
          resolvedImg = doc.img || "";
          itemLevel = doc.system?.level?.value ?? itemLevel;
          resolvedPrice = formatItemPrice(doc);
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
    } else {
      resolvedUuid = GOLD_PIECES_UUID;
      resolvedImg = GOLD_PIECES_ICON;
    }

    const flagData = await this.ensureFlagStructure();
    flagData[this.activeLevel].bonusLoot.push({
      uuid: resolvedUuid,
      img: resolvedImg,
      name: customName || uuidOrGp,
      level: itemLevel,
      price: resolvedPrice,
      type: resolvedType,
      blank: false,
      distributed: false
    });

    await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
    await this.render();
  }

  /**
   * Helper to query candidate items from `pf2e.equipment-srd` for the Random Loot Roller tab
   */
  static async #queryRollerCandidates(pack, { trait, minLevel, maxLevel, maxRarity }) {
    const index = await pack.getIndex({
      fields: [
        "img",
        "system.level.value",
        "system.price.value",
        "type",
        "system.traits.rarity",
        "system.traits.value"
      ]
    });

    const maxRarityIdx = RARITY_ORDER.indexOf(maxRarity);
    const allowedRarities = new Set(
      RARITY_ORDER.slice(0, maxRarityIdx >= 0 ? maxRarityIdx + 1 : 4)
    );
    const normalizedTrait = (trait || "").trim().toLowerCase();
    const normalizedTraitSlug = normalizedTrait.replace(/\s+/g, "-");

    return index.filter((entry) => {
      if (!["weapon", "armor", "equipment", "shield", "consumable", "treasure", "backpack"].includes(entry.type)) {
        return false;
      }
      const lvl = Number(entry.system?.level?.value ?? 0);
      if (lvl < minLevel || lvl > maxLevel) return false;

      const rarity = (entry.system?.traits?.rarity || "common").toLowerCase();
      if (!allowedRarities.has(rarity)) return false;

      if (normalizedTrait) {
        const traitsArr = Array.isArray(entry.system?.traits?.value)
          ? entry.system.traits.value.map((t) => String(t).toLowerCase())
          : [];
        const matchesTrait =
          traitsArr.some(
            (t) =>
              t === normalizedTrait ||
              t === normalizedTraitSlug ||
              t.includes(normalizedTraitSlug)
          ) || entry.type.toLowerCase() === normalizedTrait;
        if (!matchesTrait) return false;
      }

      return true;
    });
  }

  /**
   * Random Loot Roller Tab: Generates weighted random items based on Trait, Level Range, Max Rarity, and Count
   */
  static async #onRollCustomLoot() {
    if (!game.user?.isGM) return;
    const form = this.element.querySelector(".random-roller-form");
    if (!form) return;

    const trait = form.querySelector("[name='rollerTrait']")?.value?.trim() || "";
    const minLevelRaw = Number(form.querySelector("[name='rollerMinLevel']")?.value ?? 1);
    const maxLevelRaw = Number(form.querySelector("[name='rollerMaxLevel']")?.value ?? 20);
    const minLevel = Math.max(0, Math.min(25, Math.min(minLevelRaw, maxLevelRaw)));
    const maxLevel = Math.max(0, Math.min(25, Math.max(minLevelRaw, maxLevelRaw)));
    const maxRarity = (form.querySelector("[name='rollerMaxRarity']")?.value || "rare").toLowerCase();
    const count = Math.max(1, Math.min(50, Number(form.querySelector("[name='rollerCount']")?.value) || 5));

    const pack = game.packs.get("pf2e.equipment-srd");
    if (!pack) {
      ui.notifications.error("Compendium pf2e.equipment-srd not found in this world.");
      return;
    }

    const candidates = await PartyTreasureTrackerApp.#queryRollerCandidates(pack, {
      trait,
      minLevel,
      maxLevel,
      maxRarity
    });

    if (!candidates.length) {
      ui.notifications.warn(
        `No items found matching Level ${minLevel}–${maxLevel}, Max Rarity "${maxRarity}"${
          trait ? `, Trait "${trait}"` : ""
        }.`
      );
      return;
    }

    const rolledItems = [];
    for (let i = 0; i < count; i++) {
      const picked = pickWeightedByRarity(candidates, maxRarity);
      if (picked) {
        rolledItems.push({
          uuid: picked.uuid,
          img: picked.img || "",
          name: picked.name,
          level: picked.system?.level?.value ?? 0,
          price: formatItemPrice(picked),
          rarity: (picked.system?.traits?.rarity || "common").toLowerCase(),
          type: picked.type,
          blank: false,
          distributed: false
        });
      }
    }

    const flagData = await this.ensureFlagStructure();
    flagData.randomRoller = {
      trait,
      minLevel,
      maxLevel,
      maxRarity,
      count,
      items: rolledItems
    };

    await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
    await this.render();
  }

  /**
   * Clears all generated items in the Random Loot Roller tab
   */
  static async #onClearCustomLootResults() {
    if (!game.user?.isGM) return;
    const flagData = await this.ensureFlagStructure();
    if (flagData.randomRoller) {
      flagData.randomRoller.items = [];
      await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
      await this.render();
    }
  }

  /**
   * Copies an item from the Random Loot Roller into the active level's Bonus Loot section
   */
  static async #onSendRollerItemToBonus(event, target) {
    if (!game.user?.isGM) return;
    const idx = Number(target.dataset.index);
    const flagData = await this.ensureFlagStructure();
    const item = flagData.randomRoller?.items?.[idx];
    if (!item || item.blank) return;

    flagData[this.activeLevel].bonusLoot.push({
      ...foundry.utils.deepClone(item),
      distributed: false
    });
    await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
    ui.notifications.info(`Added "${item.name}" to Level ${this.activeLevel} Bonus Loot.`);
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
