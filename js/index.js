// Список компонент (from components.js)
const components = {
  header: Header,
  navbar: NavBar,
  content: Content,
  footer: Footer,
  modal: WarnModal,
};

// Список поддердживаемых роутов (from pages.js)
const routes = {
  main: HomePage,
  default: HomePage,
  setting: SettingPage,
  help: HelpPage,
  check: CheckPage,
  error: ErrorPage,
};


const tetris = (function () {
  // это будем парсить из локала и заполнять при инициализации, если в локале пусто


  function GameView() {
    let myContainer = null
    let btnCheckState = null
    let btnNewGame = null
    let btnSaveScore = null
    let form = null
    const colors = ['#00F0F0', '#F0A000', '#0000F0', '#F0F000', '#00F000', '#F00000', '#52007B'];
    let canvas = {
      el: null,
      width: null,
      height: null,
      cellSize: null,
      ctx: null,
      score: null
    }
    let canvasAd = {
      el: null,
      width: null,
      height: null,
      ctx: null,
      cellSize: null,
    }

    this.init = function (container) {

      myContainer = container
      btnCheckState = myContainer.querySelector('#pause-button')
      btnSaveScore = myContainer.querySelector('#save-score-btn')
      form = myContainer.querySelector('.game__form')
      btnScoreSave = myContainer.querySelector('#save-score-btn')
      score = myContainer.querySelector('.game__score')

      canvas.el = myContainer.querySelector('#game-canvas')
      canvas.ctx = canvas.el.getContext('2d')

      canvasAd.el = myContainer.querySelector('#canvas-next-tetra')
      canvasAd.ctx = canvasAd.el.getContext('2d')


      btnNewGame = myContainer.querySelector('#newGame-button')

      // this.fillBoard()
    }
    this.setSize = function (bigBoard, smallBoard) {
      canvas.width = bigBoard.width;
      canvas.height = bigBoard.height;
      canvas.cellSize = bigBoard.cellSize;
      canvas.el.setAttribute('width', canvas.width);
      canvas.el.setAttribute('height', canvas.height);
      canvasAd.width = smallBoard.width;
      canvasAd.height = smallBoard.height;
      canvasAd.cellSize = smallBoard.cellSize;
      canvasAd.el.setAttribute('width', canvasAd.width);
      canvasAd.el.setAttribute('height', canvasAd.height);
    }
    this.stopGame = function () {
      btnCheckState.innerHTML = 'Продолжить'
    }
    this.playGame = function () {
      btnCheckState.innerHTML = 'Пауза'

    }
    this.startNewGame = function () {
      this.clearBord(true)
      btnCheckState.classList.remove('hide')
      form.classList.add('hide')
    }
    this.gameOver = function () {
      btnCheckState.classList.add('hide')
      btnSaveScore.classList.remove('hide')
      form.classList.remove('hide')
    }
    this.reDraw = function (arr) {
      let ctx = canvas.ctx
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.beginPath()
      arr.forEach(info => {
        let block = canvas.cellSize
        let y = info[0]
        let x = info[1]

        ctx.fillStyle = 'black'
        ctx.fillRect(x * block - 0.5, y * block - 0.5, block + 1, block + 1)
        ctx.fillStyle = colors[info[2] - 1]
        ctx.fillRect(x * block + 1, y * block + 1, block - 2, block - 2)

      });
    }
    this.renderNexTetra = function ({
      table
    }) {
      let ctx = canvasAd.ctx
      let block = canvasAd.cellSize

      this.clearBord()

      ctx.beginPath()
      for (let y = 0; y < table.length; y++) {
        for (let x = 0; x < table.length; x++) {
          if (table[y][x]) {
            ctx.fillStyle = 'black'
            ctx.fillRect(x * block + 5, y * block + 5, block + 1, block + 1)
            ctx.fillStyle = colors[table[y][x] - 1]
            ctx.fillRect(x * block + 6, y * block + 6, block - 1, block - 1)
          }
        }

      }
    }
    this.renderScore = function (val) {
      score.innerText = 'Счет: ' + val
    }
    this.clearBord = function (all) {
      ctxAd = canvasAd.ctx
      ctx = canvas.ctx

      ctx.fillStyle = 'white'
      ctxAd.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctxAd.fillRect(0, 0, canvasAd.width, canvasAd.height)

    }
    this.btnSaveState = function (str) {
      console.log(btnScoreSave);
      btnScoreSave.disabled = str
    }
  }

  function GameModel() {

    let myView = null
    // проверим идет ли анимация
    let ani = null

    let setting = {}
    let curTetra = null

    let board = {
      width: 320,
      height: 640,
      table: null,
      row: 20,
      col: 10,
      cellSize: 32,
      isPlay: false,
      score: 0
    }
    let boardNextTetra = {
      width: 180,
      height: 180,
      cellSize: 40,
    }

    let tetraminos = [{
        name: 'I',
        table: [
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
          [0, 1, 0, 0],
        ],
        posX: 3,
        posY: -4,
      },

      {
        name: "L",
        table: [
          [0, 0, 2],
          [2, 2, 2],
          [0, 0, 0],
        ],
        posX: 3,
        posY: -2,
      },
      {
        name: 'J',
        table: [
          [3, 0, 0],
          [3, 3, 3],
          [0, 0, 0],
        ],
        posX: 3,
        posY: -2,
      },
      {
        name: 'O',
        table: [
          [4, 4],
          [4, 4],
        ],
        posX: 4,
        posY: -2,
      },
      {
        name: 'S',
        table: [
          [0, 5, 5],
          [5, 5, 0],
          [0, 0, 0],
        ],
        posX: 3,
        posY: -2,
      },
      {
        name: 'Z',
        table: [
          [6, 6, 0],
          [0, 6, 6],
          [0, 0, 0],
        ],
        posX: 3,
        posY: -2,
      },
      {
        name: 'T',
        table: [
          [0, 7, 0],
          [7, 7, 7],
          [0, 0, 0],
        ],
        posX: 3,
        posY: -2,
      }

    ]
    let nextTetra = {}

    this.init = function (view) {
      myView = view
      curTetra = this.getRandomTetra()
      board.table = this.clearBoardTable()
      myView.setSize(board, boardNextTetra)
      setting = JSON.parse(localStorage.getItem('setting'))
    }

    this.rotateTetramino = function () {
      let table = curTetra.table
      // let arr = new Array(table.length).fill([0, 0, 0])
      let arr = []
      for (let i = 0; i < table.length; i++) {
        arr[i] = new Array(length).fill(0)
      }
      for (let y = 0; y < table.length; y++) {
        for (let x = 0; x < table.length; x++) {
          arr[x][y] = table[table.length - 1 - y][x]
        }
      }
      curTetra.table = arr
      if (this.colizz()) {
        curTetra.table = table
      }
    }

    this.calcCords = function () {
      let arr = []
      for (let y = 0; y < board.table.length; y++) {
        for (let x = 0; x < board.table[y].length; x++) {
          if (board.table[y][x]) arr.push([y, x, board.table[y][x]])
        }
      }
      for (let y = 0; y < curTetra.table.length; y++) {
        for (let x = 0; x < curTetra.table[y].length; x++) {

          if (curTetra.table[y][x]) arr.push([curTetra.posY + y, curTetra.posX + x, curTetra.table[y][x]])
        }
      }
      return arr
    }



    this.clearBoardTable = function () {
      let arr = []
      for (let y = -4; y < board.row; y++) {
        arr[y] = []
        for (let x = 0; x < board.col; x++) {
          arr[y][x] = 0
        }
      }
      return arr
    }

    this.stateGame = function () {
      if (board.isPlay) {
        myView.stopGame()
        board.isPlay = false
        clearInterval(ani)
      } else {
        myView.playGame()
        board.isPlay = true
        this.startAnimation()
      }
    }
    this.startNewGame = function () {
      board.score = 0
      board.table = this.clearBoardTable()
      board.isPlay = true
      curTetra = 0
      nextTetra = 0
      clearInterval(ani)
      setTimeout(() => {
        curTetra = this.getRandomTetra()
        nextTetra = this.getRandomTetra()
        myView.renderNexTetra(nextTetra)
        this.startAnimation()

      }, 100);

      myView.startNewGame()
      myView.renderScore(0)
    }
    this.startAnimation = function () {
      ani = setInterval(() => {
        this.moveDownFigure()
        myView.reDraw(this.calcCords())
      }, setting.time);
    }

    this.getRandomTetra = function () {
      return JSON.parse(JSON.stringify(tetraminos[this.rangeRandomNumb(0, 6)]))
    }
    // кнопки управлнеия, и игровой цикл
    this.sumCheck = function (number) {
      board.score += number
      let score = board.score
      if (score < 10) {
        score = '000' + score
      } else if (score < 100) {
        score = '00' + score
      } else if (score < 1000) {
        score = '0' + score
      }
      myView.renderScore(score)
    }

    this.moveDownFigure = function () {
      curTetra.posY += 1

      if (this.colizz()) {
        curTetra.posY -= 1
        this.lock()
        this.respawn()
      }
    }

    this.respawn = function () {
      curTetra = JSON.parse(JSON.stringify(nextTetra))
      nextTetra = this.getRandomTetra()
      myView.renderNexTetra(nextTetra)
    }

    this.moveLeftFigure = function () {
      curTetra.posX -= 1

      if (this.colizz()) {
        curTetra.posX += 1
      }
    }

    this.moveRightFigure = function () {
      curTetra.posX += 1
      if (this.colizz()) {
        curTetra.posX -= 1
      }
    }
    this.colizz = function () {
      for (let y = 0; y < curTetra.table.length; y++) { // проверяем каждую строку
        for (let x = 0; x < curTetra.table[y].length; x++) { // проверяем каждый элемент в строке
          if (
            curTetra.table[y][x] && // существует ли такой элемент в игровом поле
            ((board.table[curTetra.posY + y] === undefined || // строка вне пределов игрового поля
                board.table[curTetra.posY + y][curTetra.posX + x] === undefined) || // элемент вне пределов игрового поля
              board.table[curTetra.posY + y][curTetra.posX + x]) // занята ли ячейка
          ) {
            return true
          }
        }
      }
      return false
    }

    this.lock = function () {
      for (let y = 0; y < curTetra.table.length; y++) {
        for (let x = 0; x < curTetra.table[y].length; x++) {
          if (curTetra.table[y][x]) {
            board.table[curTetra.posY + y][curTetra.posX + x] = curTetra.table[y][x] // записываем в игровой массив застывшую фигуру
          }
        }
      }
      this.sumCheck(4)
      this.hideRow()
      if (curTetra.posY < 0) this.gameOver()
    }
    this.gameOver = function () {
      myView.clearBord()
      clearInterval(ani)
      board.isPlay = false
      myView.gameOver()
    }
    this.hideRow = function () {
      console.log('hide row');
      let multiX = -1
      for (let y = 0; y < board.table.length; y++) {
        let count = 0
        for (let x = 0; x < board.table[y].length; x++) {

          if (board.table[y][x]) {
            count++
          }
        }
        if (count === 10) {
          multiX++
          this.toDownArray(y)
        }
      }
      if (multiX > -1) this.sumCheck((2 ** multiX) * 10)
    }
    this.toDownArray = function (i) {
      console.log(1111111111111);
      let y = i
      for (y; y > 0; y--) {
        for (let x = 0; x < board.table[y].length; x++) {
          board.table[y][x] = board.table[y - 1][x]
          board.table[y - 1][x] = 0
        }
      }
    }
    this.rangeRandomNumb = function (min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
    }
    this.jumpToDown = function () {
      curTetra.posY += 1

      if (this.colizz()) {
        curTetra.posY -= 1
        this.lock()
        this.respawn()
      } else this.jumpToDown()

    }
    this.keyMove = function (e) {
      if (!board.isPlay) return // если игра окончена

      switch (e.code) {
        case setting.keyLeft:
          e.preventDefault()
          this.moveLeftFigure()
          break;
        case setting.keyRight:
          e.preventDefault()
          this.moveRightFigure()
          break;
        case setting.keyRotate:
          e.preventDefault()
          this.rotateTetramino()
          break;
        case setting.keyDown:
          e.preventDefault()
          this.jumpToDown()
          break;
      }
      myView.reDraw(this.calcCords())
    }
    this.saveScore = function (username) {
      let date = Date.parse(new Date)
      myAppDB.ref('players/' + `player_${username.replace(/\s/g, "").toLowerCase()}`).set({
          username: `${username}`,
          score: `${board.score}`,
          date: date
        })
        .then((username) => console.log('ADD'))
        .catch((error) => console.error(error))

    }
    this.validName = function (str) {
      myView.btnSaveState(!str)
    }

  }


  function GameController() {
    let myContainer = null
    let myModel = null

    let btnCheckState = null
    let btnNewGame = null
    let playerNameInput = null
    let self = this

    this.init = function (contrainer, model) {
      myContainer = contrainer
      myModel = model

      playerNameInput = myContainer.querySelector('#username')
      playerNameInput.addEventListener('input', (e) => {
        e.preventDefault()
        myModel.validName(playerNameInput.value)
      })

      btnCheckState = myContainer.querySelector('#pause-button')
      btnCheckState.addEventListener('click', this.stateGame)

      btnSaveScore = myContainer.querySelector('#save-score-btn')
      btnSaveScore.addEventListener('click', this.saveScore)

      btnNewGame = myContainer.querySelector('#newGame-button')
      btnNewGame.addEventListener('click', this.newGame)

    }
    this.saveScore = function (e) {
      e.preventDefault()
      myModel.saveScore(playerNameInput.value)
    }
    this.stateGame = function () {
      myModel.stateGame()
    }

    this.moveFigure = function (e) {
      // e.preventDefault()
      myModel.keyMove(e)
    }

    this.newGame = function (e) {
      e.preventDefault()
      e.target.blur()
      // в данном случае this равен кнопке
      document.addEventListener('keydown', self.moveFigure)
      myModel.startNewGame()
    }
  }

  return {
    version: '0.0.1',

    init: function () {
      let container = document.querySelector('.game')
      const appModalView = new GameView();
      const appModalModel = new GameModel();
      const appModalController = new GameController();
      // можно было сохранить в переменную контейнер, но при инициализации view он перерисовывается или создается и в контроллере заново находится даже если его небыло
      appModalView.init(container);
      appModalModel.init(appModalView);
      appModalController.init(container, appModalModel);
      this.main()
    },

    main: function () {
      console.log('Инициализация прошла успешно. Project by Vadim Galakov. Версия проекта: ' + this.version);
    },

  };

})()



const gameSetting = (function () {


  function View() {
    let myContainer = null

    this.init = function (container) {
      myContainer = container

      inputTitme = myContainer.querySelector('#time')
      btnRotate = myContainer.querySelector('#setting-rotate')
      btnForLeft = myContainer.querySelector('#setting-left')
      btnForRight = myContainer.querySelector('#setting-right')
      btnForDown = myContainer.querySelector('#setting-down')
      btnReset = myContainer.querySelector('#setting-reset')
    }
    this.setSetting = function ({
      time,
      keyRotate,
      keyLeft,
      keyRight,
      keyDown
    }) {
      inputTitme.value = time;
      btnRotate.value = keyRotate;
      btnForLeft.value = keyLeft;
      btnForRight.value = keyRight;
      btnForDown.value = keyDown
    }
  }

  function Model() {
    myView = null

    let defaultSetting = {
      time: 500,
      keyRotate: 'Space',
      keyLeft: 'ArrowLeft',
      keyRight: 'ArrowRight',
      keyDown: 'ArrowDown',
    }
    let customSetting = {
      time: 500,
      keyRotate: 'Space',
      keyLeft: 'ArrowLeft',
      keyRight: 'ArrowRight',
      keyDown: 'ArrowDown',
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
    this.first = function (dataKey, val) {
      customSetting[dataKey] = val
      localStorage.setItem('setting', JSON.stringify(customSetting))
      myView.setSetting(customSetting)
    }
  }

  function Controller() {
    let myContainer = null
    let myModel = null

    let inputTitme = null
    let btnRotate = null
    let btnForLeft = null
    let btnForRight = null
    let keyForDown = null

    this.init = function (contrainer, model) {
      myContainer = contrainer
      myModel = model

      inputTitme = myContainer.querySelector('#time')
      inputTitme.addEventListener('input', this.setVal)

      btnRotate = myContainer.querySelector('#setting-rotate')
      btnRotate.addEventListener('click', this.setBtn)

      btnForLeft = myContainer.querySelector('#setting-left')
      btnForLeft.addEventListener('click', this.setBtn)

      btnForRight = myContainer.querySelector('#setting-right')
      btnForRight.addEventListener('click', this.setBtn)

      keyForDown = myContainer.querySelector('#setting-down')
      keyForDown.addEventListener('click', this.setBtn)

      btnReset = myContainer.querySelector('#setting-reset')
      btnReset.addEventListener('click', this.setDefaultSettings)

    }
    this.setVal = function (e) {
      e.preventDefault()
      myModel.first(e.target.dataset.control, e.target.value, true)
    }
    this.setBtn = function (e) {
      e.preventDefault()
      document.addEventListener('keydown', set = (a) => {
        myModel.first(e.target.dataset.control, a.code)

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







/* ----- spa init module --- */
const scoreTable = (function () {
  /* ------- begin view -------- */
  function ScoreView() {
    let myContainer = null;
    let tbody = null

    this.init = function (container, routes) {
      myContainer = container;
      tbody = myContainer.querySelector('tbody')
    }
    this.renderScoreTable = function (arr) {
      tbody.innerHTML = ''
      arr.forEach((obj) => {
        let date = new Date(obj.date)
        tbody.innerHTML += `<tr><td>${obj.number}</td><td>${date.getFullYear()}:${date.getMonth()}:${date.getDate()}</td><td>${obj.username}</td><td>${obj.score}</td></tr`
      })
    }
  }



  function ScoreModel() {
    let myView = null;
    let playerList = null
    let sort = {
      type: 'score',
      back: true,
    }
    this.init = function (view) {
      myView = view;
      myAppDB.ref('players/').once('value')
        .then((snapshot) => {
          let i = 1
          playerList = Object.values(snapshot.val())

          playerList.sort((a, b) => b.score - a.score)
          for (let i = 0; i < playerList.length; i++) {
            playerList[i].number = i + 1
          }
          myView.renderScoreTable(playerList);
        })
        .catch((error) => {
          console.log(error);
        })
    }
    this.sortFor = function (type) {
      let back = sort.back
      if (sort.type === type) {
        sort.back ? back = false : back = true
      } else {
        sort.type = type;
        sort.back = false;
      }
      if (type === 'score') {
        playerList.sort((a, b) => back ? b.score - a.score : a.score - b.score)
      } else if (type === 'number') {
        playerList.sort((a, b) => back ? b.number - a.number : a.number - b.number)
      } else if (type === 'date') {
        playerList.sort((a, b) => back ? b.date - a.date : a.date - b.date)
      } else if (type === 'name') {
        playerList.sort((a, b) => {
          if (a.username > b.username) {
            return back ? -1 : 1
          }
          if (a.username < b.username) {
            return back ? 1 : -1
          }
          return 0;
        });
      }
      sort.back = back
      myView.renderScoreTable(playerList)
    }
  }


  /* -------- end model -------- */
  /* ----- begin controller ---- */
  function ScoreController() {
    let myContainer = null;
    let myModel = null;
    let thead = null

    this.init = function (container, model) {
      myContainer = container;
      myModel = model;
      thead = myContainer.querySelector('thead')
      thead.addEventListener('click', this.sortFor)

      // sortBtns = Array.from(myContainer.querySelector('.btn__sort'))
      // .forEach((el) => {
      //   el.addEventListener('click', console.log(1))
      // })
    }
    this.sortList = function (e) {
      e.preventDefault()
      console.log(e);
      myModel.sortList(e.dataset.sort)
    }
    this.sortFor = function (e) {
      e.preventDefault()
      if (e.target.dataset.sort) {
        myModel.sortFor(e.target.dataset.sort)
      }
    }

  };

  return {
    init: function () {
      let container = document.querySelector('#content')

      const view = new ScoreView();
      const model = new ScoreModel();
      const controller = new ScoreController();

      //связываем части модуля
      view.init(container);
      model.init(view);
      controller.init(container, model);


      // myAppDB.ref('players/' + 'testplayer').set({
      //   username: 'test',
      //   score: '0004'
      // })
    },

  };

}());







/* ----- spa init module --- */
const mySPA = (function () {

  /* ------- begin view -------- */
  function ModuleView() {
    let myModuleContainer = null;
    let menu = null;
    let contentContainer = null;
    let routesObj = null;
    let warnModal = null
    this.init = function (container, routes) {
      myModuleContainer = container;
      routesObj = routes;
      menu = myModuleContainer.querySelector("#mainmenu");
      contentContainer = myModuleContainer.querySelector("#content");
      warnModal = document.querySelector('.modal__wrapper')
    }

    this.renderContent = function (hashPageName) {
      let routeName = "default";

      if (hashPageName.length > 0) {
        routeName = hashPageName in routes ? hashPageName : "error";
      }

      window.document.title = routesObj[routeName].title;
      contentContainer.innerHTML = routesObj[routeName].render(`${routeName}-page`);
      this.updateButtons(routesObj[routeName].id);
    }

    this.updateButtons = function (currentPage) {
      const menuLinks = menu.querySelectorAll(".mainmenu__link");

      for (let link of menuLinks) {
        currentPage === link.getAttribute("href").slice(1) ? link.classList.add("active") : link.classList.remove("active");
      }
    }
    this.showModal = function () {
      warnModal.classList.remove('hide')
    }
    this.hideModal = function () {
      warnModal.classList.add('hide')
    }
  };
  /* -------- end view --------- */
  /* ------- begin model ------- */
  function ModuleModel() {
    let myModuleView = null;
    let viewModal = false
    this.init = function (view) {
      myModuleView = view;
    }

    this.updateState = function (pageName) {
      myModuleView.renderContent(pageName);

      if (pageName === 'main' || !pageName) {
        tetris.init()
      } else if (pageName === 'setting') {
        gameSetting.init()
      } else if (pageName === 'check') {
        scoreTable.init()
      }
    }
    // this.closeModal = function () {
    //   console.log('close');
    // }
  }

  /* -------- end model -------- */
  /* ----- begin controller ---- */
  function ModuleController() {
    let myModuleContainer = null;
    let myModuleModel = null;


    this.init = function (container, model) {
      myModuleContainer = container;
      myModuleModel = model;

      // вешаем слушателей на событие hashchange и кликам по пунктам меню
      window.addEventListener("hashchange", this.updateState);

      this.updateState(); //первая отрисовка
    }

    this.updateState = function () {
      const hashPageName = location.hash.slice(1).toLowerCase();
      myModuleModel.updateState(hashPageName);
    }
  };
  /* ------ end controller ----- */

  return {
    init: function ({
      container,
      routes,
      components
    }) {
      if (!localStorage.getItem('setting')) {
        localStorage.setItem('setting', JSON.stringify({
          time: 500,
          keyRotate: 'Space',
          keyLeft: 'ArrowLeft',
          keyRight: 'ArrowRight',
          keyDown: 'ArrowDown',
        }))
      }
      this.renderComponents(container, components);

      const view = new ModuleView();
      const model = new ModuleModel();
      const controller = new ModuleController();

      //связываем части модуля
      view.init(document.getElementById(container), routes);
      model.init(view);
      controller.init(document.getElementById(container), model);
    },

    renderComponents: function (container, components) {
      const root = document.getElementById(container);
      const componentsList = Object.keys(components);
      for (let item of componentsList) {
        root.innerHTML += components[item].render("component");
      }
    },
  };

}());
/* ------ end app module ----- */

/*** --- init module --- ***/
document.addEventListener("DOMContentLoaded", mySPA.init({
  container: "spa",
  routes: routes,
  components: components
}));