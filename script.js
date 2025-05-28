// script.js - Main JavaScript for Exclusive Piano Records

document.addEventListener('DOMContentLoaded', function () {
    // Initialize playlist if it doesn't exist in localStorage
    if (!localStorage.getItem('playlist')) {
        localStorage.setItem('playlist', JSON.stringify([]));
    }

    // Add to playlist functionality
    const addToPlaylistButtons = document.querySelectorAll('.add-to-playlist');
    if (addToPlaylistButtons) {
        addToPlaylistButtons.forEach(button => {
            button.addEventListener('click', function () {
                const trackName = this.getAttribute('data-track');
                addToPlaylist(trackName);
                this.textContent = 'Added!';
                this.disabled = true;
                setTimeout(() => {
                    this.textContent = 'Add to Playlist';
                    this.disabled = false;
                }, 2000);
            });
        });
    }

    // Load playlist items if on playlist page
    if (document.getElementById('playlist-items')) {
        loadPlaylist();
        setupPlaylistControls();
    }

    // Form validation for contact page
    const contactForm = document.getElementById('feedback-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (validateContactForm()) {
                // In a real app, you would send the form data to a server here
                alert('Thank you for your message! We will get back to you soon.');
                this.reset();
            }
        });
    }

    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (validateEmail(email)) {
                // In a real app, you would send the email to a server here
                alert('Thanks for subscribing to our newsletter!');
                this.reset();
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }
});

// Function to add a track to the playlist
function addToPlaylist(trackName) {
    const playlist = JSON.parse(localStorage.getItem('playlist'));
    if (!playlist.includes(trackName)) {
        playlist.push(trackName);
        localStorage.setItem('playlist', JSON.stringify(playlist));

        // If on playlist page, refresh the display
        if (document.getElementById('playlist-items')) {
            loadPlaylist();
        }
    }
}

// Function to load playlist items
function loadPlaylist() {
    const playlist = JSON.parse(localStorage.getItem('playlist'));
    const playlistItemsContainer = document.getElementById('playlist-items');

    playlistItemsContainer.innerHTML = '';

    if (playlist.length === 0) {
        playlistItemsContainer.innerHTML = '<p class="empty-message">Your playlist is empty. Add tracks from the New Drops page.</p>';
        document.getElementById('export-playlist').disabled = true;
        document.getElementById('share-playlist').disabled = true;
        return;
    }

    playlist.forEach((track, index) => {
        const playlistItem = document.createElement('div');
        playlistItem.className = 'playlist-item';
        playlistItem.innerHTML = `
            <div class="playlist-item-info">
                <span class="track-number">${index + 1}.</span>
                <span class="track-name">${track}</span>
            </div>
            <button class="btn btn-small remove-track" data-track="${track}">Remove</button>
        `;
        playlistItemsContainer.appendChild(playlistItem);
    });

    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-track').forEach(button => {
        button.addEventListener('click', function () {
            removeFromPlaylist(this.getAttribute('data-track'));
        });
    });

    document.getElementById('export-playlist').disabled = false;
    document.getElementById('share-playlist').disabled = false;
}

// Function to remove a track from playlist
function removeFromPlaylist(trackName) {
    let playlist = JSON.parse(localStorage.getItem('playlist'));
    playlist = playlist.filter(track => track !== trackName);
    localStorage.setItem('playlist', JSON.stringify(playlist));
    loadPlaylist();
}

// Function to setup playlist controls
function setupPlaylistControls() {
    // Save playlist name
    document.getElementById('save-playlist').addEventListener('click', function () {
        const playlistName = document.getElementById('playlist-name').value.trim();
        if (playlistName) {
            localStorage.setItem('playlistName', playlistName);
            alert('Playlist name saved!');
        } else {
            alert('Please enter a playlist name.');
        }
    });

    // Clear playlist
    document.getElementById('clear-playlist').addEventListener('click', function () {
        if (confirm('Are you sure you want to clear your entire playlist?')) {
            localStorage.setItem('playlist', JSON.stringify([]));
            loadPlaylist();
        }
    });

    // Export playlist
    document.getElementById('export-playlist').addEventListener('click', function () {
        const playlist = JSON.parse(localStorage.getItem('playlist'));
        const playlistName = localStorage.getItem('playlistName') || 'My Amapiano Playlist';

        let exportText = `${playlistName}\n\n`;
        playlist.forEach((track, index) => {
            exportText += `${index + 1}. ${track}\n`;
        });

        // Create a blob and download it
        const blob = new Blob([exportText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${playlistName.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Share playlist
    document.getElementById('share-playlist').addEventListener('click', function () {
        alert('In a real app, this would share your playlist on social media or generate a shareable link.');
    });

    // Load saved playlist name if exists
    const savedPlaylistName = localStorage.getItem('playlistName');
    if (savedPlaylistName) {
        document.getElementById('playlist-name').value = savedPlaylistName;
    }
}

// Function to validate contact form
function validateContactForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value.trim();

    if (!name) {
        alert('Please enter your name.');
        return false;
    }

    if (!validateEmail(email)) {
        alert('Please enter a valid email address.');
        return false;
    }

    if (!subject) {
        alert('Please select a subject.');
        return false;
    }

    if (!message) {
        alert('Please enter your message.');
        return false;
    }

    return true;
}

// Function to validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Filter functionality for tracks page
const genreFilter = document.getElementById('genre-filter');
if (genreFilter) {
    genreFilter.addEventListener('change', function () {
        filterTracks();
    });
}

const sortBy = document.getElementById('sort-by');
if (sortBy) {
    sortBy.addEventListener('change', function () {
        filterTracks();
    });
}

function filterTracks() {
    const genre = document.getElementById('genre-filter').value;
    const sort = document.getElementById('sort-by').value;
    const trackCards = document.querySelectorAll('.track-card');

    trackCards.forEach(card => {
        if (genre === 'all' || card.getAttribute('data-genre') === genre) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    // Simple sorting - in a real app you would sort based on actual data
    const tracksGrid = document.querySelector('.tracks-grid');
    const tracks = Array.from(trackCards).filter(card => card.style.display !== 'none');

    if (sort === 'az') {
        tracks.sort((a, b) => {
            const aName = a.querySelector('h3').textContent;
            const bName = b.querySelector('h3').textContent;
            return aName.localeCompare(bName);
        });
    } else if (sort === 'popular') {
        // This would use actual popularity data in a real app
        tracks.sort(() => Math.random() - 0.5);
    }

    // Re-append sorted tracks
    tracks.forEach(track => {
        tracksGrid.appendChild(track);
    });
}