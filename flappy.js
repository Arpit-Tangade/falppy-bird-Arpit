// board
let board;
let boardHeight = 640;
let boardwidth = 360;
let context;

// bird
let birdwidth = 34;
let birdheight = 26;
let birdx = boardwidth/8;
let birdy = boardHeight/2;
let birdimg;

let bird = {
    x : birdx,
    y : birdy,
    width : birdwidth,
    height : birdheight
}

//pipes
let pipeArray = [];
let pipex = boardwidth;
let pipey = 0;
let pipewidth = 64;
let pipeheight = 512;

let topPipeImg;
let bottomPipeImg;

//Game Physics
let velocityX = -2 ;//pipe moving left speed
let velocityY = 0 ;//bird jump speed
let gravity = 0.4 ;


let gameOver = false;
let score = 0;


window.onload = function(){
        //canvas adjustments
        board = document.getElementById("board");
        board.height = boardHeight;
        board.width = boardwidth;
        context = board.getContext("2d");

        //loading bird image
        birdimg = new Image();
        birdimg.src = "./images/flappybird.png" ;
        birdimg.style.height = "50";
        birdimg.onload = function(){
            context.drawImage(birdimg , bird.x , bird.y , bird.width , bird.height );
        }

        //loading pipe images
        topPipeImg = new Image();
        topPipeImg.src = "./images/toppipe.png";

        bottomPipeImg = new Image();
        bottomPipeImg.src = "./images/bottompipe.png";
        
        // Animation loop
        requestAnimationFrame(update);
        setInterval(placepipes , 1500);//every 1.5 seconds
        document.addEventListener("keydown", moveBird);
}

function update(){
    //Starting the animation
    requestAnimationFrame(update);
    
    if(gameOver){
        return;
    }

    context.clearRect(0 , 0 , board.width , board.height);

    //bird
    velocityY += gravity ;
    bird.y = Math.max(bird.y + velocityY,0);
    context.drawImage(birdimg , bird.x , bird.y , bird.width , bird.height );

    if(bird.y > board.height){
        gameOver = true;
    }

    //pipes
    for(let i=0 ; i < pipeArray.length ; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX ;
        context.drawImage(pipe.img , pipe.x , pipe.y , pipe.width , pipe.height);

        if(!pipe.passed && bird.x > pipe.x + pipe.width){
                score += 0.5; //0.5 coz there are 2 set of pipe(upper and lower). so 0.5*2 =1 , 1 for each set of pipes
                pipe.passed = true;
        }

        if(detectCollision(bird,pipe)){
            gameOver = true;
        }
    }

    //clear pipes
    while(pipeArray.length > 0 && pipeArray[0].x < -pipewidth){
        pipeArray.shift(); //removes first array from the array
    }

    //score
    context.fillStyle = "white"; //color of the font score
    context.font = "45px sans-serif";
    context.fillText(score , 5 , 45);

    if(gameOver){
        context.fillText("GAME OVER" , 5 , 90);
    }
}

function placepipes(){
    
    if(gameOver){
        return;
    }

    let randomPiepY = pipey - pipeheight/4 - Math.random()*pipeheight/2; //math.random() returns number between 0 and 1 , hence length of every pipe is changed
    let openingspace = pipeheight/4;

    let topPipe = {
        img : topPipeImg,
        x : pipex,
        y : randomPiepY,
        width : pipewidth,
        height : pipeheight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipex,
        y : randomPiepY + pipeheight + openingspace,
        width : pipewidth,
        height : pipeheight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e){
    if( e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX" ){
        //bird jump
        velocityY = -6;
    }

    //reset game
    if(gameOver){
        bird.y = birdy;
        pipeArray = [];
        score = 0;
        gameOver = false;
    }
}

function detectCollision(a,b){
    return a.x < b.x + b.width &&  
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;   //logic for detecting collision
}