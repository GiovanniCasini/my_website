const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particlesArray;

let mouse = {
    x: null,
    y: null
}

window.addEventListener('mousemove',
    function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.mysize = size;
        this.color = color;
        this.count = size;
        this.pulsing = false;
        this.grow = false;
        this.degrow = false;
        this.signal = false;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        this.x += this.directionX;
        this.y += this.directionY;

         if (this.pulsing == true) {
            if (this.grow == true) {
                if (this.size < 8) {
                    this.count += 1;
                    this.size = this.count / 1.5;
                }
                else {
                    this.grow = false;
                    this.degrow = true;
                }
            }

            if (this.degrow == true) {
                if (this.size > this.mysize) {
                    this.count -= 1;
                    this.size = this.count / 1.5;
                }
                else {
                    this.signal = true;
                    this.count = 0;
                    this.degrow = false;
                    this.color = 'rgb(19, 176, 255, 0.3)';
                }
            }
            if (this.signal == true) {
                this.count += 1
                if (this.count > 10) {
                    this.signal = false;
                    this.pulsing = false;
                }
            } 
        } 
        this.draw();
    }

    pulse() {
        if (this.pulsing == false) {
            this.pulsing = true;
            this.grow = true;
            this.color = '#fff';
        }
    }
}

function init() {
    particlesArray= [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 4) + 2;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = 'rgb(19, 176, 255, 0.3)'
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function connect(){
    let opacityValue = 0.2;
    for (let a = 0; a < particlesArray.length; a++){
        for (let b = a; b < particlesArray.length; b++){
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
            + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 0.2 - (distance/80000);
                if (particlesArray[b].signal == true) {
                    particlesArray[a].pulse();
                    ctx.strokeStyle='rgb(255, 255, 255,' + (opacityValue * 4) + ')';
                } 
                else {
                    ctx.strokeStyle='rgb(98, 239, 255,' + opacityValue + ')';
                }
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function lastParticleUpdate(){
    particlesArray[particlesArray.length - 1].pulse();
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

window.addEventListener('resize',
    function(){
        canvas.width = innerWidth;
        canvas.height = innerHeight;
    }
);

window.addEventListener('mouseout',
    function(){
        mouse.x = undefined;
        mouse.y = undefined;
    }
);

window.addEventListener('click',
    function(){
        particlesArray.push(new Particle(mouse.x, mouse.y, (Math.random() * 5) - 2.5, (Math.random() * 5) - 2.5,
         (Math.random() * 4) + 2, 'rgb(19, 176, 255, 0.3)'));
        lastParticleUpdate();
    }
);

init();
animate();

