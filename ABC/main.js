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
    onlooker = Array(population),
    scout = Array(population),
    propArr = Array(population),
    maxIteration = 100,
    employedChances = 10,
    a = 1,
    lBoundryX = -width/2,
    uBoundryX = width/2,
    lBoundryY = -height/2,
    uBoundryY = height/2,
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

    let DrawOnlooker = (bee) => {
        ctx.beginPath();
        ctx.arc(bee.PositionX, bee.PositionY, 7, 0, 2 * Math.PI, false);
        //ctx.fillStyle = 'blue';
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
        for(let i=0;i<employed.length;i++) {
            employed[i] = new Bee();
            employed[i].PositionX = lBoundryX + Math.random() * (uBoundryX - lBoundryX);
            employed[i].PositionY = lBoundryY + Math.random() * (uBoundryY - lBoundryY);
            employed[i].Nectar = FitnessFunction(employed[i]);

            scout[i] = 0;
            onlooker[i] = new Bee();
        }
    }

    let EmployedPhase = () => {
        for(let i=0;i<employed.length;i++) {

            
            // wybór pozycji w sąsiedztwie
            let neighbourhoodX,neighbourhoodY;
            do{
                neighbourhoodX = lBoundryX + Math.random() * (uBoundryX - lBoundryX);
            }while(neighbourhoodX == employed[i].PositionX);
            do{
                neighbourhoodY = lBoundryY + Math.random() * (uBoundryY - lBoundryY);
            }while(neighbourhoodY == employed[i].PositionY);

            let tmpBee = new Bee();
            
            let phi = -a + ((a + a) * Math.random());
            tmpBee.PositionX = employed[i].PositionX + ( phi*( employed[i].PositionX - neighbourhoodX ) );
            if(tmpBee.PositionX < lBoundryX) tmpBee.PositionX = lBoundryX;
            if(tmpBee.PositionX > uBoundryX) tmpBee.PositionX = uBoundryX;
        
            phi = -a + ((a + a) * Math.random());
            tmpBee.PositionY = employed[i].PositionY + ( phi*( employed[i].PositionY - neighbourhoodY ) );
            if(tmpBee.PositionY < lBoundryY) tmpBee.PositionY = lBoundryY;
            if(tmpBee.PositionY > uBoundryY) tmpBee.PositionY = uBoundryY;
        
            tmpBee.Nectar = FitnessFunction(tmpBee);
            if(tmpBee.Nectar >= employed[i].Nectar) {
                employed[i].PositionX = tmpBee.PositionX;
                employed[i].PositionY = tmpBee.PositionY;
                employed[i].Nectar = tmpBee.Nectar;
            } else {
                scout[i] = scout[i] + 1;
            }
            DrawEmployed(employed[i]);
        }

    }

    let OnlookerPhase = () => {

        let sum = 0;
        for(let i=0;i<employed.length;i++) {
            propArr[i] = employed[i].Nectar;
            sum += propArr[i];
        }

        for(let i=0;i<propArr.length;i++){
            propArr[i] = propArr[i]/sum;
        }

        for(let i=0;i<onlooker.length;i++){
            let rnd = Math.random();
            let propSum = 0;
            let ChoosenEmployed = 0;
            for(let j=0;j<propArr.length;j++) {
                if(rnd >= propSum && rnd < (propSum + propArr[j])) {
                    ChoosenEmployed = employed[j];
                    break;
                }
                propSum += propArr[j];
            }
            onlooker[i].PositionX = ChoosenEmployed.PositionX;
            onlooker[i].PositionY = ChoosenEmployed.PositionY;
            
            // neighbourhood source
            let k = Math.floor(Math.random() * population);
            while(i==k) {
                k = Math.floor(Math.random() * population);
            }
            let phi = -a + ((a + a) * Math.random());
            onlooker[i].PositionX = onlooker[i].PositionX + ( phi*( onlooker[i].PositionX - employed[k].PositionX ) );
            if(onlooker[i].PositionX < lBoundryX) onlooker[i].PositionX = lBoundryX;
            if(onlooker[i].PositionX > uBoundryX) onlooker[i].PositionX = uBoundryX;
        
            phi = -a + ((a + a) * Math.random());
            onlooker[i].PositionY = onlooker[i].PositionY + ( phi*( onlooker[i].PositionY - employed[k].PositionY ) );
            if(onlooker[i].PositionY < lBoundryY) onlooker[i].PositionY = lBoundryY;
            if(onlooker[i].PositionY > uBoundryY) onlooker[i].PositionY = uBoundryY;
        
            onlooker[i].Nectar = FitnessFunction(onlooker[i]);


            DrawOnlooker(onlooker[i]);
        }
    }

    let ScoutPhase = () => {
        for(let i=0;i<scout.length;i++) {
            if(scout[i] >= employedChances){
                employed[i].PositionX = lBoundryX + Math.random() * (uBoundryX - lBoundryX);
                employed[i].PositionY = lBoundryY + Math.random() * (uBoundryY - lBoundryY);
                employed[i].Nectar = FitnessFunction(employed[i]);
                scout[i] = 0;
            }
        }
    }

    let UpdateGlobalPhase = () => {
        let globalBee = new Bee();
        globalBee.PositionX = globalBestSolutionX;
        globalBee.PositionY = globalBestSolutionY;
        for(let i=0;i<onlooker.length;i++){
            if(FitnessFunction(globalBee) < FitnessFunction(onlooker[i])){
                globalBee.PositionX = globalBestSolutionX = onlooker[i].PositionX;
                globalBee.PositionY = globalBestSolutionY = onlooker[i].PositionY;
            }
        }
        DrawGlobal(globalBestSolutionX,globalBestSolutionY);
    }

    let Reset = () => {
        window.cancelAnimationFrame(animationId);
        population = parseInt( document.getElementById("populationNumber").value);
        employed = Array(population);
        onlooker = Array(population);
        scout = Array(population);
        propArr = Array(population);
        maxIteration = document.getElementById("maxIteration").value;
        if(maxIteration == "")
            maxIteration = 100;
        employedChances = document.getElementById("chances").value;
        if (employedChances == ""){
            employedChances = 10;
        }
        a = parseFloat(document.getElementById("aNumber").value);
        if (isNaN(a)) {
            a = 1;
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
                EmployedPhase();
                OnlookerPhase();
                UpdateGlobalPhase();
                ScoutPhase();
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

