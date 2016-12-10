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
    employed = Array(population),
    recruter = Array(0),
    recruterProb = Array(0),
    uncommited = Array(0),
    maxIteration = 100,
    indexOfHigestNectar = 0,
    indexOfLowestNectar = 0,
    lBoundryX = -width/2,
    uBoundryX = width/2,
    lBoundryY = -height/2,
    uBoundryY = height/2,
    velocity = 20,
    globalBestSolutionX = Infinity,
    globalBestSolutionY = Infinity;

    let DrawEmployed = (bee) => {
        ctx.beginPath();
        ctx.arc(bee.PositionX, bee.PositionY, 10, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'green';
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
        for(let i=0;i<employed.length;i++) {
            employed[i] = new Bee();
            employed[i].PositionX = lBoundryX + Math.random() * (uBoundryX - lBoundryX);
            employed[i].PositionY = lBoundryY + Math.random() * (uBoundryY - lBoundryY);
            employed[i].Nectar = FitnessFunction(employed[i]);
        }
    }

    let ForwardPass = () => {
    
        
        for(let i=0;i<employed.length;i++) {

            let phi = -velocity + (velocity + velocity) * Math.random();
            employed[i].PositionX = employed[i].PositionX + ( phi );
            if(employed[i].PositionX < lBoundryX) employed[i].PositionX = lBoundryX;
            if(employed[i].PositionX > uBoundryX) employed[i].PositionX = uBoundryX;

            phi = -velocity + (velocity + velocity) * Math.random();
            employed[i].PositionY = employed[i].PositionY + ( phi );
            if(employed[i].PositionY < lBoundryY) employed[i].PositionY = lBoundryY;
            if(employed[i].PositionY > uBoundryY) employed[i].PositionY = uBoundryY;

            employed[i].Nectar = FitnessFunction(employed[i]);
            if(employed[indexOfHigestNectar].Nectar <= employed[i].Nectar){
                indexOfHigestNectar = i;
            }
            if(employed[indexOfLowestNectar].Nectar >= employed[i].Nectar){
                indexOfLowestNectar = i;
            }
            DrawEmployed(employed[i]);
        }
    }

    let BackwardPass = () => {

        // loyalty decision
        let Omax = (employed[indexOfHigestNectar].Nectar - employed[indexOfLowestNectar].Nectar)/(employed[indexOfHigestNectar].Nectar - employed[indexOfLowestNectar].Nectar); 
        let Osum = 0;

        for(let i=0;i<employed.length;i++){

            let Ob = (employed[i].Nectar - employed[indexOfLowestNectar].Nectar)/(employed[indexOfHigestNectar].Nectar - employed[indexOfLowestNectar].Nectar); 
            let p = Math.exp(-( Omax - Ob ));
            
            let rnd = Math.random();
            if(rnd <= p){
                recruter.push(employed[i]);
                recruterProb.push(Ob);
                Osum += Ob;
            } else {
                uncommited.push(employed[i]);
            }

        }

        // recrution
        for(let i=0;i<recruterProb.length;i++){
            recruterProb[i] = recruterProb[i] / Osum;
        }
        
        for(let i=0;i<uncommited.length;i++){
            let rnd = Math.random();
            let propSum = 0;
            let ChoosenRecruter = 0;
            for(let j=0;j<recruterProb.length;j++) {
                if(rnd >= propSum && rnd <= (propSum + recruterProb[j])) {
                    ChoosenRecruter = recruter[j];
                    break;
                }
                propSum += recruterProb[j];
            }
            uncommited[i].PositionX = ChoosenRecruter.PositionX;
            uncommited[i].PositionY = ChoosenRecruter.PositionY;
        }

        employed = [];
        for(let i=0;i<recruter.length;i++){
            employed.push(recruter[i]);
        }
        for(let i=0;i<uncommited.length;i++){
            employed.push(uncommited[i]);
        }
        recruterProb = [];
        recruter = [];
        uncommited = [];
    }


    let UpdateGlobalPhase = () => {
        let globalBee = new Bee();
        globalBee.PositionX = globalBestSolutionX;
        globalBee.PositionY = globalBestSolutionY;
        for(let i=0;i<employed.length;i++){
            if(FitnessFunction(globalBee) < FitnessFunction(employed[i])){
                globalBee.PositionX = globalBestSolutionX = employed[i].PositionX;
                globalBee.PositionY = globalBestSolutionY = employed[i].PositionY;
            }
        }
        DrawGlobal(globalBestSolutionX,globalBestSolutionY);
    }

    let Reset = () => {
        window.cancelAnimationFrame(animationId);
        population = parseInt( document.getElementById("populationNumber").value);
        employed = Array(population);
        recruter = Array(0);
        recruterProb = Array(0);
        uncommited = Array(0);
        indexOfHigestNectar = 0;
        maxIteration = document.getElementById("maxIteration").value;
        if(maxIteration == ""){
            maxIteration = 100;
        }
        velocity = document.getElementById("velocity").value;
        if(velocity == ""){
            velocity = 10;
        }
        velocity = Math.abs(velocity);
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
                ForwardPass();
                BackwardPass();
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

