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
      console.log(pageName);
      if (pageName === 'game') {
        tetris.init()
        // audio.initPageGame()
      } else if (pageName === 'setting') {
        gameSetting.init()
        // audio.initPageSetting()
      } else if (pageName === 'check') {
        scoreTable.init()
      } else if (pageName === 'main') {
        mainScreen.init()
      }
    }
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
      // audio.init()

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