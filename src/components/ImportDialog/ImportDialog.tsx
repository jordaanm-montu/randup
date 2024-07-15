import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import React, { useContext, useState } from 'react';
import { ListDataContext } from '../../contexts/list-data-context';
import { Item } from '../../types';

const ImportTextArea = styled('textarea')`
  width: 100%;
  min-width: 40vw;
  min-height: 50vh;
`

const loadFileAsync = (): Promise<File> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = () => {
      if(input.files && input.files.length) {
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
      if(content) {
        resolve(content.toString());
      } else {
        reject('File was empty');
      }
    };
    reader.onerror = () => {
      reject('Unable to read file');
    };

    reader.readAsText(file, 'utf-8');
  });
}

type ImportCallback = (settings: Partial<Settings>) => void;

const importSettingsFromFile = async (callback: ImportCallback) => {
  try {
    const file = await loadFileAsync();
    const text = await readFile(file);
    const json = JSON.parse(text);
    const settings = {
      items: json.items || undefined,
      linkTemplate: json.linkTemplate || undefined
    };
    callback(settings);
  } catch {
    console.error("Unable to load file");
    // TODO: TOAST NOTIFICATION?
  }
}


interface Settings {
  items: Item[],
  linkTemplate: string
}


interface ImportDialogProps {
  onClose: () => void;
  isOpen: boolean;
}

export const ImportDialog = (props: ImportDialogProps) => {
  const { isOpen, onClose } = props;

  const listData = useContext(ListDataContext);
  const { updateItems, updateLinkTemplate } = listData;

  const [text, setText] = useState('');

  const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
  };

  const importFromFile = async () => {
    try {
      await importSettingsFromFile(settings => {
        if(settings.items){
          updateItems(settings.items);
        }
        if(settings.linkTemplate) {
          updateLinkTemplate(settings.linkTemplate);
        }
      });
      onClose();
    } catch (e) {
      console.error(e);
    }
  }

  const importFromText = () => {
    try {
      const settings = JSON.parse(text);
      //TODO: Zod Validation
      if(settings.items){
        updateItems(settings.items);
      }
      if(settings.linkTemplate) {
        updateLinkTemplate(settings.linkTemplate);
      } 
    } catch(e) {
      console.error(e);
    }
  }

  return (
    <Dialog open={isOpen}>
      <DialogTitle>Import Settings</DialogTitle>
      <DialogContent>
        <ImportTextArea value={text} onChange={onTextChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={importFromText}>Import From Text</Button>
        <Button onClick={importFromFile}>Import from File</Button>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}