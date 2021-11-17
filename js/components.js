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
        <li><a class="mainmenu__link" href="#main">Галавная страница</a></li>
          <li><a class="mainmenu__link" href="#game">Игра</a></li>
          <li><a class="mainmenu__link" href="#setting">Настройки</a></li>
          <li><a class="mainmenu__link" href="#help">Помощь</a></li>
          <li><a class="mainmenu__link" href="#check">Счет</a></li>
        </ul>
      </nav>
    `;
  }
};

const Content = {
  render: (customClass = "") => {
    return `<div class="content ${customClass}" id="content"></div>`;
  }
};

const Footer = {
  render: (customClass = "") => {
    return `<footer class="footer ${customClass}">
      <p>&copy;Project by Vadim Galakov 2021</p>
    </footer>`;
  }
};
