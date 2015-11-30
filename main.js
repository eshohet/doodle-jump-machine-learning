// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

var width = 422,
    height = 552;

canvas.width = width;
canvas.height = height;

var baseHeight = 0;

var gamespeed = 1;
var draw_flag = 1;


// Used to define current iteration for graphing library
var currentIteration = 1;

//Variables for game
var platforms = [],
    image = document.getElementById("sprite"),
    player, platformCount = 10,
    position = 0,
    gravity = 0.2,
    animloop,
    flag = 0,
    menuloop, broken = 0,
    dir, score = 0,
    firstRun = true;

//Base object
var Base = function() {
    this.height = 5;
    this.width = width;

    //Sprite clipping
    this.cx = 0;
    this.cy = 614;
    this.cwidth = 100;
    this.cheight = 5;

    this.moved = 0;

    this.x = 0;
    this.y = height - this.height;

    this.draw = function() {
        try {
            if (draw_flag)
                ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
        } catch (e) {}
    };
};

var base = new Base();

//Player object
var Player = function() {
    this.vy = 11;
    this.vx = 0;

    this.isMovingLeft = false;
    this.isMovingRight = false;
    this.isDead = false;

    this.width = 55;
    this.height = 40;

    //Sprite clipping
    this.cx = 0;
    this.cy = 0;
    this.cwidth = 110;
    this.cheight = 80;

    this.dir = "left";

    this.x = width / 2 - this.width / 2;
    this.y = height;

    //Function to draw it
    this.draw = function() {
        try {
            if (this.dir == "right") this.cy = 121;
            else if (this.dir == "left") this.cy = 201;
            else if (this.dir == "right_land") this.cy = 289;
            else if (this.dir == "left_land") this.cy = 371;

            if (draw_flag){
              ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
            }


        } catch (e) {}
    };

    this.jump = function() {
        this.vy = -8;
    };

    this.jumpHigh = function() {
        this.vy = -16;
    };

};

player = new Player();

//Platform class

function Platform() {
    this.width = 70;
    this.height = 17;

    this.x = Math.random() * (width - this.width);
    this.y = position;

    position += (height / platformCount);

    this.flag = 0;
    this.state = 0;

    //Sprite clipping
    this.cx = 0;
    this.cy = 0;
    this.cwidth = 105;
    this.cheight = 31;

    this.reward = 0;
    this.target = 0;
    //Function to draw it
    this.draw = function() {
        try {

            if (this.type == 1) this.cy = 0;
            else if (this.type == 2) this.cy = 61;
            else if (this.type == 3 && this.flag === 0) this.cy = 31;
            else if (this.type == 3 && this.flag == 1) this.cy = 1000;
            else if (this.type == 4 && this.state === 0) this.cy = 90;
            else if (this.type == 4 && this.state == 1) this.cy = 1000;

            if (draw_flag){
                ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
                ctx.fillText(this.reward, this.x + 30, this.y + 13);

                if(this.target){
                  ctx.fillText("TARGET", this.x + 20, this.y + 26);
                  ctx.fillText("|", platforms[target_platform].x, platforms[target_platform].y);
                  ctx.fillText("|", platforms[target_platform].x+platforms[target_platform].width, platforms[target_platform].y);
                }

                ctx.beginPath();
                ctx.moveTo(p.x + p.width/2, p.y + p.height/2);
                ctx.lineTo(player.x + player.width/2, player.y + player.height/2);

                if(this.target) {
                  ctx.strokeStyle = "black";
                  ctx.lineWidth = 1;
                  ctx.fillText("["  + states[i][2] + "," + states[i][1] + "," + states[i][0] + "]",
                  (p.x + p.width/2 + player.x + player.width/2) /2, (p.y + p.height/2 + player.y + player.height/2)/2);
                }
                // else if(this.reward < 0) {
                //   ctx.strokeStyle = "red";
                //   ctx.lineWidth = 1;
                // }
                // else {
                //   ctx.strokeStyle = "black";
                //   ctx.lineWidth = 1;
                // }

                ctx.stroke();



              }
        } catch (e) {}
    };

    //Platform types
    //1: Normal
    //2: Moving
    //3: Breakable (Go through)
    //4: Vanishable
    //Setting the probability of which type of platforms should be shown at what score
    if (score >= 5000) this.types = [2, 3, 3, 3, 4, 4, 4, 4];
    else if (score >= 2000 && score < 5000) this.types = [2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
    else if (score >= 1000 && score < 2000) this.types = [2, 2, 2, 3, 3, 3, 3, 3];
    else if (score >= 500 && score < 1000) this.types = [1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3];
    else if (score >= 100 && score < 500) this.types = [1, 1, 1, 1, 2, 2];
    else this.types = [1];

    this.type = this.types[Math.floor(Math.random() * this.types.length)];

    //We can't have two consecutive breakable platforms otherwise it will be impossible to reach another platform sometimes!
    if (this.type == 3 && broken < 1) {
        broken++;
    } else if (this.type == 3 && broken >= 1) {
        this.type = 1;
        broken = 0;
    }

    this.moved = 0;
    this.vx = 1;
}

for (var i = 0; i < platformCount; i++) {
    platforms.push(new Platform());
}

//Broken platform object
var Platform_broken_substitute = function() {
    this.height = 30;
    this.width = 70;

    this.x = 0;
    this.y = 0;

    //Sprite clipping
    this.cx = 0;
    this.cy = 554;
    this.cwidth = 105;
    this.cheight = 60;

    this.appearance = false;

    this.draw = function() {
        try {
            if (draw_flag)
                if (this.appearance === true) ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
                else return;
        } catch (e) {}
    };
};

var platform_broken_substitute = new Platform_broken_substitute();

//Spring Class
var spring = function() {
    this.x = 0;
    this.y = 0;

    this.width = 26;
    this.height = 30;

    //Sprite clipping
    this.cx = 0;
    this.cy = 0;
    this.cwidth = 45;
    this.cheight = 53;

    this.state = 0;

    this.draw = function() {
        try {
            if (this.state === 0) this.cy = 445;
            else if (this.state == 1) this.cy = 501;

            if (draw_flag)
                ctx.drawImage(image, this.cx, this.cy, this.cwidth, this.cheight, this.x, this.y, this.width, this.height);
        } catch (e) {}
    };
};

var Spring = new spring();

function init() {
    //Variables for the game
    var dir = "left",
        jumpCount = 0;

    firstRun = false;

    //Function for clearing canvas in each consecutive frame

    function paintCanvas() {
        ctx.clearRect(0, 0, width, height);
    }

    decision = -39; // the point at which a prediction is made
    function playerCalc() {
        // When the player is almost at the top of the arc, predict where to go
        if (Math.round(player.vy * 5) == decision) // scale to reduce number of calls to one per jump
            decide();

        // face the direction of target platform
        if (direction(target_platform) == "left") {
            player.dir = "left";
            if (player.vy < -7 && player.vy > -15) player.dir = "left_land";
        } else if (direction(target_platform) == "right") {
            player.dir = "right";
            if (player.vy < -7 && player.vy > -15) player.dir = "right_land";
        }

        // move towards target platform
        if (direction(target_platform) == "left") {
            player.x += player.vx;
            player.vx -= 0.15;
            //stop moving if we're above the target platform
            if (player.x >= platforms[target_platform].x && player.x <= (platforms[target_platform].x + width && platforms[target_platform] > player.y)){
              player.vx = 0;
            }
        } else {
            player.x += player.vx;
            if (player.vx < 0) player.vx += 0.1;
        }
        //////

        if (direction(target_platform) == "right") {
            player.x += player.vx;
            player.vx += 0.15;
            //stop moving in x direction if we are above the target platform
            if (player.x >= platforms[target_platform].x && player.x <= (platforms[target_platform].x + width && platforms[target_platform] > player.y)){
              player.vx = 0;
            }
        } else {
            player.x += player.vx;
            if (player.vx > 0) player.vx -= 0.1;
        }


        // if (dir == "left") {
        //   player.dir = "left";
        //   if (player.vy < -7 && player.vy > -15) player.dir = "left_land";
        // } else if (dir == "right") {
        //   player.dir = "right";
        //   if (player.vy < -7 && player.vy > -15) player.dir = "right_land";
        // }

        //Adding keyboard controls
        document.onkeydown = function(e) {
            var key = e.keyCode;

            if (key == 37) {
                dir = "left";
                player.isMovingLeft = true;
            } else if (key == 39) {
                dir = "right";
                player.isMovingRight = true;
            }

            if (key == 32) {
                if (firstRun === true)
                    init();
                else
                    reset();
            }
        };

        document.onkeyup = function(e) {
            var key = e.keyCode;

            if (key == 37) {
                dir = "left";
                player.isMovingLeft = false;
            } else if (key == 39) {
                dir = "right";
                player.isMovingRight = false;
            }
        };

        //Accelerations produces when the user hold the keys
        if (player.isMovingLeft === true) {
            player.x += player.vx;
            player.vx -= 0.15;
        } else {
            player.x += player.vx;
            if (player.vx < 0) player.vx += 0.1;
        }

        if (player.isMovingRight === true) {
            player.x += player.vx;
            player.vx += 0.15;
        } else {
            player.x += player.vx;
            if (player.vx > 0) player.vx -= 0.1;
        }

        // Speed limits!
        if (player.vx > 8)
            player.vx = 8;
        else if (player.vx < -8)
            player.vx = -8;

        //console.log(player.vx);

        //Jump the player when it hits the base
        if ((player.y + player.height) > base.y && base.y < height) player.jump();

        //Gameover if it hits the bottom
        if (base.y > height && (player.y + player.height) > height && player.isDead != "lol") player.isDead = true;

        //Make the player move through walls
        if (player.x > width) player.x = 0 - player.width;
        else if (player.x < 0 - player.width) player.x = width;

        //Movement of player affected by gravity
        if (player.y >= (height / 2) - (player.height / 2)) {
            player.y += player.vy;
            player.vy += gravity;
        }

        //When the player reaches half height, move the platforms to create the illusion of scrolling and recreate the platforms that are out of viewport...
        else {
            platforms.forEach(function(p, i) {

                if (player.vy < 0) {
                    p.y -= player.vy;
                }

                if (p.y > height) {
                    platforms[i] = new Platform();
                    platforms[i].y = p.y - height;
                }

            });

            base.y -= player.vy;
            player.vy += gravity;

            if (player.vy >= 0) {
                player.y += player.vy;
                player.vy += gravity;
            }

            if (base.y > baseHeight) {
                score++;
            }

            baseHeight = Math.max(base.y, baseHeight);
        }

        //Make the player jump when it collides with platforms
        collides();

        if (player.isDead === true) gameOver();
    }

    //Spring algorithms

    function springCalc() {
        var s = Spring;
        var p = platforms[0];

        if (p.type == 1 || p.type == 2) {
            s.x = p.x + p.width / 2 - s.width / 2;
            s.y = p.y - p.height - 10;

            if (s.y > height / 1.1) s.state = 0;

            s.draw();
        } else {
            s.x = 0 - s.width;
            s.y = 0 - s.height;
        }
    }

    //Platform's horizontal movement (and falling) algo

    function platformCalc() {
        var subs = platform_broken_substitute;

        platforms.forEach(function(p, i) {
            if (p.type == 2) {
                if (p.x < 0 || p.x + p.width > width) p.vx *= -1;

                p.x += p.vx;
            }

            if (p.flag == 1 && subs.appearance === false && jumpCount === 0) {
                subs.x = p.x;
                subs.y = p.y;
                subs.appearance = true;

                jumpCount++;
            }

            p.draw();
        });

        if (subs.appearance === true) {
            subs.draw();
            subs.y += 8;
        }

        if (subs.y > height) subs.appearance = false;
    }

    function collides() {
        //Platforms
        platforms.forEach(function(p, i) {
            if (player.vy > 0 && p.state === 0 && (player.x + 15 < p.x + p.width) && (player.x + player.width - 15 > p.x) && (player.y + player.height > p.y) && (player.y + player.height < p.y + p.height)) {

                if (p.type == 3 && p.flag === 0) {
                    previous_collision = i;
                    p.flag = 1;
                    jumpCount = 0;
                    return;
                } else if (p.type == 4 && p.state === 0) {
                    previous_collision = i;
                    player.jump();
                    p.state = 1;
                } else if (p.flag == 1){
                    previous_collision = i;
                    return;
                }
                else {
                    previous_collision = i;
                    player.jump();
                }
            }
        });

        //Springs
        var s = Spring;
        if (player.vy > 0 && (s.state === 0) && (player.x + 15 < s.x + s.width) && (player.x + player.width - 15 > s.x) && (player.y + player.height > s.y) && (player.y + player.height < s.y + s.height)) {
            s.state = 1;
            previous_collision = 0;
            player.jumpHigh();
        }

    }

    function updateScore() {
        if (draw_flag) {
            var scoreText = document.getElementById("score");
            scoreText.innerHTML = score;
        }
    }

    function gameOver() {
        decide();
        platforms.forEach(function(p, i) {
            p.y -= 12;
        });

        if (player.y > height / 2 && flag === 0) {
            player.y -= 8;
            player.vy = 0;
        } else if (player.y < height / 2) flag = 1;
        else if (player.y + player.height > height) {
            showGoMenu();
            hideScore();
            player.isDead = "lol";

            var tweet = document.getElementById("tweetBtn");
            tweet.href = 'http://twitter.com/share?url=http://is.gd/PnFFzu&text=I just scored ' + score + ' points in the HTML5 Doodle Jump game!&count=horiztonal&via=cssdeck&related=solitarydesigns';

            var facebook = document.getElementById("fbBtn");
            facebook.href = 'http://facebook.com/sharer.php?s=100&p[url]=http://cssdeck.com/labs/html5-doodle-jump/8&p[title]=I just scored ' + score + ' points in the HTML5 Doodle Jump game!&p[summary]=Can you beat me in this awesome recreation of Doodle Jump created in HTML5?';

        }
    }

    //Function to update everything

    function update() {
        paintCanvas();
        platformCalc();

        springCalc();

        playerCalc();
        player.draw();

        base.draw();

        updateScore();
    }

    menuLoop = function() {
        return;
    };
    animloop = function() {
        for (i = 0; i < gamespeed; i++)
            update();
        requestAnimFrame(animloop);
    };

    animloop();

    hideMenu();
    showScore();
}

scores = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function reset() {
    // record iteration and score for graphing library
    scores[currentIteration % 11] = score;
    average = (scores[0] + scores[1] + scores[2] + scores[3] + scores[4] + scores[5] + scores[6] + scores[7] + scores[8] + scores[9]) / 10;
    //sorted = scores.sort(function(a,b){return a-b;});
    //console.log(sorted);
    //median = sorted[5];
    //max = sorted[10];
    if (currentIteration % 10 == 0) {
        ScorePerLifeChartDPS.push({
            x: currentIteration,
            y: average
        });
        Chart2DPS.push({
            x: currentIteration,
            y: brain.explored
        });
        updateChart();
        store.set('brain', brain);

    }
    hideGoMenu();
    showScore();
    player.isDead = false;

    flag = 0;
    position = 0;
    score = base_score;
    baseHeight = 0;
    currentIteration++;


    base = new Base();
    player = new Player();
    Spring = new spring();
    platform_broken_substitute = new Platform_broken_substitute();

    platforms = [];
    for (var i = 0; i < platformCount; i++) {
        platforms.push(new Platform());
    }

    // player.x = platforms[0].x;
    // player.y = platforms[0].y;
}

//Hides the menu
function hideMenu() {
    var menu = document.getElementById("mainMenu");
    menu.style.zIndex = -1;
}

//Shows the game over menu
function showGoMenu() {
    var menu = document.getElementById("gameOverMenu");
    menu.style.zIndex = 1;
    menu.style.visibility = "visible";

    var scoreText = document.getElementById("go_score");
    scoreText.innerHTML = "You scored " + score + " points!";
}

//Hides the game over menu
function hideGoMenu() {
    var menu = document.getElementById("gameOverMenu");
    menu.style.zIndex = -1;
    menu.style.visibility = "hidden";
}

//Show ScoreBoard
function showScore() {
    var menu = document.getElementById("scoreBoard");
    menu.style.zIndex = 1;
}

//Hide ScoreBoard
function hideScore() {
    var menu = document.getElementById("scoreBoard");
    menu.style.zIndex = -1;
}

function playerJump() {

    player.y += player.vy;
    player.vy += gravity;

    if (player.vy > 0 &&
        (player.x + 15 < 260) &&
        (player.x + player.width - 15 > 155) &&
        (player.y + player.height > 475) &&
        (player.y + player.height < 500))
        player.jump();

    if (dir == "left") {
        player.dir = "left";
        if (player.vy < -7 && player.vy > -15) player.dir = "left_land";
    } else if (dir == "right") {
        player.dir = "right";
        if (player.vy < -7 && player.vy > -15) player.dir = "right_land";
    }

    //Adding keyboard controls
    document.onkeydown = function(e) {
        var key = e.keyCode;

        if (key == 37) {
            dir = "left";
            player.isMovingLeft = true;
        } else if (key == 39) {
            dir = "right";
            player.isMovingRight = true;
        }

        if (key == 32) {
            if (firstRun === true) {
                init();
                firstRun = false;
            } else
                reset();
        }




    };

    document.onkeyup = function(e) {
        var key = e.keyCode;

        if (key == 37) {
            dir = "left";
            player.isMovingLeft = false;
        } else if (key == 39) {
            dir = "right";
            player.isMovingRight = false;
        }

    };

    //Accelerations produces when the user hold the keys
    if (player.isMovingLeft === true) {
        player.x += player.vx;
        player.vx -= 0.15;
    } else {
        player.x += player.vx;
        if (player.vx < 0) player.vx += 0.1;
    }

    if (player.isMovingRight === true) {
        player.x += player.vx;
        player.vx += 0.15;
    } else {
        player.x += player.vx;
        if (player.vx > 0) player.vx -= 0.1;
    }

    //Jump the player when it hits the base
    if ((player.y + player.height) > base.y && base.y < height) player.jump();

    //Make the player move through walls
    if (player.x > width) player.x = 0 - player.width;
    else if (player.x < 0 - player.width) player.x = width;

    player.draw();
}

function update() {
    ctx.clearRect(0, 0, width, height);
    playerJump();
}

menuLoop = function() {
    update();
    requestAnimFrame(menuLoop);
};

menuLoop();


window.onbeforeunload = function (event) {
    //save the master brain to disk before exiting
    store.set('brain', brain);

    var message = 'Are you sure you wish to stop running this algorithm?';
    if (typeof event == 'undefined') {
      event = window.event;
    }
    if (event) {
      event.returnValue = message;
    }
    return message;

};
