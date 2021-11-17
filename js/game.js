const tetris = (function () {
  // это будем парсить из локала и заполнять при инициализации, если в локале пусто


  function GameView() {
    const colors = ['#00F0F0', '#F0A000', '#0000F0', '#F0F000', '#00F000', '#F00000', '#52007B'];
    let myContainer = null;
    let canvas = {
      el: null,
      width: null,
      height: null,
      cellSize: null,
      ctx: null,
      isDrowCells: false,
    };
    let aside = {
      btnNewGame: null,
      btnCheckState: null,
      btnSaveScore: null,
      inputUserName: null,
      form: null,
      score: null,
      level: null,
      line: null,

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

      aside.btnNewGame = myContainer.querySelector('#newGame-button')
      aside.btnCheckState = myContainer.querySelector('#pause-button')
      aside.btnSaveScore = myContainer.querySelector('#save-score-btn')
      aside.inputUserName = myContainer.querySelector('#username')
      aside.form = myContainer.querySelector('.game__form')
      aside.score = myContainer.querySelector('#score')
      aside.level = myContainer.querySelector('#level')
      aside.line = myContainer.querySelector('#line')

      canvas.el = myContainer.querySelector('#game-canvas')
      canvas.ctx = canvas.el.getContext('2d')

      canvasAd.el = myContainer.querySelector('#canvas-next-tetra')
      canvasAd.ctx = canvasAd.el.getContext('2d')
    }
    this.setSize = function (bigBoard, smallBoard) {
      canvas.width = bigBoard.width;
      canvas.height = bigBoard.height;
      canvas.cellSize = bigBoard.cellSize;
      canvas.el.setAttribute('width', canvas.width);
      canvas.el.setAttribute('height', canvas.height);
      canvas.isDrowCells = bigBoard.isDrowCells;

      canvasAd.width = smallBoard.width;
      canvasAd.height = smallBoard.height;
      canvasAd.cellSize = smallBoard.cellSize;
      canvasAd.el.setAttribute('width', canvasAd.width);
      canvasAd.el.setAttribute('height', canvasAd.height);
    }
    this.stopGame = function () {
      aside.btnCheckState.innerHTML = 'Продолжить'
    }
    this.playGame = function () {
      aside.btnCheckState.innerHTML = 'Пауза'
    }
    this.startNewGame = function () {
      canvasAd.el.style.display = 'block'
      aside.inputUserName.classList.remove('input-try')
      aside.inputUserName.classList.remove('input-error')
      this.clearBord()
      aside.btnCheckState.classList.remove('hide')
      aside.form.classList.add('hide')
    }
    this.gameOver = function (splashScreen) {
      let ctx = canvas.ctx
      canvasAd.el.style.display = 'none'

      if (!splashScreen) {
        aside.btnCheckState.classList.add('hide')
        aside.btnSaveScore.classList.remove('hide')
        aside.form.classList.remove('hide')
      }
      setTimeout(() => {
        ctx.fillStyle = 'black'
        ctx.fillRect(2, canvas.height / 2 - canvas.cellSize * 2, canvas.width - 4, canvas.cellSize * 3)
        ctx.font = `${canvas.cellSize * 1.55}px Arial`;
        ctx.textAlign = 'center'
        ctx.fillStyle = 'black';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        ctx.font = `${canvas.cellSize * 1.5}px Arial`;
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
            ctx.fillRect(x * block + 1, y * block + 1, block + 1, block + 1)
            ctx.fillStyle = colors[table[y][x] - 1]
            ctx.fillRect(x * block + 2, y * block + 2, block - 1, block - 1)
          }
        }
      }
    }
    this.renderStats = function (score, level = 1, line = 0) {
      aside.score.innerText = score
      aside.level.innerText = level
      aside.line.innerText = line

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
    }
    this.btnSaveState = function (str) {
      aside.btnSaveScore.disabled = str
    }
    this.userExists = function (user) {
      if (user) {
        aside.inputUserName.classList.remove('input-try')
        aside.inputUserName.classList.add('input-error')
      } else {
        aside.inputUserName.classList.remove('input-error')
        aside.inputUserName.classList.add('input-try')
        aside.btnSaveScore.classList.add('hide')
      }

    }
  }

  function GameModel() {

    let myView = null,
      animation = null,
      splashScreenId = null,
      isSplashScreen = false,
      setting = null,
      curTetra = null,
      nextTetra = null;

    let board = {
      width: null,
      height: null,
      table: null,
      row: 20,
      col: 10,
      cellSize: null,
      isPlay: false,
      score: 0,
      level: 1,
      line: 0,
      time: null,
      isDrowCells: false,
    }
    let boardNextTetra = {
      width: null,
      height: null,
      cellSize: null,
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
    ];

    this.init = function (view) {
      myView = view
      setting = JSON.parse(localStorage.getItem('setting'))
      board.time = setting.time
      board.isDrowCells = setting.isDrowCells

      if (setting.music) {
        start.volume = +setting.musicVol
        gameOver.volume = +setting.musicVol
      } else {
        start.volume = 0
        gameOver.volume = 0
      }
      if (setting.sound) {
        move.volume = +setting.soundVol
        drop.volume = +setting.soundVol
        levelUp.volume = +setting.soundVol
      } else {
        move.volume = 0
        drop.volume = 0
        levelUp.volume = 0

      }
      this.splashScreen()
    }
    this.setSize = function (height, width) {
      if (width >= 1400) {
        board.cellSize = 36
        boardNextTetra.cellSize = 40
      } else if (width >= 1200) {
        board.cellSize = 26
        boardNextTetra.cellSize = 30
      } else if (width >= 992) {
        board.cellSize = 22
        boardNextTetra.cellSize = 26
      } else {
        board.cellSize = 18
        boardNextTetra.cellSize = 22
      }
      board.height = board.cellSize * board.row
      board.width = board.cellSize * board.col
      boardNextTetra.width = boardNextTetra.height = boardNextTetra.cellSize * 4 + 2
      myView.setSize(board, boardNextTetra)
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
      clearInterval(animation)
      setTimeout(() => {
        curTetra = this.getRandomTetra()
        nextTetra = this.getRandomTetra()
        myView.renderNexTetra(nextTetra)
        this.startAnimation()
      }, 100);
      if (isSplashScreen == 1) return
      start.play()
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
        clearInterval(animation)
      } else {
        myView.playGame()
        board.isPlay = true
        this.startAnimation()
      }
    }

    this.startAnimation = function () {
      clearInterval(animation)
      animation = setInterval(() => {
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
        levelUp.play()
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
      clearInterval(animation)
      board.isPlay = false
      if (!isSplashScreen) {
        gameOver.play()
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
        drop.play()
      } else this.jumpToDown()

    }
    this.keyMove = function (e) {
      if (!board.isPlay) return // если игра окончена
      if (setting.sound) {
        let soundMove = move.cloneNode()
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
      clearInterval(animation)
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
      myModel.setSize(document.documentElement.clientHeight, document.documentElement.clientWidth)
    }
    this.validInput = function (e) {
      e.preventDefault()
      myModel.validName(e.target.value)
    }
    this.exitGame = function () {
      playerNameInput.removeEventListener('input', this.validInput)
      btnCheckState.removeEventListener('click', this.stateGame)
      btnSaveScore.removeEventListener('click', this.saveScore)
      btnNewGame.removeEventListener('click', this.newGame)
      document.removeEventListener('keydown', self.moveFigure)
      myModel.exitGame()
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
    },
  };

})()