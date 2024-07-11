import FlipMove from 'react-flip-move';
import { ItemView } from './ItemView';
import "./List.css";
import { useContext } from 'react';
import { ListDataContext } from '../contexts/list-data-context';
import { HiddenItemContext } from '../contexts/hidden-item.context';

export const ListView = () => {
  const { shuffledItems, linkTemplate } = useContext(ListDataContext);
  const { isHidden, showItems, hideItems } = useContext(HiddenItemContext);

  const toggleItem = (id: string) => {
    if(isHidden(id)) {
      showItems([id]);
    } else {
      hideItems([id]);
    }
  }

  return <ul className="list">
    <FlipMove>
      {shuffledItems.map(x => <ItemView 
        key={x.name}
        linkTemplate={linkTemplate}
        item={x}
        isHidden={isHidden(x.id)}
        onClick={() => toggleItem(x.id)}
      />)}
    </FlipMove>
  </ul>
}