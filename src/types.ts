export interface Item {
  id: string;
  name: string;
  color: string;
  linkedId: string | undefined;
}

export interface Preset {
  name: string;
  linkTemplate: string;
  items: Item[];
}

export interface PresetSaveData {
  presets: Preset[];
  activePreset: string;
}
