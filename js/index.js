firebase.initializeApp({
  apiKey: "AIzaSyBhIoJhMRri1iI2ythHfkW67LhRn9pFAnE",
  authDomain: "tetris-ac756.firebaseapp.com",
  projectId: "tetris-ac756",
  storageBucket: "tetris-ac756.appspot.com",
  messagingSenderId: "87844830536",
  appId: "1:87844830536:web:7ae0a1cf802f4cb268477d",
  measurementId: "G-W50K47HPQ6"
});

const myAppDB = firebase.database();

const drop = new Audio('sounds/drop.mp3'),
  gameOver = new Audio('sounds/gameOver.mp3'),
  levelUp = new Audio('sounds/levelUp.mp3'),
  move = new Audio('sounds/move.mp3'),
  start = new Audio('sounds/start.mp3');

// Список компонент (from components.js)
const components = {
  header: Header,
  content: Content,
  footer: Footer,
};

// Список поддердживаемых роутов (from pages.js)
const routes = {
  main: HomePage,
  game: GamePage,
  default: HomePage,
  setting: SettingPage,
  help: HelpPage,
  check: CheckPage,
  error: ErrorPage,
};

/* ----- spa init module --- */
const mySPA = (function () {

  /* ------- begin view -------- */
  function ModuleView() {
    let myContainer = null;
    let contentContainer = null;
    let routesObj = null;
    
    this.init = function (container, routes) {
      myContainer = container;
      routesObj = routes;
      contentContainer = myContainer.querySelector("#content");
    }

    this.renderContent = function (hashPageName) {
      let routeName = "default";

      if (hashPageName.length > 0) routeName = hashPageName in routes ? hashPageName : "error";
      window.document.title = routesObj[routeName].title;
      contentContainer.innerHTML = routesObj[routeName].render(`${routeName}-page`);
    }
  };

  function ModuleModel() {
    let myView = null

    this.init = function (view) {
      myView = view;
    }

    this.updateState = function (pageName) {
      myView.renderContent(pageName);
      if (pageName === 'game') {
        tetris.init()
      } else if (pageName === 'setting') {
        gameSetting.init()
      } else if (pageName === 'check') {
        scoreTable.init()
      }
    }
  }
  function ModuleController() {
    let myContainer = null;
    let myModel = null;

    this.init = function (container, model) {
      myContainer = container;
      myModel = model;

      window.addEventListener("hashchange", this.updateState);

      this.updateState();
    }

    this.updateState = function () {
      const hashPageName = location.hash.slice(1).toLowerCase();
      myModel.updateState(hashPageName);
    }
  };

  return {
    init: function ({
      container,
      routes,
      components
    }) {
      let setting = localStorage.getItem('setting')
      if (!setting) {
        localStorage.setItem('setting', JSON.stringify({
          time: 500,
          keyRotate: 'ArrowUp',
          keyLeft: 'ArrowLeft',
          keyRight: 'ArrowRight',
          keyDown: 'ArrowDown',
          keyPowerDown: 'Space',
          music: false,
          sound: false,
          musicVol: 0.4,
          soundVol: 0.4,
        }))
      }

      this.renderComponents(container, components);

      const view = new ModuleView();
      const model = new ModuleModel();
      const controller = new ModuleController();

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

document.addEventListener("DOMContentLoaded", mySPA.init({
  container: "spa",
  routes: routes,
  components: components
}));