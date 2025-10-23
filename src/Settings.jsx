import { useEffect, useRef, useState, useMemo } from "react"
import { Input } from "blocksin-system"
import "./settings.css"
import { RiUnderline, RiBold, RiStrikethrough, RiItalic } from 'react-icons/ri';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { util } from "fabric";


const wsUrl = import.meta.env.VITE_WEBSOCKET_URL;


export const getImageUrl = (url64bit)=>{

}

export default function Settings({ canvas }) {
    const wsRef = useRef(null)

    const [selectedObject, setSelectedObject] = useState(null)
    const [color, setColor] = useState("#000000")
    //for rectangle and triangle
    const [width, setWidth] = useState("")
    const [height, setHeight] = useState("")
    //for circle
    const [radius, setRadius] = useState("")
    //for line
    const [length, setLength] = useState("")
    const [panelPosition, setPanelPosition] = useState({ top: 0, left: 0, display: "none" })
    //for textbox
    const [font, setFont] = useState("Arial")
    const [fontSize, setFontSize] = useState(40)
    const [bold, setBold] = useState(false)
    const [underline, setUnderline] = useState(false)
    const [italics, setItalics] = useState(false)
    const [strike, setStrike] = useState(false)



    const updatePanelPosition = (object) => {
        const zoom = canvas.getZoom();
        const canvasRect = canvas.getElement().getBoundingClientRect();
        const objRect = object.getBoundingRect(true);

        setPanelPosition({
            top: canvasRect.top + objRect.top * zoom - 50, // 50px above
            left: canvasRect.left + (objRect.left + objRect.width) * zoom + 25, // right side
            display: "block",
            position: "absolute"
        });
    }
    const handleScaling = (object) => {
        if (object && object === selectedObject) {
            if (object.type === "rect" || object.type === "triangle") {
                setWidth(Math.round(object.width * object.scaleX));
                setHeight(Math.round(object.height * object.scaleY));
            }
            else if (object.type === "circle") {
                setRadius(Math.round(object.radius * object.scaleX));
            }
        }
    }

    useEffect(() => {
        if (!canvas) {
            return
        }

        if (canvas) {
            canvas.on("selection:created", (event) => {
                handleObjectSelection(event.selected[0])
            })
            canvas.on("selection:updated", (event) => {
                handleObjectSelection(event.selected[0])
            })
            canvas.on("selection:cleared", () => {
                setSelectedObject(null)
                clearSettings()
                setPanelPosition((pos) => ({ ...pos, display: "none" }))
            })
            canvas.on("selection:modified", (event) => {
                handleObjectSelection(event.selected[0])
            })
            // canvas.on("selection:scaling", (event) => {
            //     handleObjectSelection(event.target)

            // })
            canvas.on("object:moving", (e) => {
                if (e.target === selectedObject) {
                    updatePanelPosition(e.target)
                    // sendMessageThrottled()
                }
            })




        }
    }, [canvas])

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Delete" || e.key === "Backspace") {
                const activeObjects = canvas.getActiveObjects();
                if (activeObjects.length > 0) {
                    activeObjects.forEach((obj) => canvas.remove(obj));
                    canvas.discardActiveObject();
                    canvas.requestRenderAll();
                }
            }
        }
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [canvas])

    useEffect(() => {
        if (!canvas) return
        const handleMove = (e) => {
            if (e.target === selectedObject) {
                updatePanelPosition(e.target)
            }
        }
        canvas.on("object:added", () => {
            sendMessage()
            // else return

        })
        canvas.on("object:removed", () => {
            // sendMessage()
        })
        canvas.on("object:modified", () => {
            sendMessage()
        })
        canvas.on("object:moving", (e) => {
            handleMove(e)
            // sendMessageThrottled()
        })
        canvas.on("object:scaling", (e) => {
            handleScaling(e.target)
            // sendMessage()
            // sendMessageThrottled()
        })
        canvas.on("object:rotating", () => {
            // sendMessageThrottled()
        })
        return () => {
            canvas.off("object:added");
            canvas.off("object:removed");
            canvas.off("object:modified");
            canvas.off("object:moving", handleMove);
            canvas.off("object:scaling");
            canvas.off("object:rotating");
        }

    }, [canvas, selectedObject])


    useEffect(() => {
        // if(!canvas){
        //     return 
        // }
        // console.log(wsUrl)
        const ws = new WebSocket(wsUrl)
        //connection open
        ws.onopen = () => {
            console.log("connection opened")
        }

        wsRef.current = ws;
        // if (!wsRef.current) return;  
        if (!canvas) return;

        //server pushing data to client 

        return () => {
            //connection close
            ws.close();
        };
    }, [])

    useEffect(() => {
        wsRef.current.onmessage = (event) => {
            let dataParsed
            // console.log("inside onmessage");
            try {
                dataParsed = JSON.parse(event.data)
            } catch (err) {
                console.log("error parsing json")
                return
            }
            const canvasDataJson = dataParsed.data.message
            console.log(canvasDataJson)

            if (canvas) {
                // console.log("entered the condition")
                canvas.off("object:added")
                // canvas.off("object:modified")
                // canvas.off("object:scaling")


                canvas.loadFromJSON(canvasDataJson).then(() => { canvas.renderAll() })
                // canvas.loadFromJSON(canvasDataJson, canvas.renderAll.bind(canvas));


                // canvas.loadFromJSON(canvasDataJson, () => {
                //     canvas.renderAll();
                //     console.log("✅ All objects (including images) loaded and rendered");
                // });
                canvas.on("object:added");
                // canvas.on("object:modified");
                // canvas.on("object:scaling")
                return
            }

        }
    }, [canvas])

    //receive objects/broadcasted msg
    // useEffect(() => {

    // }, [])


    // const canvasRef = useRef(null);
    // useEffect(() => {
    //     // store the latest canvas in a ref so the handler can use it
    //     canvasRef.current = canvas;
    // }, [canvas]);
    // const remoteSendRef = useRef(false);

    // useEffect(() => {
    //     // create socket once
    //     const ws = new WebSocket(wsUrl);
    //     wsRef.current = ws;

    //     ws.onopen = () => console.log("connection opened");

    //     ws.onmessage = (event) => {
    //         const c = canvasRef.current;   // always the latest canvas
    //         if (!c) return;

    //         let dataParsed;
    //         try {
    //             dataParsed = JSON.parse(event.data);
    //         } catch {
    //             console.log("error parsing json");
    //             return;
    //         }

    //         remoteSendRef.current = true;
    //         c.clear();
    //         c.loadFromJSON(dataParsed.data.message, () => {
    //             remoteSendRef.current = false;
    //             c.renderAll();
    //         });
    //     };

    //     return () => ws.close();
    // }, [])









    const sendMessage = () => {
        const canvasJson = canvas.toJSON()
        console.log("sending message")
        // console.log(canvasJson)
        const jsonToSend = { "action": "sendMessage", "message": canvasJson }
        wsRef.current?.send(JSON.stringify(jsonToSend))
        // console.log(jsonToSend)
        console.log("sent")
    }

    // const sendMessageThrottled = useMemo(
    //     () => throttle(() => sendMessage(), 200), // max every 200ms
    //     [canvas]
    // );



    const handleObjectSelection = (object) => {
        if (!object) {
            return
        }
        setSelectedObject(object)
        updatePanelPosition(object)
        if (object.type === "rect" && object.lockScalingY) {
            setLength(Math.round(object.width * object.scaleX))
            setColor(object.fill)
            setRadius("")
        }
        if (object.type === "rect") {
            setWidth(Math.round(object.width * object.scaleX))
            setHeight(Math.round(object.height * object.scaleY))
            setColor(object.fill)
            setRadius("")
        }
        else if (object.type === "circle") {
            setRadius(Math.round(object.radius * object.scaleX))
            setColor(object.fill)
            setWidth("")
            setHeight("")
        }
        else if (object.type === "triangle") {
            setWidth(Math.round(object.width * object.scaleX))
            setHeight(Math.round(object.height * object.scaleY))
            setColor(object.fill)
            setRadius("")
        }
    }
    const clearSettings = () => {
        setWidth("")
        setHeight("")
        setColor("")
        setRadius("")
    }

    const handleWidthChange = (e) => {
        const value = e.target.value.replace(/,/g, "")

        const intValue = parseInt(value, 10)
        setWidth(intValue / selectedObject.scaleX)
        if (selectedObject && selectedObject.type === "rect" && intValue >= 0) {
            selectedObject.set({ width: intValue / selectedObject.scaleX })
            canvas.renderAll()
        }
        if (selectedObject && selectedObject.type === "triangle" && intValue >= 0) {
            selectedObject.set({ width: intValue / selectedObject.scaleX })
            canvas.renderAll()
        }
        canvas.fire('object:modified')
    }
    const handleHeightChange = (e) => {
        const value = e.target.value.replace(/,/g, "")
        const intValue = parseInt(value, 10)
        setHeight(intValue / selectedObject.scaleY)
        if (selectedObject && selectedObject.type === "rect" && intValue >= 0) {
            selectedObject.set({ height: intValue / selectedObject.scaleY })
            canvas.renderAll()
        }
        if (selectedObject && selectedObject.type === "triangle" && intValue >= 0) {
            selectedObject.set({ height: intValue / selectedObject.scaleY })
            canvas.renderAll()
        }
        canvas.fire('object:modified')
    }
    const handleRadiusChange = (e) => {
        const value = e.target.value.replace(/,/g, "")
        const intValue = parseInt(value, 10)
        setRadius(intValue / selectedObject.scaleX)
        if (selectedObject && selectedObject.type === "circle" && intValue >= 0) {
            selectedObject.set({ radius: intValue / selectedObject.scaleX })
            canvas.renderAll()
        }
        canvas.fire('object:modified')
    }

    const handleLineChange = (e) => {
        const value = e.target.value.replace(/,/g, "")
        const intValue = parseInt(value, 10)


        setLength(intValue / selectedObject.scaleX)
        if (selectedObject && selectedObject.type === "rect" && intValue >= 0) {
            selectedObject.set({ width: intValue / selectedObject.scaleX })
            canvas.renderAll()
        }
        canvas.fire('object:modified')
    }
    const handleTextColorChange = (e) => {
        const color = e.target.value
        setColor(color)
        if (selectedObject) {
            selectedObject.setSelectionStyles({ fill: color })
            canvas.fire('object:modified')
            canvas.renderAll()
        }

    }

    const handleColorChange = (e) => {
        const color = e.target.value
        setColor(color)
        if (selectedObject) {
            selectedObject.set({ fill: color })
            canvas.fire('object:modified')
            canvas.renderAll()
        }

    }

    const handleFontChange = (e) => {
        const fontStyle = e.target.value
        setFont(fontStyle)
        if (selectedObject) {
            selectedObject.setSelectionStyles({ fontFamily: fontStyle })
            canvas.fire('object:modified')
        }
        canvas.requestRenderAll()

    }

    const decreaseFontSize = () => {
        setFontSize(prev => Math.max(1, prev - 1))
        if (selectedObject) {
            selectedObject.setSelectionStyles({ fontSize: fontSize })
            canvas.fire('object:modified')
        }
        canvas.requestRenderAll()

    }

    const increaseFontSize = () => {
        setFontSize(prev => prev + 1)
        if (selectedObject) {
            selectedObject.setSelectionStyles({ fontSize: fontSize })
            canvas.fire('object:modified')
        }
        canvas.requestRenderAll()

    }

    const handleFontSizeChange = (e) => {
        const fontsize = Number(e.target.value)
        setFontSize(fontsize)
        if (selectedObject) {
            selectedObject.setSelectionStyles({ fontSize: fontsize })
            canvas.fire('object:modified')
        }
        canvas.requestRenderAll()
    }

    const handleBoldChange = () => {
        const opt = !bold
        setBold(prev => !prev)
        if (selectedObject) {
            selectedObject.setSelectionStyles({ fontWeight: opt ? "bold" : "normal" })
            canvas.fire('object:modified')
        }
        canvas.requestRenderAll()
    }

    const handleUnderlineChange = () => {
        const opt = !underline
        setUnderline(prev => !prev)
        if (selectedObject) {
            selectedObject.setSelectionStyles({ underline: opt ? true : false })
            canvas.fire('object:modified')
        }
        canvas.requestRenderAll()
    }

    const handleItalicsChange = () => {
        const opt = !italics
        setItalics(prev => !prev)
        if (selectedObject) {
            selectedObject.setSelectionStyles({ fontStyle: opt ? "italic" : "normal" })
            canvas.fire('object:modified')
        }
        canvas.requestRenderAll()
    }

    const handleStrikethroughChange = () => {
        const opt = !strike
        setStrike(prev => !prev)
        if (selectedObject) {
            selectedObject.setSelectionStyles({ linethrough: opt ? true : false })
            canvas.fire('object:modified')
        }
        canvas.requestRenderAll()
    }

    return (
        <div className="settings-panel darkmode" style={panelPosition}>
            {/* line */}
            {selectedObject && selectedObject.lockScalingY && selectedObject.type === "rect" && (
                <div className="settings-pane">
                    <div className="width-container">
                        <p>Length</p>
                        <input type="number" className="width" value={length} onChange={handleLineChange} />
                    </div>
                    <div className="color-container">
                        <p>Color</p>
                        <input type="color" className="color" value={color} onChange={handleColorChange} />
                    </div>
                </div>
            )}
            {selectedObject && selectedObject.type === "rect" && selectedObject.lockScalingY === false && (
                <div className="settings-pane">
                    <div className="width-container">
                        <p>Width</p>
                        <input type="number" className="width" value={width} onChange={handleWidthChange} />
                    </div>
                    <div className="height-container">
                        <p>Height</p>
                        <input type="number" className="height" value={height} onChange={handleHeightChange} />
                    </div>
                    <div className="color-container">
                        <p>Color</p>
                        <input type="color" className="color" value={color} onChange={handleColorChange} />
                    </div>
                </div>
            )}
            {selectedObject && selectedObject.type === "circle" && (
                <div className="settings-pane">
                    <div className="radius-container">
                        <p>Radius</p>
                        <input type="number" className="radius" value={radius} onChange={handleRadiusChange} />
                    </div>
                    <div className="color-container">
                        <p>Color</p>
                        <input type="color" className="color" value={color} onChange={handleColorChange} />
                    </div>
                </div>
            )}
            {selectedObject && selectedObject.type === "triangle" && (
                <div className="settings-pane">
                    <div className="width-container">
                        <p>Width</p>
                        <input type="number" className="width" value={width} onChange={handleWidthChange} />
                    </div>
                    <div className="height-container">
                        <p>Height</p>
                        <input type="number" className="height" value={height} onChange={handleHeightChange} />
                    </div>
                    <div className="color-container">
                        <p>Color</p>
                        <input type="color" className="color" value={color} onChange={handleColorChange} />
                    </div>
                </div>
            )}
            {selectedObject && selectedObject.type === "i-text" && (
                // for textbox
                <div className="settings-pane">
                    {/* Font Family */}
                    <div className="fontType-container">
                        <p>Font</p>
                        <select value={font} onChange={handleFontChange}>
                            <option value="Arial">Arial</option>
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Courier New">Courier New</option>
                            <option value="Georgia">Georgia</option>
                            <option value="Verdana">Verdana</option>
                        </select>
                    </div>

                    <div className="fontSize-container">
                        <p>Size</p>
                        <div className="fontSize-adjuster">

                            <FaMinus onClick={decreaseFontSize} />
                            <input type="number" value={fontSize} onChange={handleFontSizeChange} />
                            <FaPlus onClick={increaseFontSize} />

                        </div>
                    </div>

                    <div className="fontStyle-container">
                        <RiBold size={20} onClick={handleBoldChange} />
                        <RiUnderline size={20} onClick={handleUnderlineChange} />
                        <RiStrikethrough size={20} onClick={handleStrikethroughChange} />
                        <RiItalic size={20} onClick={handleItalicsChange} />
                    </div>

                    <div className="color-container">
                        <p>Color</p>
                        <input type="color" className="color" value={color} onChange={handleTextColorChange} />
                    </div>

                </div>
            )}
        </div>

    )
}