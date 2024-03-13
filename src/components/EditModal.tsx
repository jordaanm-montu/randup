import { useState } from "react";
import { Item } from "../types";
import { v4 as uuidv4 } from 'uuid';

interface EditModalProps {
  items: Item[];
  onSave: (updatedItems: Item[]) => void;
}

const randomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  return `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
}

export const EditModal = (props: EditModalProps) => {
  const { items, onSave} = props;
  const [updatedItems, setUpdatedItems] = useState(items);

  const addItem = () => {
    const newItem: Item = {
      id: uuidv4(),
      name: 'New',
      color: randomColor()
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

  return (
    <form method="dialog flex col">
      <div className="flex col">
        {updatedItems.map(x => <EditItem item={x} key={x.id} onChange={editItem} removeItem={removeItem}/>)}
        <div className="flex row">
          <button type="button" className="btn" onClick={addItem}>Add</button>
        </div>
      </div>
      <div className="actions flex row">
        <button onClick={() => onSave(updatedItems)}>save</button>
        <button>cancel</button>
      </div>
    </form>
  );
}


interface EditItemProps {
  item: Item;
  onChange: (item: Item) => void;
  removeItem: (id: string) => void;
};

const EditItem = (props: EditItemProps) => {
  const {item, removeItem } = props;
  const [value, setValue] = useState(item.name);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.currentTarget.value;
    setValue(val);
  }

  const onBlur = () => {
    props.onChange({
      ...item,
      name: value
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
    <input style={{flex: 1}} value={value} onChange={onChange} onBlur={onBlur}/>
    <input type="color" value={item.color} onChange={changeColor}/>
    <button type="button" onClick={() => removeItem(item.id)}>X</button>
  </div>
}