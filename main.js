const canvas = document.getElementById("color")
const ctx = canvas.getContext("2d");

let coolZooms = [84.96137312576997,341.2300879109429,255.68992959747393]

let offset = 0;
let zoom = 257.6000000000003
canvas.addEventListener("click",()=>{zoom += 0.1;init();console.log(zoom)})
// canvas.addEventListener("click",()=>{stopAnimation = !stopAnimation})
let stopAnimation = false
let width = 1920;
let height = 1080;

let data;
let imageData
resizeCanvas();

// Attach an event listener to window resize event
window.addEventListener('resize', resizeCanvas);

// Function to resize the canvas
function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    imageData = ctx.getImageData(0,0,width,height)
    data = imageData.data
    init();
}

function clear(){
    ctx.clearRect(0, 0, width, height);
}

// ctx.imageSmoothingEnabled = false

// ctx.fillStyle = "#aabbcc";
// ctx.fillRect(0,0,5,5);

// let data = new Uint8ClampedArray(width * height * 4)
for(let i = 0; i < data.byteLength; i++){
    data[i] = 256
}
// imageData.data = data
let len = data.byteLength

ctx.putImageData(imageData,0,0)


// ctx.putImageData(imageData,0,0)

console.log(data)
console.log(ctx)
function init(){
    for(let row = 0; row < height; row++){
        for(let col = 0; col < width; col++){
            let field = (row * width + col) * 4
            // let color = ((row*zoom + offset) * (col*zoom+offset)) % 256
            let color = ((row*zoom + offset) ^ (col*zoom+offset)) % 256
            data[field] = (color + row ^ col / 6) % 256;
            field++;
            data[field] = (color + 85 + row ^ col + col / 5 + row / 4) % 256;
            field++;
            data[field] = (color + 170 + col ^ row / 7) % 256;
            field++;
            data[field] = 256;
        }
    }
}
init()
function updateCanvas(){
    // for (let i = 0; i < len; i++){
    //     data[i] = (data[i] + i) % 256;
    // }
    // console.log(data)

    // for(let row = 0; row < height; row++){
    //     for(let col = 0; col < width; col++){
    //         let field = (row * width + col) * 4
    //         data[field] = (data[field] += 133) % 256;
    //         field++;
    //         data[field] = (data[field] += 123) % 256;
    //         field++;
    //         data[field] = (data[field] += 127) % 256;
    //         field++;
    //         data[field] = 256;
    //     }
    // }
    for(let row = 0; row < height; row++){
        for(let col = 0; col < width; col++){
            let field = (row * width + col) * 4
            data[field] = (data[field] += 254 ) % 256;
            field++;
            data[field] = (data[field] += 1 ) % 256;
            field++;
            data[field] = (data[field] += 3) % 256;
            field++;
            data[field] = 256;
        }
    }
    
    

}

let frame = 0;
function animate(){
    if(!stopAnimation){
        frame++;
        updateCanvas();
        ctx.putImageData(imageData,0,0)
    }
    requestAnimationFrame(animate);
}

animate();


// for(let row = 0; row < width; row++){
//     for(let col = 0; col < height; col++){
//         let field = (row * height + col) * 4
//         let color = (row * col) % 256
//         data[field] = color;
//         field++;
//         data[field] = color;
//         field++;
//         data[field] = color;
//         field++;
//         data[field] = 256;
//     }
// }




// ctx.putImageData(imageData,0,0)