import { useContext, useRef } from "react"
import { ListDataContext } from "../contexts/list-data-context"
import { ListView } from "./List";
import { EditModal } from "./EditModal";

import { HiddenItemContext } from "../contexts/hidden-item.context";
import { Item } from "../types";
import { RandupLogo } from "./RandupLogo";

export const Page = () => {
  const listData = useContext(ListDataContext);
  const {items, linkTemplate, shuffle, unshuffle, updateItems, updateLinkTemplate} = listData;

  const updateSettings = (updatedItems: Item[], updatedLinkTemplate: string) => {
    updateItems(updatedItems);
    updateLinkTemplate(updatedLinkTemplate);
  }

  const hiddenItemData = useContext(HiddenItemContext);
  const { hideItems, showAll } = hiddenItemData;

  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = () => {
    dialogRef.current?.showModal();
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
      <dialog className="modal centered" ref={dialogRef}>
        <EditModal items={items} linkTemplate={linkTemplate} onSave={updateSettings}/>
      </dialog>
    </div>
  );
}