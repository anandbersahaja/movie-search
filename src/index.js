const cardSpace = document.querySelector(".card-list");
const modalSpace = document.querySelector(".modal-space");
const modalBody = document.querySelector(".modal-body");
const modalIsi = document.querySelector(".modal-isi");
const buttonSearch = document.querySelector(".search");
const keywordEnter = document.querySelector(".keyword");

const apiKey = "http://www.omdbapi.com/?apikey=405f9de5&";

const fetchData = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
      .then((response) => {
        if (response.Response === "False") throw new Error("Movie not found!");
        resolve(response);
      })
      .catch((err) => reject(err));
  });
};

// menarik api movie
function getMovies(url) {
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((response) => {
      if (response.Response === "False") {
        throw new Error("Movie not found!");
      }
      return response.Search;
    });
}

const noCard = function (message) {
  return `<div
          class="h-36 text-gray-500 font-semibold text-base col-span-full text-center flex flex-col items-center justify-center gap-y-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            data-slot="icon" class="w-14 h-14">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          ${message}
        </div>`;
};

const showCard = function (movie) {
  return `<div class="shadow-lg relative">
            <div style="background-image: url(${movie.Poster});"
              class="card-image h-96 w-full rounded-t-lg bg-contain bg-no-repeat bg-center">
            </div>
            <div class="card-body mb-5 mx-4 ">
              <div>${movie.Title}</div>
              <div>${movie.Year}</div>
              <button onClick="seeDetail(this)" type="button" data-imdbid=${movie.imdbID}
                class="button-modal absolute right-2 bottom-2 shadow-md font-semibold text-sm bg-blue-400 rounded-lg py-[2px] px-2 hover:bg-blue-500 text-gray-800 hover:text-gray-900 ">See
                details</button>
            </div>
        </div>`;
};

const showModal = function (movie) {
  return `<div style="background-image: url(${movie?.Poster ?? ""});"
  class="h-96 w-full rounded-t-lg bg-contain bg-no-repeat bg-center">
</div>
<div class="flex-col flex-auto divide-y space-y-2">
  <div class="text-2xl font-bold my-2 ">${movie?.Title ?? ""}</div>
  <div><span class="font-bold">Director</span>: ${movie?.Director ?? ""}</div>
  <div><span class="font-bold">Actors</span>: ${movie?.Actors ?? ""}</div>
  <div><span class="font-bold">Writer</span>: ${movie?.Writer ?? ""}</div>
  <div><span class="font-bold">Genre</span>: ${movie?.Genre ?? ""}</div>
  <div><span class="font-bold">Plot</span>: ${movie?.Plot ?? ""}</div>
</div>`;
};

// Membuka modal
const seeDetail = function (e) {
  fetchData(`http://www.omdbapi.com/?apikey=405f9de5&i=${e.dataset.imdbid}`)
    .then((data) => {
      modalIsi.innerHTML = showModal(data);
      modalBody.classList.toggle("hidden");
    })
    .catch((err) => console.log(err));

  // fetch(`http://www.omdbapi.com/?apikey=405f9de5&i=${e.dataset.imdbid}`)
  //   .then(response => response.json())
  //   .then(response => {
  //     modalIsi.innerHTML = showModal(response);
  //   });
};

// Menutup modal
function closeModal(e) {
  // Ketika mengklik tombol close modal
  if (e.target.classList.contains("close-modal")) {
    e.preventDefault();
    modalBody.classList.toggle("hidden");
    modalIsi.innerHTML = "";
    // modalSpace.innerHTML = '';
  }
}

function showMovies() {
  /** CARA 1 */
  fetchData(`http://www.omdbapi.com/?apikey=405f9de5&s=${keywordEnter.value}`)
    .then((data) => addCard(data.Search))
    .catch((err) => notFound(err));

  /** CARA 2 */
  // try {
  //   // jalankan fungsi get movies dengan parameter url + keyword searching
  //   const movies = await getMovies(`http://www.omdbapi.com/?apikey=405f9de5&s=${keywordEnter.value}`);
  //   addCard(movies);
  // }
  // catch (err) {
  //   notFound(err);
  // }
}

// fungsi untuk memasukan data film ke dalam card
function addCard(movies) {
  // let cards = '';
  cardSpace.innerHTML = "";
  movies.forEach((m) => {
    cardSpace.innerHTML += showCard(m);
  });

  // masukkan ke dalam card space
  // cardSpace.innerHTML = cards;
}

function notFound(message) {
  cardSpace.innerHTML = noCard(message);
}

function searchClick(e) {
  // Jika menekan enter pada kolom pencarian
  if (e.key === "Enter") {
    // Jalankan click tombol
    buttonSearch.click();
    buttonSearch.focus();
  }
}

buttonSearch.addEventListener("click", showMovies);

document.addEventListener("click", closeModal);

// Trigger button
keywordEnter.addEventListener("keypress", searchClick);
document.addEventListener("keyup", (e) => {
  if (e.key === "/") {
    e.preventDefault();
    keywordEnter.focus();
  }
});
