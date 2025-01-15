export const appUrl = `https://682b-35-222-248-14.ngrok-free.app`;

export async function fetchMovies() { 
    const response = await fetch(`${appUrl}/get-movies`, {
        headers: {
            'ngrok-skip-browser-warning': '69420'
        }
    }); 
    const data = await response.json(); 
    return data.data.events; 
}

export async function fetchDescription(movieUrl) {
    const parsedUrl = movieUrl.split('/')[3];
    const response = await fetch(`${appUrl}/movie-description/${parsedUrl}`, {
        headers: {
            'ngrok-skip-browser-warning': '69420'
        }
    });
    const data = await response.json();
    return data.description;
}

export function sortMovies(movies, criteria) { 
    if (criteria === 'year') { 
        movies.sort((a, b) => b.year - a.year); 
    } else if (criteria === 'rating') { 
        movies.sort((a, b) => b.imdb_rating - a.imdb_rating); 
    } 
    return movies; 
}

export function displaySchedule(movieId) {
    const schedulePanel = document.createElement('div');
    schedulePanel.classList.add('schedule-panel');
    schedulePanel.innerHTML = `
        <h3>Расписание</h3>
        <button id="close-schedule">Закрыть</button>
        <div class="schedule-times">
          <div class="loading-animation" id="loading-animation-schedule"></div>
        </div>
    `;

    const scheduleTimes = schedulePanel.querySelector('.schedule-times');
    const loadingAnimation = schedulePanel.querySelector('#loading-animation-schedule');

    document.body.appendChild(schedulePanel);

    const closeButton = document.getElementById('close-schedule');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(schedulePanel);
    });
    
    loadingAnimation.style.display = 'block';
    fetch(`${appUrl}/schedule`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': '69420'
        },
        body: JSON.stringify({ data: movieId })
    })
    .then(response => response.json())
    .then(scheduleData => {
        loadingAnimation.style.display = 'none';
        for (const [cinema, times] of Object.entries(scheduleData.response)) {
            const cinemaSchedule = document.createElement('div');
            cinemaSchedule.innerHTML = `<strong>${cinema}:</strong> ${times.join(', ')}`;
            scheduleTimes.appendChild(cinemaSchedule);
        }
    })
    .catch(error => {
        console.error('Ошибка при получении расписания:', error);
        loadingAnimation.style.display = 'none';
        scheduleTimes.innerHTML = 'Произошла ошибка при загрузке расписания.';
    });
}