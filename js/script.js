function startGame() {
    const game = new Game();
    game.createButtons();
    game.scrambleButtons();
}

class Game {
    constructor() {
        this.buttonArray = [];
        this.uiHandler = new UIHandler();
        this.numOfButtons = this.uiHandler.howManyButtonsInput();
        this.colorOptions = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#F1C40F', '#9B59B6', '#1ABC9C'];
        this.userOrder = [];
        this.userOrderIndex = 0;
        window.addEventListener("windowResize", () => this.onWindowResize());
    }

    createButtons() {
        document.getElementById("buttonContainer").innerHTML = '';
        this.buttonArray = [];
        this.userOrder = [];
        this.currentIndex = 0;

        for (let i = 1; i <= this.numOfButtons; i++) {
            let color = this.getRandomColor();
            let button = new Button(i, color);
            button.createButtonElement();
            this.buttonArray.push(button);
        }
        this.addClickListeners();
    }

    scrambleButtons() {
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;

        this.disableButtons(true);

        let scrambleCount = 0;
        const scrambleInterval = setTimeout(() => {
            if (scrambleCount < this.numOfButtons) {
            this.buttonArray.forEach(
                button => {
                    button.move(windowWidth, windowHeight);
                    button.removeNumber();
                });
                scrambleCount++;
            } else {
                clearInterval(scrambleInterval);
                this.disableButtons(false)
            }
        }, 2000);;
    }

    getRandomColor() {
        console.log("color options", this.colorOptions);
        const random = Math.floor(Math.random() * this.colorOptions.length);
        return this.colorOptions.splice(random, 1)[0];
    }

    onWindowResize() {
        let width = window.innerWidth;
        let height = window.innerHeight;
        this.buttonArray.forEach(button => {
            button.move(width, height)
        });
    }

    addClickListeners() {
        this.buttonArray.forEach((button) => {
            button.element.addEventListener("click", () => this.handleClick(button))
        });
    }

    handleClick(button) {
        if (button === this.buttonArray[this.currentIndex]) {
            button.showNumber();
            this.currentIndex++;

            if (this.currentIndex === this.buttonArray.length) {
                this.uiHandler.displayMessage(messages.win);
            }

        } else {
            this.uiHandler.displayMessage(messages.lose);
            this.showCorrectOrder();
        }
    }

    showCorrectOrder() {
        this.buttonArray.forEach(button => button.showNumber());
    }

    disableButtons(input) {
        this.buttonArray.forEach(button => {
            button.element.disabled = input;
        })
    }

}

class Button {
    constructor(number, color) {
        this.element = document.createElement("button");
        this.number = number;
        this.color = color;
    }

    createButtonElement() {
        this.element.innerText = this.number;
        this.setColor(this.color);
        document.getElementById("buttonContainer").append(this.element);
    }

    move(windowWidth, windowHeight) {
        this.element.style.position = "absolute";
        let buttonDimensions = [
            this.element.offsetWidth,
            this.element.offsetHeight
        ];
        let randomX = Math.floor(Math.random() * (windowWidth - buttonDimensions[0]));
        let randomY = Math.floor(Math.random() * (windowHeight - buttonDimensions[1]));

        randomX = Math.max(0, Math.min(randomX, windowWidth - buttonDimensions[0]));
        randomY = Math.max(0, Math.min(randomY, windowHeight - buttonDimensions[1]))
        this.element.style.left = `${randomX}px`;
        this.element.style.top = `${randomY}px`;
    }

    removeNumber() {
        this.element.innerText = "";
    }

    showNumber() {
        this.element.innerText = this.number;
    }

    setColor(color) {
        this.color = color;
        this.element.style.backgroundColor = color;
    }
}


class UIHandler {
    howManyButtonsInput() {
        let numButtons = parseInt(document.getElementById('numButtons').value)
        if (numButtons < 3 || numButtons > 7 || numButtons === "" || isNaN(numButtons)) {
            this.displayMessage(messages.enterValidNumber);
            return 0;
        }
        return numButtons
    }

    displayMessage(message) {
        alert(message);
    }
}