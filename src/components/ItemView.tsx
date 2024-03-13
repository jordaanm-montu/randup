import { forwardRef } from "react";
import { Item } from "../types"

interface ItemProps {
  item: Item
}

export const ItemView = forwardRef<HTMLLIElement, ItemProps>((props: ItemProps, ref) => {
  const { color, name } = props.item;
  return (
    <li style={{backgroundColor: color}} ref={ref}>
      {name}
    </li>
  );
});