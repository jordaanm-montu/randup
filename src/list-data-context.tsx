import { ReactNode, createContext, useEffect, useState } from "react";
import { Item } from "./types";
import _ from 'lodash';

interface ListDataContextValue {
  items: Item[],
  shuffledItems: Item[],
  shuffle: () => Item[],
  unshuffle: () => Item[],
  updateItems: (items: Item[]) => void,
}

export const ListDataContext = createContext<ListDataContextValue>({
  items: [],
  shuffledItems: [],
  shuffle: () => [],
  unshuffle: () => [],
  updateItems: () => {}
});


export const ListData = (props: { children: ReactNode }) => {
  const { children } = props;
  const [items, setItems] = useState<Item[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [shuffledItems, setShuffledItems] = useState<Item[]>([]);
  
  const shuffle = () => {
    const shuffled = _.shuffle(items);
    setShuffledItems(shuffled);
    return shuffled;
  }

  const unshuffle = () => {
    setShuffledItems([...items]);
    return [...items];
  }

  const updateItems = (updatedItems: Item[]) => {
    setItems(updatedItems);
    setShuffledItems(updatedItems);
    localStorage.setItem('randupItems', JSON.stringify(updatedItems, null, 2));
  }

  const value = {
    items, shuffledItems, shuffle, unshuffle, updateItems
  };

  useEffect(() => {
    const saved = localStorage.getItem('randupItems');
    let savedItems = JSON.parse(saved || '[]');
    if(savedItems && Array.isArray(savedItems)) {
      setItems(savedItems);
      setShuffledItems(savedItems);
      setHasLoaded(true);
    }
  }, [])


  return (
    <ListDataContext.Provider value={value}>
      { hasLoaded  ? children: null }
    </ListDataContext.Provider>
  )
}