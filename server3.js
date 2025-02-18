const { title } = require("process");
const puppeteer= require("puppeteer");
    const readline= require("readline");

    async function scrapeBooksToScrape() {
        const rl= readline.createInterface({
            input: process.stdin, 
            output: process.stdout
        });

        rl.question("Dime una categoria: ", async(categoria)=>{
            console.log("categoria " +categoria)

            const browser= await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(" https://books.toscrape.com/index.html ");
            
            const categories= await page.evaluate(()=>{
                const elementsCategory = document.querySelectorAll(".side_categories ul li a");
                return Array.from(elementsCategory).map(category=>({
                    name: category.textContent.trim().replace(/\n\s+/g, " "), // Eliminar espacios y saltos de línea adicionales
                    url: category.href
                }));
            });
            console.log(categories);

            const selectCategory= categories.find(cat=>cat.name.toLocaleLowerCase()===categoria.toLocaleLowerCase());
            if(selectCategory){
                await page.goto(selectCategory.url);
           

            const bookData= await page.evaluate(()=>{
                const books=document.querySelectorAll("article.product_pod");
                return Array.from(books).map(book=>({
                    title: book.querySelector("h3 a").textContent,
                    price: book.querySelector(".price_color").textContent,
                    inStock: book.querySelector(".instock.availability").textContent.trim(),
                    qualification: book.querySelector(".star-rating").classList[1]
                }))
            })
            
            console.log(bookData);
        }else{
            console.log("Categoria no encontrada");
        }
            await browser.close();
            rl.close();
        })
    }
    scrapeBooksToScrape();
