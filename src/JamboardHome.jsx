import CanvasBoard from "./Canvas"
import { useEffect, useState, useRef } from "react"
import NavBar from "./NavBar"
import "./App.css"
import CanvasListComponent from "./CanvasList"



export default function JamboardHome() {
  const [canvasList, setCanvasList] = useState([{ id: 1, json: null },])
  const [canvasId, setCanvasId] = useState(1)
  const [selectedId, setSelectedId] = useState(1)
  const canvasBoardRef = useRef()

  useEffect(() => {
    if (canvasList.length === 0) {
      setCanvasList([{ id: 0, json: {} }])
      setCanvasId(0)
      setSelectedId(0)
    }
  }, [canvasList])

  const handleAddCanvas = () => {
    //updating existing canvas
    const currentCanvas = canvasBoardRef.current?.getCanvas()
    const currentCanvasId = canvasList.find(c => c.id === selectedId)
    if (currentCanvasId) {
      const updatedJson = currentCanvas.toJSON()
      setCanvasList(prev =>
        prev.map(canvas =>
          canvas.id === selectedId
            ? { ...canvas, json: updatedJson }
            : canvas
        )
      )
    }
    else {
      setCanvasList(prev => [...prev, { id: selectedId, json: currentCanvas.toJSON() }])
    }
    const newId = canvasId + 1
    setCanvasList(prev => [...prev, { id: newId, json: {} }])
    setCanvasId(newId)
    setSelectedId(newId)

  }

  const handleCanvasSelection = (id) => {
    const currentCanvas = canvasBoardRef.current?.getCanvas()
    const currentCanvasId = canvasList.find(c => c.id === id)
    if (currentCanvasId) {
      const updatedJson = currentCanvas.toJSON()
      setCanvasList(prev =>
        prev.map(canvas =>
          canvas.id === id
            ? { ...canvas, json: updatedJson }
            : canvas
        )
      )
    }
    setSelectedId(id)
  }

  return (
    <div className="main-page">
      <NavBar />
      <CanvasListComponent handleAddCanvas={handleAddCanvas} handleCanvasSelection={handleCanvasSelection} canvasList={canvasList} />
      {canvasList.map(({ id, json }) => (
        <div
          key={id}
          style={{ display: id === selectedId ? 'block' : 'none' }}
        >
          <CanvasBoard
            id={id}
            initialJson={json}
            ref={id === selectedId ? canvasBoardRef : null}
          />
        </div>
      ))}
      </div>
  )

}