import { PresetSaveData } from "../types";

const PRESET_STORAGE_KEY = "randupPresets";
const ITEMS_STORAGE_KEY = "randupItems";
const LINK_TEMPLATE_STORAGE_KEY = "randupLinkTemplate";

export const DEFAULT_PRESET_DATA: PresetSaveData = {
  presets: [
    {
      name: "Default",
      items: [],
      linkTemplate: "",
    },
  ],
  activePreset: "Default",
};

/**
 * Fallback method that loads the older version's stored data, and remaps it to the newer format.
 * @returns PresetSaveData
 */
export const loadPresetsFromItemStorage = (): PresetSaveData => {
  try {
    const saved = localStorage.getItem(ITEMS_STORAGE_KEY);
    const savedItems = JSON.parse(saved || "[]");
    // TODO: Use Zod to validate JSON
    const savedLinkTemplate =
      localStorage.getItem(LINK_TEMPLATE_STORAGE_KEY) || "";
    return {
      presets: [
        {
          name: "Default",
          items: savedItems,
          linkTemplate: savedLinkTemplate,
        },
      ],
      activePreset: "Default",
    };
  } catch {
    //TODO: Improved error handling
    return DEFAULT_PRESET_DATA;
  }
};

/**
 * Loads saved data from localStorage
 * @returns
 */
export const loadPresetsFromStorage = (): PresetSaveData => {
  // Load from Local Storage
  const savedJson = localStorage.getItem(PRESET_STORAGE_KEY);

  if (savedJson) {
    try {
      const data = JSON.parse(savedJson);
      //TODO: Use Zod to validate JSON.
      return data;
    } catch {
      //TODO: Improved error handling
      return DEFAULT_PRESET_DATA;
    }
  }

  // If the full preset data isn't in storage, fallback to the older storage keys
  return loadPresetsFromItemStorage();
};

export const savePresets = (data: PresetSaveData) => {
  localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(data));
};
