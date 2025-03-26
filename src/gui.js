import * as THREE from 'three';


export class GameStart {
    constructor(startCallback) {
        this.startCallback = startCallback;
        this.currentPage = 0;

        // Sfondo semi-trasparente
        this._layer = document.createElement('div');
        this._layer.style.position = 'absolute';
        this._layer.style.left = '0';
        this._layer.style.top = '0';
        this._layer.style.width = '100%';
        this._layer.style.height = '100%';
        this._layer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';

        // Contenitore del menu
        this._gameStart = document.createElement('div');
        this._gameStart.style.position = 'absolute';
        this._gameStart.style.left = '50%';
        this._gameStart.style.top = '40%';
        this._gameStart.style.transform = 'translate(-50%, -50%)';
        this._gameStart.style.color = 'white';
        this._gameStart.style.fontSize = '35px';
        this._gameStart.style.fontFamily = 'Handjet';
        this._gameStart.style.textAlign = 'center';
        this._gameStart.style.padding = '20px';
        this._gameStart.style.width = '50%';
        this._gameStart.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this._gameStart.style.border = '4px solid rgba(255, 255, 255, 0.5)';
        this._gameStart.style.borderRadius = '10px';

        // Contenuto dinamico delle pagine
        this.content = document.createElement('div');
        this._gameStart.appendChild(this.content);

        // Pulsante per proseguire
        this.nextButton = document.createElement('button');
        this.nextButton.style.position = 'absolute';
        this.nextButton.style.left = '50%';
        this.nextButton.style.top = '120%';
        this.nextButton.style.transform = 'translate(-50%, -50%)';
        this.nextButton.style.width = '200px';
        this.nextButton.style.height = '70px';
        this.nextButton.style.backgroundColor = 'rgba(150, 150, 150, 0.5)';
        this.nextButton.style.color = 'white';
        this.nextButton.style.fontSize = '30px';
        this.nextButton.style.fontFamily = 'Handjet';
        this.nextButton.style.border = 'solid 4px rgba(255, 255, 255, 0.5)';
        this.nextButton.style.borderRadius = '10px';
        this.nextButton.innerHTML = 'Go further';

        this.nextButton.onmouseover = () => {
            this.nextButton.style.backgroundColor = 'rgba(180, 180, 180, 0.7)';
            this.nextButton.style.border = 'solid 6px rgba(255, 255, 255, 0.5)';
        };

        this.nextButton.onmouseout = () => {
            this.nextButton.style.backgroundColor = 'rgba(150, 150, 150, 0.5)';
            this.nextButton.style.border = 'solid 4px rgba(255, 255, 255, 0.5)';
        };

        this.nextButton.onclick = () => {
            this.nextPage();
        };

        this._gameStart.appendChild(this.nextButton);
        document.body.appendChild(this._layer);
        document.body.appendChild(this._gameStart);

        this.updatePage();
    }

    updatePage() {
        const pages = [
            `<h1>Welcome to a border reality!</h1>
             <p>You have been chosen to experiment the passage between the Universe and the Xenoverse.</p>`,

            `<h1>Xenoverse is a beautiful place...</h1>
             <p>There lives everything you don't know .</p>`,

            `<h1>Are you ready?</h1>
             <p>You will be thrown in the Universe, and you will find the Xenoverse. Are you ready?</p>`,

            `<h1>Commands? </h1>
             <p>Your journey begins now. Brace yourself for the unknown and step into the portal.</p>`,

             
        ];

        this.content.innerHTML = pages[this.currentPage];

        if (this.currentPage === pages.length - 1) {
            this.nextButton.innerHTML = 'Start';
            this.nextButton.onclick = () => {
                this.hide();
                if (this.startCallback) this.startCallback();
            };
        } else {
            this.nextButton.innerHTML = 'Go further';
            this.nextButton.onclick = () => this.nextPage();
        }
    }

    nextPage() {
        this.currentPage++;
        this.updatePage();
    }

    show() {
        this._gameStart.style.display = 'block';
        this._layer.style.display = 'block';
    }

    hide() {
        this._gameStart.style.display = 'none';
        this._layer.style.display = 'none';
    }
}

export class GameMessage {
    constructor() {
        this._messageBox = document.createElement('div');
        this._messageBox.style.position = 'absolute';
        this._messageBox.style.left = '50%';
        this._messageBox.style.top = '20%';
        this._messageBox.style.transform = 'translate(-50%, -50%)';
        this._messageBox.style.color = 'white';
        this._messageBox.style.fontSize = '24px';
        this._messageBox.style.fontFamily = 'Arial, sans-serif';
        this._messageBox.style.textAlign = 'center';
        this._messageBox.style.padding = '15px';
        this._messageBox.style.minWidth = '200px';
        this._messageBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this._messageBox.style.border = '2px solid rgba(255, 255, 255, 0.5)';
        this._messageBox.style.borderRadius = '8px';
        this._messageBox.style.display = 'none';
        this._messageBox.style.zIndex = '1000';

        document.body.appendChild(this._messageBox);
    }

    showMessage(text) {
        this._messageBox.innerHTML = `<p>${text}</p>`;
    
        // Creazione del pulsante "Continua"
        const button = document.createElement('button');
        button.innerText = "Continua";
        button.style.marginTop = "10px";
        button.style.padding = "8px 12px";
        button.style.fontSize = "18px";
        button.style.border = "none";
        button.style.cursor = "pointer";
        button.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
        button.style.color = "white";
        button.style.borderRadius = "5px";
    
        button.onmouseover = () => button.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
        button.onmouseout = () => button.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
        
        button.onclick = () => {
            this._messageBox.style.display = 'none';
        };
    
        this._messageBox.appendChild(button);
        this._messageBox.style.display = 'block';
    }
    
}

// export class GUI {
//     #gameMessage;
//     #gameStart;
//     constructor(){
//         this.#gameMessage = new GameMessage();
//         this.#gameStart = new GameStart();
//     }

//     get gameMessage(){
//         return this.#gameMessage;
//     }

//     get gameStart() {
//         return this.#gameStart;
//     }
// }