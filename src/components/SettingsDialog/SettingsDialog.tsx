import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Checkbox } from "@mui/material";
import { useContext, useState } from "react";
import { PresetDataContext } from "../../contexts/preset-data.context";
import { paletteColors } from "../../data";
import { Preset } from "../../types";
import { ExportDialog } from "../ExportDialog/ExportDialog";
import { ImportDialog } from "../ImportDialog/ImportDialog";
import { PresetEditDialog } from "../PresetEditDialog/PresetEditDialog";

interface SettingsDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SettingsDialog = (props: SettingsDialogProps) => {
  const { isOpen, setIsOpen } = props;

  const [openListDialog, setOpenListDialog] = useState<string>("");

  const [exportIsOpen, setExportIsOpen] = useState(false);
  const [importIsOpen, setImportIsOpen] = useState(false);

  const presetDataContext = useContext(PresetDataContext);

  const removePreset = (name: string) => {
    presetDataContext.removePreset(name);
  };

  const addNewPreset = () => {
    presetDataContext.addPreset("New Preset");
  };

  const onImportClosed = () => {
    setImportIsOpen(false);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const openExportDialog = () => {
    setExportIsOpen(true);
  };
  const openImportDialog = () => {
    setImportIsOpen(true);
  };

  const setActivePreset = (presetName: string) => {
    presetDataContext.setActivePreset(presetName);
  };
  const closeListDialog = () => setOpenListDialog("");

  return (
    <>
      <Dialog open={isOpen}>
        <DialogTitle>Edit Settings</DialogTitle>
        <DialogContent dividers>
          <div className="flex col">
            <div className="flex col">
              {presetDataContext.data.presets.map((preset) => {
                const savePreset = (updatedPreset: Preset) => {
                  closeListDialog();
                  presetDataContext.updatePreset(preset.name, updatedPreset);
                };
                return (
                  <div key={preset.name} className="flex row center">
                    <Checkbox
                      checked={
                        preset.name === presetDataContext.data.activePreset
                      }
                      onChange={() => setActivePreset(preset.name)}
                    ></Checkbox>
                    <span>{preset.name}</span>
                    <button onClick={() => setOpenListDialog(preset.name)}>
                      Edit
                    </button>
                    <button onClick={() => removePreset(preset.name)}>
                      Remove
                    </button>
                    <PresetEditDialog
                      isOpen={openListDialog === preset.name}
                      onSave={savePreset}
                      onCancel={closeListDialog}
                      preset={preset}
                    />
                  </div>
                );
              })}
            </div>
            <Button onClick={addNewPreset}>Add Preset</Button>
          </div>
          <datalist id="palette">
            {paletteColors.map((x) => (
              <option key={x} value={x} />
            ))}
          </datalist>
        </DialogContent>
        <DialogActions>
          <Button onClick={openExportDialog}>Export</Button>
          <Button onClick={openImportDialog}>Import</Button>
          <Button variant="contained" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <ExportDialog
        isOpen={exportIsOpen}
        onClose={() => setExportIsOpen(false)}
      />
      <ImportDialog isOpen={importIsOpen} onClose={onImportClosed} />
    </>
  );
};
