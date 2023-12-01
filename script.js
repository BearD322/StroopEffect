let gameOption = {
    difficulty: "easy",
    easy: 3, 
    normal: 4,
    hard: 5,
    endless: false,
    stop: false,
    counter: 0,
    wrapperScore: document.querySelector(".wrapper__score"),
    audioCorrect: new Audio("sound/correct.wav"),
    audioIncorrect: new Audio("sound/incorrect.wav"),
    cheatSheetButtons: document.querySelector(".wrapper__cheatSheet").children,
    cheatSheetButtonsArr: null,
    };
let headerOption = {
    radios: document.querySelectorAll("input[type='radio']"),
    normalNode: document.querySelectorAll("div[class^='normal']"),
    hardNode: document.querySelectorAll("div[class^='hard']"),
    endlessMode: document.querySelector(".option__toggle"),
    testMode: document.querySelector(".gameMode__test"),
};

document.querySelector(".option__wrapper").addEventListener("click", switchOption);
document.querySelector("#toggle").addEventListener("click",switchGameMode);

function switchGameMode(){
    gameOption.endless = gameOption.endless === false ? true : false;
}

function switchOption(){
    for (let radio of headerOption.radios) {
        if (radio.checked) {
            switch (radio.value) {
                case "easy":
                    headerOption.normalNode.forEach((item)=>item.classList.add("hidden"));
                    headerOption.hardNode.forEach((item)=> item.classList.add("hidden"));
                    gameOption.difficulty = "easy";
                    break;
            
                case "normal":
                    headerOption.normalNode.forEach((item)=> item.classList.remove("hidden"));
                    headerOption.hardNode.forEach((item)=> item.classList.add("hidden"));
                    gameOption.difficulty = "normal";
                    break;

                case "hard":
                    headerOption.normalNode.forEach((item)=>item.classList.remove("hidden"));
                    headerOption.hardNode.forEach((item)=> item.classList.remove("hidden"));
                    gameOption.difficulty = "hard";
                    break;
            }
        }
    }
}

document.querySelector("#showButton").onclick = start;

function start(){
    let hidden = document.querySelectorAll('.hidden');
    for (let i = 0; i < hidden.length; i++) {
        if (!(hidden[i].classList.contains("wrapper__score")) && !((hidden[i].classList.contains("green")) && (gameOption.difficulty == "easy")) && !(hidden[i].classList.contains("purple") && (gameOption.difficulty == "easy" || gameOption.difficulty == "normal"))) {
            hidden[i].classList.remove("hidden");
        }
    }
    gameOption.audioCorrect.volume = 0.3
    document.querySelector('header').classList.add("hidden");
    game();
    document.addEventListener("keyup", (event)=>{
        gameOption.cheatSheetButtons[event.key - 1].classList.remove("active")
    });// добавляем слушатель события keyUp сюда, чтобы он не добавлялся повторно через функцию retry
    document.addEventListener("mouseup", (event)=>{
        event.target.parentElement.classList.remove("active")
    })
}

function retry(){
    gameOption.counter = 0;
    gameOption.stop = false;
    gameOption.wrapperScore.classList.add("hidden");
    game();
}

function game(){
    let words = [];
    let colors = ["Красный","Синий","Желтый","Зелёный","Фиолетовый"];
    let randomWords, randomColors, randomCSSColors;
    let timeSec1 = -1;
    let timeSec2 = 0;
    let timeMin = 0;
    gameOption.cheatSheetButtonsArr = Array.from(gameOption.cheatSheetButtons);
    let counterSheet, timer, optionCheatSheet;
    let CSSColors = {
        0: ["#880808","#800020","#D2042D"],
        1: ["#0000FF","#0096FF","#0047AB"],
        2: ["#FFEA00","#FDDA0D","#FFFF8F"],
        3: ["#097969","#7CFC00","#008000"],
        4: ["#BF40BF","#800080","#CF9FFF"],
    };
    counterSheet = document.querySelector(".wrapper__counterSheet");
    words = document.querySelectorAll(".colorWord");
    optionCheatSheet = document.querySelector(".option__cheatSheet");

    document.addEventListener(`keydown`, gameLoop);
    gameOption.cheatSheetButtons[0].parentElement.addEventListener('mousedown',gameLoop);
   
    
    counterSheet.firstElementChild.innerHTML = gameOption.counter;
    words.forEach(item => item.innerHTML= "");
    words.forEach(item => item.style.color = "");

    randomWords = Math.floor(Math.random() * 9);
    randomColors = Math.floor(Math.random() * gameOption[gameOption.difficulty]);
    randomCSSColors = Math.floor(Math.random() * gameOption[gameOption.difficulty]);

    words[randomWords].innerHTML = colors[randomColors];
    words[randomWords].style.cssText += `
        color: ${CSSColors[randomCSSColors][Math.floor(Math.random() * 3)]};
    `;
    timerLoop();

    function timerLoop(){
        timeSec2 = timeSec1 == 9 ? timeSec2 + 1 : timeSec2;
        timeMin = timeSec2 == 6 ? timeMin + 1 : timeMin;
        timeSec1 = timeSec1 == 9 ? 0 : timeSec1 + 1;
        timeSec2 = timeSec2 == 6 ? 0 : timeSec2;
        if (!gameOption.stop){ 
            timer = `${timeMin}:${timeSec2}${timeSec1}`;
        }
        counterSheet.lastElementChild.innerHTML = timer;
        if (!gameOption.endless) {
            if (timeMin < 1 && !gameOption.stop) {
                setTimeout(timerLoop, 1000);
            } else {
                document.removeEventListener(`keydown`, gameLoop);
                gameOption.wrapperScore.classList.remove("hidden");
                gameOption.wrapperScore.innerHTML = `<span>Ваш счет:</span><span>${gameOption.counter}</span><button type="button" id="retry">Еще раз?</button>`;
                document.querySelector("#retry").addEventListener("click", retry, {once:true});
            }
        } else {
            setTimeout(timerLoop, 1000);
        }
        
    }
    
    function gameLoop(event){
        if ((event.key >= 1 && event.key <= gameOption[gameOption.difficulty]) || (gameOption.cheatSheetButtonsArr.includes(event.target.parentElement))) {
            if (event.key === undefined) {
                event.target.parentElement.classList.add("active");
            }else{
                gameOption.cheatSheetButtons[event.key - 1].classList.add("active");
            }
            if (event.key == +randomCSSColors + 1 || gameOption.cheatSheetButtonsArr.indexOf(event.target.parentElement) == +randomCSSColors) {
                gameOption.counter++;
                gameOption.audioCorrect.pause();
                gameOption.audioCorrect.currentTime = 0;
                gameOption.audioCorrect.play();
            }else{
                gameOption.counter--;
                gameOption.audioIncorrect.pause();
                gameOption.audioIncorrect.currentTime = 0;
                gameOption.audioIncorrect.play();
            }
            counterSheet.firstElementChild.innerHTML = gameOption.counter;
            if (gameOption.counter < -4 && !gameOption.endless) {
                event.currentTarget.removeEventListener(`keydown`, gameLoop);
                gameOption.stop = true;
            }

            words.forEach(item => item.innerHTML= "");
            words.forEach(item => item.style.color = "");

            randomWords = Math.floor(Math.random() * 9);
            randomColors = Math.floor(Math.random() * gameOption[gameOption.difficulty]);
            randomCSSColors = Math.floor(Math.random() * gameOption[gameOption.difficulty]);

            words[randomWords].innerHTML = colors[randomColors];
            words[randomWords].style.cssText += `
                color: ${CSSColors[randomCSSColors][Math.floor(Math.random() * 3)]};
            `;
        }
    }   
}