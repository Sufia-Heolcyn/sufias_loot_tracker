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
const SCHEMA_VERSION = 2;

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

const COIN_NAMES = new Set(["copper pieces", "silver pieces", "gold pieces", "platinum pieces"]);
const PERMANENT_TYPES = new Set(["weapon", "armor", "equipment", "shield"]);
const ROLLER_ALLOWED_TYPES = new Set(["weapon", "armor", "equipment", "shield", "consumable", "treasure", "backpack"]);

/**
 * In-memory Compendium Index Cache for O(1) lookups and instant rolling
 */
let equipmentCachePromise = null;
let clutterCache = { packId: null, entries: null };

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
 * Builds and caches pre-bucketed lookup tables from `pf2e.equipment-srd` once per session.
 * Eliminates repeated 8,000+ item compendium scans.
 */
async function getEquipmentCache() {
  if (equipmentCachePromise) return equipmentCachePromise;

  const pack = game.packs?.get("pf2e.equipment-srd");
  if (!pack) return null;

  equipmentCachePromise = (async () => {
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

    const byUuid = new Map();
    const byNameLower = new Map();
    const commonPermanentByLevel = new Map();
    const commonConsumablesByLevel = new Map();
    const treasures = [];
    const rollerPool = [];

    for (const entry of index) {
      const uuid = entry.uuid;
      const nameLower = (entry.name || "").toLowerCase();
      const level = Number(entry.system?.level?.value ?? 0);
      const rarity = (entry.system?.traits?.rarity || "common").toLowerCase();
      const type = entry.type;

      byUuid.set(uuid, entry);
      if (nameLower && !byNameLower.has(nameLower)) {
        byNameLower.set(nameLower, entry);
      }

      if (rarity === "common") {
        if (PERMANENT_TYPES.has(type)) {
          let list = commonPermanentByLevel.get(level);
          if (!list) {
            list = [];
            commonPermanentByLevel.set(level, list);
          }
          list.push(entry);
        } else if (type === "consumable") {
          let list = commonConsumablesByLevel.get(level);
          if (!list) {
            list = [];
            commonConsumablesByLevel.set(level, list);
          }
          list.push(entry);
        }
      }

      if (type === "treasure" && !COIN_NAMES.has(nameLower)) {
        const gpVal = Number(entry.system?.price?.value?.gp ?? 0);
        if (gpVal > 0) {
          treasures.push({ entry, gpVal });
        }
      }

      if (ROLLER_ALLOWED_TYPES.has(type)) {
        const rawTraits = entry.system?.traits?.value;
        const traitsLower = Array.isArray(rawTraits)
          ? rawTraits.map((t) => String(t).toLowerCase())
          : [];
        rollerPool.push({
          entry,
          level,
          rarity,
          typeLower: type.toLowerCase(),
          traitsLower
        });
      }
    }

    return {
      byUuid,
      byNameLower,
      commonPermanentByLevel,
      commonConsumablesByLevel,
      treasures,
      rollerPool
    };
  })();

  return equipmentCachePromise;
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
 * Returns cached index entries for `world.clutter`
 */
async function getClutterEntries() {
  const pack = getClutterPack();
  if (!pack) return null;
  if (clutterCache.packId === pack.collection && clutterCache.entries) {
    return clutterCache.entries;
  }
  const index = await pack.getIndex({
    fields: ["img", "system.level.value", "system.price.value", "type"]
  });
  const entries = Array.from(index);
  clutterCache = { packId: pack.collection, entries };
  return entries;
}

/**
 * Builds the 4-player fundamental rune slots for a given level
 */
function createDefaultFundamentalRuneSlots(level, eqCache = null) {
  const templates = FUNDAMENTAL_RUNES_BY_LEVEL[level] || [];
  const slots = [];
  for (const rune of templates) {
    const matched = eqCache?.byNameLower?.get(rune.name.toLowerCase());
    for (let playerNum = 1; playerNum <= 4; playerNum++) {
      slots.push({
        uuid: matched?.uuid || "",
        img: matched?.img || "",
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
function createDefaultLevelSlots(level, eqCache = null) {
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

  const fundamentalRunes = createDefaultFundamentalRuneSlots(level, eqCache);
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
    const r = item.rarity || "common";
    if (buckets[r]) {
      buckets[r].push(item.entry);
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
    this._savedScrollTop = 0;
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
      template: `modules/${MODULE_ID}/templates/treasure-tracker.hbs`,
      scrollable: [".treasure-sections-scroll"]
    }
  };

  /**
   * Fast flag initialization and O(1) icon/UUID resolution using the in-memory equipment cache.
   */
  async ensureFlagStructure() {
    const rawFlag = this.actor.getFlag(MODULE_ID, FLAG_KEY);
    const eqCache = await getEquipmentCache();

    // Fast path: if already initialized to current schema and active level runes/icons are resolved, return shallow clone
    if (rawFlag && rawFlag._schemaVersion === SCHEMA_VERSION) {
      const activeLvlObj = rawFlag[this.activeLevel];
      const needsActiveResolution =
        activeLvlObj &&
        ["permanentItems", "consumables", "currency", "fundamentalRunes", "clutterLoot", "bonusLoot"].some((cat) =>
          (activeLvlObj[cat] || []).some((it) => !it.blank && ((it.uuid && !it.img) || (cat === "fundamentalRunes" && !it.uuid)))
        );
      if (!needsActiveResolution) {
        return foundry.utils.deepClone(rawFlag);
      }
    }

    const cloned = rawFlag && typeof rawFlag === "object" ? foundry.utils.deepClone(rawFlag) : {};
    let needsSave = cloned._schemaVersion !== SCHEMA_VERSION;
    cloned._schemaVersion = SCHEMA_VERSION;

    for (let lvl = 1; lvl <= 20; lvl++) {
      if (!cloned[lvl] || !Array.isArray(cloned[lvl].permanentItems)) {
        cloned[lvl] = createDefaultLevelSlots(lvl, eqCache);
        needsSave = true;
      } else {
        if (!Array.isArray(cloned[lvl].fundamentalRunes)) {
          cloned[lvl].fundamentalRunes = createDefaultFundamentalRuneSlots(lvl, eqCache);
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

    // Resolve Fundamental Rune UUIDs & missing icons across all levels in O(1) time via eqCache
    if (eqCache) {
      const categories = ["permanentItems", "consumables", "currency", "fundamentalRunes", "clutterLoot", "bonusLoot"];
      for (let lvl = 1; lvl <= 20; lvl++) {
        const lvlObj = cloned[lvl];
        if (!lvlObj) continue;

        for (const runeSlot of lvlObj.fundamentalRunes || []) {
          if (runeSlot.blank) continue;
          if (!runeSlot.uuid || !runeSlot.img) {
            const targetName = (runeSlot.runeTemplateName || runeSlot.name || "").toLowerCase();
            const match = eqCache.byNameLower.get(targetName);
            if (match) {
              runeSlot.uuid = match.uuid;
              runeSlot.img = match.img || runeSlot.img || "";
              needsSave = true;
            }
          }
        }

        for (const cat of categories) {
          for (const item of lvlObj[cat] || []) {
            if (item.blank || item.img) continue;
            if (item.uuid === GOLD_PIECES_UUID) {
              item.img = GOLD_PIECES_ICON;
              needsSave = true;
            } else if (item.uuid) {
              const cached = eqCache.byUuid.get(item.uuid);
              if (cached?.img) {
                item.img = cached.img;
                needsSave = true;
              }
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

  /**
   * Updates the active level tab's progress counter (`X/Y`) in-place in the DOM
   */
  _updateLevelProgressInDom(level, levelData) {
    if (!this.element || !levelData) return;
    const allMand = [
      ...(levelData.permanentItems || []),
      ...(levelData.consumables || []),
      ...(levelData.currency || []),
      ...(levelData.fundamentalRunes || [])
    ];
    const distCount = allMand.filter((e) => e.distributed).length;
    const activeTabProg = this.element.querySelector(`.level-tab[data-level="${level}"] .tab-prog`);
    if (activeTabProg) {
      activeTabProg.textContent = `${distCount}/${allMand.length}`;
    }
  }

  /**
   * Updates a single `.loot-row` element in-place in the DOM so single-item clear/reroll never re-renders the whole window
   */
  _updateRowInDom(row, slotData) {
    if (!row || !slotData) return;

    row.classList.toggle("is-distributed", Boolean(slotData.distributed));
    row.classList.toggle("is-blank", Boolean(slotData.blank));

    if (slotData.uuid) {
      row.setAttribute("draggable", "true");
      row.dataset.uuid = slotData.uuid;
    } else {
      row.removeAttribute("draggable");
      delete row.dataset.uuid;
    }

    const levelEl = row.querySelector(".slot-level");
    if (levelEl) {
      levelEl.textContent = slotData.level ? `Lv ${slotData.level}` : slotData.type === "treasure" ? "GP" : "Lv 0";
    }

    const mainEl = row.querySelector(".slot-main");
    if (mainEl) {
      const existingIcon = mainEl.querySelector(".slot-item-icon, .slot-icon-placeholder");
      if (existingIcon) {
        if (slotData.img) {
          const img = document.createElement("img");
          img.className = "slot-item-icon";
          img.src = slotData.img;
          img.alt = slotData.name || "";
          img.loading = "lazy";
          existingIcon.replaceWith(img);
        } else {
          const span = document.createElement("span");
          span.className = "slot-icon-placeholder";
          span.innerHTML = '<i class="fa-solid fa-cube"></i>';
          existingIcon.replaceWith(span);
        }
      }

      const existingName = mainEl.querySelector(".slot-name");
      if (existingName) {
        if (slotData.uuid) {
          const link = document.createElement("a");
          link.className = "slot-name item-link";
          link.dataset.action = "openItemSheet";
          link.dataset.uuid = slotData.uuid;
          link.textContent = slotData.name;
          existingName.replaceWith(link);
        } else {
          const span = document.createElement("span");
          span.className = `slot-name ${slotData.blank ? "blank-slot" : "unrolled"}`;
          span.textContent = slotData.name;
          existingName.replaceWith(span);
        }
      }

      const rarityBadge = mainEl.querySelector(".rarity-badge");
      if (rarityBadge && slotData.rarity) {
        rarityBadge.className = `rarity-badge rarity-${slotData.rarity.toLowerCase()}`;
        rarityBadge.textContent = slotData.rarity;
      }
    }

    const priceEl = row.querySelector(".slot-price");
    if (priceEl) {
      priceEl.textContent = slotData.price || "";
    }

    const checkbox = row.querySelector(".distribute-checkbox");
    if (checkbox) {
      checkbox.checked = Boolean(slotData.distributed);
    }

    const sendBtn = row.querySelector("[data-action='sendRollerItemToBonus']");
    if (sendBtn) {
      sendBtn.disabled = Boolean(slotData.blank);
    }
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

    const roller = flagData.randomRoller || createDefaultRandomRollerState();

    return {
      actorName: this.actor.name,
      activeLevel: this.activeLevel,
      activeTab: this.activeTab,
      isRandomRollerTab: this.activeTab === "randomRoller",
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

  async _preRender(context, options) {
    await super._preRender(context, options);
    const currentScroll = this.element?.querySelector(".treasure-sections-scroll")?.scrollTop;
    if (typeof currentScroll === "number" && currentScroll >= 0) {
      this._savedScrollTop = currentScroll;
    }
  }

  /**
   * Wire lightweight delegated HTML5 Drag-and-Drop listeners
   */
  _onRender(context, options) {
    super._onRender(context, options);
    const root = this.element;
    if (!root) return;

    // 0. Restore and track scroll position of .treasure-sections-scroll
    const scrollContainer = root.querySelector(".treasure-sections-scroll");
    if (scrollContainer) {
      const targetScroll = this._savedScrollTop || 0;
      if (targetScroll > 0) {
        scrollContainer.scrollTop = targetScroll;
        requestAnimationFrame(() => {
          scrollContainer.scrollTop = targetScroll;
        });
      }
      scrollContainer.addEventListener(
        "scroll",
        () => {
          this._savedScrollTop = scrollContainer.scrollTop;
        },
        { passive: true }
      );
    }

    // Bind delegated dragstart / dragover / drop once on the root element
    if (root.dataset.dragDelegated === "true") return;
    root.dataset.dragDelegated = "true";

    root.addEventListener("dragstart", (event) => {
      const row = event.target.closest(".loot-row[draggable='true']");
      if (!row) return;
      const uuid = row.dataset.uuid;
      if (!uuid) return;
      event.dataTransfer.setData("text/plain", JSON.stringify({ type: "Item", uuid }));
    });

    root.addEventListener("dragover", (event) => {
      const container = event.target.closest(".loot-container[data-drop-category]");
      if (!container) return;
      event.preventDefault();
      container.classList.add("drag-hover");
    });

    root.addEventListener("dragleave", (event) => {
      const container = event.target.closest(".loot-container[data-drop-category]");
      if (!container) return;
      if (!container.contains(event.relatedTarget)) {
        container.classList.remove("drag-hover");
      }
    });

    root.addEventListener("drop", async (event) => {
      const container = event.target.closest(".loot-container[data-drop-category]");
      if (!container) return;
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
          this._updateRowInDom(targetRow, targetList[rowIndex]);
          this._updateLevelProgressInDom(this.activeLevel, flagData[this.activeLevel]);
          await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
          return;
        }
      }

      targetList.push(newEntry);
      await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
      await this.render();
    });
  }

  static async #onSelectLevel(event, target) {
    const newLevel = Number(target.dataset.level) || 1;
    if (this.activeTab !== "level" || this.activeLevel !== newLevel) {
      this._savedScrollTop = 0;
    }
    this.activeTab = "level";
    this.activeLevel = newLevel;
    await this.render();
  }

  static async #onSelectRandomRollerTab() {
    if (this.activeTab !== "randomRoller") {
      this._savedScrollTop = 0;
    }
    this.activeTab = "randomRoller";
    await this.render();
  }

  /**
   * Section 1 Button: Generate Mandatory Permanent Items for the active level (O(1) cached lookup)
   */
  static async #onGeneratePermanent() {
    if (!game.user?.isGM) return;
    const level = this.activeLevel;
    const spec = PARTY_TREASURE_MATRIX[level];
    const eqCache = await getEquipmentCache();
    if (!eqCache) {
      ui.notifications.error("Compendium pf2e.equipment-srd not found in this world.");
      return;
    }

    const permanentItems = [];
    for (const slotGroup of spec.permanent) {
      const pool = eqCache.commonPermanentByLevel.get(slotGroup.level) || [];
      for (let i = 0; i < slotGroup.count; i++) {
        const doc = pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
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
   * Section 2 Button: Generate Mandatory Consumables for the active level (O(1) cached lookup)
   */
  static async #onGenerateConsumables() {
    if (!game.user?.isGM) return;
    const level = this.activeLevel;
    const spec = PARTY_TREASURE_MATRIX[level];
    const eqCache = await getEquipmentCache();
    if (!eqCache) {
      ui.notifications.error("Compendium pf2e.equipment-srd not found in this world.");
      return;
    }

    const consumables = [];
    for (const slotGroup of spec.consumables) {
      const pool = eqCache.commonConsumablesByLevel.get(slotGroup.level) || [];
      for (let i = 0; i < slotGroup.count; i++) {
        const doc = pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
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
   */
  static async #onGenerateCurrency() {
    if (!game.user?.isGM) return;
    const level = this.activeLevel;
    const spec = PARTY_TREASURE_MATRIX[level];
    const eqCache = await getEquipmentCache();
    if (!eqCache) {
      ui.notifications.error("Compendium pf2e.equipment-srd not found in this world.");
      return;
    }

    const currency = [];
    const splitRatio = 0.3 + Math.random() * 0.45;
    let treasureBudget = Math.max(1, Math.floor(spec.currencyGp * splitRatio));
    let totalSpentOnTreasure = 0;
    let attempts = 0;

    while (treasureBudget > 0 && attempts < 6) {
      attempts++;
      const minGp = Math.max(1, Math.floor(treasureBudget * 0.15));
      const affordable = eqCache.treasures.filter(
        (t) => t.gpVal <= treasureBudget && t.gpVal >= minGp
      );
      if (!affordable.length) break;

      const chosen = affordable[Math.floor(Math.random() * affordable.length)];
      currency.push({
        uuid: chosen.entry.uuid,
        img: chosen.entry.img || "",
        name: chosen.entry.name,
        level: chosen.entry.system?.level?.value ?? 1,
        price: `${chosen.gpVal.toLocaleString()} gp`,
        type: "treasure",
        blank: false,
        distributed: false
      });
      treasureBudget -= chosen.gpVal;
      totalSpentOnTreasure += chosen.gpVal;
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
   * Section 5 Button: Generate Clutter Loot from `world.clutter` compendium
   */
  static async #onGenerateClutter() {
    if (!game.user?.isGM) return;
    const entries = await getClutterEntries();
    if (!entries) {
      ui.notifications.warn("Compendium 'world.clutter' was not found in this world.");
      return;
    }
    if (!entries.length) {
      ui.notifications.warn("Compendium 'world.clutter' is currently empty.");
      return;
    }

    const flagData = await this.ensureFlagStructure();
    const level = this.activeLevel;
    const slotCount = Math.max(1, flagData[level]?.clutterLoot?.length || DEFAULT_CLUTTER_SLOTS);

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
   * Adds an extra Clutter slot
   */
  static async #onAddClutterSlot() {
    if (!game.user?.isGM) return;
    const flagData = await this.ensureFlagStructure();
    const level = this.activeLevel;
    const entries = await getClutterEntries();

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

    if (entries && entries.length > 0) {
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

    flagData[level].clutterLoot.push(newSlot);
    await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
    await this.render();
  }

  /**
   * Toggles the `distributed` state of an item via its checkbox in-place (zero window re-render)
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

    const newDistributed = !list[idx].distributed;
    list[idx].distributed = newDistributed;
    target.checked = newDistributed;

    const row = target.closest(".loot-row");
    if (row) {
      row.classList.toggle("is-distributed", newDistributed);
    }

    if (category !== "randomRoller") {
      this._updateLevelProgressInDom(this.activeLevel, flagData[this.activeLevel]);
    }

    await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
  }

  /**
   * Rerolls a single item slot in-place in the DOM (zero full window re-render)
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
      const entries = await getClutterEntries();
      if (!entries) {
        ui.notifications.warn("Compendium 'world.clutter' was not found in this world.");
        return;
      }
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
      const eqCache = await getEquipmentCache();
      const match = eqCache && runeName ? eqCache.byNameLower.get(runeName.toLowerCase()) : null;
      list[idx] = {
        ...currentSlot,
        uuid: match?.uuid || "",
        img: match?.img || "",
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
      const eqCache = await getEquipmentCache();
      if (!eqCache) return;
      const roller = flagData.randomRoller || createDefaultRandomRollerState();
      const candidates = PartyTreasureTrackerApp.#filterCachedRollerCandidates(eqCache, roller);
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
      const eqCache = await getEquipmentCache();
      if (!eqCache) {
        ui.notifications.error("Compendium pf2e.equipment-srd not found in this world.");
        return;
      }

      let pool = [];
      if (category === "consumables") {
        pool = eqCache.commonConsumablesByLevel.get(targetLevel) || [];
      } else if (category === "currency") {
        const spec = PARTY_TREASURE_MATRIX[this.activeLevel];
        pool = eqCache.treasures.filter((t) => t.gpVal <= spec.currencyGp).map((t) => t.entry);
      } else {
        pool = eqCache.commonPermanentByLevel.get(targetLevel) || [];
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

    // Update row & progress directly in the DOM without full window re-render
    const row = target.closest(".loot-row");
    if (row) {
      this._updateRowInDom(row, list[idx]);
    }
    if (category !== "randomRoller") {
      this._updateLevelProgressInDom(this.activeLevel, flagData[this.activeLevel]);
    }

    await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
  }

  /**
   * Clears an individual item to a blank slot in-place in the DOM (zero full window re-render unless removing an empty bonus row)
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

    if (category === "bonusLoot" && current.blank) {
      list.splice(idx, 1);
      await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
      await this.render();
      return;
    }

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

    const row = target.closest(".loot-row");
    if (row) {
      this._updateRowInDom(row, list[idx]);
    }
    if (category !== "randomRoller") {
      this._updateLevelProgressInDom(this.activeLevel, flagData[this.activeLevel]);
    }

    await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
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
   * Fast synchronous filter over the pre-indexed `rollerPool` cache
   */
  static #filterCachedRollerCandidates(eqCache, { trait, minLevel, maxLevel, maxRarity }) {
    const maxRarityIdx = RARITY_ORDER.indexOf(maxRarity);
    const allowedRarities = new Set(
      RARITY_ORDER.slice(0, maxRarityIdx >= 0 ? maxRarityIdx + 1 : 4)
    );
    const normalizedTrait = (trait || "").trim().toLowerCase();
    const normalizedTraitSlug = normalizedTrait.replace(/\s+/g, "-");

    return eqCache.rollerPool.filter((item) => {
      if (item.level < minLevel || item.level > maxLevel) return false;
      if (!allowedRarities.has(item.rarity)) return false;

      if (normalizedTrait) {
        const matchesTrait =
          item.traitsLower.some(
            (t) =>
              t === normalizedTrait ||
              t === normalizedTraitSlug ||
              t.includes(normalizedTraitSlug)
          ) || item.typeLower === normalizedTrait;
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

    const eqCache = await getEquipmentCache();
    if (!eqCache) {
      ui.notifications.error("Compendium pf2e.equipment-srd not found in this world.");
      return;
    }

    const candidates = PartyTreasureTrackerApp.#filterCachedRollerCandidates(eqCache, {
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
