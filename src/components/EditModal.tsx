import { useState } from "react";
import { Item } from "../types";
import { v4 as uuidv4 } from 'uuid';
import { paletteColors } from "../data";

interface EditModalProps {
  items: Item[];
  linkTemplate: string;
  onSave: (updatedItems: Item[], updatedLinkTemplate: string) => void;
}

const randomColor = () => {
  const index = Math.floor(Math.random() * paletteColors.length);
  return paletteColors[index];
}

export const EditModal = (props: EditModalProps) => {
  const { items, linkTemplate, onSave} = props;
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

  return (
    <form method="dialog" className="flex col">
      <div className="flex col">
        {updatedItems.map(x => <EditItem 
          item={x} key={x.id}
          onChange={editItem}
          removeItem={removeItem}
        />)}
        <div className="flex row">
          <button type="button" className="btn action" onClick={addItem}>+</button>
        </div>
      </div>
      <div className="flex row center">
        <label htmlFor="linkTemplate">Link Template:</label>
        <input style={{flex: 1}} name="linkTemplate" type="text" value={updatedLinkTemplate} onChange={onLinkTemplateChange} />
      </div>
      <div className="actions flex row">
        <button onClick={() => onSave(updatedItems, updatedLinkTemplate)} className="btn action">save</button>
        <button className="btn action">cancel</button>
      </div>
      <datalist id="palette">
        {paletteColors.map(x => <option key={x} value={x} />)}
      </datalist>
    </form>
  );
}


interface EditItemProps {
  item: Item;
  onChange: (item: Item) => void;
  removeItem: (id: string) => void;
}

const EditItem = (props: EditItemProps) => {
  const {item, removeItem } = props;
  const [linkedId, setLinkedId] = useState(item.linkedId);
  const [name, setName] = useState(item.name);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    setName(val);
  }

  const onChangeLinkedId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    setLinkedId(val);
  }

  const onBlur = () => {
    props.onChange({
      ...item,
      name,
      linkedId
    });
  }

  const changeColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    props.onChange({
      ...item,
      color: val
    });
  }

  return <div className="flex row">
    <input style={{flex: 1}} value={name} onChange={onChange} onBlur={onBlur} placeholder="Name"/>
    <input type="color" value={item.color} onChange={changeColor} list="palette" />
    <input type="text" value={linkedId} onChange={onChangeLinkedId} onBlur={onBlur} placeholder="Link ID"/>
    <button type="button" className="btn action" onClick={() => removeItem(item.id)}>✕</button>
  </div>
}