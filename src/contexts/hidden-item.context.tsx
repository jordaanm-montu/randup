import { ReactNode, createContext, useState } from "react"

interface HiddenItemContextValue {
  hiddenIds: string[],
  hideItems: (ids: string[]) => void,
  showItems: (ids: string[]) => void,
  showAll: () => void,
  isHidden: (id: string) => boolean,
}

export const HiddenItemContext = createContext<HiddenItemContextValue>({
  hiddenIds: [],
  hideItems: () => {},
  showItems: () => {},
  showAll: () => {},
  isHidden: () => false,
});

export const HiddenItemProvider = (props: {children: ReactNode }) => {
  const { children } = props;

  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const hideItems = (ids: string[]) => {
    const hidden = [
      ...(new Set([
        ...hiddenIds,
        ...ids
      ]))
    ];

    setHiddenIds(hidden);
  }

  const showItems = (ids: string[]) => {
    const hidden = hiddenIds.filter(x => !ids.includes(x));
    setHiddenIds(hidden);
  }

  const showAll = () => setHiddenIds([]);
  const isHidden = (id: string) => hiddenIds.includes(id);


  const value: HiddenItemContextValue = {
    hiddenIds,
    hideItems,
    showItems,
    showAll,
    isHidden
  }

  return (
    <HiddenItemContext.Provider value={value}>
      {children}
    </HiddenItemContext.Provider>
  )
}