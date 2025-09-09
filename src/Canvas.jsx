import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import './canvas.css'
import { Canvas, Circle, Rect, Triangle } from "fabric"

import Settings from './Settings'
import CanvasSettings from './canvasSettings'
import { handleObjectMoving, clearGuidelines } from './SnappingHelper'
import Toolbar from './Toolbar'
import { IconButton } from 'blocksin-system'
import { SquareIcon, CircleIcon, TriangleIcon } from 'sebikostudio-icons'



const CanvasBoard = forwardRef(({ id, initialJson }, ref) => {
    const canvasId = id
    const canvasRef = useRef(null)
    const [canvas, setCanvas] = useState(null)
    const [guidelines, setGuidelines] = useState([])
    

    useEffect(() => {
        if (canvasRef.current) {
            const initCanvas = new Canvas(canvasRef.current)
            initCanvas.backgroundColor = "#fff"
            setCanvas(initCanvas)

            // Only load JSON if it's present
            if (initialJson && Object.keys(initialJson).length > 0) {
                initCanvas.loadFromJSON(initialJson, () => {
                    initCanvas.renderAll()
                })
            } else {
                initCanvas.renderAll()
            }

            // Setup snapping
            initCanvas.on("object:moving", event => {
                handleObjectMoving(initCanvas, event.target, guidelines, setGuidelines)
            })

            initCanvas.on("object:modified", event => {
                clearGuidelines(initCanvas, guidelines, setGuidelines)
            })

            return () => {
                initCanvas.dispose()
            }
        }
    }, [])


    useImperativeHandle(ref, () => ({
        getCanvas: () => canvas
    }))

    

    return (
        <div className='app'>
            <Toolbar canvas={canvas}/>
            <canvas className='canvas' ref={canvasRef} width={1100} height={650}/>
        
            <Settings className='settings' canvas={canvas} onMouseDown={(e) => e.stopPropagation()} />
            {/* <CanvasSettings canvas={canvas} /> */}

        </div>
    )
})

export default CanvasBoard