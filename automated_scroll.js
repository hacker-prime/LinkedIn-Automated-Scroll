(function scrollToBottom() {
    let scrolling = true;
    let retryCount = 0;
    const maxRetries = 20; // Increase retries to ensure content loads fully
    const retryTimeout = 3000; // Adjust as necessary depending on the loading speed
    let keepScrolling = true;

    // Helper function to scroll down the page
    function scroll() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    // Helper function to check if new content has been loaded
    function contentLoaded() {
        return new Promise((resolve) => {
            const initialHeight = document.body.scrollHeight;
            setTimeout(() => {
                const newHeight = document.body.scrollHeight;
                resolve(newHeight > initialHeight);
            }, retryTimeout); // Wait for new content to load
        });
    }

    // Function to click the "Show more" button
    function clickShowMore() {
        const buttons = document.querySelectorAll('button');
        for (const button of buttons) {
            if (button.innerText.includes('Show more') || button.innerText.includes('Load more')) {
                console.log('Clicking "Show more" button...');
                button.click();
                return true; // Button found and clicked
            }
        }
        return false; // No "Show more" button found
    }

    // Main function to handle scrolling and loading new content
    async function scrollPage() {
        if (!keepScrolling) {
            console.log("Scrolling stopped by user.");
            scrolling = false;
            return;
        }

        // Click "Show more" button if available, otherwise scroll
        const buttonClicked = clickShowMore();
        if (!buttonClicked) {
            scroll(); // Only scroll if no button to click
        }

        // Wait for new content to load
        const loaded = await contentLoaded();

        // Retry if content is still loading or retry count hasn't been exceeded
        if (loaded) {
            retryCount = 0; // Reset retry count if new content is loaded
            scrollPage(); // Continue scrolling
        } else if (retryCount < maxRetries) {
            retryCount++;
            console.log(`Retrying... (${retryCount}/${maxRetries})`);
            scrollPage(); // Retry loading
        } else {
            console.log("Max retries reached or no more content to load.");
            scrolling = false; // Stop after reaching max retries
            window.stopScrolling(); // Auto stop when nothing left to load
        }
    }

    // Allow user to stop scrolling manually
    window.stopScrolling = function () {
        console.log("Stopping scroll on user request or no more content to load.");
        keepScrolling = false;
    };

    // Add a function to scroll up to a specific point
    window.scrollToPosition = function (yPosition) {
        console.log(`Scrolling to position: ${yPosition}`);
        window.scrollTo({
            top: yPosition,
            behavior: 'smooth' // Optional: Adds a smooth scroll effect
        });
    };

    // Start scrolling
    scrollPage();
})();
