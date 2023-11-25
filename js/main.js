document.getElementById('start-button').addEventListener('click', function () {
  document.getElementById('start-button').style.display = 'none';
  document.getElementById('date').style.display = 'flex';

  document.getElementById('go').addEventListener('click', function () {
    const date = document.getElementById('start-date').value;
    if (!date)
      return alert('Please input a valid date to proceed with the search.');
    fetchData(date);
  });
});

function renderList() {
  const list = document.getElementById('list');
  const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

  favorites.forEach((favorite, index) => {
    const listItem = document.createElement('div');
    listItem.className = 'boxer';

    const favImage = document.createElement('img');
    favImage.className = 'fav-img';
    favImage.src = favorite.url;

    const text = document.createElement('p');
    text.textContent = favorite.title;
    const binImage = document.createElement('img');
    binImage.id = 'bin';
    binImage.src = './images/recycle-bin.png';

    listItem.appendChild(favImage);
    listItem.appendChild(text);
    listItem.appendChild(binImage);

    list.appendChild(listItem);

    binImage.addEventListener('click', function () {
      const confirmDelete = window.confirm(
        'Are you sure you want to delete this favorite?'
      );

      if (confirmDelete) {
        favorites.splice(index, 1);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        list.removeChild(listItem);
      }
    });
  });
}

renderList();

function fetchData(date) {
  const apiKey = 'DQhaDmgFFfmo9YE3SwLEWLlxOv8F6uTgTgUi140W';
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const modal = document.getElementById('modal');
      const close = document.getElementById('close');
      const titleElement = document.getElementById('title');
      const dateElement = document.getElementById('date-api');
      const explanationElement = document.getElementById('explanation');
      const mainImageElement = document.getElementById('main-image');

      titleElement.innerText = data.title;
      dateElement.innerText = data.date;
      explanationElement.innerText = data.explanation;
      mainImageElement.src = data.url;
      modal.style.display = 'flex';

      close.addEventListener('click', function () {
        modal.style.display = 'none';
      });

      const favButton = document.getElementById('fav');
      favButton.addEventListener('click', function () {
        const existingFavorites =
          JSON.parse(localStorage.getItem('favorites')) || [];
        existingFavorites.push(data);
        localStorage.setItem('favorites', JSON.stringify(existingFavorites));
        renderList();
        alert('Added to favorites!');
      });

      mainImageElement.addEventListener('click', function () {
        window.open(data.hdurl, '_blank');
      });
    })
    .catch((error) => {
      console.error('Error fetching APOD data:', error);
      alert(
        'An error occurred while fetching APOD data. Please try again later.'
      );
    });
}
