import FlipMove from 'react-flip-move';
import { ItemView } from './ItemView';
import "./List.css";
import { useContext } from 'react';
import { ListDataContext } from '../list-data-context';

interface ListViewProps {
}

export const ListView = (props: ListViewProps) => {
  const { shuffledItems } = useContext(ListDataContext);
  return <ul className="list">
    <FlipMove>
      {shuffledItems.map(x => <ItemView item={x} key={x.name}/>)}
    </FlipMove>
  </ul>
}