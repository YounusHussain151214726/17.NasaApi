// https://api.nasa.gov/planetary/apod?api_key=0lMTTB42gh6dQ2vdKAD7t1BeIxut0XckeoOemcZK
//https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY

const count = 10;
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&count=${count}`;

//dom maniulation
const container = document.getElementById("container");

const success = document.getElementById("success");

let dataArray = [];
let Favourite = {};

function createDom(page) {
  const currentPage =
    page === "dataArray" ? dataArray : Object.values(Favourite);
  currentPage.forEach((data) => {
    container.classList.add("container");
    //images

    const imageContainer = document.createElement("div");
    imageContainer.classList.add("image-container");
    const img = document.createElement("img");
    img.src = data.hdurl;
    img.classList.add("image");

    //addFav
    const addFav = document.createElement("h");
    addFav.classList.add("addFav");
    if (page === "dataArray") {
      addFav.textContent = "Add to Favourite";
      addFav.setAttribute("onclick", `toLocalStorage("${data.url}")`);
    } else if (page === "Favourite") {
      addFav.textContent = "Remove to Favourite";
      addFav.setAttribute("onclick", `removeFav("${data.url}")`);
    }

    //article
    const article = document.createElement("div");
    article.classList.add("article");
    const title = document.createElement("h");
    title.textContent = data.title;
    const description = document.createElement("p");
    description.textContent = data.explanation;
    article.append(title, description);

    //footer
    const footer = document.createElement("div");
    const date = document.createElement("span");

    date.textContent = data.date;
    date.classList.add("date");
    footer.appendChild(date);

    imageContainer.appendChild(img);
    container.append(imageContainer, addFav, article, footer);
  });
}

function updateDom(page) {
  // console.log(page)
  if (localStorage.getItem("data")) {
    Favourite = JSON.parse(localStorage.getItem("data"));
  }
  container.textContent = "";
  console.log(page);

  createDom(page);
}

function toLocalStorage(data) {
  console.log(data);
  dataArray.forEach((item) => {
    if (item.url.includes(data) && !Favourite[data]) {
      Favourite[data] = item;
      localStorage.setItem("data", JSON.stringify(Favourite));
      console.log(Favourite);
      success.style.visibility = "visible";
    }
  });
  createDom();
}

function removeFav(data) {
  if (Favourite[data]) {
    console.log(Favourite[data]);
    delete Favourite[data];
    localStorage.setItem("data", JSON.stringify(Favourite));
    updateDom("Favourite");
  }
}

async function fetchData() {
  try {
    const request = await fetch(apiUrl);
    const response = await request.json();
    dataArray = response;
    console.log(dataArray);
    updateDom("dataArray");
  } catch (error) {
    const er = document.createElement("h");
    er.textContent = `❌Whoops ! ${error.message}`;
    er.classList.add("errorMessage");
    container.appendChild(er);
  }
}

fetchData();
