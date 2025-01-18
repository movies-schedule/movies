import { appUrl, fetchMovies, fetchDescription, sortMovies, displaySchedule } from './utils.js';

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
                <form action="https://kino.mail.ru${movie.url}#ticket"><button class="button">Купить билеты</button></form>
                <form action="https://kino.mail.ru${movie.url}#trailer"><button class="button">Смотреть трейлер</button></form>
                <button class="button" id="schedule-button-${movie.id}">Смотреть расписание</button>
              </div>
            </div>
        `;
        movieElement.addEventListener('click', async () => {             
            const detailsElement = movieElement.querySelector('.movie-details-text');
            const loadingAnimation = movieElement.querySelector('.loading-animation');
            movieElement.classList.toggle('active');
            if (movieElement.classList.contains('active')) {
                detailsElement.parentElement.style.display = 'block';
                movieElement.style.height = 'auto';
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
                movieElement.style.height = (200) + 'px';
            }
            if (!detailsElement.innerHTML) {                
                loadingAnimation.style.display = 'block';
                const description = await fetchDescription(movie.url);              
                detailsElement.innerHTML = description;
                loadingAnimation.style.display = 'none';          
            }
        });

        const scheduleButton = movieElement.querySelector(`#schedule-button-${movie.id}`);
        scheduleButton.addEventListener('click', (event) => {
            event.stopPropagation();
            displaySchedule(movie.id);
        });

        movieBlock.appendChild(movieElement); 
    }
}

async function init() {
    const helpButton = document.getElementById('help-button');
    const helpPanel = document.getElementById('help-panel');
    const helpInput = document.getElementById('help-input');
    const sendHelpButton = document.getElementById('send-help');
    const helpResponse = document.getElementById('help-response');

    helpButton.addEventListener('click', () => {
        if (helpPanel.classList.contains('show')) {
            helpPanel.classList.remove('show');
            helpPanel.style.opacity = '0';
            setTimeout(() => {
                helpPanel.style.display = 'none';
            }, 300);
        } else {
            helpPanel.style.display = 'block';
            setTimeout(() => {
                helpPanel.style.opacity = '1';
            }, 10);
            helpPanel.classList.add('show');
        }
    });

    sendHelpButton.addEventListener('click', async () => {
        const text = helpInput.value;
        if (text) {
            helpInput.value = '';
            const loadingAnimation = document.getElementById('loading-animation');
            loadingAnimation.style.display = 'block';
            helpResponse.style.display = 'none';
            try {
                const response = await fetch(`${appUrl}/aireq/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'ngrok-skip-browser-warning': '69420'
                    },
                    body: JSON.stringify({ data: text })
                });
                const data = await response.json();
                helpResponse.innerHTML = data.response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                helpResponse.style.display = 'block';
            } catch (error) {
                helpResponse.innerHTML = 'Произошла ошибка при отправке запроса.';
                helpResponse.style.display = 'block';
            } finally {
                loadingAnimation.style.display = 'none';
            }
        }
    });

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