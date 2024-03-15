import { useContext, useRef, useState } from "react"
import { ListDataContext } from "../contexts/list-data-context"
import { ListView } from "./List";
import { EditModal } from "./EditModal";

import shuffleLogo from '/shuffle.png';
import { HiddenItemContext } from "../contexts/hidden-item.context";

export const Page = () => {
  const listData = useContext(ListDataContext);
  const {items, shuffle, unshuffle, updateItems} = listData;

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
        <img src={shuffleLogo} className="logo" alt="Shuffle logo" />
        <h1>Rand Up</h1>
      </div>
      <div className="actions">
        <button className="btn action" onClick={() => shuffle()}>Shuffle</button>
        <button className="btn action" onClick={() => unshuffle()}>Un-Shuffle</button>
        <button className='btn action' onClick={openDialog}>Edit List</button>
        <button className="btn action" onClick={hideAll}>Hide All</button>
        <button className="btn action" onClick={showAll}>Show All</button>
      </div>
      <div className="card-list">
        <ListView />
      </div>
      <dialog className="modal centered" ref={dialogRef}>
        <EditModal items={items} onSave={updateItems}/>
      </dialog>
    </div>
  );
}