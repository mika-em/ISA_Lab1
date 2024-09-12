//Note: Chat-GPT was used 

/**
 * Starts the game by creating a new Game object,
 * creating the buttons, and then scrambling them.
 */
function startGame() {
    const game = new Game();
    game.createButtons();
    game.scrambleButtons();
}

/**
 * The Game class handles the game logic,
 * which includes creating buttons, scrambling them,
 * and user interaction with the buttons.
 */
class Game {
    /**
     * Initializes the Game object with an empty button array,
     * a new UIHandler object, and the number of buttons
     * the user wants to play with (which is obtained from the UI).
     */
    constructor() {
        this.buttonArray = [];
        this.uiHandler = new UIHandler();
        this.numOfButtons = this.uiHandler.howManyButtonsInput();
        this.colorOptions = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF'];
        this.userOrder = [];
        this.userOrderIndex = 0;
        window.addEventListener("windowResize", () => this.onWindowResize());
    }

    createButtons() {
        /**
         * Creates buttons by first clearing the button container,
         * then creating a new button with a random color from the colorOptions array,
         * and adding a click listener to the button.
         */
        document.getElementById("buttonContainer").innerHTML = '';
        this.buttonArray = [];
        this.userOrder = [];
        this.currentIndex = 0;

        for (let i = 1; i <= this.numOfButtons; i++) {
            let color = this.getRandomColor();
            let button = new Button(i, color);
            button.createButtonElement(); //how does the createButtonElement method work?
            this.buttonArray.push(button);
        }
        this.addClickListeners(); //how does the addClickListeners method work?
    }

    scrambleButtons() {
        /**
         * Scrambles the buttons by moving them to random positions
         * on the screen. The buttons are disabled while they are
         * being scrambled, and then enabled again once the scramble
         * is complete.
         */
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;

        this.disableButtons(true); 

        let scrambleCount = 0; // scrambleCount keeps count of how many times the buttons have been scrambled
        //how does the setInterval method work?
        // setInterval() method calls a function or 
        //evaluates an expression at specified intervals (in milliseconds).

        //the interval runs until the scramble count is equal to the number of buttons
        //the interval runs every 2000 milliseconds, 2 seconds
        const scrambleInterval = setInterval(() => {
            if (scrambleCount < this.numOfButtons) {
                this.buttonArray.forEach(button => {
                    button.move(windowWidth, windowHeight);
                    button.removeNumber();
                });
                scrambleCount++;
            } else {
                clearInterval(scrambleInterval);
                this.disableButtons(false);
            }
        }, 2000);
    }

    getRandomColor() {
        console.log("color options", this.colorOptions);
        const random = Math.floor(Math.random() * this.colorOptions.length); //generate number between 0 and 7, exclusive
        return this.colorOptions.splice(random, 1)[0];
    }

    onWindowResize() {
        let width = window.innerWidth;
        let height = window.innerHeight;
        this.buttonArray.forEach(button => {
            button.move(width, height)
        });
    }
t
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
        let buttonWidth = this.element.offsetWidth;
        let buttonHeight = this.element.offsetHeight;
        
        let randomX = Math.floor(Math.random() * (windowWidth - buttonWidth));
        let randomY = Math.floor(Math.random() * (windowHeight - buttonHeight - 5));
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