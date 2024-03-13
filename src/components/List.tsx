import FlipMove from 'react-flip-move';
import { ItemView } from './ItemView';
import "./List.css";
import { useContext } from 'react';
import { ListDataContext } from '../list-data-context';

export const ListView = () => {
  const { shuffledItems } = useContext(ListDataContext);
  return <ul className="list">
    <FlipMove>
      {shuffledItems.map(x => <ItemView item={x} key={x.name}/>)}
    </FlipMove>
  </ul>
}