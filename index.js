
// GIPHY API key from the starter project
const giphyApiKey = "MhAodEJIJxQMxW9XqxKjyXfNYdLoOIym";

// Select the HTML elements
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#search-button");
const removeButton = document.querySelector("#remove-button");
const gifContainer = document.querySelector("#gif-container");

// Add event listeners
searchForm.addEventListener("submit", handleSearch);
removeButton.addEventListener("click", removeGifs);

// Make an API request to GIPHY
async function getGif(searchTerm) {
  const response = await axios.get(
    "https://api.giphy.com/v1/gifs/search",
    {
      params: {
        api_key: giphyApiKey,
        q: searchTerm,
        limit: 1
      }
    }
  );

  const gif = response.data.data[0];

  if (!gif) {
    return null;
  }

  return gif.images.downsized.url;
}

// Handle the search form submission
async function handleSearch(event) {
  event.preventDefault();

  const searchTerm = searchInput.value.trim();

  if (!searchTerm) {
    return;
  }

  searchButton.disabled = true;
  searchButton.textContent = "Searching...";

  try {
    const gifUrl = await getGif(searchTerm);

    if (!gifUrl) {
      showMessage("No GIFs found. Try another search.");
      return;
    }

    // Create a new image
    const gifImage = document.createElement("img");

    gifImage.src = gifUrl;
    gifImage.alt = `GIF for ${searchTerm}`;
    gifImage.classList.add("gif");

    // Add the GIF to the page
    gifContainer.appendChild(gifImage);

    searchInput.value = "";
    searchInput.focus();

  } catch (error) {
    console.error("GIPHY API request failed:", error);
    showMessage("Something went wrong. Please try again.");

  } finally {
    searchButton.disabled = false;
    searchButton.textContent = "Search";
  }
}

// Display a message
function showMessage(message) {
  const messageElement = document.createElement("p");

  messageElement.classList.add("message");
  messageElement.textContent = message;

  gifContainer.appendChild(messageElement);
}

// Remove all GIFs
function removeGifs() {
  gifContainer.innerHTML = "";
}
