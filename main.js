


class Mouse {
    constructor(game){
        this.game = game;
        this.x = undefined;
        this.y = undefined;
        this.canvas = game.screen.canvas;
        this.gridPosition = undefined
        this.canvas.addEventListener("mousemove", (e) => {
            let canvasPosition = this.canvas.getBoundingClientRect();
            this.x = e.x - canvasPosition.left;
            this.y = e.y - canvasPosition.top;
            this.gridPosition = `x${Math.floor(this.x / 100)}y${Math.floor(this.y / 100)}`
        });
        this.canvas.addEventListener("mouseout", () => {
            this.x = undefined;
            this.y = undefined;
            this.gridPosition = undefined
        });
        this.canvas.addEventListener("mousedown", () => {
            this.game.handleClick();

        });
        this.canvas.addEventListener("mouseup", () => {
            return
        });
    }
    
    
}

const uiConf = {
    "UiClose": {
        position: {x: 0, y: 8},
        color: "white",
    },
    "UiMenu": {
        position: {x: 1, y: 8},
        color: "white",
    },
    "placeTower": {
        position: {x: 2, y: 8},
        color: "white",
    },
    "sellTower": {
        position: {x: 3, y: 8},
        color: "white",
    },
}
class Ui {
    constructor(game, type){
        this.game = game;
        this.ctx = game.screen.ctx;
        this.type = type;
        this.position = uiConf[type].position;
        this.gridPosition = xystring(this.position);
        this.color = uiConf[type].position;
    }
    draw = () => {
        this.ctx.fillStyle = this.color;
        this.ctx.font = "20px Arial";
        this.ctx.fillText(this.type, this.position.x * 100 + 10, this.position.y * 100 + 60);
    }
    action = () => {
        switch (this.type) {
            case "UiMenu":
                console.log("action")
                break;
            case "UiClose":
                console.log("close")
                this.game.state = "wave";
                break;
            case "placeTower":
                console.log("place now");
                this.game.state = "placeTower";
                break;
            case "sellTower":
                console.log("sell now");
                this.game.state = "sellTower";
                break;
        
            default:
                break;
        }
        
    }
}

class Canvas{
    constructor(canvas1, screenSize){
        this.width = screenSize.x;
        this.height = screenSize.y;
        this.canvas = document.getElementById(canvas1);
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = `${this.width}px`
        this.canvas.style.height = `${this.height}px`
    }
    clear(){
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    drawCircle(x,y,r,color){
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2* Math.PI);
        this.ctx.fill();
    }
    drawRect = (position,dimention,color) => {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(position.x, position.y, dimention.w, dimention.h);
    }
    strokeRect(position,dimention,color){
        this.ctx.strokeStyle = color;
        this.ctx.strokeRect(position.x, position.y, dimention.w, dimention.h);
    }
    drawUiCell(cellx, celly, row, text){
        this.ctx.fillStyle = conf.uiColor;
        this.ctx.font = conf.uiFont;
        this.ctx.fillText(text, cellx * conf.scale + 10, celly * conf.scale + 30 * (row + 1));
    }
    drawUi = (x, y, text, color) => {
        // console.log(this)
        this.ctx.fillStyle = color;
        this.ctx.font = "20px Arial";
        this.ctx.fillText(text, x + 10, y + 30);
    }
    drawMainMenu = (name) => {
        this.drawRect({x: this.width / 2 - 100
            , y: this.height / 2 - 100
            },{w: 200
            , h: 200
            }, "Black"
        )
        this.drawUi(
            this.width / 2 - 80,
            this.height / 2 - 100,
            name,
            "red"
        )
        this.drawRect({x: this.width / 2 - 80
            , y: this.height / 2 - 50
            },{w: 160
            , h: 130
            }, "green"
        )
        this.drawUi(
            this.width / 2 - 60,
            this.height / 2 - 10,
            "New Game",
            "black"
        )
        
    }
    drawElements(){ // loop over eyerython and draw shit( maybe accept them ass atrribuites?)
        this.clear()
        
        // game.cells
        // game.towers
        // game.enemies
        // game.projectiles
        for (let element of toDraw){
            element.shape
            // elemnts have shape, size, color, position
        }
    }

}

class Enemy{
    constructor(game){
        this.game = game;
        this.position = {
            x: this.game.conf.start.x + 0.5,
            y: this.game.conf.start.y + 0.5
        }
        this.goal = this.game.conf.end;
        this.dist = 100;
        this.ctx = this.game.screen.ctx;
        this.color = "red";
        this.size = 10;
        this.speed = 0.05;
        this.health = 100;
        }
        gridPosition = () => {
            return {
                x: Math.floor(this.position.x),
                y: Math.floor(this.position.y)
            }
        }
        update = () => {
            this.goal = this.game.gameGrid.get(xystring(this.gridPosition())).nextStep;
            let direction = calcDirection(this.position, this.goal);
            this.dist = calcDist(this.position, this.goal);
            this.position.x += Math.cos(direction) * this.speed;
            this.position.y += Math.sin(direction) * this.speed;
        }
        draw = () => {
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(this.position.x * 100, this.position.y * 100, this.size, this.size);
        }

}

class Projectile{
    constructor(parent){
        this.game = parent.game;
        this.ctx = this.game.screen.ctx;
        this.position = {
            x: parent.position.x + 0.5,
            y: parent.position.y + 0.5
        };
        this.goal = parent.aim;
        this.size = 10;
        this.color = "yellow";
        this.dist = Infinity;
        this.speed = 0.1;
        this.power = 10;
    }
    update = () => {
        this.dist = calcDist(this.position, this.goal.position);
        let direction = calcDirection(this.position, this.goal.position);
        this.position.x += Math.cos(direction) * this.speed;
        this.position.y += Math.sin(direction) * this.speed;
    }
    draw = () => {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.position.x * 100, this.position.y * 100, this.size, this.size);
    }

}

class Tower{
    constructor(parent){
        this.game = parent.game;
        this.name = "tower";
        this.position = parent.position;
        this.size = this.game.gameSize.scale;
        this.ctx = this.game.screen.ctx;
        this.color = "green";
        this.aim = this.game.conf.end;
        this.range = 200;
        this.counter = 1;
        this.ready = false;
    }
    centre = () => {
        return {
            x: this.position.x + 0.5,
            y: this.position.y + 0.5
        }
    }
    draw(){
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.position.x * 100, this.position.y * 100, this.size, this.size);
    }
    update(){
        this.counter++;
        if (this.counter % 100 === 0 && this.game.elements.enemies.length > 0){
            this.ready = true;
        }
        if(this.ready){
            for (let x of this.game.elements.enemies){
            // console.log((calcDist(this.centre(), x.position)))
            if (calcDist(this.centre(), x.position) <= this.range / 100){                            
                this.aim = x;
                this.game.elements.projectiles.push(new Projectile(this))
                this.ready = false;
                break;
            }
        }
        }
        
        
    }
}


class Grid {
    constructor(position, game){
        this.game = game;
        this.ctx = this.game.screen.ctx;
        this.position = position;
        this.walk = true;
        this.type = "empty"; //empts, start, end, tower
        this.contains = null;
        this.pathHeight = 0;
        this.nextStep = this.game.conf.end;
        // a neihbour map for path finding would be nice
    }
    drawUmrand(){
        this.ctx.strokeStyle = "Black";
        this.ctx.strokeRect(this.position.x * this.game.gameSize.scale, 
        this.position.y * this.game.gameSize.scale, this.game.gameSize.scale, this.game.gameSize.scale)
    }
    drawHeigth = () => {
        this.ctx.fillStyle = "White";
        this.ctx.font = "20px Arial";
        this.ctx.fillText(this.pathHeight, this.position.x * 100 +10,  this.position.y * 100  +50)
    }
    placeTower = () => {
        if (this.type === "empty"){
            this.type = "tower";
            this.walk = false;
            this.contains = new Tower(this);
            this.pathHeight = -Infinity;
            this.game.elements.towers.push(this.contains);
        this.game.pathFinding();
        }
        
    }
    sellTower(){
        if (this.type === "tower"){
            let index = this.game.elements.towers.indexOf(this.contains)
            this.game.elements.towers.splice(index,1);
            this.walk = true
            this.contains = null;
            this.type = "empty";
            this.game.pathFinding();
        } 

    }
}

class Game {
    constructor(name){
        this.name = name;
        this.screenSize = {x: 800, y: 900};
        this.screen = new Canvas("canvas1", this.screenSize);
        this.mouse = new Mouse(this);
        this.path = [];
        this.gameSize = {
            x: 800, 
            y: 800,
            scale: 100,
            columns: 8,
            rows: 8,
        };
        this.gameGrid = new Map();
        this.ui = new Map();

        this.conf = {                
            money: 1000,
            lives: 10,
            start: {x: 0, y: 5},
            end: {x: 5, y: 6},
            states: {0: "wave", 1: "placeTower", 2: "sellTower", 3: "Upgrade"},
        };

        this.frame = 0;
        this.elements = {
            towers: [],
            projectiles: [],
            enemies: [],
        };

        this.state = this.conf.states[0];
        
    }
    pathFinding = () => {
        for(let x of this.gameGrid.values()){
            switch (x.type) {
                case "tower":
                    x.pathHeight = -100;
                    break;
                case "end":
                    x.pathHeight = 1;
                    break;                
            
                default:
                    x.pathHeight = 0;
                    break;
            }
            x.tempHeigth = x.pathHeight;
        }
        let change = 1;
        while (change){
            change = 0;
            for(let x of this.gameGrid.values()){
                if(x.pathHeight === 1){
                    change = 1;
                }
                if (
                    x.walk && (
                        x.pathHeight > 0 ||
                        this.gameGrid.get(xystring(x.position,1,0))?.pathHeight > 0 ||
                        this.gameGrid.get(xystring(x.position,-1,0))?.pathHeight > 0 ||
                        this.gameGrid.get(xystring(x.position,0,1))?.pathHeight > 0 ||
                        this.gameGrid.get(xystring(x.position,0,-1))?.pathHeight > 0
                )){
                    x.tempHeigth += 1;
                } 
                // x.pathHeight++
            }
            for(let x of this.gameGrid.values()){
                x.pathHeight = x.tempHeigth
            }
            // if(this.gameGrid.get(xystring(this.conf.start)).pathHeight > 0){
            //     break;
            // }
        }
        for(let x of this.gameGrid.values()){
            let next;
            // console.log(x.pathHeight, this.gameGrid.get(xystring(x.position,1,0))?.pathHeight)
            
            switch (x.pathHeight) {
                case -Infinity:
                    next = this.conf.end;
                    x.nextStep = {x: next.x + 0.5, y: next.y + 0.5}
                    break;
                case 0:
                    next = this.conf.end;
                    x.nextStep = {x: next.x + 0.5, y: next.y + 0.5}
                    break;
                case this.gameGrid.get(xystring(x.position,1,0))?.pathHeight - 1:
                    next = this.gameGrid.get(xystring(x.position,1,0))?.position;
                    x.nextStep = {x: next.x + 0.5, y: next.y + 0.5}
                    break;
                case this.gameGrid.get(xystring(x.position,-1,0))?.pathHeight - 1:
                    next = this.gameGrid.get(xystring(x.position,-1,0))?.position;
                    x.nextStep = {x: next.x + 0.5, y: next.y + 0.5}
                    break;
                case this.gameGrid.get(xystring(x.position,0,-1))?.pathHeight - 1:
                    next = this.gameGrid.get(xystring(x.position,0,-1))?.position;
                    x.nextStep = {x: next.x + 0.5, y: next.y + 0.5}
                    break;
                case this.gameGrid.get(xystring(x.position,0,1))?.pathHeight - 1:
                    next = this.gameGrid.get(xystring(x.position,0,1))?.position;
                    x.nextStep = {x: next.x + 0.5, y: next.y + 0.5}
                    break;
            
                default:
                    next = this.conf.end;
                    x.nextStep = {x: next.x + 0.5, y: next.y + 0.5}
                    break;
            }
        }
    }
    handleClick = () => {
        let mousePos = this.mouse.gridPosition;
        // this.screen.clear()
        //calc the path arr
        this.ui.get(mousePos)?.action();
        console.log(mousePos)
        
        switch (this.state) {
            case "wave":

                break;
            case "placeTower":
                this.gameGrid.get(mousePos).placeTower();
                break;
            case "sellTower":
                this.gameGrid.get(mousePos).sellTower();
                break;
            case "Upgrade":

                break;
        
            default:
                break;
        }
        
    }
    makeGrid = () => {
        for (let i = 0; i < this.gameSize.rows; i++){
            for (let j = 0; j < this.gameSize.columns; j++){
                let position = {x: j, y: i};
                this.gameGrid.set(xystring(position), new Grid(position, this));
            }
        }
        this.gameGrid.get(xystring(this.conf.start)).type = "start";
        this.gameGrid.get(xystring(this.conf.end)).pathHeight = 1;
        this.gameGrid.get(xystring(this.conf.end)).type = "end";
        // set Ui element at the bottom
        this.ui.set("x0y8", new Ui(this, "UiClose"));
        this.ui.set("x1y8", new Ui(this, "UiMenu"));
        this.ui.set("x2y8", new Ui(this, "placeTower"));
        this.ui.set("x3y8", new Ui(this, "sellTower"));
    }
    start(){
        this.makeGrid();
        this.mainAnimate();
    }
    updateElements = () => {
        if (this.frame % 2 === 0){
            this.elements.enemies.push(new Enemy(this));
        }
        this.elements.towers.forEach(element => {
            element.update();
        });
        this.elements.enemies.forEach(element => {
            element.update();
            if(element.dist < 0.05 || element.health <= 0){
                let index = this.elements.enemies.indexOf(element)
                this.elements.enemies.splice(index,1);
            }
        });
        this.elements.projectiles.forEach(element => {
            element.update();
            if(element.dist < 0.05){
                let index = this.elements.projectiles.indexOf(element)
                element.goal.health -= element.power;
                this.elements.projectiles.splice(index,1);
            }
        });

    }
    drawElements = () => {

        if (this.mouse.gridPosition){
            this.gameGrid.get(this.mouse.gridPosition)?.drawUmrand()
        }
        this.elements.towers.forEach(element => {
            element.draw();
        });
        this.elements.enemies.forEach(element => {
            element.draw();
        });
        this.elements.projectiles.forEach(element => {
            element.draw();
        });
        for(let x of this.gameGrid.values()){
            x.drawHeigth()
        }
        for(let x of this.ui.values()){
            x.draw()
        }

    }
    mainLoop = () => {
        this.frame++;
        
        this.updateElements();
        this.drawElements();
    }
    mainAnimate = () => {
        this.screen.clear()
        this.mainLoop()

        
    
        
        requestAnimationFrame(this.mainAnimate)
    }
}

let tdGame = new Game("Tower Defense");
tdGame.start();


// functions

//take two objekts with x and y coord and return distance
function calcDist(first, second){
    return Math.sqrt((first.x - second.x) ** 2 + (first.y - second.y) ** 2)
}

//between 0 and 2 * PI, convert with sin to y, cos to x

function calcDirection(self, target){
    let dist = calcDist(self, target);
    if (Math.sign(target.y - self.y) === -1){
        return Math.PI * 2 - Math.acos((target.x - self.x) / dist);
    } else {
        return Math.acos((target.x - self.x) / dist);
    }
}

function xystring(obj, x = 0, y = 0){
    return `x${obj.x + x}y${obj.y + y}`
}