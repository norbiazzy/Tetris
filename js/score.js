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
        }
        this.sortList = function (e) {
            e.preventDefault()
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