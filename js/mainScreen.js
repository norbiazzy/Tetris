// const mainScreen = (function () {

//   function MainView() {
//     let myContainer = null

//     this.init = function (container) {
//       myContainer = container
//     }
//     this.blank = function () {
//       settings.bufferCtx.fillStyle = settings.bachgroundColor;
//       settings.bufferCtx.fillRect(0, 0, settings.width, settings.height);
//     }
//   }

//   function MainModel() {
//     let myView = null
//     let tetraminos = [{
//         name: 'I',
//         table: [
//           [0, 0, 1, 0],
//           [0, 0, 1, 0],
//           [0, 0, 1, 0],
//           [0, 0, 1, 0],
//         ],
//         posX: null,
//         posY: -4,
//       },
//       {
//         name: "L",
//         table: [
//           [0, 0, 2],
//           [2, 2, 2],
//           [0, 0, 0],
//         ],
//         posX: null,
//         posY: -2,
//       },
//       {
//         name: 'J',
//         table: [
//           [3, 0, 0],
//           [3, 3, 3],
//           [0, 0, 0],
//         ],
//         posX: null,
//         posY: -2,
//       },
//       {
//         name: 'O',
//         table: [
//           [4, 4],
//           [4, 4],
//         ],
//         posX: null,
//         posY: -2,
//       },
//       {
//         name: 'S',
//         table: [
//           [0, 5, 5],
//           [5, 5, 0],
//           [0, 0, 0],
//         ],
//         posX: null,
//         posY: -2,
//       },
//       {
//         name: 'Z',
//         table: [
//           [6, 6, 0],
//           [0, 6, 6],
//           [0, 0, 0],
//         ],
//         posX: null,
//         posY: -2,
//       },
//       {
//         name: 'T',
//         table: [
//           [0, 7, 0],
//           [7, 7, 7],
//           [0, 0, 0],
//         ],
//         posX: null,
//         posY: -2,
//       }

//     ]
//     let settings = {
//       width: null,
//       canvas: null,
//       ctx: null,
//       bufferCanvas: null,
//       bufferCtx: null,
//       maxEl: 100,
//       table: null,
//       row: null,
//       col: null,
//       hardCellSize: 50, // для пересчета ячейки
//       cellSize: null,
//       height: null,
//       bachgroundColor: 'black',
//     }
//     let tetra = null

//     this.init = function (view) {
//       myView = view
//     }
//     this.randomSpawn = function () {
//       tetra = JSON.parse(JSON.stringify(tetraminos[this.rangeRandomNumb(0, 6)]))
//       tetra.posX = this.rangeRandomNumb(0, settings.col - 3)
//       while (!this.colizz()) {
//         tetra.posX += 3
//         if (tetra.posX >= settings.col) {
//           debugger
//           tetra.posY++
//           tetra.posX += 0
//         }
//       }
//       this.lock()



//     }

//     this.setSize = function (h, w) {
//       settings.height = h
//       settings.width = w
//       settings.col = Math.floor(settings.height / settings.hardCellSize)
//       settings.row = Math.floor(settings.width / settings.hardCellSize)
//       settings.cellSize = settings.width / settings.col
//       settings.table = this.createTable()
//       console.table(settings.table);

//       let i = 0
//       while (i < 20) {
//         i++
//         this.randomSpawn()

//       }
//       console.table(settings.table);
//       console.log(settings);
//     }

//     this.createTable = function () {
//       let arr = []
//       for (let y = -4; y < settings.row; y++) {
//         arr[y] = []
//         for (let x = 0; x < settings.col; x++) {
//           arr[y][x] = 0
//         }
//       }
//       return arr
//     }

//     this.lock = function () {
//       for (let y = 0; y < tetra.table.length; y++) {
//         for (let x = 0; x < tetra.table[y].length; x++) {
//           if (tetra.table[y][x]) {
//             settings.table[tetra.posY + y][tetra.posX + x] = tetra.table[y][x] // записываем в игровой массив застывшую фигуру
//           }
//         }
//       }
//     }
//     this.colizz = function () {
//       for (let y = 0; y < tetra.table.length; y++) { // проверяем каждую строку
//         for (let x = 0; x < tetra.table[y].length; x++) { // проверяем каждый элемент в строке
//           if (
//             tetra.table[y][x] && // существует ли такой элемент в игровом поле
//             ((settings.table[tetra.posY + y] === undefined || // строка вне пределов игрового поля
//                 settings.table[tetra.posY + y][tetra.posX + x] === undefined) || // элемент вне пределов игрового поля
//               settings.table[tetra.posY + y][tetra.posX + x]) // занята ли ячейка
//           ) {
//             debugger
//             console.table(settings.table[y][x]);

//             return true
//           }
//         }
//       }
//       return false
//     }

//     this.rangeRandomNumb = function (min, max) {
//       min = Math.ceil(min);
//       max = Math.floor(max);
//       return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
//     }
//   }

//   function MainControoller() {
//     let myContainer = null,
//       myModel = null

//     this.init = function (container, model) {
//       myContainer = container
//       myModel = model
//       myModel.setSize(document.documentElement.clientHeight, document.documentElement.clientWidth)
//       window.addEventListener('resize', this.setSize)
//     }
//     this.setSize = function (e) {
//       let height = e.target.document.documentElement.clientHeight
//       let width = e.target.document.documentElement.clientWidth
//       myModel.setSize(height, width)
//     }

//   }

//   return {
//     init: function () {
//       const container = document.querySelector('#content')
//       const view = new MainView();
//       const model = new MainModel();
//       const controller = new MainControoller();
//       //связываем части модуля
//       view.init(container);
//       model.init(view);
//       controller.init(container, model)
//     },
//   }
// })()