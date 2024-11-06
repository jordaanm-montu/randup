import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useContext } from "react";
import { PresetDataContext } from "../../contexts/preset-data.context";

const ExportTextArea = styled("textarea")`
  width: 100%;
  min-width: 40vw;
  min-height: 50vh;
`;

interface ExportDialogProps {
  onClose: () => void;
  isOpen: boolean;
}

const JsonToFile = (json: object, filename: string) => {
  const text = JSON.stringify(json, null, 2);
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const ExportDialog = (props: ExportDialogProps) => {
  const { isOpen, onClose } = props;
  const presetDataContext = useContext(PresetDataContext);
  const { data } = presetDataContext;

  const json = JSON.stringify(data, null, 2);

  const exportToFile = () => {
    JsonToFile(data, "randup");
  };

  return (
    <Dialog open={isOpen}>
      <DialogTitle>Export Settings</DialogTitle>
      <DialogContent>
        <ExportTextArea readOnly value={json} />
      </DialogContent>
      <DialogActions>
        <Button onClick={exportToFile}>Export to File</Button>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
