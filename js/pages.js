const HomePage = {
  id: "main",
  title: "Tetris",
  render: (className = "container", ...rest) => {
    return `
    <section class="game ${className}">
      <canvas class="game__canvas" id="game-canvas"></canvas>
      <aside class="game__bar">
        <div class="game__info">
          <h3 class="game__title">Norbi</h3>
          <p class="game__score">Счет: <span id='score'>0000</span></p>
          <div>
            <canvas class=" game__canvas_small" id="canvas-next-tetra"></canvas>
          </div>
        </div>
        <div class="game__btns">
          <form class="game__form hide">
            <label class="game__subtitle">Ведите имя:</label>
            <input class="game__item" type="text" placeholder='Username' name="username" id="username">
            <input type="button" value="Сохранить результат" disabled="true" class="game__item hide" id="save-score-btn">
          </form>
          <button class="game__item hide" id="pause-button">Пауза</button>
          <button class="game__item" id="newGame-button">Новая игра</button>
        </div>
      </aside>
    </section>
    `;
  }
};
const SettingPage = {
  id: "setting",
  title: "Настройки Tetris",
  render: (className = "container", ...rest) => {
    return `
      <section class="${className}">
      <div class="setting">
      <form class="setting__form">
        <label class="setting__item setting__time">Время между фигурами<input class="setting__input" type="number" value="500" name="time" id="time" data-control="time"></label>
        <label class="setting__item setting__rotate"> Вращение фигуры<input class="setting__input" type="button" value="Spase" id="setting-rotate" data-control="keyRotate"></label>
        <label class="setting__item setting__left"> Фигура влево<input class="setting__input" type="button" value="ArrowLeft" id="setting-left" data-control="keyLeft"></label>
        <label class="setting__item setting__rigth"> Фигура вправо<input class="setting__input" type="button" value="ArrowRight" id="setting-right" data-control="keyRight"></label>

        <label class="setting__item setting__down"> Прыжок вниз<input class="setting__input" type="button" value="ArrowDown" id="setting-down" data-control="keyDown"></label>

        <input class="setting__item setting__btn setting__reset" id="setting-reset" type="button" value="Cбросить настройки">
      </form>
    </div>
      </section>
    `;
  }
};
const HelpPage = {
  id: "help",
  title: "Правила игры в Tetris",
  render: (className = "container", ...rest) => {
    return `
      <section class="${className}">
      <div class="wrapper">
      <h2>Правила игры</h2>
      <p>Случайные фигурки тетрамино падают сверху в прямоугольный стакан шириной 10 и высотой 20 клеток. В полёте игрок может поворачивать фигурку на 90° и двигать её по горизонтали. Также можно «сбрасывать» фигурку, то есть ускорять её падение, когда уже решено, куда фигурка должна упасть. Фигурка летит до тех пор, пока не наткнётся на другую фигурку либо на дно стакана. Если при этом заполнился горизонтальный ряд из 10 клеток, он пропадает и всё, что выше него, опускается на одну клетку. Дополнительно показывается фигурка, которая будет следовать после текущей — это подсказка, которая позволяет игроку планировать действия. Темп игры постепенно ускоряется. Игра заканчивается, когда новая фигурка не может поместиться в стакан. Игрок получает очки за каждый заполненный ряд, поэтому его задача — заполнять ряды, не заполняя сам стакан (по вертикали) как можно дольше, чтобы таким образом получить как можно больше очков.</p>
      </div>
      </section>
    `;
  }
};
const CheckPage = {
  id: "check",
  title: "Лучшие игроки",
  render: (className = "container", ...rest) => {
    return `
      <section class="${className}">
      <h2>Таблица лидеров</h2>
        <table class="check__table">
          <thead class="check__head">
            <tr class="check__row">
              <th><button class="btn__sort" data-sort="number">#</button></th>
              <th><button class="btn__sort" data-sort="date">Дата</button></th>
              <th><button class="btn__sort" data-sort="name">Имя Игрока</button></th>
              <th><button class="btn__sort" data-sort="score">Счет</button></th>
            </tr>
          </thead>
          <tbody class="check__body"></tbody>
        </table>
      </section>
    `;
  }
};

const ErrorPage = {
  id: "error",
  title: "Achtung, warning, kujdes, attenzione, pozornost...",
  render: (className = "container", ...rest) => {
    return `
      <section class="${className}">
        <h1>Ошибка 404</h1>
        <p>Страница не найдена, попробуйте вернуться на <a href="#main">главную</a>.</p>
      </section>
    `;
  }
};