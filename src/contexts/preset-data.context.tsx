import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { Preset, PresetSaveData } from "../types";
import {
  DEFAULT_PRESET_DATA,
  loadPresetsFromStorage,
  savePresets,
} from "../util/storage";

interface IPresetContext {
  data: PresetSaveData;
  getActivePreset: () => Preset;
  setActivePreset: (name: string) => void;
  updatePreset: (presetName: string, updatedPreset: Preset) => void;
  setData: (data: PresetSaveData) => void;
  addPreset: (presetName: string) => void;
  removePreset: (presetName: string) => void;
  renamePreset: (presetName: string, newName: string) => void;
}
const noOp = () => {};

export const PresetDataContext = createContext<IPresetContext>({
  data: DEFAULT_PRESET_DATA,
  getActivePreset: () => DEFAULT_PRESET_DATA.presets[0],
  setActivePreset: noOp,
  updatePreset: noOp,
  setData: noOp,
  addPreset: noOp,
  removePreset: noOp,
  renamePreset: noOp,
});

export const PresetData = (props: PropsWithChildren) => {
  const { children } = props;

  const [presetData, setPresetData] = useState<PresetSaveData>();

  const setAndSavePresetData = (updatedPresetData: PresetSaveData) => {
    console.trace("setAndSave", updatedPresetData);
    setPresetData(updatedPresetData);
    savePresets(updatedPresetData);
  };

  const setActivePreset = (name: string) => {
    if (!presetData?.presets.some((preset) => preset.name === name)) {
      return;
    }

    const updatedData: PresetSaveData = {
      ...presetData,
      activePreset: name,
    };

    setAndSavePresetData(updatedData);
  };

  const updatePreset = (presetName: string, updatedPreset: Preset) => {
    if (!presetData?.presets.some((preset) => preset.name === presetName)) {
      return;
    }

    const updatedPresets: Preset[] = presetData.presets.map((preset) => {
      if (preset.name !== presetName) {
        return { ...preset };
      } else {
        return updatedPreset;
      }
    });

    setAndSavePresetData({
      ...presetData,
      presets: updatedPresets,
    });
  };

  const addPreset = (presetName: string) => {
    if (!presetData) return;

    const newPreset = {
      name: presetName,
      items: [],
      linkTemplate: "",
    };

    const updatedPresetData: PresetSaveData = {
      ...presetData,
      presets: [...presetData.presets, newPreset],
    };

    setAndSavePresetData(updatedPresetData);
  };

  const removePreset = (presetName: string) => {
    if (!presetData) return;
    const updatedPresetData = {
      ...presetData,
      presets: presetData.presets.filter((x) => x.name !== presetName),
    };

    setAndSavePresetData(updatedPresetData);
  };

  const renamePreset = (presetName: string, newName: string) => {
    if (!presetData?.presets.some((preset) => preset.name === presetName)) {
      return;
    }

    // If we're renaming the currently active preset, also reset the activePreset field
    const activePreset =
      presetName === presetData.activePreset
        ? newName
        : presetData.activePreset;
    const presets = presetData.presets.map((preset) => {
      if (preset.name !== presetName) {
        return preset;
      } else {
        return {
          ...preset,
          name: newName,
        };
      }
    });
    const updatedPresetData: PresetSaveData = {
      activePreset,
      presets,
    };

    setAndSavePresetData(updatedPresetData);
  };

  const setData = (newPresetData: PresetSaveData) => {
    setAndSavePresetData(newPresetData);
  };

  const getActivePreset = (): Preset => {
    return presetData?.presets.find((p) => p.name === presetData.activePreset)!;
  };

  // On first mount, load Preset data from storage
  useEffect(() => {
    const saved = loadPresetsFromStorage();
    setPresetData(saved);
  }, []);

  // Block until loaded from storage
  if (!presetData) {
    //TODO: Better loading state?
    return "Loading...";
  }

  const value: IPresetContext = {
    data: presetData,
    setActivePreset,
    updatePreset,
    setData,
    addPreset,
    removePreset,
    renamePreset,
    getActivePreset,
  };

  return (
    <PresetDataContext.Provider value={value}>
      {children}
    </PresetDataContext.Provider>
  );
};
