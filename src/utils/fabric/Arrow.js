// Arrow.js
import * as fabric from 'fabric';

export class Arrow extends fabric.Line {
  constructor(points, options = {}) {
    super(points, {
      ...options,
      hasBorders: false,
      hasControls: true,
    });

    this.headLength = options.headLength || 15;
    this.stroke = options.stroke || 'black';
    this.strokeWidth = options.strokeWidth || 2;
  }

  _render(ctx) {
    super._render(ctx);

    const x1 = this.x1, y1 = this.y1;
    const x2 = this.x2, y2 = this.y2;
    const angle = Math.atan2(y2 - y1, x2 - x1);

    const headLength = this.headLength;
    const arrowX1 = x2 - headLength * Math.cos(angle - Math.PI / 6);
    const arrowY1 = y2 - headLength * Math.sin(angle - Math.PI / 6);
    const arrowX2 = x2 - headLength * Math.cos(angle + Math.PI / 6);
    const arrowY2 = y2 - headLength * Math.sin(angle + Math.PI / 6);

    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(arrowX1, arrowY1);
    ctx.moveTo(x2, y2);
    ctx.lineTo(arrowX2, arrowY2);
    ctx.strokeStyle = this.stroke;
    ctx.lineWidth = this.strokeWidth;
    ctx.stroke();
  }

  toObject(propertiesToInclude) {
    return {
      ...super.toObject(propertiesToInclude),
      headLength: this.headLength,
    };
  }
}
