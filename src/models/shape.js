export class Shape{
    constructor(x, y, width, height, color, outlined){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.outlined = outlined;
    }

    draw(context){}
}

export class Rectangle extends Shape{

    constructor(x, y, width, height, color, outlined){
        super(x, y, width, height, color, outlined);

        this.lineCap = 'round';
        this.lineJoin = 'round';
    }
   
    draw(context){
        context.rect(this.x, this.y, this.width, this.height);
        if(this.outlined){
            context.strokeStyle = this.color;
            context.stroke();
        }
        else{
            context.fillStyle = this.color;
            context.fill();
        }
        
    }
}

export class Circle extends Shape{

    constructor(x, y, radius, color, outlined){
        super(x, y, radius, radius, color, outlined);

        this.lineCap = 'round';
        this.lineJoin = 'round';
        this.radius = radius;
    }
   
    draw(context){
        context.arc(this.x, this.y, this.radius, 2 * Math.PI);
        if(this.outlined){
            context.strokeStyle = this.color;
            context.stroke();
        }
        else{
            context.fillStyle = this.color;
            context.fill();
        }
        
    }
}
