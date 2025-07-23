// script.js - Main JavaScript for Exclusive Piano Records
document.addEventListener('DOMContentLoaded', function () {
    // ===== Theme Toggle Functionality =====
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const currentTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', currentTheme);

        // Update button text based on current theme
        updateThemeButton(currentTheme);

        themeToggle.addEventListener('click', function () {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeButton(newTheme);
        });
    }

    function updateThemeButton(theme) {
        if (!themeToggle) return;
        if (theme === 'light') {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
        }
    }

    // ===== Playlist Functionality =====
    // Initialize playlist if it doesn't exist
    if (!localStorage.getItem('playlist')) {
        localStorage.setItem('playlist', JSON.stringify([]));
    }

    // Add to playlist functionality
    document.addEventListener('click', function (e) {
        if (e.target.closest('.add-to-playlist')) {
            const button = e.target.closest('.add-to-playlist');
            const trackData = button.getAttribute('data-track');

            try {
                const track = JSON.parse(trackData);
                addToPlaylist(track);

                // Visual feedback
                button.innerHTML = '<i class="fas fa-check"></i> Added';
                button.disabled = true;

                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-plus"></i> Add to Playlist';
                    button.disabled = false;
                }, 2000);

                showToast('Track added to playlist!', 'success');
            } catch (error) {
                console.error('Error parsing track data:', error);
                showToast('Failed to add track', 'error');
            }
        }
    });

    // ===== Toast Notifications =====
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // ===== Form Validation =====
    const contactForm = document.getElementById('feedback-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (validateContactForm()) {
                // Simulate form submission
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;

                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalText;
                    showToast('Message sent successfully!', 'success');
                    this.reset();
                }, 1500);
            }
        });
    }

    function validateContactForm() {
        let isValid = true;
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');

        // Validate name
        if (!name.value.trim()) {
            showError(name, 'Please enter your name');
            isValid = false;
        } else {
            clearError(name);
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            showError(email, 'Please enter your email');
            isValid = false;
        } else if (!emailRegex.test(email.value)) {
            showError(email, 'Please enter a valid email');
            isValid = false;
        } else {
            clearError(email);
        }

        // Validate subject
        if (!subject.value) {
            showError(subject, 'Please select a subject');
            isValid = false;
        } else {
            clearError(subject);
        }

        // Validate message
        if (!message.value.trim()) {
            showError(message, 'Please enter your message');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            showError(message, 'Message must be at least 10 characters');
            isValid = false;
        } else {
            clearError(message);
        }

        return isValid;
    }

    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;

        let errorElement = formGroup.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }

        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function clearError(input) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return;

        input.classList.remove('error');
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    // ===== Newsletter Form =====
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();

            if (validateEmail(email)) {
                // Simulate subscription
                showToast('Thanks for subscribing!', 'success');
                this.reset();
            } else {
                showToast('Please enter a valid email address', 'error');
                emailInput.focus();
            }
        });
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // ===== Playlist Management =====
    if (document.getElementById('playlist-items')) {
        loadPlaylist();
        setupPlaylistControls();
    }

    function addToPlaylist(track) {
        const playlist = JSON.parse(localStorage.getItem('playlist'));

        // Check if track already exists
        if (!playlist.some(item => item.name === track.name && item.artist === track.artist)) {
            playlist.push(track);
            localStorage.setItem('playlist', JSON.stringify(playlist));

            // Refresh playlist display if on playlist page
            if (document.getElementById('playlist-items')) {
                loadPlaylist();
            }
        } else {
            showToast('Track already in playlist', 'warning');
        }
    }

    function loadPlaylist() {
        const playlist = JSON.parse(localStorage.getItem('playlist'));
        const playlistItems = document.getElementById('playlist-items');

        if (!playlistItems) return;

        playlistItems.innerHTML = '';

        if (playlist.length === 0) {
            playlistItems.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-music"></i>
                    <p>Your playlist is empty</p>
                    <a href="new-drops.html" class="btn">
                        <i class="fas fa-plus"></i> Add Tracks
                    </a>
                </div>
            `;

            // Disable buttons when empty
            ['play-all', 'export-playlist', 'share-playlist'].forEach(id => {
                const btn = document.getElementById(id);
                if (btn) btn.disabled = true;
            });

            return;
        }

        let totalDuration = 0;

        playlist.forEach((track, index) => {
            // Calculate total duration
            const [mins, secs] = track.duration.split(':').map(Number);
            totalDuration += (mins * 60) + secs;

            const playlistItem = document.createElement('div');
            playlistItem.className = 'playlist-item';
            playlistItem.innerHTML = `
                <div class="track-info">
                    <span class="track-number">${index + 1}.</span>
                    <img src="${track.cover}" 
                         alt="${track.artist}" 
                         width="50" 
                         height="50"
                         loading="lazy">
                    <div class="track-details">
                        <h4 class="track-title">${track.name}</h4>
                        <p class="track-artist">${track.artist}</p>
                        <span class="track-duration">${track.duration}</span>
                    </div>
                </div>
                <div class="track-actions">
                    <button class="btn btn-small play-track" data-audio="${track.audio || '#'}">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="btn btn-small remove-track" data-track='${JSON.stringify(track)}'>
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;

            playlistItems.appendChild(playlistItem);
        });

        // Format total duration
        const durationMins = Math.floor(totalDuration / 60);
        const durationSecs = totalDuration % 60;
        const formattedDuration = `${durationMins}:${durationSecs.toString().padStart(2, '0')}`;

        // Update stats
        const trackCount = document.getElementById('track-count');
        const durationDisplay = document.getElementById('duration');

        if (trackCount) trackCount.textContent = `${playlist.length} ${playlist.length === 1 ? 'track' : 'tracks'}`;
        if (durationDisplay) durationDisplay.textContent = formattedDuration;

        // Enable buttons
        ['play-all', 'export-playlist', 'share-playlist'].forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.disabled = false;
        });

        // Add event listeners to new elements
        setupPlaylistItemEvents();
    }

    function setupPlaylistControls() {
        // Save playlist name
        document.getElementById('save-playlist')?.addEventListener('click', function () {
            const playlistName = document.getElementById('playlist-name').value.trim();
            if (playlistName) {
                localStorage.setItem('playlistName', playlistName);
                showToast('Playlist name saved!', 'success');
            } else {
                showToast('Please enter a playlist name', 'error');
            }
        });

        // Clear playlist
        document.getElementById('clear-playlist')?.addEventListener('click', function () {
            if (confirm('Are you sure you want to clear your entire playlist?')) {
                localStorage.setItem('playlist', JSON.stringify([]));
                loadPlaylist();
                showToast('Playlist cleared', 'success');
            }
        });

        // Play all tracks
        document.getElementById('play-all')?.addEventListener('click', function () {
            const playlist = JSON.parse(localStorage.getItem('playlist'));
            if (playlist.length === 0) {
                showToast('Playlist is empty!', 'error');
            } else {
                showToast(`Playing ${playlist.length} tracks...`, 'success');
                // In a real app: Implement audio queue here
            }
        });

        // Export playlist
        document.getElementById('export-playlist')?.addEventListener('click', function () {
            const playlist = JSON.parse(localStorage.getItem('playlist'));
            if (playlist.length === 0) {
                showToast('Nothing to export!', 'error');
                return;
            }

            const playlistName = document.getElementById('playlist-name').value.trim() || 'MyPlaylist';
            const data = {
                name: playlistName,
                tracks: playlist,
                createdAt: new Date().toISOString(),
                totalTracks: playlist.length,
                totalDuration: document.getElementById('duration').textContent
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${playlistName.replace(/[^a-z0-9]/gi, '_')}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            showToast('Playlist exported!', 'success');
        });

        // Share playlist
        document.getElementById('share-playlist')?.addEventListener('click', function () {
            const playlist = JSON.parse(localStorage.getItem('playlist'));
            if (playlist.length === 0) {
                showToast('Nothing to share!', 'error');
                return;
            }

            // In a real app, this would use the Web Share API
            showToast('Share feature would open social media dialog', 'info');
        });

        // Load saved playlist name
        const savedPlaylistName = localStorage.getItem('playlistName');
        if (savedPlaylistName) {
            document.getElementById('playlist-name').value = savedPlaylistName;
        }
    }

    function setupPlaylistItemEvents() {
        // Play individual tracks
        document.querySelectorAll('.play-track').forEach(btn => {
            btn.addEventListener('click', function () {
                const audioSrc = this.getAttribute('data-audio');
                // In a real app: Play the audio file
                showToast('Now playing track...', 'success');
            });
        });

        // Remove tracks
        document.querySelectorAll('.remove-track').forEach(btn => {
            btn.addEventListener('click', function () {
                const track = JSON.parse(this.getAttribute('data-track'));
                removeFromPlaylist(track);
            });
        });
    }

    function removeFromPlaylist(track) {
        let playlist = JSON.parse(localStorage.getItem('playlist'));
        playlist = playlist.filter(item => !(item.name === track.name && item.artist === track.artist));
        localStorage.setItem('playlist', JSON.stringify(playlist));
        loadPlaylist();
        showToast('Track removed', 'success');
    }

    // ===== Producer Favorites =====
    document.addEventListener('click', function (e) {
        if (e.target.closest('.favorite-btn')) {
            const btn = e.target.closest('.favorite-btn');
            const producerId = btn.getAttribute('data-producer-id');

            let favorites = JSON.parse(localStorage.getItem('producerFavorites')) || [];

            if (btn.classList.contains('fas')) {
                // Remove from favorites
                favorites = favorites.filter(id => id !== producerId);
                btn.classList.remove('fas');
                btn.classList.add('far');
                btn.setAttribute('aria-label', 'Add to favorites');
                showToast('Removed from favorites', 'success');
            } else {
                // Add to favorites
                favorites.push(producerId);
                btn.classList.remove('far');
                btn.classList.add('fas');
                btn.setAttribute('aria-label', 'Remove from favorites');
                showToast('Added to favorites!', 'success');
            }

            localStorage.setItem('producerFavorites', JSON.stringify(favorites));
        }
    });

    // ===== Track Filtering (New Drops Page) =====
    const genreFilter = document.getElementById('genre-filter');
    const sortBy = document.getElementById('sort-by');

    if (genreFilter && sortBy) {
        genreFilter.addEventListener('change', filterTracks);
        sortBy.addEventListener('change', filterTracks);
    }

    function filterTracks() {
        const genre = document.getElementById('genre-filter').value;
        const sort = document.getElementById('sort-by').value;
        const trackCards = document.querySelectorAll('.track-card');

        // Filter by genre
        trackCards.forEach(card => {
            if (genre === 'all' || card.classList.contains(genre)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        // Sort tracks
        const tracksGrid = document.querySelector('.tracks-grid');
        const tracks = Array.from(trackCards)
            .filter(card => card.style.display !== 'none');

        if (sort === 'newest') {
            tracks.sort((a, b) => {
                const aDate = a.querySelector('.date').textContent;
                const bDate = b.querySelector('.date').textContent;
                return new Date(bDate) - new Date(aDate);
            });
        } else if (sort === 'popular') {
            tracks.sort((a, b) => {
                const aPlays = parseInt(a.querySelector('.plays')?.textContent.replace(/\D/g, '') || '0');
                const bPlays = parseInt(b.querySelector('.plays')?.textContent.replace(/\D/g, '') || '0');
                return bPlays - aPlays;
            });
        } else if (sort === 'az') {
            tracks.sort((a, b) => {
                const aName = a.querySelector('h3').textContent;
                const bName = b.querySelector('h3').textContent;
                return aName.localeCompare(bName);
            });
        }

        // Re-append sorted tracks
        tracks.forEach(track => {
            tracksGrid.appendChild(track);
        });
    }

    // ===== Producer Filtering (Producers Page) =====
    const cityFilter = document.getElementById('city-filter');
    const sortProducers = document.getElementById('sort-producers');

    if (cityFilter && sortProducers) {
        cityFilter.addEventListener('change', filterProducers);
        sortProducers.addEventListener('change', filterProducers);
    }

    function filterProducers() {
        const city = document.getElementById('city-filter').value;
        const sort = document.getElementById('sort-producers').value;
        const producerCards = document.querySelectorAll('.producer-card');

        // Filter by city
        producerCards.forEach(card => {
            if (city === 'all' || card.classList.contains(city.replace(' ', '-'))) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });

        // Sort producers
        const producersGrid = document.querySelector('.producers-grid');
        const producers = Array.from(producerCards)
            .filter(card => card.style.display !== 'none');

        if (sort === 'popular') {
            producers.sort((a, b) => {
                const aPlays = parseInt(a.querySelector('.number:nth-child(2)')?.textContent.replace(/\D/g, '') || '0');
                const bPlays = parseInt(b.querySelector('.number:nth-child(2)')?.textContent.replace(/\D/g, '') || '0');
                return bPlays - aPlays;
            });
        } else if (sort === 'tracks') {
            producers.sort((a, b) => {
                const aTracks = parseInt(a.querySelector('.number:first-child')?.textContent || '0');
                const bTracks = parseInt(b.querySelector('.number:first-child')?.textContent || '0');
                return bTracks - aTracks;
            });
        } else if (sort === 'az') {
            producers.sort((a, b) => {
                const aName = a.querySelector('h3').textContent;
                const bName = b.querySelector('h3').textContent;
                return aName.localeCompare(bName);
            });
        }

        // Re-append sorted producers
        producers.forEach(producer => {
            producersGrid.appendChild(producer);
        });
    }
});

// ===== Utility Functions =====
function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function parseDuration(durationString) {
    const [mins, secs] = durationString.split(':').map(Number);
    return (mins * 60) + secs;
}