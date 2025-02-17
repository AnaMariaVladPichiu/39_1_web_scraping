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
            
            const categories= await page.evaluate((categoryUrl)=>{
                const elementsCategory = document.querySelectorAll("div.side_categories");
                return Array.from(elementsCategory).map(category=>({
                    name: category.textContent.trim(),
                    url: category.href
                }));
            });
            console.log(categories);
            await browser.close();
            rl.close();
        })
    }
    scrapeBooksToScrape();
