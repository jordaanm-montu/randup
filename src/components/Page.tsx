import { useContext, useState } from "react";
import { ListDataContext } from "../contexts/list-data-context";
import { ListView } from "./List";

import {
  Box,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  styled,
} from "@mui/material";
import Button from "@mui/material/Button";
import { HiddenItemContext } from "../contexts/hidden-item.context";
import { PresetDataContext } from "../contexts/preset-data.context";
import { RandupLogo } from "./RandupLogo";
import { SettingsDialog } from "./SettingsDialog/SettingsDialog";

const ActionsRow = styled(Box)`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const CardList = styled(Box)`
  margin: 1rem;

  li {
    font-weight: 500;
    font-size: 1.5rem;
    cursor: pointer;

    .content {
      flex: 1;
      padding: 0.5rem;
      border-radius: 0.5rem;
      text-shadow: 1px 1px #222;
      transition: all 0.2s;

      &.hidden {
        background-color: #444 !important;
        color: #444;
        text-shadow: none;
      }
    }

    .link-container {
      padding: 0.5rem;
      border-radius: 0.5rem;
      text-shadow: 1px 1px #222;
    }

    .content.hidden + .link-container {
      visibility: hidden;
    }
  }
`;

export const Page = () => {
  const listData = useContext(ListDataContext);
  const presetData = useContext(PresetDataContext);
  const { items, shuffle, unshuffle } = listData;

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const hiddenItemData = useContext(HiddenItemContext);
  const { hideItems, showAll } = hiddenItemData;

  const presetNames = presetData.data.presets.map((preset) => preset.name);
  const activePreset = presetData.data.activePreset;

  const openDialog = () => {
    setIsSettingsModalOpen(true);
  };

  const hideAll = () => {
    hideItems(items.map((x) => x.id));
  };

  return (
    <div style={{ margin: "1rem" }}>
      <div className="flex center">
        <RandupLogo />
        <h1>Rand Up</h1>
      </div>
      <ActionsRow>
        <Button variant="contained" onClick={() => shuffle()}>
          Shuffle
        </Button>
        <Button variant="contained" onClick={() => unshuffle()}>
          Un-Shuffle
        </Button>
        <Button variant="contained" onClick={openDialog}>
          Edit
        </Button>
        <Button variant="contained" onClick={hideAll}>
          Hide All
        </Button>
        <Button variant="contained" onClick={showAll}>
          Show All
        </Button>
        <FormControl variant="outlined" size="medium" color="secondary">
          <Select
            variant="standard"
            color="primary"
            value={activePreset}
            onChange={(x) => presetData.setActivePreset(x.target.value)}
          >
            {presetNames.map((name) => (
              <MenuItem value={name}>
                <Typography>{name}</Typography>
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Change Preset</FormHelperText>
        </FormControl>
      </ActionsRow>
      <CardList>
        <ListView />
      </CardList>
      <SettingsDialog
        isOpen={isSettingsModalOpen}
        setIsOpen={setIsSettingsModalOpen}
      />
    </div>
  );
};
