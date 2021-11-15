const tetris = (function () {
  // это будем парсить из локала и заполнять при инициализации, если в локале пусто


  function GameView() {
    let myContainer = null
    let btnCheckState = null
    let btnNewGame = null
    let btnSaveScore = null
    let form = null
    let inputUserName = null
    let = false
    let splashScreen = true
    const colors = ['#00F0F0', '#F0A000', '#0000F0', '#F0F000', '#00F000', '#F00000', '#52007B'];
    let canvas = {
      el: null,
      width: null,
      height: null,
      cellSize: null,
      ctx: null,
      score: null,
      line: null,
      level: null,
      isDrowCells: false,
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
      inputUserName = myContainer.querySelector('#username')
      canvas.score = myContainer.querySelector('#score')
      canvas.level = myContainer.querySelector('#level')
      canvas.line = myContainer.querySelector('#line')

      canvas.el = myContainer.querySelector('#game-canvas')
      canvas.ctx = canvas.el.getContext('2d')

      canvasAd.el = myContainer.querySelector('#canvas-next-tetra')
      canvasAd.ctx = canvasAd.el.getContext('2d')


      btnNewGame = myContainer.querySelector('#newGame-button')

    }
    this.setSize = function (bigBoard, smallBoard, isDrowCells) {
      canvas.width = bigBoard.width;
      canvas.height = bigBoard.height;
      canvas.cellSize = bigBoard.cellSize;
      canvas.el.setAttribute('width', canvas.width);
      canvas.el.setAttribute('height', canvas.height);
      canvas.isDrowCells = isDrowCells;
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
      inputUserName.classList.remove('input-try')
      inputUserName.classList.remove('input-error')
      this.clearBord()
      btnCheckState.classList.remove('hide')
      form.classList.add('hide')
    }
    this.gameOver = function (splashScreen) {
      let ctx = canvas.ctx
      if (!splashScreen) {
        btnCheckState.classList.add('hide')
        btnSaveScore.classList.remove('hide')
        form.classList.remove('hide')
      }
      setTimeout(() => {
        ctx.fillStyle = 'black'
        ctx.fillRect(2, 250, 316, 100)
        ctx.font = '46px Arial';
        ctx.textAlign = 'center'
        ctx.fillStyle = 'black';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        ctx.font = '48px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
      }, 0);
    }
    this.reDraw = function (arr) {
      let ctx = canvas.ctx
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      if (canvas.isDrowCells) {
        this.drowCells()
      }
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
    this.renderStats = function (score, level = 1, line = 0) {
      canvas.score.innerText = score
      canvas.level.innerText = level
      canvas.line.innerText = line

    }
    this.drowCells = function () {
      let block = canvas.cellSize
      let ctx = canvas.ctx
      for (let y = 0; y < 20; y++) {
        for (let x = 0; x < 10; x++) {
          ctx.strokeStyle = 'gray'
          ctx.strokeRect(x * block, y * block, block, block)
        }

      }
    }
    this.clearBord = function () {
      let ctxAd = canvasAd.ctx
      let ctx = canvas.ctx

      ctx.fillStyle = 'white'
      ctxAd.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctxAd.fillRect(0, 0, canvasAd.width, canvasAd.height)
      // if (canvas.isDrowCells)this.drowCells()
    }
    this.btnSaveState = function (str) {
      btnSaveScore.disabled = str
    }
    this.userExists = function (user) {
      if (user) {
        inputUserName.classList.remove('input-try')
        inputUserName.classList.add('input-error')
      } else {
        inputUserName.classList.remove('input-error')
        inputUserName.classList.add('input-try')
        btnSaveScore.classList.add('hide')
      }

    }
  }

  function GameModel() {

    let myView = null
    // проверим идет ли анимация
    let ani = null
    let splashScreenId = null
    let isSplashScreen = false
    let setting = {}
    let curTetra = null
    const sounds = {
      drop: new Audio('../sounds/drop.mp3'),
      gameOver: new Audio('../sounds/game-over.mp3'),
      levelUp: new Audio('../sounds/level-up.mp3'),
      move: new Audio('../sounds/move.mp3'),
      start: new Audio('../sounds/start.mp3')
    }
    let board = {
      width: 320,
      height: 640,
      table: null,
      row: 20,
      col: 10,
      cellSize: 32,
      isPlay: false,
      score: 0,
      level: 1,
      line: 0,
      time: null,
      isDrowCells: false,
    }
    let boardNextTetra = {
      width: 180,
      height: 180,
      cellSize: 40,
    }

    let tetraminos = [{
        name: 'I',
        table: [
          [0, 0, 1, 0],
          [0, 0, 1, 0],
          [0, 0, 1, 0],
          [0, 0, 1, 0],
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
      setting = JSON.parse(localStorage.getItem('setting'))
      board.time = setting.time
      board.isDrowCells = setting.isDrowCells

      if (setting.music) {
        sounds.start.volume = +setting.musicVol
        sounds.gameOver.volume = +setting.musicVol
      } else {
        sounds.start.volume = 0
        sounds.gameOver.volume = 0

      }
      if (setting.sound) {
        sounds.move.volume = +setting.soundVol
        sounds.drop.volume = +setting.soundVol
        sounds.levelUp.volume = +setting.soundVol
      } else {
        sounds.move.volume = 0
        sounds.drop.volume = 0
        sounds.levelUp.volume = 0

      }
      myView.setSize(board, boardNextTetra, board.isDrowCells)
      this.splashScreen()

    }

    this.startNewGame = function () {
      if (isSplashScreen) clearInterval(splashScreenId)
      board.score = 0
      board.line = 0
      board.level = 1
      board.table = this.clearBoardTable()
      board.isPlay = true
      curTetra = null
      nextTetra = null
      clearInterval(ani)
      setTimeout(() => {
        curTetra = this.getRandomTetra()
        nextTetra = this.getRandomTetra()
        myView.renderNexTetra(nextTetra)
        this.startAnimation()
      }, 100);
      if (isSplashScreen == 1) return
      sounds.start.play()
      myView.playGame()
      myView.startNewGame()
      myView.renderStats('0000')
      isSplashScreen = false
    }

    this.splashScreen = function () {
      isSplashScreen = 1
      this.startNewGame()
      splashScreenId = setInterval(() => {
        let move = this.rangeRandomNumb(1, 10)
        switch (move) {
          case 1:
            this.moveLeftFigure()
            break;
          case 2:
            this.moveRightFigure()
            break;
          case 3:
            this.rotateTetramino()
            break;
          default:
            break;
        }
      }, 200);
      isSplashScreen++
    }

    this.rotateTetramino = function () {
      let table = curTetra.table
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

    this.startAnimation = function () {
      clearInterval(ani)
      ani = setInterval(() => {
        this.moveDownFigure()
        myView.reDraw(this.calcCords())
      }, board.time);


    }

    this.getRandomTetra = function () {
      return JSON.parse(JSON.stringify(tetraminos[this.rangeRandomNumb(0, 6)]))
    }
    // кнопки управлнеия, и игровой цикл
    this.calcStats = function (points) {
      board.score += points
      let score = board.score
      if (score < 10) {
        score = '000' + score
      } else if (score < 100) {
        score = '00' + score
      } else if (score < 1000) {
        score = '0' + score
      }
      if (board.line >= 10) {
        board.line %= 10
        board.level++
        sounds.levelUp.play()
        board.time *= 0.8
        this.startAnimation()
        console.log(board.time);
      }

      myView.renderStats(score, board.level, board.line)
    }

    this.moveDownFigure = function () {
      curTetra.posY += 1

      if (this.colizz()) {
        curTetra.posY -= 1
        this.lock()
      }
    }

    this.respawnTetra = function () {
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
      this.calcStats(4)
      this.hideRow()
      if (curTetra.posY < 0) this.gameOver()
      else this.respawnTetra()
    }
    this.gameOver = function () {
      myView.clearBord()
      clearInterval(ani)
      board.isPlay = false
      if (!isSplashScreen) {
        sounds.gameOver.play()
      }
      if (isSplashScreen == 2) {
        clearInterval(splashScreenId)
        myView.gameOver(isSplashScreen)
        isSplashScreen = 0
        return
      }
      myView.gameOver()

    }
    this.hideRow = function () {
      let multiX = -1
      for (let y = 0; y < board.table.length; y++) {
        let count = 0
        for (let x = 0; x < board.table[y].length; x++) {

          if (board.table[y][x]) {
            count++
          }
        }
        if (count === 10) {
          this.downBordArr(y)
          multiX++
          board.line++
        }
      }
      if (multiX > -1) this.calcStats((2 ** multiX) * 10)

    }
    this.downBordArr = function (i) {
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
        sounds.drop.play()
      } else this.jumpToDown()

    }
    this.keyMove = function (e) {
      if (!board.isPlay) return // если игра окончена
      if (setting.sound) {
        let soundMove = sounds.move.cloneNode()
        soundMove.volume = setting.soundVol
        soundMove.play()
      }
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
          this.moveDownFigure()
          break;
        case setting.keyPowerDown:
          e.preventDefault()
          this.jumpToDown()
          break;
      }
      myView.reDraw(this.calcCords())
    }
    this.userExists = function (username) {
      myAppDB.ref('players/' + `player_${username.replace(/\s/g, "").toLowerCase()}`).get()
      .then(snapshot => {
          if (snapshot.val()) myView.userExists(true)
          else this.saveScore(username)
        })
        .catch(error => {
          console.log(error);
        })
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
      myView.userExists(false)
    }
    this.validName = function (str) {
      myView.btnSaveState(!str)
    }
    this.exitGame = function () {

    }

  }


  function GameController() {
    let myContainer = null
    let myModel = null

    let btnCheckState = null
    let btnSaveScore = null
    let btnNewGame = null
    let playerNameInput = null
    let self = this

    this.init = function (contrainer, model) {
      myContainer = contrainer
      myModel = model

      playerNameInput = myContainer.querySelector('#username')
      playerNameInput.addEventListener('input', this.validInput)

      btnCheckState = myContainer.querySelector('#pause-button')
      btnCheckState.addEventListener('click', this.stateGame)

      btnSaveScore = myContainer.querySelector('#save-score-btn')
      btnSaveScore.addEventListener('click', this.userExists)

      btnNewGame = myContainer.querySelector('#newGame-button')
      btnNewGame.addEventListener('click', this.newGame)

      window.addEventListener("hashchange", this.exitGame, {
        once: true
      });

    }
    this.validInput = function (e) {
      e.preventDefault()
      myModel.validName(e.target.value)
    }
    this.exitGame = function () {
      myModel.exitGame()
      playerNameInput.removeEventListener('input', this.validInput)
      btnCheckState.removeEventListener('click', this.stateGame)
      btnSaveScore.removeEventListener('click', this.saveScore)
      btnNewGame.removeEventListener('click', this.newGame)
      document.removeEventListener('keydown', self.moveFigure)
    }
    this.userExists = function (e) {
      e.preventDefault()
      myModel.userExists(playerNameInput.value)
    }
    this.stateGame = function () {
      myModel.stateGame()
    }

    this.moveFigure = function (e) {
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