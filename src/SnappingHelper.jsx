// import { fabric } from "fabric";

import { Line } from "fabric";
const snappingDistance = 10;

export const clearGuidelines = (canvas) => {
  const objects = canvas.getObjects("line");
  objects.forEach((obj) => {
    if (obj.id && (obj.id.startsWith("vertical-") || obj.id.startsWith("horizontal-"))) {
      canvas.remove(obj);
    }
  });
  canvas.renderAll();
};

const guidelineExists = (canvas, id) => {
  const objects = canvas.getObjects("line");
  return objects.some((obj) => obj.id === id);
};

export const handleObjectMoving = (canvas, obj, guidelines, setGuidelines) => {
  let bounds;

  if (obj.type === "line") {
    // Use endpoints for lines
    const x1 = obj.x1 + obj.left;
    const y1 = obj.y1 + obj.top;
    const x2 = obj.x2 + obj.left;
    const y2 = obj.y2 + obj.top;

    bounds = {
      left: Math.min(x1, x2),
      top: Math.min(y1, y2),
      right: Math.max(x1, x2),
      bottom: Math.max(y1, y2),
      centerX: (x1 + x2) / 2,
      centerY: (y1 + y2) / 2
    };
  } else {
    // Use standard object bounds
    bounds = {
      left: obj.left,
      top: obj.top,
      right: obj.left + obj.width * obj.scaleX,
      bottom: obj.top + obj.height * obj.scaleY,
      centerX: obj.left + (obj.width * obj.scaleX) / 2,
      centerY: obj.top + (obj.height * obj.scaleY) / 2
    };
  }

  const height = canvas.height;
  const width = canvas.width;

  let newGuidelines = [];
  clearGuidelines(canvas);
  let snapped = false;

  // Snap left
  if (Math.abs(bounds.left) < snappingDistance) {
    const shift = -bounds.left;
    shiftObject(obj, shift, 0);
    addVerticalGuide(canvas, 0, "vertical-left", newGuidelines);
    snapped = true;
  }

  // Snap top
  if (Math.abs(bounds.top) < snappingDistance) {
    const shift = -bounds.top;
    shiftObject(obj, 0, shift);
    addHorizontalGuide(canvas, 0, "horizontal-top", newGuidelines);
    snapped = true;
  }

  // Snap right
  if (Math.abs(bounds.right - width) < snappingDistance) {
    const shift = width - bounds.right;
    shiftObject(obj, shift, 0);
    addVerticalGuide(canvas, width, "vertical-right", newGuidelines);
    snapped = true;
  }

  // Snap bottom
  if (Math.abs(bounds.bottom - height) < snappingDistance) {
    const shift = height - bounds.bottom;
    shiftObject(obj, 0, shift);
    addHorizontalGuide(canvas, height, "horizontal-bottom", newGuidelines);
    snapped = true;
  }

  // Snap center X
  if (Math.abs(bounds.centerX - width / 2) < snappingDistance) {
    const shift = width / 2 - bounds.centerX;
    shiftObject(obj, shift, 0);
    addVerticalGuide(canvas, width / 2, "vertical-center", newGuidelines);
    snapped = true;
  }

  // Snap center Y
  if (Math.abs(bounds.centerY - height / 2) < snappingDistance) {
    const shift = height / 2 - bounds.centerY;
    shiftObject(obj, 0, shift);
    addHorizontalGuide(canvas, height / 2, "horizontal-center", newGuidelines);
    snapped = true;
  }

  if (!snapped) {
    clearGuidelines(canvas);
  } else {
    setGuidelines(newGuidelines);
  }

  canvas.renderAll();
};

// Helper: Shift object by dx, dy
const shiftObject = (obj, dx, dy) => {
  if (obj.type === "line") {
    obj.set({
      x1: obj.x1 + dx,
      y1: obj.y1 + dy,
      x2: obj.x2 + dx,
      y2: obj.y2 + dy
    });
  } else {
    obj.set({
      left: obj.left + dx,
      top: obj.top + dy
    });
  }
  obj.setCoords();
};

// Add guideline helpers
const addVerticalGuide = (canvas, x, id, arr) => {
  if (!guidelineExists(canvas, id)) {
    const line = createVerticalGuideline(canvas, x, id);
    arr.push(line);
    canvas.add(line);
  }
};

const addHorizontalGuide = (canvas, y, id, arr) => {
  if (!guidelineExists(canvas, id)) {
    const line = createHorizontalGuideline(canvas, y, id);
    arr.push(line);
    canvas.add(line);
  }
};

export const createVerticalGuideline = (canvas, x, id) => {
  return new Line([x, 0, x, canvas.height], {
    id,
    stroke: "red",
    strokeWidth: 1,
    selectable: false,
    evented: false,
    strokeDashArray: [5, 5],
    opacity: 0.8
  });
};

export const createHorizontalGuideline = (canvas, y, id) => {
  return new Line([0, y, canvas.width, y], {
    id,
    stroke: "red",
    strokeWidth: 1,
    selectable: false,
    evented: false,
    strokeDashArray: [5, 5],
    opacity: 0.8
  });
};
