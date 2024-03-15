import { forwardRef } from "react";
import { Item } from "../types"

interface ItemProps {
  item: Item,
  isHidden: boolean,
  onClick: () => void
}

export const ItemView = forwardRef<HTMLLIElement, ItemProps>((props: ItemProps, ref) => {
  const { item, isHidden, onClick } = props;
  const { color, name } = item;
  return (
    <li ref={ref} role="button">
      <div 
        className={`content ${isHidden ? 'hidden' : ''}`} 
        style={{backgroundColor: color}}
        onClick={onClick}
      >
        {name}
      </div>
    </li>
  );
});