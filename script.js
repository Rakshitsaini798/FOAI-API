/**
 * Public API Playground - script.js
 * Modular logic for fetching and displaying data from various public APIs.
 */

// --- DOM Elements ---

// Dog Finder
const dogDisplay = document.getElementById('dog-display');
const getDogBtn = document.getElementById('get-dog-btn');
const copyDogUrlBtn = document.getElementById('copy-dog-url-btn');

// Joke Generator
const jokeDisplay = document.getElementById('joke-display');
const getJokeBtn = document.getElementById('get-joke-btn');
const nextJokeBtn = document.getElementById('next-joke-btn');

// Random User Profile
const userDisplay = document.getElementById('user-display');
const getUserBtn = document.getElementById('get-user-btn');

// --- Utility Functions ---

/**
 * Shows a loading spinner in the target display area.
 * @param {HTMLElement} displayArea 
 */
function showLoading(displayArea) {
    displayArea.innerHTML = '<div class="loader"></div>';
}

/**
 * Displays an error message in the target display area.
 * @param {HTMLElement} displayArea 
 * @param {string} message 
 */
function showError(displayArea, message) {
    displayArea.innerHTML = `<p class="error-msg">Oops! ${message}</p>`;
}

// --- API Functions ---

/**
 * Fetches a random dog image and breed.
 */
async function fetchDog() {
    showLoading(dogDisplay);
    copyDogUrlBtn.disabled = true;

    try {
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        if (!response.ok) throw new Error('Failed to fetch dog image');

        const data = await response.json();
        const imageUrl = data.message;
        const breed = extractBreedFromUrl(imageUrl);

        dogDisplay.innerHTML = `
            <img src="${imageUrl}" alt="${breed}" class="dog-img">
            <p class="breed-name">${breed}</p>
        `;

        // Store URL for copy button
        copyDogUrlBtn.onclick = () => copyToClipboard(imageUrl);
        copyDogUrlBtn.disabled = false;

    } catch (error) {
        showError(dogDisplay, error.message);
    }
}

/**
 * Extracts the breed name from the Dog CEO API image URL.
 * URL format: https://images.dog.ceo/breeds/breed-name/image.jpg
 * @param {string} url 
 * @returns {string}
 */
function extractBreedFromUrl(url) {
    try {
        const parts = url.split('/');
        const breedPart = parts[4]; // The breed is usually the 5th element
        return breedPart.replace('-', ' ');
    } catch (e) {
        return 'Unknown Breed';
    }
}

/**
 * Fetches a random joke.
 */
async function fetchJoke() {
    showLoading(jokeDisplay);
    nextJokeBtn.style.display = 'none';

    try {
        const response = await fetch('https://official-joke-api.appspot.com/random_joke');
        if (!response.ok) throw new Error('Failed to fetch joke');

        const data = await response.json();

        jokeDisplay.innerHTML = `
            <div class="joke-container">
                <p class="joke-setup">"${data.setup}"</p>
                <p class="joke-punchline">${data.punchline}</p>
            </div>
        `;

        nextJokeBtn.style.display = 'block';
        getJokeBtn.innerText = 'Get Another Joke';

    } catch (error) {
        showError(jokeDisplay, error.message);
    }
}

/**
 * Fetches a random user profile.
 */
async function fetchUser() {
    showLoading(userDisplay);

    try {
        const response = await fetch('https://randomuser.me/api/');
        if (!response.ok) throw new Error('Failed to fetch user');

        const data = await response.json();
        const user = data.results[0];

        userDisplay.innerHTML = `
            <div class="user-profile">
                <img src="${user.picture.large}" alt="${user.name.first}" class="user-avatar">
                <p class="user-name">${user.name.first} ${user.name.last}</p>
                <p class="user-info">📧 ${user.email}</p>
                <p class="user-info">🌍 ${user.location.country}</p>
                <p class="user-info">🎂 ${user.dob.age} years old</p>
            </div>
        `;

        getUserBtn.innerText = 'Get Another User';

    } catch (error) {
        showError(userDisplay, error.message);
    }
}

/**
 * Helper to copy text to clipboard.
 * @param {string} text 
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        const originalText = copyDogUrlBtn.innerText;
        copyDogUrlBtn.innerText = 'Copied!';
        copyDogUrlBtn.style.backgroundColor = 'var(--success-color)';

        setTimeout(() => {
            copyDogUrlBtn.innerText = originalText;
            copyDogUrlBtn.style.backgroundColor = '';
        }, 2000);
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}

// --- Event Listeners ---

getDogBtn.addEventListener('click', fetchDog);
getJokeBtn.addEventListener('click', fetchJoke);
nextJokeBtn.addEventListener('click', fetchJoke);
getUserBtn.addEventListener('click', fetchUser);

// Initialize with some data on load (optional, but makes it look better)
// window.addEventListener('DOMContentLoaded', () => {
//     fetchDog();
//     fetchJoke();
//     fetchUser();
// });
