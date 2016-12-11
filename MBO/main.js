window.onload = () => {

    // Zmienne dotyczące canvasu
    let canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    width = canvas.width = 800,
    height = canvas.height = 600;

    // Ustawienia pętli
    let isRunning = false,
        lastFrameTime = 0,
        deltaTime = 0,
        beeSpeed = 0.5,
        timer = 0,
        animationId = 0;

    class Bee {
        constructor(){
            this.PositionX = -1;
            this.PositionY = -1;
            this.Nectar = 0;
        }
    }


    // Zmiene algorytmu
    let population = 20,
    queens = Array(population),
    workers = Array(0),
    broods = Array(0),
    maxIteration = 100,
    lBoundryX = -width/2,
    uBoundryX = width/2,
    lBoundryY = -height/2,
    uBoundryY = height/2,
    speed = 10,
    spermathecaSize = 5,
    initialEnergy = 100,
    alpha = 0.9,
    step = 10,
    globalBestSolutionX = Infinity,
    globalBestSolutionY = Infinity;

    class Queen extends Bee {
        constructor(){
            super();
            this.Energy = initialEnergy;
            this.Spermatheca = Array(0);
            this.Speed = speed;
        }
    }

    let DrawQueen = (bee) => {
        ctx.beginPath();
        ctx.arc(bee.PositionX, bee.PositionY, 10, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
    }

    let DrawBrood = (bee) => {
        ctx.beginPath();
        ctx.arc(bee.PositionX, bee.PositionY, 7, 0, 2 * Math.PI, false);
        ctx.fillStyle = "rgba(41, 98, 255, 0.5)";
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
    }

    let DrawGlobal = (x,y) => {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
    }

    let DrawLines = () => {
        ctx.beginPath();
        ctx.moveTo(-width/2,0);
        ctx.lineTo(width/2,0);
        ctx.strokeStyle = '#000000';
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0,-height/2);
        ctx.lineTo(0,height/2);
        ctx.strokeStyle = '#000000';
        ctx.stroke();
    }

    // funkcja sprawdzania fitnessu
    let FitnessFunction = (bee) => {
        if(bee.PositionX >= 0 && bee.PositionY >= 0) {
            return 1/(1+Math.abs(bee.PositionX + bee.PositionY));
        } else if (bee.PositionX >= 0 && bee.PositionY < 0){
            return 1/(1+Math.abs(bee.PositionX - bee.PositionY));
        } else if (bee.PositionX < 0 && bee.PositionY >= 0){
            return 1/(1+Math.abs(bee.PositionX - bee.PositionY));
        } else {
            return 1/(1+Math.abs(bee.PositionX + bee.PositionY));
        }
    }

    // Inicializacja
    let Init = () => {
        for(let i=0;i<queens.length;i++) {
            queens[i] = new Queen();
            queens[i].PositionX = lBoundryX + Math.random() * (uBoundryX - lBoundryX);
            queens[i].PositionY = lBoundryY + Math.random() * (uBoundryY - lBoundryY);
            queens[i].Nectar = FitnessFunction(queens[i]);
        
            let globalBee = new Bee();
            globalBee.PositionX = globalBestSolutionX;
            globalBee.PositionY = globalBestSolutionY;
            if(FitnessFunction(globalBee) < FitnessFunction(queens[i])){
                globalBee.PositionX = globalBestSolutionX = queens[i].PositionX;
                globalBee.PositionY = globalBestSolutionY = queens[i].PositionY;
            }
        }
    }

    let LookingForPartner = () => {
    
        
        for(let i=0;i<queens.length;i++) {
            
            queens[i].Energy = initialEnergy;
            queens[i].Spermatheca = Array(0);
            queens[i].Speed = speed;

            let drone = new Bee();

            while(queens[i].Energy > 0 && queens[i].Spermatheca.length < spermathecaSize) {

                // choose drone
                let phi = -speed + (speed + speed) * Math.random();
                drone.PositionX = queens[i].PositionX + ( phi );
                if(drone.PositionX < lBoundryX) drone.PositionX = lBoundryX;
                if(drone.PositionX > uBoundryX) drone.PositionX = uBoundryX;

                phi = -speed + (speed + speed) * Math.random();
                drone.PositionY = drone.PositionY + ( phi );
                if(drone.PositionY < lBoundryY) drone.PositionY = lBoundryY;
                if(drone.PositionY > uBoundryY) drone.PositionY = uBoundryY;

                drone.Nectar = FitnessFunction(drone);

                // check probability and add drone
                let prob = Math.exp(-( Math.abs(drone.Nectar - queens[i].Nectar)/queens[i].Speed ));
                if(prob > Math.random()){
                    queens[i].Spermatheca.push(drone);
                }
                
                // update queen's internal speed and energy
                queens[i].Speed *= alpha;
                queens[i].Energy -= step;

            }

            DrawQueen(queens[i]);
        }
    }

    let GenerateBroods = () => {

        for(let i=0;i<queens.length;i++) {
            
            let randomSperm = Math.floor( queens[i].Spermatheca.length * Math.random() );
            let brood = new Queen();

            let droneX = queens[i].Spermatheca[randomSperm].PositionX;
            let droneY = queens[i].Spermatheca[randomSperm].PositionY;
            let queenX = queens[i].PositionX;
            let queenY = queens[i].PositionY;

            let randomX = Math.random();
            let randomY = Math.random();

            if(randomX > 0.5){
                brood.PositionX = droneX;
            } else {
                brood.PositionX = queenX;
            }

            if(randomY > 0.5){
                brood.PositionY = droneY;
            } else {
                brood.PositionY = queenY;
            }

            // TODO: ADD WORKERS
            DrawBrood(brood);
            brood.Nectar = FitnessFunction(brood);
            broods.push(brood);

            
        }

    }

    let ChooseQueen = () => {

        for(let i=0;i<queens.length;i++){

            for(let j=0;j<broods.length;j++){
                if(queens[i].Nectar < broods[j].Nectar){
                    let tmp = broods[j];
                    broods[j] = queens[i];
                    queens[i] = tmp;
                }
            }

        }

        broods = Array(0);

    }


    let UpdateGlobalPhase = () => {
        let globalBee = new Bee();
        globalBee.PositionX = globalBestSolutionX;
        globalBee.PositionY = globalBestSolutionY;
        for(let i=0;i<queens.length;i++){
            if(FitnessFunction(globalBee) < FitnessFunction(queens[i])){
                globalBee.PositionX = globalBestSolutionX = queens[i].PositionX;
                globalBee.PositionY = globalBestSolutionY = queens[i].PositionY;
            }
        }
        DrawGlobal(globalBestSolutionX,globalBestSolutionY);
    }

    let Reset = () => {
        window.cancelAnimationFrame(animationId);
        population = parseInt( document.getElementById("populationNumber").value);
        queens = Array(population);
        workers = Array(0);
        broods = Array(0);
        maxIteration = document.getElementById("maxIteration").value;
        if(maxIteration == ""){
            maxIteration = 100;
        }
        speed = document.getElementById("speed").value;
        if(speed == ""){
            speed = 10;
        }
        speed = Math.abs(speed);
        spermathecaSize = document.getElementById("spermathecaSize").value;
        if(spermathecaSize == ""){
            spermathecaSize = 10;
        }
        spermathecaSize = Math.abs(spermathecaSize);
        step = document.getElementById("step").value;
        if(step == ""){
            step = 10;
        }
        step = Math.abs(step);

        alpha = parseFloat(document.getElementById("alpha").value);
        if (isNaN(alpha)) {
            alpha = 1;
        }

        globalBestSolutionX = Infinity;
        globalBestSolutionY = Infinity;
        Init();
        animationId = window.requestAnimationFrame(Update);

    }

    let Update = () => {
        // delta time
        let timestamp = performance.now();  
        deltaTime = (timestamp - lastFrameTime) / 1000;
        lastFrameTime = timestamp;
        timer += deltaTime;

        if(timer >= beeSpeed){
            if(isRunning && maxIteration > 0){
                ctx.clearRect(lBoundryX,lBoundryY,width,height);
                DrawLines();
                LookingForPartner();
                GenerateBroods();
                ChooseQueen();
                UpdateGlobalPhase();
                maxIteration -= 1;
            }
            beeSpeed = 1 - document.getElementById("speedRange").value / 100;
            isRunning = document.getElementById("playBtn").checked;
            timer -= beeSpeed;
        }

        animationId = window.requestAnimationFrame(Update);
    }

    // Reset button inicializacja
    animationId = document.getElementById("resetBtn").onclick = Reset;


    ctx.translate(width/2,height/2);
    Init();
    window.requestAnimationFrame(Update);
    //setInterval( Update, 500);

    
}

