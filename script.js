// Replace with your actual API key
const API_KEY = "473b80a1";

const btn = document.getElementById('search-btn');
const input = document.getElementById('search-input');
const moviesDiv = document.querySelector('.movies-wrapper');

const detailsBG = document.querySelector('.movie-details');
const detailsModal = document.querySelector('.movie-details-modal');

let searchValue;
let moviesArr = [];
let pageNb = 2;

// Intersection observer for movies
let observer = new IntersectionObserver(function (entries) {
  entries.forEach(entry => {
    if (entry.intersectionRatio > 0.2) {
      entry.target.classList.remove('hidden');
    }
  })
},{
  threshold: [0.2]
})

// Intersection observer for body
// let bodyObserver = new IntersectionObserver(function (entries) {
//   entries.forEach(entry => {
//     if (entry.intersectionRatio > 0.8) {
//       console.log('fin du body');
//     }
//   })
// }, {
//   threshold: [0.8]
// })
// bodyObserver.observe(document.querySelector('body'));

// Check if search input is not empty
const checkInput = (input) => {
  input.value.length > 0 ? input.classList.remove('error') : input.classList.add('error')
  return input.value.length > 0 ? true : false;
} 

// Get the APIs informations
const findMovies = (keyword, page=1) => {
  fetch(`https://www.omdbapi.com/?s=${keyword}&plot=full&apikey=${API_KEY}&page=${page}`)
  .then((promise) => {
    return promise.json();
  })
  .then((result) => {
    result.Search.forEach(movie => {
      moviesArr.push({"title": movie.Title, "year": movie.Year, "img": movie.Poster, "id": movie.imdbID});
    })
    displayMovies(moviesArr, page);
    let movies = document.querySelectorAll('.movie button');
    movies.forEach(movie => {
      movie.addEventListener('click', e => {
        let id = Array.from(movies).indexOf(e.target);
        movieDetails(moviesArr[id].id);
      })
    })
    let movieObserver = document.querySelectorAll('.movie');
    movieObserver.forEach(movie => {
      movie.classList.add('hidden');
      observer.observe(movie);
    })
  })
  .catch((error) => {
    displayError();
  })
}

// Displays an array of movies on webpage
const displayMovies = (arr, firstTime) => {
  moviesDiv.innerHTML = "";

  arr.forEach(movie => {
    moviesDiv.innerHTML += 
    `<div class="movie">
      <div class="movie-left">
        <img src="${movie.img}" alt="poster">
      </div>
      <div class="movie-right">
        <div class="movie-right-text">
          <h2>${movie.title}</h2>
          <p>${movie.year}</p>
        </div>
        <button type="button">+ d'infos</button>
      </div>
    </div>`;
  })
}

// Shows details for a selected movie
const movieDetails = (id) => {
      fetch(`https://www.omdbapi.com/?i=${id}&apikey=${API_KEY}&plot=full`)
      .then((response) => {
        return response.json();
      })
      .then((movie) => {
        let details = {"title": movie.Title, "date": movie.Released, "duration": movie.Runtime, "img": movie.Poster, "plot": movie.Plot, "genre": movie.Genre, "rating": movie.imdbRating}
        displayDetails(details);
      })
}

// Displays details from selected movie on webpage
const displayDetails = (movie) => {
  detailsBG.classList.add("active");
  document.querySelector("body").classList.add("modal-open");
  detailsModal.innerHTML = `
    <div class="movie-left">
      <img src="${movie.img}" alt="poster">
    </div>
    <div class="movie-right">
      <div class="movie-right-title">
        <h2>${movie.title}</h2>
        <p>Date de sortie :${movie.date}</p>
        <p>Durée : ${movie.duration}</p>
        <p>Genre : ${movie.genre}</p>
      </div>
      <p class="movie-right-plot">
        ${movie.plot}
      </p>
      <p class="movie-right-rating ${parseInt(movie.rating, 10) < 4 ? "red-bg" : parseInt(movie.rating, 10) < 7 ? "orange-bg" : "green-bg"}">
        ${movie.rating}
      </p>
    </div>
  `;
}

// Displays error
const displayError = () => {
  if (moviesArr.length == 0) {
    moviesDiv.innerHTML = `Aucun résultat n'a été trouvé.
                          Vérifiez votre recherche et essayez à nouveau.`;
  }
}

// Check search input whenever something is typed in
input.addEventListener('input', e => {
  checkInput(input);
})

// Calls APIs function when user clicks on search button
btn.addEventListener('click', e => {
  if (checkInput(input)) {
    searchValue = input.value;
    findMovies(input.value);
  }
})

// Calls APIs function when user presses Enter
input.addEventListener('keypress', e => {
  if (e.key === 'Enter' && checkInput(input)) {
    e.preventDefault();
    searchValue = input.value;
    findMovies(input.value);
  }
})

// Hides modal when clicking on it
detailsBG.addEventListener('click', function() {
  detailsBG.classList.remove("active");
  document.querySelector("body").classList.remove("modal-open");
})

// Loads more movies when reaching bottom of page
window.onscroll = function(ev) {
  if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
      findMovies(searchValue, pageNb);
      pageNb++;
  }
};