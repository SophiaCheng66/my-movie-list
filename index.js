// 在這段程式碼裡，我們運用 IIFE (Immediately Invoked Functions Expressions) 來讓函式被宣告後就立即執行。之後會把程式碼寫在中間的大括號裡。


(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []

  axios.get(INDEX_URL)
    .then((response) => {
      // console.log(response)
      // console.log(response.data)
      // console.log(response.data.results)
      // 把response.data.results用push的方式存進data裡,會造成array外面又多了一層[],之前會用迴圈(for of)打開list
      //   for (let item of response.data.results) {
      //     data.push(item)
      //   }
      //   console.log(data)

      // 另一種新的解法是使用 ES6 提供的新語法「展開運算子 (spread operator)」... 三個點點（刪節號）就是 spread operator，他的主要功用是「展開陣列元素」
      // 不能再用data=response.data.results來存內容,因為已經const data = []，所以才會把response.data.results用push的方式存進data裡
      data.push(...response.data.results)

      // displayDataList(data)
      getTotalPages(data)
      getPageData(1, data)

    })

    .catch((error) => console.log(error))



  // 目前只有當使用者點擊右上角的兩個 icon 的時候，才會改變顯示的模式。因此，我們可以在程式的最一開始宣告 mode
  let mode = ''
  const modeSelector = document.querySelector('#mode-selector')
  modeSelector.addEventListener('click', (event) => {
    // console.log(event.target)
    if (event.target.matches('#mode-list')) {
      mode = 'list'
      // console.log(event.target)
      // movieList(data)
      getMovieList(1, data)
    }

    else if (event.target.matches('#mode-card')) {
      mode = 'card'
      getPageData(1, data)
    }

  })
  //   只要這裡設定好 mode 的值，之後在任何function裡面都可以提取 mode 這個變數的值，包含 pagination.addEventListener  當中。因此只要判斷 mode 的值，就可以選擇使用不同的畫面輸出方式喔。



  function movieList(data) {
    let listMovies = ''
    data.forEach(item => {
      listMovies += `
   <div id="listCard"   class="card" style="width:150rem;">
   <ul class="list-group list-group-flush   d-flex flex-row justify-content-between">
     <div>
     <li class="list-group-item">${item.title}</li>
     </div>
   <div class = "listButton">
   <button type="button" class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal"  data-id = "${item.id}">more
   </button>
   <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
   </div>
   </ul>       
   </div>
 `
    })
    dataPanel.innerHTML = listMovies
    getMovieList(1, listMovies)
  }

  function getMovieList(pageNum, data) {
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = data.slice(offset, offset + ITEM_PER_PAGE)
    movieList(pageData)
    getTotalPages(pageData)
  }

  const dataPanel = document.getElementById('data-panel')

  // listen to data panel
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      // console.log(event.target)
      // console.log(event.target.dataset.id)
      showMovie(event.target.dataset.id)
    }
    else if (event.target.matches('.btn-add-favorite')) {
      // console.log(event.target.dataset.id)
      addFavoriteItem(event.target.dataset.id)

    }
  })

  const searchForm = document.querySelector('#search')
  const searchInput = document.querySelector('#search-input')
  // 因此遇到這種有預設行為的元件，需要使用 event.preventDefault() 來終止它們的預設行為。畫面就不會閃動了
  /*searchForm.addEventListener('submit', event => {
     event.preventDefault()
     // 先用 toLowerCase()，把 input 和 title 都改成小寫，再進行比對
     let input = searchInput.value.toLowerCase()
     let results = data.filter(
       movie => movie.title.toLowerCase().includes(input)
     )
     console.log(results)
     displayDataList(results)
   })*/

  searchForm.addEventListener('submit', event => {
    event.preventDefault()
    if (mode === 'card') {
      let results = []
      const regex = new RegExp(searchInput.value, 'i')
      // 這裡的 i 代表的是 case insensitive，也就是不管大小寫-0-
      results = data.filter(movie => movie.title.match(regex))
      // console.log(results)
      // displayDataList(results)
      getTotalPages(results)
      getPageData(1, results)
    }
    else if (mode === 'list') {
      let results1 = []
      const regex1 = new RegExp(searchInput.value, 'i')
      // 這裡的 i 代表的是 case insensitive，也就是不管大小寫-0-
      results1 = data.filter(movie => movie.title.match(regex1))
      // console.log(results)
      // displayDataList(results)
      getTotalPages(results1)
      getMovieList(1, results1)
    }
    else {
      let results = []
      const regex = new RegExp(searchInput.value, 'i')
      // 這裡的 i 代表的是 case insensitive，也就是不管大小寫-0-
      results = data.filter(movie => movie.title.match(regex))
      // console.log(results)
      // displayDataList(results)
      getTotalPages(results)
      getPageData(1, results)
    }
  })




  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list !`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
    displayDataList(list)
  }

  const pagination = document.getElementById('pagination')
  const ITEM_PER_PAGE = 12

  // ...

  function getTotalPages(data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }


  pagination.addEventListener('click', event => {
    // console.log(event.target.dataset.page)
    if (event.target.tagName === 'A') {
      if (mode === 'card') {
        getPageData(event.target.dataset.page)
      }
      else if (mode === 'list') {
        getMovieList(event.target.dataset.page, data)
      }
      else {
        getPageData(event.target.dataset.page)
      }
    }
  })





  let paginationData = []

  // ...
  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }

  function displayDataList(data) {
    let htmlContent = ''
    //用index出來是數字
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top"  src="${POSTER_URL}${item.image}"  alt="Card image cap">

            <div  class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h6>
            </div>

            <div  class="card-footer">
               <button type="button" class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal"  data-id = "${item.id}">more
            </button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>

        
       `
      // 以下內容用上面bootstrap的內容取代,用到card的元件
      // <div>
      //   <img src =" ${POSTER_URL}${item.image}" >
      //   <h6>${item.title}</h6>
      //  </div>
    })
    dataPanel.innerHTML = htmlContent
  }


  function showMovie(id) {
    // get elements
    const modalTitle = document.querySelector('#show-movie-title')
    const modalImage = document.querySelector('#show-movie-image')
    const modalDate = document.querySelector('#show-movie-date')
    const modalDescription = document.querySelector('#show-movie-description')
    // set request url
    const url = INDEX_URL + id
    console.log(url)
    // send request to show api
    axios.get(url).then((response) => {
      //這個data只會存活在then這個大括號裡
      const data = response.data.results
      // console.log(response.data.results)
      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src= "${POSTER_URL}${data.image}"  class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at: ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
      .catch((error) =>
        console.log(error))
  }





})()
