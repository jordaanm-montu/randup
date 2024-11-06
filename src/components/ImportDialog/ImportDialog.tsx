import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import React, { useContext, useState } from "react";
import { PresetDataContext } from "../../contexts/preset-data.context";

const ImportTextArea = styled("textarea")`
  width: 100%;
  min-width: 40vw;
  min-height: 50vh;
`;

const loadFileAsync = (): Promise<File> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = () => {
      if (input.files && input.files.length) {
        const files = Array.from(input.files);
        resolve(files[0]);
      } else {
        reject();
      }
    };

    input.click();
  });
};

const readFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result;
      if (content) {
        resolve(content.toString());
      } else {
        reject("File was empty");
      }
    };
    reader.onerror = () => {
      reject("Unable to read file");
    };

    reader.readAsText(file, "utf-8");
  });
};

interface ImportDialogProps {
  onClose: () => void;
  isOpen: boolean;
}

export const ImportDialog = (props: ImportDialogProps) => {
  const { isOpen, onClose } = props;

  const presetData = useContext(PresetDataContext);
  const { setData } = presetData;

  const [text, setText] = useState("");

  const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
  };

  const loadFromFile = async () => {
    try {
      const file = await loadFileAsync();
      const text = await readFile(file);
      setText(text);
    } catch (e) {
      console.error(e);
    }
  };

  const importFromText = () => {
    try {
      const settings = JSON.parse(text);

      //TODO: Zod Validation
      const isValid =
        typeof settings.activePreset !== "undefined" &&
        typeof settings.presets !== "undefined";
      if (!isValid) {
        return;
      }

      setData(settings);
      onClose();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogTitle>Import Settings</DialogTitle>
      <DialogContent>
        <ImportTextArea value={text} onChange={onTextChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={loadFromFile}>Load from File</Button>
        <Button onClick={importFromText}>Import From Text</Button>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
