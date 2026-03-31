const APIURL =
    "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI =
    "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";

const movieBox = document.querySelector("#movie-box");
const searchInput = document.querySelector("#search");

const getMovies = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        showMovies(data.results);
    } catch (error) {
        console.error("Failed to fetch movies:", error);
        movieBox.innerHTML = `<h2 class="empty-state">Failed to load movies. Please check your connection.</h2>`;
    }
};

// Initial Call
getMovies(APIURL);

// Function to classify rating colors dynamically
const getClassByRate = (vote) => {
    if (!vote || vote === 0) return "red"; // Unrated or 0
    if (vote >= 7.5) return "green";
    if (vote >= 5) return "orange";
    return "red";
};

const showMovies = (movies) => {
    // Clear movie box
    movieBox.innerHTML = "";

    // Empty state fallback
    if (movies.length === 0) {
        movieBox.innerHTML = `<h2 class="empty-state">No movies found based on your search. Try another term.</h2>`;
        return;
    }

    movies.forEach((movie) => {
        // Handle gracefully if image is null
        const imagePath = movie.poster_path === null 
            ? "https://via.placeholder.com/1280x1920/0f172a/94a3b8?text=Image+Unavailable" 
            : IMGPATH + movie.poster_path;

        const box = document.createElement("div");
        box.classList.add("box");

        // Format vote average nicely (e.g. 7.5 instead of 7.521)
        const formattedVote = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

        box.innerHTML = `
            <img src="${imagePath}" alt="${movie.original_title || 'Movie Poster'}" loading="lazy" />
            <div class="overlay">
                <div class="title-container"> 
                    <h2>${movie.original_title}</h2>
                    <span class="rating ${getClassByRate(movie.vote_average)}">${formattedVote}</span>
                </div>
                <h3>Overview</h3>
                <p> 
                    ${movie.overview || 'No synopsis available for this title.'}
                </p>
             </div>
        `;
        movieBox.appendChild(box);
    });
};

// Event listener for Search Bar - matching exact original logic, added slight debounce
let typingTimer;
searchInput.addEventListener("keyup", function (event) {
    clearTimeout(typingTimer);
    
    // Original Logic behavior wrapper
    typingTimer = setTimeout(() => {
        const value = event.target.value.trim();
        if (value !== "") {
            getMovies(SEARCHAPI + encodeURIComponent(value));
        } else {
            // Restore default view if empty
            getMovies(APIURL);
        }
    }, 400); // 400ms delay to stop API spamming while typing
});

// Logo click to return home
document.querySelector(".logo").addEventListener("click", () => {
    searchInput.value = "";
    getMovies(APIURL);
});
