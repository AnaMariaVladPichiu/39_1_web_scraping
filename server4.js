const puppeteer = require('puppeteer');
const readline = require('readline');

async function scrapeBooksToScrape() {
    const rl= readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question("Ingrese el precio minimo y el precio máximo, separados por un espacio : ", async (input)=>{
        const[minPrice, maxPrice]= input.split(" ").map(Number);
            console.log(`Buscando libros entre £${minPrice} y £${maxPrice}`)
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto("https://books.toscrape.com/index.html ");
            console.log("pagina cargada correctamente");

        let allBooks= [];
        let hasNextPage= true;
        while(hasNextPage){
            const bookData=await page.evaluate(()=>{
                const books=document.querySelectorAll("article.product_pod");
                return Array.from(books).map(book=>({
                    title: book.querySelector("h3 a").getAttribute('title'),
                    price: parseFloat(book.querySelector('.price_color').textContent.replace('£', '')),
                    inStock: book.querySelector(".instock.availability").textContent.trim(),
                    qualification: book.querySelector(".star-rating").classList[1]
                }));
            });
            console.log(`Libros en la página actual: ${JSON.stringify(bookData, null, 2)}`);

            const priceFiltered= bookData.filter(book=>book.price>=minPrice && book.price<=maxPrice);
            console.log(`Libros filtrados por precio en la página actual: ${JSON.stringify(priceFiltered, null, 2)}`);
            allBooks=allBooks.concat(priceFiltered);

            const nextPageLink= await page.$("li.next a");
            if(nextPageLink){
                await Promise.all([  //Ejecuta ambas promesas (hacer clic y esperar la navegación) simultáneamente y espera a que ambas se completen antes de continuar.
                    page.click("li.next a"),  //Simula un clic en el enlace a la siguiente página.
                    page.waitForNavigation({waitUntil: "networkidle2"})  //Espera hasta que la navegación se considere completa.
                    //waitUntil: 'networkidle2' asegura que la espera continúe hasta que no haya más de 2 conexiones de red activas durante al menos 500 ms.
                ]);
                console.log("Navegando a la siguiente página.");
            }else{
                hasNextPage= false;
                console.log("No hay más páginas.");
            }
        }
        allBooks.sort((a,b)=>(a.price-b.price));
        console.log(allBooks);
        await browser.close();
        rl.close();
        });
    }
scrapeBooksToScrape();