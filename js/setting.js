const gameSetting = (function () {


    function View() {
        let myContainer = null,

            inputTitme = null,
            btnRotate = null,
            btnLeft = null,
            btnRight = null,
            btnDown = null,
            btnReset = null,
            btnPowerDown = null,
            checkBoxCell = null,
            musicChek = null,
            soundChek = null,
            musicRange = null,
            soundRange = null;
        this.init = function (container) {
            myContainer = container

            inputTitme = myContainer.querySelector('#time')
            btnRotate = myContainer.querySelector('#setting-rotate')
            btnLeft = myContainer.querySelector('#setting-left')
            btnRight = myContainer.querySelector('#setting-right')
            btnDown = myContainer.querySelector('#setting-down')
            btnReset = myContainer.querySelector('#setting-reset')
            btnPowerDown = myContainer.querySelector('#setting-power-down')
            checkBoxCell = myContainer.querySelector('#setting-cells')
            musicChek = myContainer.querySelector('#setting-music')
            soundChek = myContainer.querySelector('#setting-sound')
            musicRange = myContainer.querySelector('#setting-range-music')
            soundRange = myContainer.querySelector('#setting-range-sound')
        }
        this.setSetting = function ({
            time,
            keyRotate,
            keyLeft,
            keyRight,
            keyDown,
            keyPowerDown,
            isDrowCells,
            music,
            sound,
            musicVol,
            soundVol,
        }) {
            inputTitme.value = time;
            btnRotate.value = keyRotate;
            btnLeft.value = keyLeft;
            btnRight.value = keyRight;
            btnDown.value = keyDown;
            btnPowerDown.value = keyPowerDown;
            checkBoxCell.checked = isDrowCells;
            musicChek.checked = music;
            soundChek.checked = sound;
            musicRange.value = musicVol;
            soundRange.value = soundVol;
        };
    }

    function Model() {
        let myView = null

        let defaultSetting = {
            time: 500,
            keyRotate: 'ArrowUp',
            keyLeft: 'ArrowLeft',
            keyRight: 'ArrowRight',
            keyDown: 'ArrowDown',
            keyPowerDown: 'Space',
            music: false,
            sound: false,
            musicVol: 0.2,
            soundVol: 0.2,
        }
        let customSetting = {
            time: 500,
            keyRotate: 'ArrowUp',
            keyLeft: 'ArrowLeft',
            keyRight: 'ArrowRight',
            keyDown: 'ArrowDown',
            keyPowerDown: 'Space',
            music: false,
            sound: false,
            musicVol: 0.2,
            soundVol: 0.2,
        }

        this.init = function (view) {
            myView = view
            if (localStorage.getItem('setting')) {
                customSetting = JSON.parse(localStorage.getItem('setting'))
                myView.setSetting(customSetting)
            }
        }
        this.startNewGame = function () {
            myView.startNewGame()
        }
        this.setDefaultSettings = function () {
            customSetting = JSON.stringify(defaultSetting)
            localStorage.setItem('setting', customSetting)
            customSetting = JSON.parse(customSetting)
            myView.setSetting(customSetting)
        }
        this.setLocalVal = function (dataKey, val) {
            customSetting[dataKey] = val
            localStorage.setItem('setting', JSON.stringify(customSetting))
            myView.setSetting(customSetting)
        }
    }

    function Controller() {
        let myContainer = null,
            myModel = null,
            scrinGame = null,
            inputTitme = null,
            btnRotate = null,
            btnLeft = null,
            btnRight = null,
            keyDown = null,
            keyPowerDown = null,
            checkBoxCell = null,
            btnReset = null,
            musicChek = null,
            soundChek = null,
            musicRange = null,
            soundRange = null

        this.init = function (contrainer, model) {
            myContainer = contrainer
            myModel = model

            inputTitme = myContainer.querySelector('#time')
            inputTitme.addEventListener('input', this.setVal)

            btnRotate = myContainer.querySelector('#setting-rotate')
            btnRotate.addEventListener('click', this.setBtn)

            btnLeft = myContainer.querySelector('#setting-left')
            btnLeft.addEventListener('click', this.setBtn)

            btnRight = myContainer.querySelector('#setting-right')
            btnRight.addEventListener('click', this.setBtn)

            keyDown = myContainer.querySelector('#setting-down')
            keyDown.addEventListener('click', this.setBtn)

            keyPowerDown = myContainer.querySelector('#setting-power-down')
            keyPowerDown.addEventListener('click', this.setBtn)

            checkBoxCell = myContainer.querySelector('#setting-cells')
            checkBoxCell.addEventListener('click', this.setChek)

            btnReset = myContainer.querySelector('#setting-reset')
            btnReset.addEventListener('click', this.setDefaultSettings)

            musicChek = myContainer.querySelector('#setting-music')
            musicChek.addEventListener('click', this.setChek)

            soundChek = myContainer.querySelector('#setting-sound')
            soundChek.addEventListener('click', this.setChek)

            musicRange = myContainer.querySelector('#setting-range-music')
            musicRange.addEventListener('mouseup', this.setVal)

            soundRange = myContainer.querySelector('#setting-range-sound')
            soundRange.addEventListener('mouseup', this.setVal)
        }
        this.setChek = function (e) {
            console.log(e.target.checked);
            myModel.setLocalVal(e.target.dataset.control, e.target.checked)
        }
        this.setVal = function (e) {
            e.preventDefault()
            myModel.setLocalVal(e.target.dataset.control, e.target.value)
        }
        this.setRange = function (e) {
            // e.preventDefault()
            console.log(e.target.value);

        }
        this.setBtn = function (e) {
            e.preventDefault()
            document.addEventListener('keydown', set = (a) => {
                myModel.setLocalVal(e.target.dataset.control, a.code)

                document.addEventListener('mousedown', () => {
                    e.preventDefault()
                    document.removeEventListener('keydown', set)
                })
            }, {
                once: true
            })
        }
        this.setDefaultSettings = function (e) {
            e.preventDefault()
            myModel.setDefaultSettings()
        }
    }

    return {
        version: '0.0.1',

        init: function () {
            let container = document.querySelector('.setting-page')
            const appModalView = new View();
            const appModalModel = new Model();
            const appModalController = new Controller();
            // можно было сохранить в переменную контейнер, но при инициализации view он перерисовывается или создается и в контроллере заново находится даже если его небыло
            appModalView.init(container);
            appModalModel.init(appModalView);
            appModalController.init(container, appModalModel);
        },
    };

})()