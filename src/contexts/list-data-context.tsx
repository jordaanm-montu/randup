import { ReactNode, createContext, useEffect, useState } from "react";
import { Item } from "../types";
import _ from 'lodash';
import { HiddenItemProvider } from "./hidden-item.context";

interface ListDataContextValue {
  items: Item[],
  linkTemplate: string,
  shuffledItems: Item[],
  shuffle: () => Item[],
  unshuffle: () => Item[],
  updateItems: (items: Item[]) => void,
  updateLinkTemplate: (newValue: string) => void,
}

export const ListDataContext = createContext<ListDataContextValue>({
  items: [],
  linkTemplate: '',
  shuffledItems: [],
  shuffle: () => [],
  unshuffle: () => [],
  updateItems: () => {},
  updateLinkTemplate: () => {}
});


export const ListData = (props: { children: ReactNode }) => {
  const { children } = props;
  const [items, setItems] = useState<Item[]>([]);
  const [linkTemplate, setLinkTemplate] = useState<string>('');
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

  const updateLinkTemplate = (updatedLinkTemplate: string) => {
    setLinkTemplate(updatedLinkTemplate);
    localStorage.setItem('randupLinkTemplate', updatedLinkTemplate);
  }

  const value = {
    items, shuffledItems, shuffle, unshuffle, updateItems, linkTemplate, updateLinkTemplate
  };

  useEffect(() => {
    const saved = localStorage.getItem('randupItems');
    const savedItems = JSON.parse(saved || '[]');
    const savedLinkTemplate = localStorage.getItem('randupLinkTemplate');
    if(savedItems && Array.isArray(savedItems)) {
      setItems(savedItems);
      setLinkTemplate(savedLinkTemplate || '');
      setShuffledItems(savedItems);
      setHasLoaded(true);
    }    
  }, [])


  return (
    <ListDataContext.Provider value={value}>
      <HiddenItemProvider>
        { hasLoaded  ? children: null }
      </HiddenItemProvider>
    </ListDataContext.Provider>
  )
}