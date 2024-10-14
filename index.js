(() => {
    //get all the drum buttons
    const DRUM_BUTTONS = document.querySelectorAll(".drum");
    //add a click event listener to all the drums and place a callback function in it
    for (let drumButton of DRUM_BUTTONS) {
        drumButton.addEventListener("click", playSoundOnButtonClick);
        //create a function names playSoundOnButtonClick that will play a sound when a button is clicked
        function playSoundOnButtonClick() {
            assignSound(drumButton);
        }
    }

    function assignSound(button) {
        //get a hold of the id of the clicked button
        const BUTTON_ID = button.id;
        //add to the id the mp3 extension and the proper path to the audio
        const DRUM_AUDIO = `sounds/${BUTTON_ID}.mp3`;
        //pass the DRUM_AUDIO variable into a function that plays the sound
        playSound(DRUM_AUDIO);
        //pass the BUTTON_ID variable into a function that animates the clicked button
        animateDrum(BUTTON_ID);
    }

    function playSound(path) {
        const audio = new Audio(path);
        audio.play();
    }

    function animateDrum(identity) {
        const DRUM = document.getElementById(identity);
        DRUM.classList.add("pressed");
        setTimeout(() => {
            DRUM.classList.remove("pressed");
        }, 200);
    }

    //add a click event listener to the more options anchor tag
    function handlePlayOptionsATagClick() {
        document
            .getElementById("playOptions")
            .addEventListener("click", evt => {
                evt.preventDefault();
                showMoreOptions();
            });
    }

    //create a function that runs when the anchor tag is clicked. This function will display the other play options
    function showMoreOptions() {
        //create a variable for the options section
        const OPTIONS_SECTION = document.querySelector(".options");
        //create a variable for the main section
        const MAIN_SECTION = document.querySelector("main");

        //add a class that blurs the main section
        MAIN_SECTION.classList.add("main");

        //remove the hideOptions class from the options section and set opacity to 0
        OPTIONS_SECTION.classList.remove("hideOptions");
        OPTIONS_SECTION.style.opacity = 0;

        //set the opacity to 1 after a period of 800 ms. this allows the blur animation on the main section to occur first
        setTimeout(() => {
            OPTIONS_SECTION.style.opacity = 1;
        }, 800);

        //add a class that prevents the overflow of the body / main section from being scrollable

        document.querySelector("body").classList.add("body");

        // call a function that controls the actions on the event of the cancel link click
        handleCancelLinkClick();

        //call a function that controls the actions on the event of the play option buttons click
        handlePlayOptionsClick();
    }
    function handleCancelLinkClick() {
        //create a variable for the cancel link
        const CANCEL = document.getElementById("cancel");

        //add a click event listener
        CANCEL.addEventListener("click", event => {
            event.preventDefault();
            removeOptionsSection();
        });
    }

    function removeOptionsSection() {
        //set opacity of the section to 0
        document.querySelector(".options").style.opacity = 0;

        //add a class to set the visibility of the section to hidden after 1000ms

        setTimeout(() => {
            document.querySelector(".options").classList.add("hideOptions");

            // remove the class that blurs the main section
            document.querySelector("main").classList.remove("main");

            //make the body scrollable again
            document.querySelector("body").classList.remove("body");
        }, 500);
    }

    // create a function that handles all the actions that follow after a different option is clicked
    function handlePlayOptionsClick() {
        //set a variable for the buttons
        const OPTION_BUTTONS = document.querySelectorAll(".optionButton");
        OPTION_BUTTONS.forEach(optionButton => {
            //add a click event listener to the buttons
            optionButton.addEventListener("click", function () {
                if (this.id === "keydown") {
                    removeOptionsSection();
                    document.getElementById("sequenceForm").style.display =
                        "none";
                    //add a keydown event listener to the document.
                    document.addEventListener("keydown", playSoundOnKeyDown);
                } else {
                    removeOptionsSection();
                    handleSoundSequence();
                }
            });
        });
    }

    function playSoundOnKeyDown() {
        // create a variable that holds the pressed key
        const KEY_PRESSED = event.key;
        //check if KEY_PRESSED matches any of the letters on the drums
        for (drumButton of DRUM_BUTTONS) {
            if (drumButton.innerText === KEY_PRESSED) {
                //play the corresponding sound if a match is found
                assignSound(drumButton);
            }
        }
    }

    //create a function that handles all the actions needed for the sequence creation
    function handleSoundSequence() {
        //remove the keydown event listener from the document
        document.removeEventListener("keydown", playSoundOnKeyDown);
        //create a variable for the form
        const FORM = document.getElementById("sequenceForm");
        //create a variable for the input and submit button

        const INPUT = document.getElementById("pattern");
        const SUBMIT = document.getElementById("submit");

        //make the form visible
        FORM.style.display = "flex";

        SUBMIT.addEventListener("click", getInputValue);

        function getInputValue() {
            let inputValue = INPUT.value.toLowerCase();
            if (inputValue.length > 9) {
                inputValue = inputValue.slice(0, 9);
            }
            const DRUM_LETTERS = [];
            for (let drumButton of DRUM_BUTTONS) {
                DRUM_LETTERS.push(drumButton.innerText);
            }
            if (inputValue.length == 0) {
                showErrorMessage(INPUT, "Input cannot be empty!!");
            } else {
                let mismatch = 0;
                for (let i = 0; i < inputValue.length; i++) {
                    if (DRUM_LETTERS.indexOf(inputValue[i]) === -1) {
                        mismatch++;
                    }
                }
                if (!mismatch) {
                    INPUT.value = "";
                    useInputValueToGenerateSequence(inputValue);
                } else {
                    showErrorMessage(INPUT, "Invalid letter inputed");
                    mismatch = 0;
                }
            }
        }

        function showErrorMessage(input, message) {
            input.value = message;
            input.style.color = "red";

            setTimeout(() => {
                input.value = "";
                input.style.color = "#dbedf3";
            }, 2000);
        }
    }

    function useInputValueToGenerateSequence(value) {
        let index = 0;

        let repeatSound = setInterval(() => {
            for (let drumButton of DRUM_BUTTONS) {
                if (drumButton.innerText === value[index]) {
                    assignSound(drumButton);
                }
            }
            index++;
            if (index === value.length) {
                clearInterval(repeatSound);
            }
        }, 300);
    }
    handlePlayOptionsATagClick();
})();
