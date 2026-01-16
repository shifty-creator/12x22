/* ========================================
   CONFIGURATION
   Change these values to customize
   ======================================== */

// Discord User IDs
const DISCORD_USER_ID = '985082401187328010'; // Center profile
const LEFT_PROFILE_ID = '391445098715545610'; // LEFT profile
const RIGHT_PROFILE_ID = '731464189708730388'; // RIGHT profile

// EXACTLY 3 Songs - CHANGE THESE to your music files
const MUSIC_PLAYLIST = [
    {
        title: 'Song 1',
        file: 'assets/ask.mp3'
    },
    {
        title: 'Song 2',
        file: 'assets/maybach.mp3'
    },
    {
        title: 'Song 3',
        file: 'assets/hayaletsevgilim.mp3'
    }
];

// Background media - To use GIF instead of video, update HTML file
// Video: <video> tag in index.html
// GIF: <img> tag in index.html (currently commented)

// Profile Links - CHANGE THESE to your social media links
const PROFILE_LINKS = {
    discord: 'https://discord.gg/337',
    spotify: 'htthttps://open.spotify.com/user/31z3mj6opabzqcuyjod7vyazqwzi?si=4368b620e6854375ps://open.spotify.com/user/31tdhycltgfet2nrky3nkbndbo6y?si=64319e90914242dd',
    instagram: 'https://www.instagram.com/ucucyedi/'
};

// ========================================
// MUSIC PLAYER (3 Songs)
// ========================================

let currentSongIndex = 0;
let isPlaying = false;
let audioElement = null;

let spotifyTrackUrl = null;
let spotifyProgressInterval = null;
let spotifyTimestamps = null;

// Side profiles Spotify data
let leftSpotifyTimestamps = null;
let rightSpotifyTimestamps = null;
let leftProgressInterval = null;
let rightProgressInterval = null;

/**
 * Initializes music player with 3 songs
 */
function initMusicPlayer() {
    audioElement = document.getElementById('background-music');
    if (!audioElement) return;
    
    audioElement.volume = 0.3;
    
    // Load first song
    loadSong(currentSongIndex);
    
    // Event listeners
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlayPause);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', playPrevious);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', playNext);
    }
    
    // Update UI when audio plays/pauses/ends
    audioElement.addEventListener('play', () => {
        isPlaying = true;
        updatePlayPauseUI(true);
    });
    
    audioElement.addEventListener('pause', () => {
        isPlaying = false;
        updatePlayPauseUI(false);
    });
    
    audioElement.addEventListener('ended', () => {
        // Auto-play next song when current ends
        playNext();
    });
    
    audioElement.addEventListener('error', (e) => {
        console.error('Audio error:', e);
    });
}

function initSpotifyControls() {
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    const openSpotify = () => {
        const url = spotifyTrackUrl || PROFILE_LINKS.spotify;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', openSpotify);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', openSpotify);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', openSpotify);
    }
}

function clearSpotifyProgress() {
    if (spotifyProgressInterval) {
        clearInterval(spotifyProgressInterval);
        spotifyProgressInterval = null;
    }
    spotifyTimestamps = null;
    const progressBar = document.getElementById('track-progress-bar');
    if (progressBar) {
        progressBar.style.width = '0%';
    }
}

function startSpotifyProgress(timestamps) {
    clearSpotifyProgress();

    if (!timestamps || !timestamps.start || !timestamps.end) {
        return;
    }

    spotifyTimestamps = {
        start: Number(timestamps.start),
        end: Number(timestamps.end)
    };

    const progressBar = document.getElementById('track-progress-bar');
    if (!progressBar) return;

    const update = () => {
        if (!spotifyTimestamps) return;
        const duration = spotifyTimestamps.end - spotifyTimestamps.start;
        if (!Number.isFinite(duration) || duration <= 0) {
            progressBar.style.width = '0%';
            return;
        }

        const now = Date.now();
        const elapsed = now - spotifyTimestamps.start;
        const ratio = Math.min(1, Math.max(0, elapsed / duration));
        progressBar.style.width = `${(ratio * 100).toFixed(2)}%`;
    };

    update();
    spotifyProgressInterval = setInterval(update, 500);
}

/**
 * Loads a song by index
 */
function loadSong(index) {
    if (index < 0 || index >= MUSIC_PLAYLIST.length) return;
    
    currentSongIndex = index;
    const song = MUSIC_PLAYLIST[index];
    
    if (!audioElement || !song) return;
    
    audioElement.src = song.file;
    audioElement.load();
    
    // Update song title
    const songTitle = document.getElementById('song-title');
    if (songTitle) {
        songTitle.textContent = song.title;
    }
    
    // If was playing, continue playing
    if (isPlaying) {
        audioElement.play().catch(error => {
            console.error('Failed to play audio:', error);
        });
    }
}

/**
 * Toggles play/pause
 */
function togglePlayPause() {
    if (!audioElement) return;
    
    if (isPlaying) {
        audioElement.pause();
    } else {
        audioElement.play().catch(error => {
            console.error('Failed to play audio:', error);
        });
    }
}

/**
 * Plays previous song
 */
function playPrevious() {
    let newIndex = currentSongIndex - 1;
    if (newIndex < 0) {
        newIndex = MUSIC_PLAYLIST.length - 1; // Loop to last song
    }
    loadSong(newIndex);
    if (isPlaying) {
        audioElement.play().catch(error => {
            console.error('Failed to play audio:', error);
        });
    }
}

/**
 * Plays next song
 */
function playNext() {
    let newIndex = currentSongIndex + 1;
    if (newIndex >= MUSIC_PLAYLIST.length) {
        newIndex = 0; // Loop to first song
    }
    loadSong(newIndex);
    if (isPlaying) {
        audioElement.play().catch(error => {
            console.error('Failed to play audio:', error);
        });
    }
}

/**
 * Updates play/pause button UI
 */
function updatePlayPauseUI(playing) {
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const playPauseBtn = document.getElementById('play-pause-btn');
    
    if (playing) {
        if (playIcon) playIcon.classList.add('hidden');
        if (pauseIcon) pauseIcon.classList.remove('hidden');
        if (playPauseBtn) playPauseBtn.classList.add('playing');
    } else {
        if (playIcon) playIcon.classList.remove('hidden');
        if (pauseIcon) pauseIcon.classList.add('hidden');
        if (playPauseBtn) playPauseBtn.classList.remove('playing');
    }
}

// ========================================
// DISCORD INTEGRATION (Visual Only)
// ========================================

let lanyardData = null;
let updateInterval = null;

/**
 * Fetches Discord user data from Lanyard REST API
 */
async function fetchDiscordData() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/391445098715545610`);
        const data = await response.json();
        
        if (data.success && data.data) {
            lanyardData = data.data;
            updateDiscordUI(data.data);
            return data.data;
        } else {
            console.error('Lanyard API error:', data);
            showFallbackUI();
            return null;
        }
    } catch (error) {
        console.error('Failed to fetch Discord data:', error);
        showFallbackUI();
        return null;
    }
}

/**
 * Updates all Discord-related UI elements
 */
function updateDiscordUI(data) {
    updateAvatar(data.discord_user);
    updateUsername(data.discord_user);
    updateStatus(data.discord_status);
    updateCustomStatus(data.activities);
    updateBadges(data.discord_user);
    updateSpotifyActivity(data.activities);
    updateSpotifyLink(data.activities);
}

/**
 * Updates Discord avatar
 */
function updateAvatar(discordUser) {
    const avatarImg = document.getElementById('discord-avatar');
    if (!discordUser || !avatarImg) return;
    
    let avatarUrl;
    if (discordUser.avatar) {
        const extension = discordUser.avatar.startsWith('a_') ? 'gif' : 'png';
        avatarUrl = `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.${extension}?size=256`;
    } else {
        const defaultAvatar = parseInt(discordUser.discriminator) % 5;
        avatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatar}.png`;
    }
    
    avatarImg.src = avatarUrl;
    avatarImg.alt = `${discordUser.username}'s Avatar`;
    
    avatarImg.onerror = () => {
        const defaultAvatar = parseInt(discordUser.discriminator) % 5;
        avatarImg.src = `https://cdn.discordapp.com/embed/avatars/${defaultAvatar}.png`;
    };
}

/**
 * Updates username and discriminator
 */
function updateUsername(discordUser) {
    const usernameText = document.getElementById('username-text');
    const discriminatorSpan = document.getElementById('discord-discriminator');
    
    if (!discordUser) return;
    
    if (usernameText) {
        usernameText.textContent = discordUser.username || 'Unknown User';
    }
    
    if (discriminatorSpan) {
        if (discordUser.discriminator && discordUser.discriminator !== '0') {
            discriminatorSpan.textContent = `#${discordUser.discriminator}`;
            discriminatorSpan.style.display = 'inline';
        } else {
            discriminatorSpan.style.display = 'none';
        }
    }
}

/**
 * Updates Discord status indicator
 */
function updateStatus(status) {
    const statusDot = document.getElementById('status-dot');
    const statusText = document.getElementById('status-text');
    
    if (!status) {
        status = 'offline';
    }
    
    const statusLabels = {
        online: 'Online',
        idle: 'Idle',
        dnd: 'Do Not Disturb',
        offline: 'Offline'
    };
    
    if (statusDot) {
        statusDot.className = `status-dot ${status}`;
    }
    
    if (statusText) {
        statusText.textContent = statusLabels[status] || 'Offline';
    }
}

/**
 * Updates custom status text
 */
function updateCustomStatus(activities) {
    const customStatusText = document.getElementById('custom-status-text');
    const customStatusCard = document.getElementById('custom-status-card');
    
    if (!customStatusText || !customStatusCard) return;
    
    const customStatus = activities?.find(activity => activity.type === 4);
    
    if (customStatus && customStatus.state) {
        customStatusText.textContent = customStatus.state;
        customStatusCard.classList.remove('hidden');
        customStatusCard.setAttribute('aria-hidden', 'false');
    } else {
        customStatusCard.classList.add('hidden');
        customStatusCard.setAttribute('aria-hidden', 'true');
    }
}

/**
 * Updates Discord badges (visual elements)
 */
function updateBadges(discordUser) {
    const badgesContainer = document.getElementById('badges-container');
    if (!badgesContainer || !discordUser) return;
    
    badgesContainer.innerHTML = '';
    
    const flags = discordUser.public_flags || 0;
    const badges = [];
    
    // Staff (bit 0)
    if (flags & (1 << 0)) {
        badges.push({ type: 'staff', icon: 'fa-shield-halved' });
    }
    
    // Partner (bit 1)
    if (flags & (1 << 1)) {
        badges.push({ type: 'partner', icon: 'fa-certificate' });
    }
    
    // Bug Hunter Level 1 (bit 3)
    if (flags & (1 << 3)) {
        badges.push({ type: 'bughunter', icon: 'fa-bug' });
    }
    
    // Bug Hunter Level 2 (bit 14)
    if (flags & (1 << 14)) {
        badges.push({ type: 'bughunter2', icon: 'fa-bug' });
    }
    
    // Verified Bot (bit 16)
    if (flags & (1 << 16)) {
        badges.push({ type: 'verified', icon: 'fa-check-circle' });
    }
    
    // Verified Developer (bit 17)
    if (flags & (1 << 17)) {
        badges.push({ type: 'developer', icon: 'fa-code' });
    }
    
    // Certified Moderator (bit 18)
    if (flags & (1 << 18)) {
        badges.push({ type: 'moderator', icon: 'fa-shield-check' });
    }
    
    // Active Developer (bit 22)
    if (flags & (1 << 22)) {
        badges.push({ type: 'active-dev', icon: 'fa-hammer' });
    }
    
    // Premium / Nitro (bit 24)
    if (flags & (1 << 24)) {
        badges.push({ type: 'premium', icon: 'fa-crown' });
    }
    
    // Render badges
    badges.forEach(badge => {
        const badgeElement = document.createElement('div');
        badgeElement.className = `badge-icon ${badge.type}`;
        badgeElement.innerHTML = `<i class="fas ${badge.icon}"></i>`;
        badgeElement.title = badge.type.charAt(0).toUpperCase() + badge.type.slice(1).replace(/([A-Z])/g, ' $1');
        badgesContainer.appendChild(badgeElement);
    });
}

/**
 * Updates Spotify Rich Presence display
 */
function updateSpotifyActivity(activities) {
    const spotify = activities?.find(activity => activity.name === 'Spotify');
    const albumCover = document.getElementById('album-cover');
    const albumPlaceholder = document.querySelector('.album-placeholder');
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
    const spotifyPlayer = document.querySelector('.spotify-music-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    
    if (spotify && spotify.assets && spotify.details && spotify.state) {
        spotifyTrackUrl = spotify.sync_id ? `https://open.spotify.com/track/${spotify.sync_id}` : PROFILE_LINKS.spotify;

        // Show album cover
        if (spotify.assets.large_image) {
            // Spotify image key format: spotify:xxxxxx
            // Need to extract the image ID
            let imageId = spotify.assets.large_image;
            if (imageId.startsWith('spotify:')) {
                imageId = imageId.replace('spotify:', '');
            }
            
            // Spotify CDN URL: https://i.scdn.co/image/{image_id}
            const albumCoverUrl = `https://i.scdn.co/image/${imageId}`;
            
            if (albumCover) {
                albumCover.src = albumCoverUrl;
                albumCover.onload = () => {
                    albumCover.classList.remove('hidden');
                    if (albumPlaceholder) {
                        albumPlaceholder.style.display = 'none';
                    }
                };
                albumCover.onerror = () => {
                    albumCover.classList.add('hidden');
                    if (albumPlaceholder) {
                        albumPlaceholder.style.display = 'flex';
                    }
                };
            }
        } else {
            if (albumCover) albumCover.classList.add('hidden');
            if (albumPlaceholder) albumPlaceholder.style.display = 'flex';
        }
        
        // Update song title
        if (songTitle) {
            songTitle.textContent = spotify.details;
        }
        
        // Update artist name
        if (songArtist) {
            songArtist.textContent = spotify.state;
        }
        
        // Show player if hidden
        if (spotifyPlayer) {
            spotifyPlayer.style.display = 'flex';
            spotifyPlayer.classList.remove('inactive');
        }

        startSpotifyProgress(spotify.timestamps);
        updatePlayPauseUI(true);
        if (playPauseBtn) {
            playPauseBtn.setAttribute('aria-label', 'Open in Spotify');
        }
    } else {
        spotifyTrackUrl = null;

        // Hide or show placeholder when not playing
        if (albumCover) albumCover.classList.add('hidden');
        if (albumPlaceholder) albumPlaceholder.style.display = 'flex';
        if (songTitle) songTitle.textContent = 'Not playing';
        if (songArtist) songArtist.textContent = 'Spotify';
        if (spotifyPlayer) {
            spotifyPlayer.classList.add('inactive');
        }
        clearSpotifyProgress();
        updatePlayPauseUI(false);
    }
}

/**
 * Updates Spotify link
 */
function updateSpotifyLink(activities) {
    const spotifyLink = document.getElementById('spotify-link');
    if (!spotifyLink) return;
    
    const spotify = activities?.find(activity => activity.name === 'Spotify');
    
    if (spotify && spotify.sync_id) {
        spotifyLink.href = `https://open.spotify.com/track/${spotify.sync_id}`;
    } else {
        spotifyLink.href = PROFILE_LINKS.spotify;
    }
}

/**
 * Shows fallback UI when Discord data fails
 */
function showFallbackUI() {
    const usernameText = document.getElementById('username-text');
    if (usernameText) {
        usernameText.textContent = 'Unknown User';
    }
    
    const statusDot = document.getElementById('status-dot');
    if (statusDot) {
        statusDot.className = 'status-dot offline';
    }
}

// ========================================
// PROFILE LINKS
// ========================================

/**
 * Initializes profile links
 */
function initProfileLinks() {
    const discordLink = document.getElementById('discord-link');
    const spotifyLink = document.getElementById('spotify-link');
    const instagramLink = document.getElementById('instagram-link');
    
    if (discordLink) discordLink.href = PROFILE_LINKS.discord;
    if (spotifyLink) spotifyLink.href = PROFILE_LINKS.spotify;
    if (instagramLink) instagramLink.href = PROFILE_LINKS.instagram;
}

// ========================================
// SIDE PROFILE CARDS (LEFT & RIGHT)
// ========================================

/**
 * Fetches and updates LEFT profile card
 */
async function fetchLeftProfile() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${LEFT_PROFILE_ID}`);
        const data = await response.json();
        
        if (data.success && data.data) {
            updateSideProfile('left', data.data);
        }
    } catch (error) {
        console.error('Failed to fetch left profile:', error);
    }
}

/**
 * Fetches and updates RIGHT profile card
 */
async function fetchRightProfile() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${RIGHT_PROFILE_ID}`);
        const data = await response.json();
        
        if (data.success && data.data) {
            updateSideProfile('right', data.data);
        }
    } catch (error) {
        console.error('Failed to fetch right profile:', error);
    }
}

/**
 * Updates a side profile card (left or right)
 */
function updateSideProfile(side, data) {
    const prefix = side;
    
    // Update avatar
    const avatarImg = document.getElementById(`${prefix}-avatar`);
    if (avatarImg && data.discord_user) {
        let avatarUrl;
        if (data.discord_user.avatar) {
            const extension = data.discord_user.avatar.startsWith('a_') ? 'gif' : 'png';
            avatarUrl = `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.${extension}?size=256`;
        } else {
            const defaultAvatar = parseInt(data.discord_user.discriminator || '0') % 5;
            avatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatar}.png`;
        }
        avatarImg.src = avatarUrl;
    }
    
    // Update username
    const usernameEl = document.getElementById(`${prefix}-username`);
    if (usernameEl && data.discord_user) {
        usernameEl.textContent = data.discord_user.username || 'Unknown User';
    }
    
    // Update status
    const statusDot = document.getElementById(`${prefix}-status-dot`);
    const statusText = document.getElementById(`${prefix}-status-text`);
    const status = data.discord_status || 'offline';
    
    const statusLabels = {
        online: 'Online',
        idle: 'Idle',
        dnd: 'Do Not Disturb',
        offline: 'Offline'
    };
    
    if (statusDot) {
        statusDot.className = `status-dot ${status}`;
    }
    
    if (statusText) {
        statusText.textContent = statusLabels[status] || 'Offline';
    }
    
    // Update activity box
    const activityBox = document.getElementById(`${prefix}-activity`);
    if (activityBox) {
        const activities = data.activities || [];
        const spotify = activities.find(activity => activity.name === 'Spotify');
        const streaming = activities.find(activity => activity.type === 1); // Streaming
        const game = activities.find(activity => activity.type === 0); // Playing game
        const customStatus = activities.find(activity => activity.type === 4); // Custom status
        
        if (spotify && spotify.details) {
            activityBox.innerHTML = `
                <i class="fab fa-spotify"></i>
                <span>Listening to Spotify</span>
            `;
        } else if (streaming) {
            activityBox.innerHTML = `
                <i class="fas fa-video"></i>
                <span>Streaming ${streaming.details || streaming.name || ''}</span>
            `;
        } else if (game) {
            activityBox.innerHTML = `
                <i class="fas fa-gamepad"></i>
                <span>Playing ${game.name}</span>
            `;
        } else if (customStatus && customStatus.state) {
            activityBox.innerHTML = `
                <i class="fas fa-comment"></i>
                <span>${customStatus.state}</span>
            `;
        } else if (activities.length > 0 && activities[0].name) {
            const firstActivity = activities[0];
            const icon = firstActivity.type === 2 ? 'fa-headphones' : 'fa-discord';
            activityBox.innerHTML = `
                <i class="fas ${icon}"></i>
                <span>${firstActivity.name}</span>
            `;
        } else {
            activityBox.innerHTML = `
                <i class="fab fa-discord"></i>
                <span>...</span>
            `;
        }
    }
    
    // Update links (optional - you can customize per profile)
    const linksEl = document.getElementById(`${prefix}-links`);
    if (linksEl) {
        linksEl.textContent = '22.12';
    }
    
    // Update social link hrefs (optional)
    const discordLink = document.getElementById(`${prefix}-discord-link`);
    if (discordLink) {
        discordLink.href = PROFILE_LINKS.discord;
    }
    
    const spotifyLink = document.getElementById(`${prefix}-spotify-link`);
    if (spotifyLink) {
        spotifyLink.href = PROFILE_LINKS.spotify;
    }
    
    const instagramLink = document.getElementById(`${prefix}-instagram-link`);
    if (instagramLink) {
        instagramLink.href = PROFILE_LINKS.instagram;
    }
    
    // Update Spotify player
    updateSideSpotifyPlayer(prefix, data.activities);
}

/**
 * Updates Spotify player for side profiles
 */
function updateSideSpotifyPlayer(side, activities) {
    const spotify = activities?.find(activity => activity.name === 'Spotify');
    const albumCover = document.getElementById(`${side}-album-cover`);
    const profileEl = document.getElementById(`${side}-profile`);
    const albumPlaceholder = profileEl?.querySelector('.album-placeholder');
    const songTitle = document.getElementById(`${side}-song-title`);
    const songArtist = document.getElementById(`${side}-song-artist`);
    const playIcon = document.getElementById(`${side}-play-icon`);
    const pauseIcon = document.getElementById(`${side}-pause-icon`);
    const progressBar = document.getElementById(`${side}-track-progress-bar`);
    
    // Clear existing interval
    if (side === 'left' && leftProgressInterval) {
        clearInterval(leftProgressInterval);
        leftProgressInterval = null;
    }
    if (side === 'right' && rightProgressInterval) {
        clearInterval(rightProgressInterval);
        rightProgressInterval = null;
    }
    
    if (spotify && spotify.assets && spotify.details && spotify.state) {
        // Show album cover
        if (spotify.assets.large_image) {
            let imageId = spotify.assets.large_image;
            if (imageId.startsWith('spotify:')) {
                imageId = imageId.replace('spotify:', '');
            }
            
            const albumCoverUrl = `https://i.scdn.co/image/${imageId}`;
            
            if (albumCover) {
                albumCover.src = albumCoverUrl;
                albumCover.onload = () => {
                    albumCover.classList.remove('hidden');
                    if (albumPlaceholder) {
                        albumPlaceholder.style.display = 'none';
                    }
                };
                albumCover.onerror = () => {
                    albumCover.classList.add('hidden');
                    if (albumPlaceholder) {
                        albumPlaceholder.style.display = 'flex';
                    }
                };
            }
        } else {
            if (albumCover) albumCover.classList.add('hidden');
            if (albumPlaceholder) albumPlaceholder.style.display = 'flex';
        }
        
        // Update song info
        if (songTitle) songTitle.textContent = spotify.details;
        if (songArtist) songArtist.textContent = spotify.state;
        
        // Update play/pause icon
        if (playIcon) playIcon.classList.add('hidden');
        if (pauseIcon) pauseIcon.classList.remove('hidden');
        
        // Store timestamps and start progress interval
        if (progressBar && spotify.timestamps) {
            const timestamps = {
                start: Number(spotify.timestamps.start),
                end: Number(spotify.timestamps.end)
            };
            
            if (side === 'left') {
                leftSpotifyTimestamps = timestamps;
            } else {
                rightSpotifyTimestamps = timestamps;
            }
            
            const updateProgress = () => {
                const ts = side === 'left' ? leftSpotifyTimestamps : rightSpotifyTimestamps;
                if (!ts) return;
                
                const duration = ts.end - ts.start;
                if (!Number.isFinite(duration) || duration <= 0) {
                    progressBar.style.width = '0%';
                    return;
                }
                
                const now = Date.now();
                const elapsed = now - ts.start;
                const ratio = Math.min(1, Math.max(0, elapsed / duration));
                progressBar.style.width = `${(ratio * 100).toFixed(2)}%`;
            };
            
            updateProgress();
            
            if (side === 'left') {
                leftProgressInterval = setInterval(updateProgress, 500);
            } else {
                rightProgressInterval = setInterval(updateProgress, 500);
            }
        }
    } else {
        // Not playing
        if (albumCover) albumCover.classList.add('hidden');
        if (albumPlaceholder) albumPlaceholder.style.display = 'flex';
        if (songTitle) songTitle.textContent = 'Not playing';
        if (songArtist) songArtist.textContent = 'Spotify';
        if (playIcon) playIcon.classList.remove('hidden');
        if (pauseIcon) pauseIcon.classList.add('hidden');
        if (progressBar) progressBar.style.width = '0%';
        
        // Clear timestamps
        if (side === 'left') {
            leftSpotifyTimestamps = null;
        } else {
            rightSpotifyTimestamps = null;
        }
    }
}

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initializes the application
 */
async function init() {
    initIntroOverlay();
    initMusicPlayer();
    
    // Fetch both profiles
    await Promise.all([
        fetchLeftProfile(),
        fetchRightProfile()
    ]);
    
    // Update both profiles every 10 seconds
    updateInterval = setInterval(() => {
        fetchLeftProfile();
        fetchRightProfile();
    }, 10000);
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function initViewCounter() {
    const viewCountEl = document.getElementById('view-count');
    if (!viewCountEl) return;

    const BASE_VIEWS = 337000;
    const STORAGE_KEY = 'arax_views_total';
    const SESSION_KEY = 'arax_views_session_counted';

    let totalViews = BASE_VIEWS;
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = Number(stored);
            if (Number.isFinite(parsed) && parsed > 0) {
                totalViews = parsed;
            }
        }

        const alreadyCounted = sessionStorage.getItem(SESSION_KEY) === '1';
        if (!alreadyCounted) {
            totalViews += 1;
            localStorage.setItem(STORAGE_KEY, String(totalViews));
            sessionStorage.setItem(SESSION_KEY, '1');
        }
    } catch {
        // Ignore storage failures (private mode, blocked storage, etc.)
    }

    viewCountEl.textContent = totalViews.toLocaleString('en-US');
}

function initIntroOverlay() {
    const overlay = document.getElementById('intro-overlay');
    if (!overlay) return;

    let dismissed = false;
    const dismiss = () => {
        if (dismissed) return;
        dismissed = true;
        overlay.classList.add('fade-out');
        overlay.setAttribute('aria-hidden', 'true');
        
        // Start music player when entering site
        initMusicPlayer();
        if (audioElement) {
            audioElement.play().catch(err => console.log('Autoplay prevented:', err));
        }
        
        window.setTimeout(() => {
            overlay.remove();
        }, 540);
    };

    overlay.addEventListener('click', dismiss);
    overlay.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            dismiss();
        }
    });
}

// Cleanup
window.addEventListener('beforeunload', () => {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
    if (spotifyProgressInterval) {
        clearInterval(spotifyProgressInterval);
    }
    if (leftProgressInterval) {
        clearInterval(leftProgressInterval);
    }
    if (rightProgressInterval) {
        clearInterval(rightProgressInterval);
    }
    if (audioElement) {
        audioElement.pause();
    }
});
