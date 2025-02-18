const puppeteer = require('puppeteer');
const readline = require('readline');

async function scrapeBooksToScrape() {
    const rl= readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question("Ingrese el precio minimo"), async(minPrice)=>{
        rl.question("Ingrese el precio maximo"), async(mazPrice=>{
            await browser= await puppeteer.launch();
        })
    }
}