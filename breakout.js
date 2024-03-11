//board
let board;
let boardWidth = 620;
let boardHeight = 600;
let context; 

//players
let playerWidth = 80; 
let playerHeight = 10;
let playerVelocityX = 10; 

let player = {
    x : boardWidth/2 - playerWidth/2,
    y : boardHeight - playerHeight - 5,
    width: playerWidth,
    height: playerHeight,
    velocityX : playerVelocityX
}

//ball
let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 4; // snelheid
let ballVelocityY = 3; //snelheid

let ball = {
    x : boardWidth/2,
    y : boardHeight/2,
    width: ballWidth,
    height: ballHeight,
    velocityX : ballVelocityX,
    velocityY : ballVelocityY
}

//blocks
let blockArray = [];
let blockWidth = 50;
let blockHeight = 10;
let blockColumns = 10; 
let blockRows = 3; 
let blockMaxRows = 10; //max blokken
let blockCount = 0;

let blockX = 15;
let blockY = 45;

let score = 0;
let gameOver = false;

let playerSpeed = 52; 

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); 


    window.onload = function() {
       
    
        //  muisbewegingen
        document.addEventListener("mousemove", movePaddleWithMouse);
    
       
    }
    

    //draw initial player
    context.fillStyle="skyblue";
    context.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer);

    // blokken
    createBlocks();
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // player
    context.fillStyle = "purple";
    context.fillRect(player.x, player.y, player.width, player.height);

    // ball
    context.fillStyle = "white"; //kleur bal
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    //bounce the ball off player paddle
    if (topCollision(ball, player) || bottomCollision(ball, player)) {
        ball.velocityY *= -1;   // flip y direction up or down
    }
    else if (leftCollision(ball, player) || rightCollision(ball, player)) {
        ball.velocityX *= -1;   // flip x direction left or right
    }

    if (ball.y <= 0) { 
        // if ball touches top of canvas
        ball.velocityY *= -1; //reverse direction
    }
    else if (ball.x <= 0 || (ball.x + ball.width >= boardWidth)) {
        // if ball touches left or right of canvas
        ball.velocityX *= -1; //reverse direction
    }
    else if (ball.y + ball.height >= boardHeight) {
        // if ball touches bottom of canvas
        context.font = "20px sans-serif";
        context.fillText("Game Over: Press 'Space' to Restart", 80, 400);
        gameOver = true;
    }
   


    //blocks
    context.fillStyle = `linear-gradient(to right, #ff3300, #ffcc00)`;
    for (let i = 0; i < blockArray.length; i++) {
        let block = blockArray[i];
        if (!block.break) {
            if (topCollision(ball, block) || bottomCollision(ball, block)) {
                block.break = true;     
                
                ball.velocityY *= -1;   
                score += 100;           //score per kapote blok
                blockCount -= 1;
            }
            else if (leftCollision(ball, block) || rightCollision(ball, block)) {
                block.break = true;     
                ball.velocityX *= -1;   
                score += 10;
                blockCount -= 1;
            }
            context.fillStyle = `linear-gradient(to right, #ff3300, #ffcc00)`;

            context.fillRect(block.x, block.y, block.width, block.height);
            
        }
    }

   //volgende level
    if (blockCount == 0) {
        score += 100*blockRows*blockColumns; 
        blockRows = Math.min(blockRows + 1, blockMaxRows);
        createBlocks();
    }

       //score
       context.font = "25px sans-serif";
       context.fillText(score, 10, 25);
   }
   
   function outOfBounds(xPosition) {
       return (xPosition < 0 || xPosition + playerWidth > boardWidth);
   }
   
   function movePlayer(e) {
       if (gameOver) {
           if (e.code == "Space") {
               resetGame();
               console.log("RESET");
           }
           return;
       }
       if (e.code == "ArrowLeft") {
           let nextPlayerX = player.x - playerSpeed; 
           if (!outOfBounds(nextPlayerX)) {
               player.x = nextPlayerX;
           }
       }
       else if (e.code == "ArrowRight") {
           let nextPlayerX = player.x + playerSpeed; 
           if (!outOfBounds(nextPlayerX)) {
               player.x = nextPlayerX;
           }
       }
   }
   
   function detectCollision(a, b) {
       return a.x < b.x + b.width &&
              a.x + a.width > b.x &&
              a.y < b.y + b.height &&
              a.y + a.height > b.y;
   }
   
   function topCollision(ball, block) {
       return detectCollision(ball, block) && (ball.y + ball.height) >= block.y;
   }
   
   function bottomCollision(ball, block) {
       return detectCollision(ball, block) && (block.y + block.height) >= ball.y;
   }
   
   function leftCollision(ball, block) {
       return detectCollision(ball, block) && (ball.x + ball.width) >= block.x;
   }
   
   function rightCollision(ball, block) {
       return detectCollision(ball, block) && (block.x + block.width) >= ball.x;
   }
   
   function createBlocks() {
       blockArray = [];
       for (let c = 0; c < blockColumns; c++) {
           for (let r = 0; r < blockRows; r++) {
               let block = {
                   x : blockX + c*blockWidth + c*10,
                   y : blockY + r*blockHeight + r*10,
                   width : blockWidth,
                   height : blockHeight,
                   break : false
               }
               blockArray.push(block);
           }
       }
       blockCount = blockArray.length;
   }
   
   function resetGame() {
       gameOver = false;
       player = {
           x : boardWidth/2 - playerWidth/2,
           y : boardHeight - playerHeight - 5,
           width: playerWidth,
           height: playerHeight,
           velocityX : playerVelocityX
       }
       ball = {
           x : boardWidth/2,
           y : boardHeight/2,
           width: ballWidth,
           height: ballHeight,
           velocityX : ballVelocityX,
           velocityY : ballVelocityY
       }
       blockArray = [];
       blockRows = 3;
       score = 0;
       createBlocks();
   }
   

   function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    // Speler
    context.fillStyle = "purple";
    context.fillRect(player.x, player.y, player.width, player.height);

    // ball
    context.fillStyle = "white"; //kleur bal
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    
    if (topCollision(ball, player) || bottomCollision(ball, player)) {
        ball.velocityY *= -1;   
    }
    else if (leftCollision(ball, player) || rightCollision(ball, player)) {
        ball.velocityX *= -1;   
    }

    if (ball.y <= 0) { 
        ball.velocityY *= -1; 
    }
    else if (ball.x <= 0 || (ball.x + ball.width >= boardWidth)) {
        ball.velocityX *= -1; 
    }
    else if (ball.y + ball.height >= boardHeight) {
        context.font = "20px sans-serif";
        context.fillText("Game Over: Press 'Space' to Restart", 80, 400);
        gameOver = true;
    }

    //blocks
    context.fillStyle = "purple";
    for (let i = 0; i < blockArray.length; i++) {
        let block = blockArray[i];
        if (!block.break) {
            if (topCollision(ball, block) || bottomCollision(ball, block)) {
                block.break = true;     
                ball.velocityY *= -1;   
                score += 100;           //score per kapote blok
                blockCount -= 1;
            }
            else if (leftCollision(ball, block) || rightCollision(ball, block)) {
                block.break = true;    
                ball.velocityX *= -1;   
                score += 10;
                blockCount -= 1;
            }
            context.fillRect(block.x, block.y, block.width, block.height);
        }
    }

    //next level
    if (blockCount == 0) {
        score += 100*blockRows*blockColumns; 
        blockRows = Math.min(blockRows + 1, blockMaxRows);
        createBlocks();
    }

    //score
    context.font = "25px sans-serif";
    context.fillText(score, 10, 25);
}

function outOfBounds(xPosition) {
    return (xPosition < 0 || xPosition + playerWidth > boardWidth);
}


function movePlayer(e) {
    if (gameOver) {
        if (e.code == "Space") {
            resetGame();
            console.log("RESET");
        }
        return;
    }
    if (e.code == "ArrowLeft") {
        let nextPlayerX = player.x - playerSpeed; 
        if (!outOfBounds(nextPlayerX)) {
            player.x = nextPlayerX;
        }
    }
    else if (e.code == "ArrowRight") {
        let nextPlayerX = player.x + playerSpeed; 
        if (!outOfBounds(nextPlayerX)) {
            player.x = nextPlayerX;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y;
}

function topCollision(ball, block) {
    return detectCollision(ball, block) && (ball.y + ball.height) >= block.y;
}

function bottomCollision(ball, block) {
    return detectCollision(ball, block) && (block.y + block.height) >= ball.y;
}

function leftCollision(ball, block) {
    return detectCollision(ball, block) && (ball.x + ball.width) >= block.x;
}

function rightCollision(ball, block) {
    return detectCollision(ball, block) && (block.x + block.width) >= ball.x;
}

function createBlocks() {
    blockArray = [];
    for (let c = 0; c < blockColumns; c++) {
        for (let r = 0; r < blockRows; r++) {
            let block = {
                x : blockX + c*blockWidth + c*10,
                y : blockY + r*blockHeight + r*10,
                width : blockWidth,
                height : blockHeight,
                break : false
            }
            blockArray.push(block);
        }
    }
    blockCount = blockArray.length;
}

function resetGame() {
    gameOver = false;
    player = {
        x : boardWidth/2 - playerWidth/2,
        y : boardHeight - playerHeight - 5,
        width: playerWidth,
        height: playerHeight,
        velocityX : playerVelocityX
    }
    ball = {
        x : boardWidth/2,
        y : boardHeight/2,
        width: ballWidth,
        height: ballHeight,
        velocityX : ballVelocityX,
        velocityY : ballVelocityY
    }
    blockArray = [];
    blockRows = 3;
    score = 0;
    createBlocks();
}

function movePaddleWithMouse(e) {
    // Bereken de muispositie ten opzichte van het canvas
    let canvasRect = board.getBoundingClientRect();
    let mouseX = e.clientX - canvasRect.left;

    // Pas de x-positie van de paddle aan op basis van de muispositie
    let nextPlayerX = mouseX - player.width / 2;

    // Zorg ervoor dat de paddle niet buiten het canvas gaat
    if (nextPlayerX >= 0 && nextPlayerX + player.width <= boardWidth) {
        player.x = nextPlayerX;
    }
}

// Voeg een event listener toe voor muisbewegingen
document.addEventListener("mousemove", movePaddleWithMouse);


