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
    desireSolution = 0,
    employed = Array(population),
    onlooker = Array(population),
    scout = Array(population),
    propArr = Array(population),
    maxIteration = 100,
    employedChances = 10,
    a = 1,
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

    // funkcja sprawdzania fitnessu
    let FitnessFunction = (bee) => {
        if(bee.PositionX + bee.PositionY >= 0) {
            return 1/(1+bee.PositionX + bee.PositionY);
        } else {
            return 1 + Math.abs(bee.PositionX + bee.PositionY);
        }
    }

    // Inicializacja
    let Init = () => {
        for(let i=0;i<employed.length;i++) {
            employed[i] = new Bee();
            employed[i].PositionX = Math.random() * width;
            employed[i].PositionY = Math.random() * height;
            employed[i].Nectar = FitnessFunction(employed[i]);

            scout[i] = 0;
            onlooker[i] = new Bee();
        }
    }

    let EmployedPhase = () => {
        for(let i=0;i<employed.length;i++) {

            // wybór k różnego od i
            let k = Math.floor(Math.random() * population);
            while(i==k) {
                k = Math.floor(Math.random() * population);
            }
            
            let tmpBee = new Bee();
            let phi;
            
            phi = -a + ((a + a) * Math.random());
            tmpBee.PositionX = employed[i].PositionX + ( phi*( employed[i].PositionX - employed[k].PositionX ) );
            if(tmpBee.PositionX < 0) tmpBee.PositionX = 0;
            if(tmpBee.PositionX > width) tmpBee.PositionX = width;
        
            phi = -a + ((a + a) * Math.random());
            tmpBee.PositionY = employed[i].PositionY + ( phi*( employed[i].PositionY - employed[k].PositionY ) );
            if(tmpBee.PositionY < 0) tmpBee.PositionY = 0;
            if(tmpBee.PositionY > height) tmpBee.PositionY = height;
        
            tmpBee.Nectar = FitnessFunction(tmpBee);
            if(tmpBee.Nectar >= employed[i].Nectar) {
                employed[i].PositionX = tmpBee.PositionX;
                employed[i].PositionY = tmpBee.PositionY;
                employed[i].Nectar = tmpBee.Nectar;
            } else {
                scout[i] = scout[i] + 1;
            }

        }

        // Wyrysowanie na ekran 
        for(let i=0;i<employed.length;i++) {
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
        }
        
        
        // Wyrysowanie na ekran
        for(let i=0;i<onlooker.length;i++) {
            DrawOnlooker(onlooker[i]);
        }
    }

    let ScoutPhase = () => {
        for(let i=0;i<scout.length;i++) {
            if(scout[i] >= employedChances){
                employed[i].PositionX = Math.random() * width;
                employed[i].PositionY = Math.random() * height;
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
        desireSolution = 0;
        employed = Array(population);
        onlooker = Array(population);
        scout = Array(population);
        propArr = Array(population);
        maxIteration = document.getElementById("maxIteration").value;
        if(maxIteration == "")
            maxIteration = 100;
        employedChances = document.getElementById("chances").value;
        if (employedChances == "")
            employedChances = 10;
        a = document.getElementById("aNumber").value;
        if (a == "")
            a = 1;
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
                ctx.clearRect(0,0,width,height);
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



    Init();
    window.requestAnimationFrame(Update);
    //setInterval( Update, 500);

    
}

