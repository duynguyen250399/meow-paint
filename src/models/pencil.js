export class Pencil {
    constructor(color, thickness) {
        this.color = color;
        this.thickness = thickness;
        this.lineCap = 'round';
        this.lineJoin = 'round';
    }

    drawPoints(context, points) {
        context.lineCap = this.lineCap;
        context.lineJoin = this.lineJoin;
        context.lineWidth = this.thickness;
        context.strokeStyle = this.color;

        points.forEach(point => {
            context.lineTo(point.x, point.y);
            context.stroke();
        })
    }

    drawLines(context, lines) {
        context.lineCap = this.lineCap;
        context.lineJoin = this.lineJoin;
        context.lineWidth = this.thickness;
        context.strokeStyle = this.color;

        lines.forEach(line => {
            context.moveTo(line.x1, line.y1);
            context.lineTo(line.x2, line.y2);
            context.stroke();
        })
    }

    drawLine(context, line) {
        context.lineCap = this.lineCap;
        context.lineJoin = this.lineJoin;
        context.lineWidth = this.thickness;
        context.strokeStyle = this.color;

        context.moveTo(line.x1, line.y1);
        context.lineTo(line.x2, line.y2);
        context.stroke();
    }
}