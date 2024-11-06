import { useFieldArray, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { Preset } from "../../types";
import { paletteColors } from "../../data";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from "@mui/material";

interface PresetEditDialogProps {
  preset: Preset;
  onSave: (updated: Preset) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const randomColor = () => {
  const index = Math.floor(Math.random() * paletteColors.length);
  return paletteColors[index];
};

export const PresetEditDialog = (props: PresetEditDialogProps) => {
  const { isOpen, preset, onSave, onCancel } = props;
  const { control, register, handleSubmit } = useForm<Preset>({
    defaultValues: preset,
  });

  const { fields, remove, append } = useFieldArray({
    control,
    name: "items",
  });

  const appendItem = () => {
    const id = uuidv4();
    const color = randomColor();

    append({
      id,
      color,
      name: "New",
      linkedId: "",
    });
  };

  return (
    <Dialog open={isOpen}>
      <DialogTitle>Edit Preset</DialogTitle>
      <form onSubmit={handleSubmit(onSave)} className="flex col">
        <DialogContent>
          <div className="flex col">
            <div className="flex row form-row">
              <label htmlFor="name">Name</label>
              <input {...register("name")} />
            </div>
            <div className="flex row form-row">
              <label htmlFor="linkTemplate">Link Template</label>
              <input {...register("linkTemplate")} />
            </div>
          </div>
          <div className="flex col">
            <Divider>List Items</Divider>
            {fields.map((item, k) => {
              return (
                <div key={item.id} className="flex row center">
                  <input {...register(`items.${k}.name`)} placeholder="Name" />
                  <input
                    {...register(`items.${k}.color`)}
                    type="color"
                    list="palette"
                  />
                  <input
                    {...register(`items.${k}.linkedId`)}
                    placeholder="Link ID"
                  />
                  <Button
                    variant="outlined"
                    type="button"
                    onClick={() => remove(k)}
                  >
                    Remove
                  </Button>
                </div>
              );
            })}
            <Button variant="outlined" onClick={appendItem}>
              Add Item
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" type="submit">
            Save
          </Button>
          <Button variant="outlined" type="button" onClick={onCancel}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
