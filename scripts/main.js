/**
 * Sufia's Loot Tracker — PF2e Party Treasure by Level (GM Core Table 10-9)
 * SPDX-License-Identifier: MIT
 * Game Mechanics licensed under the ORC License (see LICENSE).
 *
 * Stores all state strictly in Party Actor Flags:
 * actor.getFlag('sufias_loot_tracker', 'treasure-data')
 * actor.setFlag('sufias_loot_tracker', 'treasure-data', {...})
 */

const MODULE_ID = "sufias_loot_tracker";
const FLAG_KEY = "treasure-data";

export const PARTY_TREASURE_MATRIX = {
  1:  { totalGp: 175,    permanent: [{ level: 2, count: 2 }, { level: 1, count: 2 }], consumables: [{ level: 2, count: 2 }, { level: 1, count: 3 }], currencyGp: 40,     extraPcGp: 10 },
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

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class PartyTreasureTrackerApp extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor(partyActor, options = {}) {
    super(options);
    this.actor = partyActor;
    this.activeLevel = partyActor?.system?.details?.level?.value || 1;
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
      width: 920,
      height: 720
    },
    actions: {
      selectLevel: PartyTreasureTrackerApp.#onSelectLevel,
      generateRandomLoot: PartyTreasureTrackerApp.#onGenerateRandomLoot,
      distributeItem: PartyTreasureTrackerApp.#onDistributeItem,
      addBonusLoot: PartyTreasureTrackerApp.#onAddBonusLoot
    }
  };

  static PARTS = {
    main: {
      template: `modules/${MODULE_ID}/templates/treasure-tracker.hbs`
    }
  };

  async ensureFlagStructure() {
    let flagData = this.actor.getFlag(MODULE_ID, FLAG_KEY);
    if (!flagData) {
      flagData = {};
      for (let lvl = 1; lvl <= 20; lvl++) {
        flagData[lvl] = {
          permanentItems: [],
          consumables: [],
          currency: [],
          bonusLoot: []
        };
      }
      await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
    }
    return foundry.utils.deepClone(flagData);
  }

  async _prepareContext() {
    const flagData = await this.ensureFlagStructure();
    const currentLevelData = flagData[this.activeLevel] || {
      permanentItems: [],
      consumables: [],
      currency: [],
      bonusLoot: []
    };

    const levels = Array.from({ length: 20 }, (_, i) => ({
      level: i + 1,
      active: i + 1 === this.activeLevel
    }));

    return {
      actorName: this.actor.name,
      activeLevel: this.activeLevel,
      levels,
      prescription: PARTY_TREASURE_MATRIX[this.activeLevel],
      levelData: currentLevelData
    };
  }

  static async #onSelectLevel(event, target) {
    this.activeLevel = Number(target.dataset.level) || 1;
    await this.render();
  }

  static async #onGenerateRandomLoot(event, target) {
    const level = this.activeLevel;
    const spec = PARTY_TREASURE_MATRIX[level];
    const pack = game.packs.get("pf2e.equipment-srd");
    if (!pack) {
      ui.notifications.error("Compendium pf2e.equipment-srd not found.");
      return;
    }

    const index = await pack.getIndex({
      fields: ["system.level.value", "system.price.value", "type", "system.traits.rarity"]
    });

    const pickRandom = (itemLevel, allowedTypes) => {
      const pool = index.filter((entry) => {
        const entryLvl = entry.system?.level?.value ?? 0;
        const rarity = entry.system?.traits?.rarity ?? "common";
        return entryLvl === itemLevel && allowedTypes.includes(entry.type) && rarity === "common";
      });
      if (!pool.length) return null;
      return pool[Math.floor(Math.random() * pool.length)];
    };

    const permanentItems = [];
    for (const slotGroup of spec.permanent) {
      for (let i = 0; i < slotGroup.count; i++) {
        const doc = pickRandom(slotGroup.level, ["weapon", "armor", "equipment", "shield"]);
        permanentItems.push({
          uuid: doc ? doc.uuid : "",
          name: doc ? doc.name : `Level ${slotGroup.level} Permanent Item`,
          level: slotGroup.level,
          type: "permanent",
          distributed: false
        });
      }
    }

    const consumables = [];
    for (const slotGroup of spec.consumables) {
      for (let i = 0; i < slotGroup.count; i++) {
        const doc = pickRandom(slotGroup.level, ["consumable"]);
        consumables.push({
          uuid: doc ? doc.uuid : "",
          name: doc ? doc.name : `Level ${slotGroup.level} Consumable`,
          level: slotGroup.level,
          type: "consumable",
          distributed: false
        });
      }
    }

    const currencyMode = target.dataset.currencyMode || "gp";
    const currency = [];
    if (currencyMode === "treasure") {
      let remainingGp = spec.currencyGp;
      const treasures = index.filter((e) => e.type === "treasure" && (e.system?.price?.value?.gp ?? 0) > 0);
      while (remainingGp > 0) {
        const valid = treasures.filter((t) => t.system.price.value.gp <= remainingGp);
        if (!valid.length) {
          currency.push({
            uuid: "Compendium.pf2e.equipment-srd.Item.Quit999GoldCoins",
            name: `${remainingGp} gp (Gold Coins)`,
            level: 0,
            type: "treasure",
            distributed: false
          });
          break;
        }
        const chosen = valid[Math.floor(Math.random() * valid.length)];
        currency.push({
          uuid: chosen.uuid,
          name: `${chosen.name} (${chosen.system.price.value.gp} gp)`,
          level: chosen.system?.level?.value ?? 1,
          type: "treasure",
          distributed: false
        });
        remainingGp -= chosen.system.price.value.gp;
      }
    } else {
      currency.push({
        uuid: "Compendium.pf2e.equipment-srd.Item.Quit999GoldCoins",
        name: `${spec.currencyGp} gp`,
        level: 0,
        type: "treasure",
        distributed: false
      });
    }

    const flagData = await this.ensureFlagStructure();
    flagData[level] = {
      ...flagData[level],
      permanentItems,
      consumables,
      currency
    };

    await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
    await this.render();
  }

  static async #onDistributeItem(event, target) {
    const { category, index } = target.dataset;
    const flagData = await this.ensureFlagStructure();
    const list = flagData[this.activeLevel]?.[category];
    if (!list || !list[Number(index)]) return;

    list[Number(index)].distributed = true;
    await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
    await this.render();
  }

  static async #onAddBonusLoot(event, target) {
    const form = this.element.querySelector(".bonus-loot-form");
    const uuidOrGp = form?.querySelector("[name='bonusInput']")?.value?.trim();
    const customName = form?.querySelector("[name='bonusName']")?.value?.trim();
    const itemLevel = Number(form?.querySelector("[name='bonusLevel']")?.value) || this.activeLevel;
    if (!uuidOrGp && !customName) return;

    const flagData = await this.ensureFlagStructure();
    flagData[this.activeLevel].bonusLoot.push({
      uuid: uuidOrGp.startsWith("Compendium.") ? uuidOrGp : "",
      name: customName || uuidOrGp,
      level: itemLevel,
      type: "treasure",
      distributed: false
    });

    await this.actor.setFlag(MODULE_ID, FLAG_KEY, flagData);
    await this.render();
  }
}

Hooks.on("getActorSheetHeaderButtons", (sheet, buttons) => {
  if (sheet.actor?.type !== "party") return;
  buttons.unshift({
    label: "Party Treasure by Level",
    class: "sufias-loot-tracker-btn",
    icon: "fa-solid fa-coins",
    onclick: () => new PartyTreasureTrackerApp(sheet.actor).render(true)
  });
});

Hooks.on("getHeaderControlsApplicationV2", (app, controls) => {
  if (app.actor?.type !== "party") return;
  controls.push({
    icon: "fa-solid fa-coins",
    label: "Party Treasure by Level",
    action: "openSufiasLootTracker",
    onClick: () => new PartyTreasureTrackerApp(app.actor).render(true)
  });
});
