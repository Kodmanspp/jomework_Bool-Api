import { bucket, heart } from "./assets.js";

const ENDPOINT = "http://localhost:1717";

const getData = (route) => {
    return fetch(`${ENDPOINT}/${route}`)
        .then(res => res.json());
}
const createElement = (tag, className, text, innerHTML) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    if (innerHTML) element.innerHTML += innerHTML;
    return element;
}
const updateData = (route, data) => {
    const { id, itemData } = data;
    getData("books").then(renderBooks);
    return fetch(`${ENDPOINT}/${route}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
    })
        .then(res => res.json());

}
const deleteData = (route, id) => {
    getData("books").then(renderBooks);
    return fetch(`${ENDPOINT}/${route}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    })
        .then(res => res.json());
}

const toggleFavorite = (id, isFavorite) => () => {
    updateData("books/update", {
        id,
        itemData: { isFavorite: !isFavorite }
    })
    getData("books").then(renderBooks);
}
const booksInfo = (id) => () => {
    const data = getData(`books/detail/${id}`);
    data.then(data => renderModal(data));
}
const deleteBook = (id) => () => {
    deleteData("books/delete", id);
    getData("books").then(renderBooks);

}

const bookList = document.querySelector(".bookList");
const renderModal = element => {
    const body = document.querySelector("body");
    const modal = createElement("div", "modal");
    const modalContainer = createElement("div", "modal__container");
    const textConteiner = createElement("div", "text__container");
    const bookTitle = createElement("h2", "name", element.name);
    const bookAuthor = createElement("h3", "author", "Автор: "+element.author);
    const bookPublishYear = createElement("p", "publishYear", "Год выпуска: "+element.publishYear);
    const bookPublishHouse = createElement("p", "publishHouse","Компания: "+ element.publishHouse);
    const bookpagesNumber = createElement("p", "pagesNumber", "Количество страниц: "+element.pagesNumber);
    const booksLang = createElement("p", "leng", "Язык оригинала: "+element.originalLanguage);
    const booksGenres = () => {
        let result = "";
        for (let i = 0; i < element.genres.length; i++) {
            result += element.genres[i];
            if (i !== element.genres.length - 1) result += ", ";
        }
        return result;
    }
    const booksGenresTag = createElement("p", "booksGenres", "Жанры:"+booksGenres());


    textConteiner.append(bookTitle, bookAuthor, bookPublishYear, bookPublishHouse, bookpagesNumber, booksGenresTag, booksLang);
    modalContainer.append(textConteiner);
    modal.append(modalContainer);

    body.prepend(modal);
    
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.remove();
            getData("books").then(renderBooks);
        }
    };
};
const renderBooks = books => {
    bookList.innerHTML = '';
    books.forEach(element => {

        const bookLi = createElement("li", "bookLi");


        const textConteiner = createElement("div", "text__container");
        textConteiner.addEventListener("click", booksInfo(element.id));
        const bookTitle = createElement("h2", "name", element.name);
        const bookAuthor = createElement("h3", "author", element.author);

        const buttonConteiner = createElement("div", "button__container");

        const isBookFavorite = element.isFavorite;
        const bookLike = createElement("button", `heart action ${isBookFavorite ? 'favorite' : ''}`, null, heart);
        bookLike.addEventListener("click", toggleFavorite(element.id, isBookFavorite));

        const bookDelete = createElement("button", "action delete__btn", null, bucket);
        bookDelete.addEventListener("click", deleteBook(element.id));

        textConteiner.append(bookTitle, bookAuthor);
        buttonConteiner.append(bookLike, bookDelete);

        bookLi.append(textConteiner, buttonConteiner);
        bookList.appendChild(bookLi);
    });
}

getData("books").then(renderBooks);
