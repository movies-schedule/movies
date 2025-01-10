const appUrl = 'https://c8f3-34-168-224-73.ngrok-free.app';

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
