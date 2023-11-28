let gameOption = {
    difficulty: "easy",
    easy: 3, 
    normal: 4,
    hard: 5,
    endless: true,
    stop: false,
    counter: 1,
    wrapperScore: document.querySelector(".wrapper__score"),
};
let headerOption = {
    radios: document.querySelectorAll("input[type='radio']"),
    normalNode: document.querySelectorAll("td[class^='normal']"),
    hardNode: document.querySelectorAll("td[class^='hard']"),
    endlessMode: document.querySelector(".gameMode__endless"),
    testMode: document.querySelector(".gameMode__test"),
};

document.querySelector(".option__wrapper").addEventListener("click", switchOption);
document.querySelector(".slider").addEventListener("click",switchGameMode);

function switchGameMode(){
    gameOption.endless = false ? true : false;
    headerOption.endlessMode.classList.toggle("gameModeBlue");
    headerOption.testMode.classList.toggle("gameModeYellow");
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
        if (!(hidden[i].tagName === "TD") && !(hidden[i].classList.contains("wrapper__score"))) {
            hidden[i].classList.remove("hidden");
        }
    }
    document.querySelector('header').classList.add("hidden");
    game();
}

function retry(){
    gameOption.counter = 1;
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
    let counterSheet, timer, table;
    let CSSColors = {
        0: ["#880808","#800020","#D2042D"],
        1: ["#0000FF","#0096FF","#0047AB"],
        2: ["#FFEA00","#FDDA0D","#FFFF8F"],
        3: ["#097969","#7CFC00","#008000"],
        4: ["#BF40BF","#800080","#CF9FFF"],
    };
    counterSheet = document.querySelector(".wrapper__counterSheet");
    words = document.querySelectorAll(".colorWord");
    table = document.querySelector("table");

    document.addEventListener(`keydown`, gameLoop);
    document.dispatchEvent(new KeyboardEvent("keydown", {
        key: 1,
        keyCode: 49, 
    }));
    timerLoop();
    document.querySelector(".wrapper__cheatSheet").innerHTML = table.outerHTML;

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
        if (event.key >= 1 && event.key <= gameOption[gameOption.difficulty]) {
            event.key == +randomCSSColors + 1 ? gameOption.counter++ : gameOption.counter--;
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