// Replace with your actual API key
const API_KEY = "473b80a1";

const btn = document.getElementById('search-btn');
const input = document.getElementById('search-input');
const moviesDiv = document.querySelector('.movies-wrapper');

const detailsBG = document.querySelector('.movie-details');
const detailsModal = document.querySelector('.movie-details-modal');

// Intersection observer
let observer = new IntersectionObserver(function (entries) {
  entries.forEach(entry => {
    if (entry.intersectionRatio > 0.1) {
      entry.target.classList.remove('hidden');
      console.log('item en vue')
    }
  })
},{
  threshold: [0.1]
})

// Check if search input is not empty
const checkInput = (input) => {
  input.value.length > 0 ? input.classList.remove('error') : input.classList.add('error')
  return input.value.length > 0 ? true : false;
} 

// Get the APIs informations
const findMovies = (keyword) => {
  let moviesArr = [];
  fetch(`https://www.omdbapi.com/?s=${keyword}&plot=full&apikey=${API_KEY}`)
  .then((promise) => {
    return promise.json();
  })
  .then((result) => {
    result.Search.forEach(movie => {
      moviesArr.push({"title": movie.Title, "year": movie.Year, "img": movie.Poster, "id": movie.imdbID});
    })
    displayMovies(moviesArr);
    let movies = document.querySelectorAll('.movie button');
    movies.forEach(movie => {
      movie.addEventListener('click', e => {
        let id = Array.from(movies).indexOf(e.target);
        movieDetails(moviesArr[id].id);
      })
    let movieObserver = document.querySelectorAll('.movie');
    movieObserver.forEach(movie => {
      movie.classList.add('hidden');
    })
    console.log(movieObserver);
    observer.observe(movies);
    })
  })
  .catch((error) => {
    displayError();
    console.log(error);
  })
}

// Displays an array of movies on webpage
const displayMovies = (arr) => {
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
        console.log(movie);
        let details = {"title": movie.Title, "date": movie.Released, "duration": movie.Runtime, "img": movie.Poster, "plot": movie.Plot, "genre": movie.Genre}
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
    </div>
  `;
}

// Displays error
const displayError = () => {
  moviesDiv.innerHTML = `Aucun résultat n'a été trouvé.
                        Vérifiez votre recherche et essayez à nouveau.`;
}

// Check search input whenever something is typed in
input.addEventListener('input', e => {
  checkInput(input);
})

// Calls APIs function when user clicks on search button
btn.addEventListener('click', e => {
  if (checkInput(input)) {
    findMovies(input.value);
  }
})

// Hides modal when clicking on it
detailsBG.addEventListener('click', function() {
  detailsBG.classList.remove("active");
  document.querySelector("body").classList.remove("modal-open");
})