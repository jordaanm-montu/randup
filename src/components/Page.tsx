import { useContext, useRef } from "react"
import { ListDataContext } from "../list-data-context"
import { ListView } from "./List";
import { EditModal } from "./EditModal";

import shuffleLogo from '/shuffle.png';

export const Page = () => {
  const {items, shuffle, unshuffle, updateItems} = useContext(ListDataContext);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = () => {
    dialogRef.current?.showModal();
  }

  return (
    <>
      <div className='flex center'>
        <img src={shuffleLogo} className="logo" alt="Shuffle logo" />
        <h1>Rand Up</h1>
      </div>
      <div className="actions">
        <button className="btn action" onClick={() => shuffle()}>Shuffle</button>
        <button className="btn action" onClick={() => unshuffle()}>Un-Shuffle</button>
        <button className='btn action' onClick={openDialog}>Edit List</button>
      </div>
      <div className="card-list">
        <ListView />
      </div>
      <dialog className="modal centered" ref={dialogRef}>
        <form method="dialog">
          <EditModal items={items} onSave={updateItems}/>
        </form>
      </dialog>
    </>
  );
}