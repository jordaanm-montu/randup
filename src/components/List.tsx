import FlipMove from 'react-flip-move';
import { styled } from '@mui/material';
import { ItemView } from './ItemView';
import { useContext } from 'react';
import { ListDataContext } from '../contexts/list-data-context';
import { HiddenItemContext } from '../contexts/hidden-item.context';

const StyledList = styled('ul')`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0;
  padding: 0;
  & > div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 0;
    padding: 0;
  }
`

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

  return <StyledList>
    <FlipMove>
      {shuffledItems.map(x => <ItemView 
        key={x.name}
        linkTemplate={linkTemplate}
        item={x}
        isHidden={isHidden(x.id)}
        onClick={() => toggleItem(x.id)}
      />)}
    </FlipMove>
  </StyledList>
}