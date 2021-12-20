import sound from "@/assets/press.mp3";

export default class Calculator {
    _arrayOfNumbers = [];
    _arrayOfSigns = [];
    _signsTypes = {
        number: ["1","2","3","4","5","6","7","8","9","0"],
        math: {"-": '-', "+":"+",  "÷": "/", "x": "*"},
        singleMathAction: ["%", "√", "±", "sqr"],
        submit: ["="],
        cancel: ["c"],
        prepares: {",": "."},
    };
    _IS_END = false;
    _DISPLAY_WIDTH = 276;
    _FONT_SIZE = 40;
    _FONT_SIZE_SCALE = 1.6;
    _sound = sound;

    constructor(element) {
        this.calculatorContainer = document.querySelector(`.${element}__wrapper`);
        this.calculatorDisplay = document.querySelector(`.${element}__equals`);
        this.calculatorSigns = document.querySelector(`.${element}__equalsSigns`);
    }

    init = () => this.calculatorContainer.addEventListener('click', this.listener.bind(this));

    cleanMemory = () => {
        this._arrayOfSigns = [];
        this._arrayOfNumbers = [];
    }

    listener(event){
        const keyPressed = String(event.target.innerText).toLowerCase().trim();
        if(keyPressed !== ''){
            this.clickSound();
            this.calculate(String(keyPressed));
            this.displayCheck();
        }
    }

    calculate(key) {
        try{
            Object.entries(this._signsTypes).find( ([type, signs]) => {
                const matchers = Array.isArray(signs) ? signs : Object.keys(signs);
                if(matchers.includes(key)) {
                    switch (type) {
                        case 'math': {
                            this._IS_END = false;
                            if([...this._arrayOfNumbers].pop() !=='') this._arrayOfNumbers.push('');
                            this._arrayOfSigns[this._arrayOfNumbers.length-2] = signs[key];
                            this.render('', [...this._arrayOfSigns].pop());
                            break;
                        }
                        case 'singleMathAction': {
                            const length = this._arrayOfNumbers.length;
                            if (length && this._arrayOfNumbers[length - 1] !== '') {
                                this._arrayOfNumbers[length - 1] = this.singleMath(key, this._arrayOfNumbers[length - 1]);
                                this.render([...this._arrayOfNumbers].pop());
                            }
                            break;
                        }
                        case 'cancel': {
                            this.cleanMemory();
                            this.resetDisplaySize();
                            this.render(" ", " ");
                            break;
                        }
                        case 'submit': {
                            let expression = Number(this.checkToFixed(eval(this._arrayOfNumbers.reduce((result, item, index) => {
                                return `${result}${this._arrayOfSigns[index-1]}${item}`;
                            })), 8));
                            this.resetDisplaySize();
                            this.cleanMemory();
                            this._IS_END = true;
                            if(!isFinite(expression)) expression = '0';
                            this._arrayOfNumbers.push(expression.toString());
                            this.render(this._arrayOfNumbers[0], ' ');
                            break;
                        }
                        case 'prepares':{
                            const currentNumberIndex = this._arrayOfNumbers.length-1;
                            const currentNumber = this._arrayOfNumbers[currentNumberIndex];
                            const regExp = new RegExp("\\"+signs[key], 'gm');
                            this._arrayOfNumbers[currentNumberIndex] += (currentNumber && !String(currentNumber).match(regExp)) ? signs[key] : '' ;
                            break;
                        }
                        case 'number':
                            if(this._IS_END) {
                                this._IS_END = false;
                                this.cleanMemory();
                            }
                            if (this._arrayOfNumbers.length) {
                                this._arrayOfNumbers[this._arrayOfNumbers.length - 1] = String(this._arrayOfNumbers[this._arrayOfNumbers.length - 1] + key);
                            } else this._arrayOfNumbers.push(key);
                            this.render([...this._arrayOfNumbers].pop());
                            break
                    }
                }
            })
        }catch (error){
            this.renderErrors(error);
        }
    }

    singleMath(sign, key){
        let result = Number(key);
        switch (sign){
            case '√':
                result = Math.sqrt(result);
                break;
            case 'sqr':
                result = Math.pow(result, 2);
                break;
            case '±':
                result = result*(-1);
                break;
            case '%':
                result = this.checkToFixed(result / 100, 8);
                break;
        }
        return this.checkToFixed(result, 8);
    }

    render(pressedNumber= null, pressedSign= null){
        if(pressedNumber)  this.calculatorDisplay.innerHTML = pressedNumber;
        if(pressedSign) this.calculatorSigns.innerHTML =pressedSign;
    }

    displayCheck(){
        if(this.calculatorDisplay.offsetWidth >= this._DISPLAY_WIDTH){
            this.calculatorDisplay.style.fontSize  = `${(this._DISPLAY_WIDTH / this.calculatorDisplay.innerHTML.length) * this._FONT_SIZE_SCALE}px`;
        }
    }

    clickSound (){
        const audio = new Audio();
        audio.src = this._sound;
        audio.autoplay = true;
    }

    checkToFixed(num, fractionDigits) {
        const decimals = String(Number(+num)).includes('.') ? String(num).split('.')[1].length : 0;
        return decimals > fractionDigits ? Number(num).toFixed(fractionDigits) : num
    }

    resetDisplaySize = () =>  this.calculatorDisplay.style.fontSize = `${this._FONT_SIZE}px`;
    renderErrors(error){
        this.cleanMemory();
        this.resetDisplaySize();
        this.render(error);
    }

}