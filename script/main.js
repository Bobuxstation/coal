const remote = require('electron').remote;
const app = remote.app;
const fs = require('fs');
const close = document.getElementById('close');
const minimize = document.getElementById('minimize');
const maximize = document.getElementById('maximize');
const imageToggle = document.getElementById('img-toggle')
const getWin = () => remote.BrowserWindow.getFocusedWindow();
var logic = 0;
const closeWin = () => {
    getWin().close();
}
const minimizeWin = () => {
    getWin().minimize();
}
const maximizeWin = () => {
    const win = getWin();
    win.isMaximized() ? win.unmaximize() : win.maximize();
}
minimize.addEventListener('click', minimizeWin);
maximize.addEventListener('click', maximizeWin);
close.addEventListener('click', closeWin);
openMenu(event, 'home')
// check available games in the games.json file
    /* json schema:
    {
        "games": [
            {
                "name": "game name",
                "path": "path to game folder",
                "icon": "path to icon",
                "args": "arguments to pass to game",
            },
            ...
        ]
    }*/
    const exec = require('child_process').exec;
    function getGames() {
        fetch(app.getPath('userData') + '/games.json')
            .then(response => response.json())
            .then(data => {
                let gameList = document.getElementById("game-list");
                gameList.innerHTML = "";
                data.games.forEach(game => {
                    let gameDisplay = document.createElement("div");
                    gameDisplay.className = "game-display";
                    if (game.icon == "" || game.icon == undefined) {
                        game.icon = "../assets/logo_1024.png";
                    }
                    gameDisplay.innerHTML = `
                        <img style="width: 48px !important; height:48px !important; border-radius: 15px;" src="${game.icon}">
                        <div class="game-title">${game.name}</div>
                    `;
                    let gameButton = document.createElement("button");
                    gameButton.className = "play";
                    gameButton.innerHTML = "Play";
                    gameButton.onclick = function() {
                        // downgraded to electron v4, now we can require child_process.
                        const { spawn } = require('child_process');
                        const process = spawn(game.exec, game.args);
                        process.on('error', (err) => {
                            console.log(err);
                        });
                    }
                    gameDisplay.appendChild(gameButton);
                    gameList.appendChild(gameDisplay);
                });
            });
        }
            function getGamesAlt() {
                fetch(app.getPath('userData') + '/games.json')
                    .then(response => response.json())
                    .then(data => {
                        let gameList = document.getElementById("game-list-alt");
                        gameList.innerHTML = "";
                        data.games.forEach(game => {
                            let gameDisplay = document.createElement("div");
                            //if game.icon is empty, use default icon
                            if (game.icon == "" || game.icon == undefined) {
                                game.icon = "../assets/logo_1024.png";
                            }
                            gameDisplay.className = "game-display";
                            gameDisplay.innerHTML = `
                                <img style="width: 48px !important; height:48px !important; border-radius:15px;" src="${game.icon}">
                                <div class="game-title">${game.name}</div>
                            `;
                            let gameButton = document.createElement("button");
                            gameButton.className = "play";
                            gameButton.innerHTML = "Play";
                            gameButton.onclick = function() {
                                // downgraded to electron v4, now we can require child_process.
                                const { spawn } = require('child_process');
                                const process = spawn(game.exec, game.args);
                                process.on('error', (err) => {
                                    console.log(err);
                                });
                            }
                            gameDisplay.appendChild(gameButton);
                            gameList.appendChild(gameDisplay);
                        });
                    });
    }
    getGames();
    // handle addGames()
    function addGames() {
        document.getElementById('add-game').style.display = "block";
        document.getElementById('close').onclick = function() {
            document.getElementById('add-game').style.display = "none";
        }
        document.getElementById('add-game-button').onclick = function() {
            let gameID = document.getElementById('game-id').value;
            let gameName = document.getElementById('game-name').value;
            let binaryLocation = document.getElementById('binary-location').value;
            let gameArgs = document.getElementById('game-args').value;
            let gameIcon = document.getElementById('game-image').value;
            let game = {
                "id": gameID,
                "name": gameName,
                "exec": binaryLocation,
                "args": gameArgs,
                "icon": gameIcon
            }
            app.getPath('userData') + '/games.json'
            let games = JSON.parse(fs.readFileSync("../test/games.json"));
            console.log("OK: Finished parse")
            games.games.push(game);
            fs.writeFileSync("../test/games.json", JSON.stringify(games));
            console.log("OK: Finished write")
            // getGames();
            // document.getElementById('add-game').style.display = "none";
        }
    }
    // check any changes on app.getPath('userData' + /games.json)
    // if changes, getGames()
    fs.watch(app.getPath('userData') + '/games.json', (event, filename) => {
        getGames();
    });
    function openMenu(e, menu) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
            console.log("OK: tabcontent[i].style.display = \"none\"");
        }
        tablinks = document.getElementsByClassName("tab");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
            console.log("OK: tablinks[i].className = tablinks[i].className.replace(\" active\", \"\")");
        }
        document.getElementById(menu).style.display = "block";
        document.getElementsByClassName("container")[0].style.display = "block";
        document.getElementById(menu + '-tab').className = "tab active";
        console.log("OK: e.currentTarget.className += \" active\"");
    }
    function fetchStores() {
        fetch('../test/CoalStore.json')
            .then(response => response.json())
            .then(data => {
                let storeList = document.getElementById("store-list");
                storeList.innerHTML = "";
                data.stores.forEach(store => {
                    let storeDisplay = document.createElement("div");
                    storeDisplay.className = "store-display";
                    storeDisplay.innerHTML = `
                        <div class="store-title">${store.name}</div>
                        <div class="store-description">${store.description}</div>
                        <div class="store-price">${store.price}</div>
                    `;
                    storeList.appendChild(storeDisplay);
                });
            });
    }
