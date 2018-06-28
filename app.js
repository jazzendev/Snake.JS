(function () {
    let canvas = document.getElementById("app");
    let ctx = canvas.getContext("2d");

    let px = py = 10;
    let ax = ay = 15;
    let xv = yv = 0;
    let gs = unit = 20;
    let tail = score = 5;
    let snake = [];
    let speed = step = 5;
    let previousFramTime = 0;
    let paused = false;

    // go right at begin
    xv = 1;

    function game(time) {
        step--;
        if (step == 0) {
            px += xv;
            py += yv;

            if (px > gs - 1) {
                px = 0;
            }
            if (px < 0) {
                px = gs - 1;
            }
            if (py > gs - 1) {
                py = 0;
            }
            if (py < 0) {
                py = gs - 1;
            }

            paused = xv == 0 && yv == 0;

            if (!paused) {
                for (var i = 0; i < snake.length; i++) {
                    ctx.fillRect(snake[i].x * unit + 1, snake[i].y * unit + 1, unit - 1, unit - 2);
                    if (px == snake[i].x && py == snake[i].y) {
                        tail = 5;
                    }
                }

                snake.push({x: px, y: py})
                while (snake.length > tail) {
                    snake.shift();
                }

                if (px == ax && py == ay) {
                    tail++;
                    if (tail >= score) {
                        score = tail;
                    }
                    ax = Math.floor(Math.random() * gs);
                    ay = Math.floor(Math.random() * gs);
                }
            }
            step = speed;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // calculate FPS
        let FPS = Math.floor(1000 / (time - previousFramTime))
        previousFramTime = time;
        ctx.fillStyle = "white";
        ctx.fillRect(gs * unit, gs * unit, gs * unit, gs * unit + 20);

        ctx.fillStyle = "black";
        ctx.font = 'normal 15px Arial';
        ctx.fillText(`FPS: ${FPS}    Length: ${snake.length}    High Score: ${score}`, 20, 415);


        // draw background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, gs * unit, gs * unit);

        if (paused) {
            // draw pause text
            ctx.fillStyle = "red";
            ctx.font = 'normal 50px Arial';
            ctx.fillText('PAUSED', 100, 220);
        } else {
            // draw snake
            ctx.fillStyle = "lime";
            for (var i = 0; i < snake.length; i++) {
                ctx.fillRect(snake[i].x * unit + 1, snake[i].y * unit + 1, unit - 1, unit - 2);
            }

            // draw apple
            ctx.fillStyle = "red";
            ctx.fillRect(ax * unit + 1, ay * unit + 1, unit - 2, unit - 2);
        }

        requestAnimationFrame(game);
    }

    function keydown(e) {
        switch (e.keyCode) {
            case 37:
            case 65:
                xv = xv==1?1:-1;
                yv = 0;
                break;
            case 38:
            case 87:
                xv = 0;
                yv = yv==1?1:-1;
                break;
            case 39:
            case 68:
                xv = xv==-1?-1:1;
                yv = 0;
                break;
            case 40:
            case 83:
                xv = 0;
                yv = yv==-1?-1:1;
                break;
            case 27:
                xv = yv = 0;
                break;
        }
    }

    window.addEventListener("load", game, false);
    window.addEventListener("keydown", keydown);

    window.addEventListener('touchstart', handleTouchStart, false);
    window.addEventListener('touchmove', handleTouchMove, false);

    let xDown = null;
    let yDown = null;

    function handleTouchStart(evt) {
        xDown = evt.originalEvent
            ? evt.originalEvent.touches[0].clientX
            : evt.touches[0].clientX;
        yDown = evt.originalEvent
            ? evt.originalEvent.touches[0].clientY
            : evt.touches[0].clientY;
    };

    function handleTouchMove(evt) {

        if (!xDown || !yDown) {
            return;
        }

        var xUp = evt.originalEvent
            ? evt.originalEvent.touches[0].clientX
            : evt.touches[0].clientX;
        var yUp = evt.originalEvent
            ? evt.originalEvent.touches[0].clientY
            : evt.touches[0].clientY;

        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;

        if (Math.abs(xDiff) > Math.abs(yDiff)) {/*most significant*/
            if (xDiff > 0) {
                /* left swipe */
                xv = xv==1?1:-1;
                yv = 0;
            } else {
                /* right swipe */
                xv = xv==-1?-1:1;
                yv = 0;
            }
        } else {
            if (yDiff > 0) {
                /* up swipe */
                xv = 0;
                yv = yv==1?1:-1;
            } else {
                /* down swipe */
                xv = 0;
                yv = yv==-1?-1:1;
            }
        }
        /* reset values */
        xDown = null;
        yDown = null;
    };
})();