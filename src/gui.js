import * as THREE from 'three';


export class GameStart {
    constructor(startCallback) {
        this.startCallback = startCallback;
        this.currentPage = 0;

        this._layer = document.createElement('div');
        this._layer.style.position = 'absolute';
        this._layer.style.left = '0';
        this._layer.style.top = '0';
        this._layer.style.width = '100%';
        this._layer.style.height = '100%';
        this._layer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';

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

        this.content = document.createElement('div');
        this._gameStart.appendChild(this.content);

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
             <p>You will be thrown in the Universe, and you will have to discover a way to find the Xenoverse.</p>`,

            `<h1>Commands? </h1>
             <p>Oh, if you don't know them, you can find them in the Xenoverse...</p>`,

             
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
export class GameFinish {
    constructor(startCallback) {
        this.startCallback = startCallback;
        this.currentPage = 0;

        this._layer = document.createElement('div');
        this._layer.style.position = 'absolute';
        this._layer.style.left = '0';
        this._layer.style.top = '0';
        this._layer.style.width = '100%';
        this._layer.style.height = '100%';
        this._layer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';

        this._gameFinish = document.createElement('div');
        this._gameFinish.style.position = 'absolute';
        this._gameFinish.style.left = '50%';
        this._gameFinish.style.top = '40%';
        this._gameFinish.style.transform = 'translate(-50%, -50%)';
        this._gameFinish.style.color = 'white';
        this._gameFinish.style.fontSize = '35px';
        this._gameFinish.style.fontFamily = 'Handjet';
        this._gameFinish.style.textAlign = 'center';
        this._gameFinish.style.padding = '20px';
        this._gameFinish.style.width = '50%';
        this._gameFinish.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this._gameFinish.style.border = '4px solid rgba(255, 255, 255, 0.5)';
        this._gameFinish.style.borderRadius = '10px';

        this.content = document.createElement('div');
        this._gameFinish.appendChild(this.content);

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

        this._gameFinish.appendChild(this.nextButton);
        document.body.appendChild(this._layer);
        document.body.appendChild(this._gameFinish);

        this.updatePage();
    }

    updatePage() {
        const pages = [
            `<h1>Congratulations! </h1>
             <p>You completed the test.</p>`,

            `<h1>You are officially a multiverse surfer!</h1>
             <p>You showed your abilities in managing space and traveling between different dimensions</p>`,

            `<h1>Are you ready? It's time to go...</h1>
             <p>Who passes the test is sent to the front in the DW1 (Dimensions War 1)...</p>`,

        ];

        this.content.innerHTML = pages[this.currentPage];

        if (this.currentPage === pages.length - 1) {
            this.nextButton.innerHTML = 'Finish';
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
        this._gameFinish.style.display = 'block';
        this._layer.style.display = 'block';
    }

    hide() {
        this._gameFinish.style.display = 'none';
        this._layer.style.display = 'none';
    }
}

export class GameMessage {
    constructor() {
        this._messageCommandBox = document.createElement('div');
        this._messageCommandBox.style.position = 'absolute';
        this._messageCommandBox.style.left = '50%';
        this._messageCommandBox.style.top = '20%';
        this._messageCommandBox.style.transform = 'translate(-50%, -50%)';
        this._messageCommandBox.style.color = 'white';
        this._messageCommandBox.style.fontSize = '24px';
        this._messageCommandBox.style.fontFamily = 'Arial, sans-serif';
        this._messageCommandBox.style.textAlign = 'center';
        this._messageCommandBox.style.padding = '15px';
        this._messageCommandBox.style.minWidth = '200px';
        this._messageCommandBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this._messageCommandBox.style.border = '2px solid rgba(255, 255, 255, 0.5)';
        this._messageCommandBox.style.borderRadius = '8px';
        this._messageCommandBox.style.display = 'none';
        this._messageCommandBox.style.zIndex = '1000';

        this._messageObjectsBox = document.createElement('div');
        this._messageObjectsBox.style.position = 'absolute';
        this._messageObjectsBox.style.left = '50%';
        this._messageObjectsBox.style.top = '20%';
        this._messageObjectsBox.style.transform = 'translate(-50%, -50%)';
        this._messageObjectsBox.style.color = 'white';
        this._messageObjectsBox.style.fontSize = '24px';
        this._messageObjectsBox.style.fontFamily = 'Arial, sans-serif';
        this._messageObjectsBox.style.textAlign = 'center';
        this._messageObjectsBox.style.padding = '15px';
        this._messageObjectsBox.style.minWidth = '200px';
        this._messageObjectsBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this._messageObjectsBox.style.border = '2px solid rgba(255, 255, 255, 0.5)';
        this._messageObjectsBox.style.borderRadius = '8px';
        this._messageObjectsBox.style.display = 'none';
        this._messageObjectsBox.style.zIndex = '1000';

        this._messageCollectedBox = document.createElement('div');
        this._messageCollectedBox.style.position = 'absolute';
        this._messageCollectedBox.style.left = '50%';
        this._messageCollectedBox.style.top = '20%';
        this._messageCollectedBox.style.transform = 'translate(-50%, -50%)';
        this._messageCollectedBox.style.color = 'white';
        this._messageCollectedBox.style.fontSize = '24px';
        this._messageCollectedBox.style.fontFamily = 'Arial, sans-serif';
        this._messageCollectedBox.style.textAlign = 'center';
        this._messageCollectedBox.style.padding = '15px';
        this._messageCollectedBox.style.minWidth = '200px';
        this._messageCollectedBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this._messageCollectedBox.style.border = '2px solid rgba(255, 255, 255, 0.5)';
        this._messageCollectedBox.style.borderRadius = '8px';
        this._messageCollectedBox.style.display = 'none';
        this._messageCollectedBox.style.zIndex = '1000';

        this._messageUsableBox = document.createElement('div');
        this._messageUsableBox.style.position = 'absolute';
        this._messageUsableBox.style.left = '50%';
        this._messageUsableBox.style.top = '20%';
        this._messageUsableBox.style.transform = 'translate(-50%, -50%)';
        this._messageUsableBox.style.color = 'white';
        this._messageUsableBox.style.fontSize = '24px';
        this._messageUsableBox.style.fontFamily = 'Arial, sans-serif';
        this._messageUsableBox.style.textAlign = 'center';
        this._messageUsableBox.style.padding = '15px';
        this._messageUsableBox.style.minWidth = '200px';
        this._messageUsableBox.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this._messageUsableBox.style.border = '2px solid rgba(255, 255, 255, 0.5)';
        this._messageUsableBox.style.borderRadius = '8px';
        this._messageUsableBox.style.display = 'none';
        this._messageUsableBox.style.zIndex = '1000';

        document.body.appendChild(this._messageCommandBox);
        document.body.appendChild(this._messageObjectsBox);
        document.body.appendChild(this._messageCollectedBox);
        document.body.appendChild(this._messageUsableBox);

        this._timeoutId = null;
    }

    showCommandMessage(text) {
        this._messageCommandBox.innerHTML = `<p>${text}</p>`;
        
        const button = document.createElement('button');
        button.innerText = "Continue";
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
            this._messageCommandBox.style.display = 'none';
        };
        
        this._messageCommandBox.appendChild(button);
        this._messageCommandBox.style.display = 'block';
    }
    showObjectMessage(text) {
        this._messageObjectsBox.innerHTML = `<p>${text}</p>`;
        this._messageObjectsBox.style.display = 'block';
    }
    hideObjectsMessage() {
        this._messageObjectsBox.style.display = 'none';
    }
    showCollectedMessage(text) {
        this._messageCollectedBox.innerHTML = `<p>${text}</p>`;
        this._messageCollectedBox.style.display = 'block';

        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
        }

        this._timeoutId = setTimeout(() => {
            this.hideCollectedMessage();
        }, 6000);
    }
    hideCollectedMessage() {
        this._messageCollectedBox.style.display = 'none';
    }
    showUsableMessage(text) {
        this._messageUsableBox.innerHTML = `<p>${text}</p>`;
        this._messageUsableBox.style.display = 'block';

        if (this._timeoutId) {
            clearTimeout(this._timeoutId);
        }

        this._timeoutId = setTimeout(() => {
            this.hideUsableMessage();
        }, 6000);
    }
    hideUsableMessage() {
        this._messageUsableBox.style.display = 'none';
    }
}
