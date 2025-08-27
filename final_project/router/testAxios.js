// testAxios.js
const axios = require('axios');

// 1. Feladat: Az összes könyv lekérése
async function getAllBooks() {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log("Összes könyv:");
        console.log(response.data);
    } catch (error) {
        console.error("Hiba az összes könyv lekérésekor:", error.response ? error.response.data : error.message);
    }
}

// 2. Feladat: Könyv lekérése ISBN alapján
async function getBookByISBN(isbn) {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        console.log(`Könyv ISBN alapján (${isbn}):`);
        console.log(response.data);
    } catch (error) {
        console.error(`Hiba az ISBN (${isbn}) lekérésekor:`, error.response ? error.response.data : error.message);
    }
}

// 3. Feladat: Könyv lekérése szerző alapján
async function getBooksByAuthor(author) {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        console.log(`Könyvek szerző alapján (${author}):`);
        console.log(response.data);
    } catch (error) {
        console.error(`Hiba a szerző (${author}) lekérésekor:`, error.response ? error.response.data : error.message);
    }
}

// 4. Feladat: Könyv lekérése cím alapján
async function getBooksByTitle(title) {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        console.log(`Könyvek cím alapján (${title}):`);
        console.log(response.data);
    } catch (error) {
        console.error(`Hiba a cím (${title}) lekérésekor:`, error.response ? error.response.data : error.message);
    }
}

// Futtatás
(async () => {
    await getAllBooks();
    await getBookByISBN(1);
    await getBooksByAuthor("Jane Austen");
    await getBooksByTitle("Fairy tales");
})();
