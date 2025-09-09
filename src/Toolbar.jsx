import "./canvas.css"
import { Canvas, Circle, FabricImage, IText, Line, Rect, Textbox, Triangle } from "fabric"
import { IconButton } from "blocksin-system"
import { CircleIcon, SquareIcon, TriangleIcon, TextIcon, ImageIcon, LineHeightIcon, BorderSolidIcon, SlashIcon, ArrowRightIcon } from "sebikostudio-icons"
import { useEffect, useState } from "react"
import { useFilePicker } from "use-file-picker"



const addShape = (shape, canvas) => {
    if (canvas) {
        switch (shape) {
            case "rectangle":
                const rect = new Rect({
                    top: 100,
                    left: 50,
                    width: 100,
                    height: 60,
                    fill: "#D84D42"
                })
                canvas.add(rect)
                break

            case "circle":
                const circle = new Circle({
                    top: 150,
                    left: 150,
                    radius: 50,
                    fill: "#2F4DC6"
                })
                canvas.add(circle)
                break

            case "triangle":
                const triangle = new Triangle({
                    top: 200,
                    left: 250,
                    height: 90,
                    width: 100,
                    fill: "#136207"
                })
                canvas.add(triangle)
                break
            case "line":
                // const line = new Rect([50, 100, 200, 100], {
                //     stroke: 'black',
                //     strokeWidth: 3,
                //     selectable:true,
                //     evented:true,
                //     // perPixelTargetFind:false,
                //     // objectCaching:false,
                //     originX:'center',
                //     originY:'center',
                //     hasBorders:false,
                //     // lockScalingY: true,
                //     hasControls: false,
                // })
                const line = new Rect({
                    top: 100,
                    left: 50,
                    width: 100,
                    height: 2,
                    fill: "black",
                    lockScalingY: true,
                    // hasControls: false
                })
                line.setCoords();
                canvas.add(line)
                canvas.renderAll()
                break
            case "textbox":
                const textbox = new IText('enter text here', {
                    left: 100,
                    top: 100,
                    width: 300,
                    maxWidth: 300,
                    fontFamily: "Arial",
                    fontSize: 40,
                    fill: "black",
                    editable: true,
                    visible: true
                })
                textbox.initDimensions();
                canvas.add(textbox)
                canvas.setActiveObject(textbox);
                // canvas.fire('object:selected', { target: textbox });
                canvas.requestRenderAll()
                break

            default:
                break
        }

    }
}






export default function Toolbar({ canvas }) {
    const [showShapes, setShowShapes] = useState(false)
    const handleShowShapes = () => {
        setShowShapes(prev => !prev)
    }


    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (!file) {
            return
        }
        const reader = new FileReader()
        reader.onload = (event) => {
            const imageUrl = event.target.result; // base64 image

            FabricImage.fromURL(imageUrl).then((img) => {
                img.set({
                    left: 100,
                    top: 100,
                    selectable: true,
                });
                img.scaleToWidth(150); // Resize image
                canvas.add(img); // Add to canvas
                canvas.setActiveObject(img);
                canvas.renderAll();
               
            });
        };

        reader.readAsDataURL(file);
    }


    //     const [filesContent, errors, openFileSelector, loading] = useFilePicker({
    //   accept: ["image/*"],
    //   multiple: false,
    //   readAs: "DataURL", // get base64
    // });

    //     // if (!canvas || filesContent.length === 0) return;

    //     const file = filesContent[0]; // first selected file
    //     const imageUrl = file.content; // base64 Data URL

    //     FabricImage.fromURL(imageUrl).then((img) => {
    //       img.set({
    //         left: 100,
    //         top: 100,
    //         selectable: true,
    //       });
    //       img.scaleToWidth(150);
    //       canvas.add(img);
    //       canvas.setActiveObject(img);
    //       canvas.renderAll();
    //       console.log("Image added to canvas");
    //     });


    return (
        <div className="toolbars-wrapper">
            <div className='toolbar'>
                <IconButton onClick={handleShowShapes} variant="ghost" size="medium">
                    <SquareIcon />
                </IconButton>
                <IconButton onClick={() => addShape("textbox", canvas)} variant="ghost" size="medium">
                    <TextIcon />
                </IconButton>
                <input
                    type="file"
                    accept="image/*"
                    id="imageUpload"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                />
                <IconButton variant="ghost" size="medium" >
                    <label htmlFor="imageUpload">
                        <ImageIcon />
                    </label>
                </IconButton>

            </div>
            {showShapes &&
                <div className="shapes-toolbar">
                    <IconButton onClick={() => addShape("rectangle", canvas)} variant="ghost" size="medium">
                        <SquareIcon />
                    </IconButton>
                    <IconButton onClick={() => addShape("circle", canvas)} variant="ghost" size="medium">
                        <CircleIcon />
                    </IconButton>
                    <IconButton onClick={() => addShape("triangle", canvas)} variant="ghost" size="medium">
                        <TriangleIcon />
                    </IconButton>
                    <IconButton onClick={() => addShape("line", canvas)} variant="ghost" size="medium">
                        <SlashIcon />
                    </IconButton>
                    {/* <IconButton onClick={() => addShape("arrow", canvas)} variant="ghost" size="medium">
                        <ArrowRightIcon />
                    </IconButton> */}
                </div>
            }
        </div>

    )
}