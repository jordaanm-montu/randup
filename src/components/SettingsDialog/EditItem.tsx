import { useState } from "react";
import { Item } from "../../types";
import Button from '@mui/material/Button';
import { styled, Box } from '@mui/material';

const ItemEditRow = styled(Box)`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  &>* {
   height: 3rem;
   padding: 0.25rem;
  }
`;

interface EditItemProps {
  item: Item;
  onChange: (item: Item) => void;
  removeItem: (id: string) => void;
}

export const EditItem = (props: EditItemProps) => {
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

  return <ItemEditRow>
      <input style={{flex: 1}} value={name} onChange={onChange} onBlur={onBlur} placeholder="Name"/>
      <input type="color" value={item.color} onChange={changeColor} list="palette" />
      <input type="text" value={linkedId} onChange={onChangeLinkedId} onBlur={onBlur} placeholder="Link ID"/>
      <Button type="button" variant="contained" onClick={() => removeItem(item.id)}>Remove</Button>
  </ItemEditRow>
}