let cart = [];
let currentSongIndex = -1;
let shuffleEnabled = false;
let playbackDuration = 0;
let timer;
let currentAudio = null;  

function addToCart(albumName) {
    
    let albumItem = document.querySelector(`.album-item[data-album-name='${albumName}']`);
    let audioElement = albumItem.querySelector('audio');
    
    
    if (!cart.some(song => song.name === albumName)) {
        cart.push({
            name: albumName,
            audioElement: audioElement
        });
        updateCart();
    }
}


function updateCart() {
    let cartItemsList = document.getElementById('cart-items');
    cartItemsList.innerHTML = ''; 
    
    cart.forEach(song => {
        let li = document.createElement('li');
        li.textContent = song.name;

        
        let removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.onclick = function () {
            removeFromCart(song.name);
        };
        li.appendChild(removeButton);

        cartItemsList.appendChild(li);
    });
}


function removeFromCart(albumName) {
    const index = cart.findIndex(song => song.name === albumName);
    if (index !== -1) {
        
        if (cart[index].audioElement === currentAudio) {
            cart[index].audioElement.pause();
            currentAudio = null; 
        }

        
        cart.splice(index, 1);
        updateCart();
    }
}

function playSongFromAlbum(albumName) {
    
    let allAudios = document.querySelectorAll('.album-item audio');
    
    
    allAudios.forEach(audio => {
        if (audio !== document.getElementById(albumName)) {
            audio.pause();  
            audio.currentTime = 0;  
        }
    });

   
    let audioElement = document.getElementById(albumName);
    if (audioElement) {
        audioElement.play();  
    }
}


document.querySelectorAll('.album-item button').forEach(button => {
    button.addEventListener('click', function () {
       
        let albumName = button.parentElement.getAttribute('data-album-name');
        playSongFromAlbum(albumName);
    });
});

document.querySelectorAll('.album-item audio').forEach(audio => {
    audio.addEventListener('play', function () {
        let albumName = audio.id; 
        playSongFromAlbum(albumName);  
    });
});


function nextSong() {
    if (cart.length === 0) return;

   
    if (shuffleEnabled) {
        currentSongIndex = Math.floor(Math.random() * cart.length);
    } else {
        currentSongIndex = (currentSongIndex + 1) % cart.length;
    }

    playSong(currentSongIndex);
}


function prevSong() {
    if (cart.length === 0) return;

    
    if (shuffleEnabled) {
        currentSongIndex = Math.floor(Math.random() * cart.length);
    } else {
        currentSongIndex = (currentSongIndex - 1 + cart.length) % cart.length;
    }

    playSong(currentSongIndex);
}


function playSong(index) {
    if (index < 0 || index >= cart.length) return;

    let song = cart[index];
    let audio = song.audioElement;
    let songTitle = document.getElementById('song-title');

   
    cart.forEach(song => song.audioElement.pause());

  
    audio.play();
    currentAudio = audio; 
    songTitle.textContent = `Now Playing: ${song.name}`;

  
    if (playbackDuration > 0) {
        let durationInSeconds = playbackDuration * 60;
        clearTimeout(timer); 
        timer = setTimeout(() => {
            audio.pause();
            songTitle.textContent = 'Now Playing: ';
            currentAudio = null; 
            promptUserToContinueOrStop(); 
        }, durationInSeconds * 1000);
    }
}


function promptUserToContinueOrStop() {
    let userResponse = confirm("The song duration has ended. Do you want to continue playing? Press OK to continue or Cancel to stop.");
    if (userResponse) {
       
        if (currentAudio) {
            currentAudio.play();
        }
    } else {
        
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
        }
    }
}


function toggleShuffle() {
    shuffleEnabled = !shuffleEnabled;
    let shuffleButton = document.getElementById('shuffle-button');
    shuffleButton.style.backgroundColor = shuffleEnabled ? 'green' : '';
}


function startPlayback() {
    playbackDuration = document.getElementById('duration').value;
    if (cart.length > 0) {
        playSong(0); 
    }
}

document.querySelector('.prev-button').addEventListener('click', prevSong);
document.querySelector('.next-button').addEventListener('click', nextSong);


document.querySelectorAll('audio').forEach(audio => {
    audio.addEventListener('ended', () => {
        nextSong();
    });
});


function searchSongs() {
    let searchQuery = document.getElementById('search-input').value.toLowerCase();
    let albumItems = document.querySelectorAll('.album-item');

    albumItems.forEach(item => {
        let albumName = item.getAttribute('data-album-name').toLowerCase();
        if (albumName.includes(searchQuery)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}
