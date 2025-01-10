import { fetchMovies, fetchDescription, sortMovies } from './utils.js';

async function displayMovies(movies) { 
    const movieBlock = document.getElementById('movie-block'); 
    movieBlock.innerHTML = ''; 

    for (const movie of movies) { 
        const movieElement = document.createElement('div'); 
        movieElement.classList.add('movie'); 

        const genres = movie.genre.map(g => g.name).join(', '); 
                        
        movieElement.innerHTML = `
            <div class="movie-content">
              <div class="movie-info"> 
                  <div class="movie-title">${movie.name}</div> 
                  <div class="movie-year">${movie.year}</div> 
                  <div class="movie-genres">${genres}</div> 
                  <div class="movie-rating"> 
                      <i class="fas fa-star"></i> ${movie.imdb_rating} 
                  </div> 
              </div> 
              <img src="${movie.image_url}" alt="Poster of the movie ${movie.name} with a scene from the movie">
            </div>
            <div class="movie-details">
              <div class="loading-animation"></div>
              <div class="movie-details-text"></div>
              <div class="movie-details-buttons">
                <a href="https://kino.mail.ru${movie.url}#ticket" class="movie-details-button">Купить Билеты</a>
                <a href="https://kino.mail.ru${movie.url}#trailer" class="movie-details-button">Смотреть Трейлер</a>
              </div>
            </div>
        `; 
        movieElement.addEventListener('click', async () => { 
            const detailsElement = movieElement.querySelector('.movie-details-text');
            const loadingAnimation = movieElement.querySelector('.loading-animation');
            
            movieElement.classList.toggle('active');
            if (movieElement.classList.contains('active')) {
                detailsElement.parentElement.style.display = 'block';
                setTimeout(() => {
                    detailsElement.parentElement.style.opacity = '1';
                    detailsElement.parentElement.style.transform = 'translateY(0)';
                }, 10);
            } else {
                detailsElement.parentElement.style.opacity = '0';
                detailsElement.parentElement.style.transform = 'translateY(-5px)';
                setTimeout(() => {
                    detailsElement.parentElement.style.display = 'none';
                }, 250);
            }
            if (!detailsElement.innerHTML) {
                loadingAnimation.style.display = 'block';
                const description = await fetchDescription(movie.url);
                detailsElement.innerHTML = description;
                loadingAnimation.style.display = 'none';
            }
        });
        movieBlock.appendChild(movieElement); 
    }
}

async function init() { 
    const movies = await fetchMovies(); 
    const searchInput = document.getElementById('search-input');
    const sortYearButton = document.getElementById('sort-year'); 
    const sortRatingButton = document.getElementById('sort-rating');

    sortMovies(movies, 'year'); 
    await displayMovies(movies);
    
    searchInput.addEventListener('input', async () => { 
        const searchTerm = searchInput.value.toLowerCase(); 
        const filteredMovies = movies.filter(movie => movie.name.toLowerCase().includes(searchTerm)); 
        await displayMovies(filteredMovies); 
    });
    
    sortYearButton.addEventListener('click', async () => { 
        sortYearButton.classList.add('active'); 
        sortRatingButton.classList.remove('active'); 
        await sortMovies(movies, 'year'); 
        await displayMovies(movies); 
    }); 
    
    sortRatingButton.addEventListener('click', async () => { 
        sortRatingButton.classList.add('active'); 
        sortYearButton.classList.remove('active'); 
        await sortMovies(movies, 'rating'); 
        await displayMovies(movies); 
    }); 
} 

init();
