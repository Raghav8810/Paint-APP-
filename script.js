const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
//getcontext method allow us to write on canvas
const toolBtns = document.querySelectorAll(".tool");
const Fillcolor = document.querySelector("#fill-color");
const sizeSlider = document.querySelector("#size-slider");
const colorBtn = document.querySelectorAll(".colors .list-option");

const colorPicker = document.querySelector("#color-picker");
const clearCanvas = document.querySelector(".clear");
const SaveBtn = document.querySelector(".save");


let isDraw = false;
let brushWidth = 5;
let selectedTool = "brush"; 
let selectedColor = "#000";

let prevMouseX,prevMouseY,snapShot; // offsetX, offsetY kai liy ek baar hi global vaiable bana liy



window.addEventListener("load", ()=>{
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
})

const drawRect = (e) =>{
    if(!Fillcolor.checked){
       return ctx.strokeRect(e.offsetX,e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    }
    ctx.fillRect(e.offsetX,e.offsetY, prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    //strokeReact(x coordinate, y coordinate, width);
}
//circle function
const drawCircle = (e) =>{
    ctx.beginPath(); // creating new path for circle
    let radius = Math.sqrt(Math.pow((prevMouseX-e.offsetX),2)+ Math.pow((prevMouseY-e.offsetY),2))
    ctx.arc(prevMouseX, prevMouseY,radius,0,2*Math.PI);
   Fillcolor.checked ? ctx.fill() : ctx.stroke(); //if fillcolor is checked fill cricle else draw border of cricle.
    //arc(xcoordinate, ycoordinate, radius, staert angle, end angle);
}

const drawTriangle = (e) =>{
    ctx.beginPath();
    ctx.moveTo(prevMouseX,prevMouseY);
    ctx.lineTo(e.offsetX, e.offsetY);//create first line 
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);// create bottom line of triangle
    ctx.closePath();//close path of trinagle so third line will cretae automaticalyy
    ctx.stroke();
    Fillcolor.checked ? ctx.fill() : ctx.stroke();
}


const drawing = (e) =>{
    if(!isDraw) return;
    ctx.putImageData(snapShot,0,0);

    if(selectedTool === "brush" || selectedTool === "eraser"){
        //if selected tool is eraser than set strokstyle to white
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        //lineTo method create a new line 
        //eg : ctx.lineTo(x coordinate, y-coordinate);
        //offsetX , offsetY return x,y coordinate acoording to mouse pointer
        ctx.stroke();
    }else if(selectedTool === "rectangle"){
        drawRect(e);  // make it function for reactangle
    }else if(selectedTool === "circle"){
        drawCircle(e);
    }else{
        drawTriangle(e);
    }
  
}


const startDraw = (e) =>{
    isDraw = true;
    prevMouseX = e.offsetX;// passing curent x value to x
    prevMouseY = e.offsetY;//passing current y value of mouse
    ctx.beginPath(); //creat a new path
    // this function for when we click mouse then start writing
    ctx.lineWidth = brushWidth; //passing brushsize as line width
    ctx.strokeStyle = selectedColor; // passing selected color as a stroke
    ctx.fillStyle  = selectedColor;//passing fill color as a fill
    snapShot = ctx.getImageData(0,0,canvas.width, canvas.height);
    //copy canvas value data and passing to snapshot this will 
    //avoid dragging the rectangele image
    //getimagedata() return image data object taht copies pixel;
}


//tools
toolBtns.forEach(btn =>{
    btn.addEventListener("click", ()=>{
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        console.log(btn.id); // this will give selected tool id jisse pata lage ki kon sa tool select hai abhi
        selectedTool  = btn.id; //selected tool mai jo select hai wo aa jayega
    });
    //in this aading click event all tool btns
})


colorBtn.forEach(btn =>{
    btn.addEventListener("click", ()=>{
        document.querySelector(".options .selected").classList.remove("selected");
        btn.classList.add("selected");
        console.log(window.getComputedStyle(btn).getPropertyValue("background-color")); // this will give selected tool id jisse pata lage ki kon sa tool select hai abhi
        selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");  //selected tool mai jo select hai wo aa jayega
    })
})


colorPicker.addEventListener("change", ()=>{
    colorPicker.parentElement.style.background = colorPicker.value;
    colorPicker.parentElement.click();
})


clearCanvas.addEventListener("click", () =>{
  ctx.clearRect(0,0,canvas.width,canvas.height);// clear  whole canvas
});

SaveBtn.addEventListener("click", () =>{
       const link = document.createElement("a");//create a tag;
       link.download = `${Date.now()}.jpg`; //passinf currnt date to download link
       link.href = canvas.toDataURL(); // passing canvas data  in href link
       link.click(); // click link to download image;
  });



canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", ()=> isDraw = false);

sizeSlider.addEventListener("change", ()=>{
    brushWidth = sizeSlider.value;
})


