document.addEventListener('DOMContentLoaded', () => {
    const reels = document.querySelectorAll('video');
    const totalWatchTimeElement = document.getElementById('total-watch-time');
    let totalWatchTime = 0;

    // Function to get the watch time from localStorage
    function getStoredWatchTime() {
        return parseFloat(localStorage.getItem('totalWatchTime')) || 0;
    }

    // Function to update the watch time in localStorage and on the page
    function updateWatchTime(duration) {
        totalWatchTime += duration;
        localStorage.setItem('totalWatchTime', totalWatchTime);
        displayWatchTime();
    }

    // Function to display the current watch time
    function displayWatchTime() {
        totalWatchTimeElement.textContent = totalWatchTime.toFixed(2);
    }

    // Initialize total watch time from localStorage and update display
    totalWatchTime = getStoredWatchTime();
    displayWatchTime();

    reels.forEach(reel => {
        let lastTimeUpdate = 0;

        reel.addEventListener('play', () => {
            lastTimeUpdate = Date.now();
        });

        reel.addEventListener('pause', () => {
            if (lastTimeUpdate) {
                const duration = (Date.now() - lastTimeUpdate) / 1000;
                updateWatchTime(duration);
                lastTimeUpdate = 0;
            }
        });

        reel.addEventListener('ended', () => {
            if (lastTimeUpdate) {
                const duration = (Date.now() - lastTimeUpdate) / 1000;
                updateWatchTime(duration);
                lastTimeUpdate = 0;
            }
        });
    });

    // Create an IntersectionObserver to monitor when videos are in or out of view
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                // Video is in view; ensure it's playing if it was previously playing
                if (!video.paused) {
                    video.play();
                }
            } else {
                // Video is out of view; pause it
                if (!video.paused) {
                    video.pause();
                }
            }
        });
    }, {
        threshold: 0.5 // Adjust this threshold as needed
    });

    // Observe each video element
    reels.forEach(reel => {
        observer.observe(reel);
    });
});
