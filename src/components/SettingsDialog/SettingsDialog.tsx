import { v4 as uuidv4 } from 'uuid';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
// import CloseIcon from '@mui/icons-material/Close';
import { useContext, useState } from 'react';
import { ListDataContext } from '../../contexts/list-data-context';
import { Item } from '../../types';
import { paletteColors } from '../../data';
import { EditItem } from './EditItem';
import { ExportDialog } from '../ExportDialog/ExportDialog';

const randomColor = () => {
  const index = Math.floor(Math.random() * paletteColors.length);
  return paletteColors[index];
}

interface SettingsDialogProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const SettingsDialog = (props: SettingsDialogProps) => {
  const { isOpen, setIsOpen } = props;

  const [exportIsOpen, setExportIsOpen] = useState(false);

  const listData = useContext(ListDataContext);
  const {items, linkTemplate, updateItems, updateLinkTemplate} = listData;

  const [updatedItems, setUpdatedItems] = useState(items);
  const [updatedLinkTemplate, setUpdatedLinkTemplate] = useState<string>(linkTemplate);

  const addItem = () => {
    const newItem: Item = {
      id: uuidv4(),
      name: 'New',
      color: randomColor(),
      linkedId: ''
    }

    setUpdatedItems([
      ...updatedItems,
      newItem
    ]);
  }

  const removeItem = (id: string) => {
    setUpdatedItems(updatedItems.filter(x => x.id !== id));
  }

  const editItem = (item: Item) => {
    const updated = updatedItems.map(x => x.id === item.id ? item : x);
    setUpdatedItems(updated);
  }

  const onLinkTemplateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedLinkTemplate(e.target.value || '');
  }

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSave = () => {
    updateItems(updatedItems);
    updateLinkTemplate(updatedLinkTemplate);
    setIsOpen(false);
  };

  const openExportDialog = () => { setExportIsOpen(true); };

  return (
    <>
      <Dialog open={isOpen}>
        <DialogTitle>
            Edit Settings
          </DialogTitle>
          <DialogContent dividers>
            <div className="flex col">
              {updatedItems.map(x => <EditItem 
                item={x} key={x.id}
                onChange={editItem}
                removeItem={removeItem}
              />)}
              <div className="flex row">
                <Button variant='contained' onClick={addItem}>Add Item</Button>
              </div>
              <div className="flex row center">
                <label htmlFor="linkTemplate">Link Template:</label>
                <input style={{flex: 1}} name="linkTemplate" type="text" value={updatedLinkTemplate} onChange={onLinkTemplateChange} />
              </div>
            </div>
            <datalist id="palette">
              {paletteColors.map(x => <option key={x} value={x} />)}
            </datalist>
          </DialogContent>
          <DialogActions>
            <Button onClick={openExportDialog}>
              Export
            </Button>
            <Button variant='contained' autoFocus onClick={handleSave}>
              Save
            </Button>
            <Button variant='contained' onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
      </Dialog>
      <ExportDialog isOpen={exportIsOpen} onClose={() => setExportIsOpen(false)} />
    </>
  )
}