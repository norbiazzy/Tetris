const Header = {
  render: (customClass = "") => {
    return `
      <header class="header ${customClass}" id="header">
        <a href="#main">Tetris</a>
      </header>
    `;
  }
};


const NavBar = {
  render: (customClass = "") => {
    return `
      <nav class="mainmenu ${customClass}" id="mainmenu">
        <ul class="mainmenu__list">
          <li><a class="mainmenu__link" href="#main">Игра</a></li>
          <li><a class="mainmenu__link" href="#setting">Настройки</a></li>
          <li><a class="mainmenu__link" href="#help">Помощь</a></li>
          <li><a class="mainmenu__link" href="#chek">Счет</a></li>
        </ul>
      </nav>
    `;
  }
};
// const NavBar = {
//   render: (customClass = "") => {
//     return `
//       <nav class="mainmenu ${customClass}" id="gameMenu">
//         <button class="pre-start__btn" id="#main">Начать</button>
//       </nav>
//     `;
//   }
// };

const Content = {
  render: (customClass = "") => {
    return `<div class="content ${customClass}" id="content"></div>`;
  }
};

const Footer = {
  render: (customClass = "") => {
    return `<footer class="footer ${customClass}">
      <p>&copy;Project by Norbi 2021</p>
    </footer>`;
  }
};

const WarnModal = {
  render: (customClass = "") => {
    return `
    <div class="modal__wrapper hide ${customClass}">
      <div class="modal__inner">
        <div class="modal__shadow"></div>
        <div class="modal">
          <h2 class="modal__title">Осторожно!</h2>
          <p class="modal__text">Если вы нажмете "Принять", процесс игры будет сброшен</p>
          <div class="row">
            <button class="modal__btn modal__btn_assept" id="modal-btn-assept">Принять</button>
            <button class="modal__btn modal__btn_cancel" id="modal-btn-cancel">Отмена</button>
          </div>
        </div>
        </div>
      </div>
    </div>`;

  }
};

// const preStart = {
//   render: (customClass = "") => {
//     return `<div class="preStart__wrapper">
//     <header class="preStart__header">
//       <h2>Tetris</h2>
//     </header>
//     <main class="preStart__main">
//       <button class="preStart__btn">Начать</button>
//     </main>
//     <footer class="preStart__footer">
//       <p>Norbi ©</p>
//     </footer>
//   </div>`;
//   }
// }