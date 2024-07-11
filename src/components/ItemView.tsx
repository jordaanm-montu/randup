import { forwardRef } from "react";
import { Item } from "../types"

interface ItemProps {
  item: Item,
  linkTemplate: string,
  isHidden: boolean,
  onClick: () => void
}

export const ItemView = forwardRef<HTMLLIElement, ItemProps>((props: ItemProps, ref) => {
  const { item, isHidden, onClick, linkTemplate } = props;
  const { color, name, linkedId } = item;
  const shouldShowLink = Boolean(linkedId && linkTemplate);
  const linkAddress = (linkTemplate || '').replace('%s', linkedId || '');


  return (
    <li ref={ref} role="button" className="flex row">
      <div 
        className={`content ${isHidden ? 'hidden' : ''}`} 
        style={{backgroundColor: color}}
        onClick={onClick}
      >
        {name}
      </div>
      {shouldShowLink && <div style={{backgroundColor: color}} className="link-container"><a href={linkAddress} target="_linked">View</a></div>}
    </li>
  );
});