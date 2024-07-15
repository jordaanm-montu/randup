import { useContext, useState } from "react"
import { ListDataContext } from "../contexts/list-data-context"
import { ListView } from "./List";

import { HiddenItemContext } from "../contexts/hidden-item.context";
import { RandupLogo } from "./RandupLogo";
import { SettingsDialog } from "./SettingsDialog/SettingsDialog";

export const Page = () => {
  const listData = useContext(ListDataContext);
  const {items, shuffle, unshuffle} = listData;

  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const hiddenItemData = useContext(HiddenItemContext);
  const { hideItems, showAll } = hiddenItemData;

  const openDialog = () => {
    setIsSettingsModalOpen(true);
  }

  const hideAll = () => {
    hideItems(items.map(x => x.id));
  }

  return (
    <div className="page">
      <div className='flex center'>
        <RandupLogo/>
        {/* <img src={shuffleLogo} className="logo" alt="Shuffle logo" /> */}
        <h1>Rand Up</h1>
      </div>
      <div className="actions">
        <button className="btn action" onClick={() => shuffle()}>Shuffle</button>
        <button className="btn action" onClick={() => unshuffle()}>Un-Shuffle</button>
        <button className='btn action' onClick={openDialog}>Edit</button>
        <button className="btn action" onClick={hideAll}>Hide All</button>
        <button className="btn action" onClick={showAll}>Show All</button>
      </div>
      <div className="card-list">
        <ListView />
      </div>
      <SettingsDialog isOpen={isSettingsModalOpen} setIsOpen={setIsSettingsModalOpen} />
    </div>
  );
}