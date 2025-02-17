const puppeteer= require("puppeteer");
const readline = require("readline");

async function scrapeBooksToScrape() {

    const rl= readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Dime una categoria: ", async (categoria)=>{
        console.log("categoria: "+categoria)
    

    const browser= await puppeteer.launch();
    const page=await browser.newPage();
    await page.goto("https://books.toscrape.com/catalogue/category/books/classics_6/index.html");

    const bookData= await page.evaluate(()=>{
        const books= document.querySelectorAll("article.product_pod");
        return Array.from(books).map(book=>({
            title: book.querySelector("h3 a").getAttribute('title'),
            price: book.querySelector(".price_color").textContent,
            inStock: book.querySelector(".instock.availability").textContent.trim(),
            qualification: book.querySelector(".star-rating"). classList[1]
        }));
    });
    console.log(bookData);
    await browser.close();
    rl.close();
})

}
scrapeBooksToScrape();

