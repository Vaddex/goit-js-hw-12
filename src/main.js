import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadBtn = document.querySelector('.more');
const lightBox = new SimpleLightbox('.gallery-link');
let page = 1;
let perPage = 15;
let searchQuery;
loadBtn.style.display = 'none';
loader.style.display = 'none';

form.addEventListener('submit', async e => {
  e.preventDefault();
  page = 1;
  loadBtn.style.display = 'none';
  gallery.innerHTML = '';
  searchQuery = form.elements.search.value.trim();
  if (searchQuery === '') {
    iziToast.show({
      message: 'Please write search image',
      messageColor: '#FAFAFB',
      backgroundColor: '#EF4040',
      position: 'topRight',
    });
    return;
  }

  loader.style.display = 'inline-block';
  try {
    const { hits, totalHits } = await fetchImage(searchQuery, page);
    if (totalHits === 0) {
      iziToast.show({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        messageColor: '#FAFAFB',
        backgroundColor: '#EF4040',
        position: 'topRight',
      });
      loader.style.display = 'none';
      return;
    }
    renderGallery(hits);
    if (totalHits < perPage) {
      notification();
    } else {
      loadBtn.style.display = 'block';
    }
  } catch (error) {
    iziToast.show({
      message: `Sorry, ${error}`,
      messageColor: '#FAFAFB',
      backgroundColor: '#EF4040',
      position: 'topRight',
    });
  } finally {
    form.reset();
  }
});

loadBtn.addEventListener('click', async () => {
  page += 1;

  loader.style.display = 'inline-block';
  try {
    const { hits, totalHits } = await fetchImage(searchQuery, page);
    renderGallery(hits);
    scroll();
    if (perPage * page > totalHits) {
      notification();
    }
  } catch (error) {
    iziToast.show({
      message: `Sorry, ${error}`,
      messageColor: '#FAFAFB',
      backgroundColor: '#EF4040',
      position: 'bottomCenter',
    });
  }
});

async function fetchImage(searchQuery, page) {
  const searchParams = {
    key: '42093583-bfe36716eb3593f6644c471e3',
    q: searchQuery,
    page,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: perPage,
  };
  const urlparams = new URLSearchParams(searchParams);
  const { data } = await axios.get(`https://pixabay.com/api/?${urlparams}`);
  return data;
}

function renderGallery(images) {
  const markup = images
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<li class="gallery-item">
    <a class="gallery-link" href="${largeImageURL}" >
      <img
        class="gallery-image"
        src="${webformatURL}"
        alt="${tags}"
      width = "360"
      />
    </a>
    <div class="img-text">
    <div class="img-info">
    <h3>Likes</h3>
    <p> ${likes}</p>
    </div>
    <div class="img-info">
    <h3>Views</h3>
    <p> ${views}</p>
    </div>
       <div class="img-info">
    <h3>Comments</h3>
    <p> ${comments}</p>
    </div>
       <div class="img-info">
    <h3>Downloads</h3>
    <p> ${downloads}</p>
    </div>
      </div>
  </li>`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  lightBox.refresh();

  loader.style.display = 'none';
}

function notification() {
  iziToast.show({
    message: 'We are sorry, but you have reached the end of search results.',
    messageColor: '#FAFAFB',
    backgroundColor: '#1DB8F5',
    position: 'topRight',
  });
  loadBtn.style.display = 'none';
  loader.style.display = 'none';
}

function scroll() {
  const listItem = document.querySelector('.gallery-item');
  const heightScroll = listItem.getBoundingClientRect().height * 2;
  window.scrollBy({
    top: heightScroll,
    left: 0,
    behavior: 'smooth',
  });
}