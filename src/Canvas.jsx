import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import './canvas.css'
import { Canvas } from "fabric"

import Settings from './Settings'
import CanvasSettings from './canvasSettings'
import { handleObjectMoving, clearGuidelines } from './SnappingHelper'
import Toolbar from './Toolbar'
import { canvasDataJsonStore } from "./EmailStore";



const CanvasBoard = forwardRef(({ id, initialJson }, ref) => {
    const canvasId = id
    const canvasRef = useRef(null)
    const [canvas, setCanvas] = useState(null)
    const [guidelines, setGuidelines] = useState([])
    const [isCanvasReady, setIsCanvasReady] = useState(false)
    const canvasFromJson = canvasDataJsonStore(store=>store.canvasJson)


    useEffect(() => {
        if (canvasRef.current) {
            const initCanvas = new Canvas(canvasRef.current)
            initCanvas.backgroundColor = "#fff"
            setCanvas(initCanvas)

            initCanvas.renderAll()


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

    const isLoadedRef = useRef(false)

    useEffect(() => {
        if (!canvas) return
        if (!canvasFromJson) return
        if (isLoadedRef.current) return
        
        

        canvas.loadFromJSON(canvasFromJson).then(() => {
            canvas.backgroundColor = "#fff"
            canvas.renderAll()
            isLoadedRef.current = true
            setIsCanvasReady(true)
        })
    }, [canvasFromJson])
    useImperativeHandle(ref, () => ({
        getCanvas: () => canvas
    }))



    return (
        <div className='app'>
            <Toolbar canvas={canvas}/>
            <canvas className='canvas' ref={canvasRef} width={1100} height={650} />

            <Settings className='settings' canvas={canvas} isCanvasReady={isCanvasReady} onMouseDown={(e) => e.stopPropagation()} />
            {/* <CanvasSettings canvas={canvas} /> */}

        </div>
    )
})

export default CanvasBoard