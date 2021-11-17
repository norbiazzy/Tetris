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
    this.setSetting = function (obj) {
      inputTitme.value = obj.time;
      btnRotate.value = obj.keyRotate;
      btnLeft.value = obj.keyLeft;
      btnRight.value = obj.keyRight;
      btnDown.value = obj.keyDown;
      btnPowerDown.value = obj.keyPowerDown;
      checkBoxCell.checked = obj.isDrowCells;
      musicChek.checked = obj.music;
      soundChek.checked = obj.sound;
      musicRange.value = obj.musicVol;
      soundRange.value = obj.soundVol;
    };
  }

  function Model() {
    let myView = null

    const defaultSetting = {
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
      } else {
        localStorage.setItem('setting', JSON.stringify(defaultSetting))
        myView.setSetting(defaultSetting)
      }
    }
    this.setDefaultSettings = function () {
      customSetting = JSON.stringify(defaultSetting)
      localStorage.setItem('setting', customSetting)
      customSetting = JSON.parse(customSetting)
      myView.setSetting(customSetting)
    }
    this.setLocalVal = function (dataKey, val) {
      for (const key in customSetting) {
        if (customSetting[key] == val) return
      }
      customSetting[dataKey] = val
      localStorage.setItem('setting', JSON.stringify(customSetting))
      myView.setSetting(customSetting)
    }
  }

  function Controller() {
    let myContainer = null,
      myModel = null,
      inputTitme = null,
      checkBoxCell = null,
      btnReset = null,
      musicChek = null,
      soundChek = null,
      musicRange = null,
      soundRange = null,
      btnsId = ['setting-rotate', 'setting-left', 'setting-right', 'setting-down', 'setting-power-down']
    this.init = function (contrainer, model) {
      myContainer = contrainer
      myModel = model
      myContainer.addEventListener('click', this.setBtn)

      inputTitme = myContainer.querySelector('#time')
      inputTitme.addEventListener('click', this.setVal)

      checkBoxCell = myContainer.querySelector('#setting-cells')
      checkBoxCell.addEventListener('click', this.setCheck)

      btnReset = myContainer.querySelector('#setting-reset')
      btnReset.addEventListener('click', this.setDefaultSettings)

      musicChek = myContainer.querySelector('#setting-music')
      musicChek.addEventListener('click', this.setCheck)

      soundChek = myContainer.querySelector('#setting-sound')
      soundChek.addEventListener('click', this.setCheck)

      musicRange = myContainer.querySelector('#setting-range-music')
      musicRange.addEventListener('mouseup', this.setVal)

      soundRange = myContainer.querySelector('#setting-range-sound')
      soundRange.addEventListener('mouseup', this.setVal)

      window.addEventListener("hashchange", this.exitSetting, {
        once: true
      });
    }
    this.setBtn = function (e) {
      if (btnsId.find(id => id === e.target.id)) {
        document.addEventListener('keydown', set = (a) => {
          myModel.setLocalVal(e.target.dataset.control, a.code)

          document.addEventListener('mousedown', () => {
            a.preventDefault()
            document.removeEventListener('keydown', set)
          })
        }, {
          once: true
        })
      }
    }
    this.setCheck = function (e) {
      myModel.setLocalVal(e.target.dataset.control, e.target.checked)
    }
    this.setVal = function (e) {
      e.preventDefault()
      myModel.setLocalVal(e.target.dataset.control, e.target.value)
    }
    this.setRange = function (e) {
      e.preventDefault()
      console.log(e.target.value);

    }
    this.setDefaultSettings = function (e) {
      e.preventDefault()
      myModel.setDefaultSettings()
    }
    this.exitSetting = function () {
      myContainer.removeEventListener('click', this.setBtn)
    }

  }

  return {
    version: '0.0.1',

    init: function () {
      let container = document.querySelector('.content')
      const appModalView = new View();
      const appModalModel = new Model();
      const appModalController = new Controller();

      appModalView.init(container);
      appModalModel.init(appModalView);
      appModalController.init(container, appModalModel);
    },
  };

})()