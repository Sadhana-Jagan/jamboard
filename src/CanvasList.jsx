import { IconButton } from "blocksin-system"
import { PlusIcon, PenIcon, BoxIcon } from "sebikostudio-icons"
import "./app.css"



export default function CanvasListComponent({handleAddCanvas,handleCanvasSelection,canvasList}){
    return (
        <div className="canvas-list">
        {canvasList.map(({ id }) => (
          <div className="canvas-selector-wrapper" onClick={()=>handleCanvasSelection(id)}>
            <p>{id}</p>
          </div>

        ))}
        <IconButton variant="ghost" size="medium" onClick={handleAddCanvas}>
          <PlusIcon />
        </IconButton>
      </div>
    )
}