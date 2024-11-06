import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Item } from "../types";
import _ from "lodash";
import { HiddenItemProvider } from "./hidden-item.context";
import { PresetDataContext } from "./preset-data.context";

interface ListDataContextValue {
  items: Item[];
  linkTemplate: string;
  shuffledItems: Item[];
  shuffle: () => Item[];
  unshuffle: () => Item[];
}

export const ListDataContext = createContext<ListDataContextValue>({
  items: [],
  linkTemplate: "",
  shuffledItems: [],
  shuffle: () => [],
  unshuffle: () => [],
});

export const ListData = (props: { children: ReactNode }) => {
  const { children } = props;
  const presetContext = useContext(PresetDataContext);

  const [items, setItems] = useState<Item[]>([]);
  const [linkTemplate, setLinkTemplate] = useState<string>("");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [shuffledItems, setShuffledItems] = useState<Item[]>([]);

  const shuffle = () => {
    const shuffled = _.shuffle(items);
    setShuffledItems(shuffled);
    return shuffled;
  };

  const unshuffle = () => {
    setShuffledItems([...items]);
    return [...items];
  };

  const value = {
    items,
    shuffledItems,
    shuffle,
    unshuffle,
    linkTemplate,
  };

  useEffect(() => {
    const activeList = presetContext.getActivePreset();
    if (activeList) {
      setItems(activeList.items);
      setLinkTemplate(activeList.linkTemplate);
      setShuffledItems(activeList.items);
      setHasLoaded(true);
    }
  }, [presetContext.data.activePreset]);

  return (
    <ListDataContext.Provider value={value}>
      <HiddenItemProvider>{hasLoaded ? children : null}</HiddenItemProvider>
    </ListDataContext.Provider>
  );
};
