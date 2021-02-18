const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");
const fs = require("fs");

let driver = new Builder()
    .forBrowser("chrome")
    .setChromeOptions(
        new chrome.Options()
        //.headless()
        //.windowSize({width: 1280, height:720})
    )
    .build();

let startTime, stopTime;

(async function main() {
    try {
        startTime = new Date();
        await driver.get("https://www.praktiker.hu/");

        

        console.log("Successful test!");
    }
    catch (error) {
        console.log("Failed test!\nError: " + error);
        let screenShot = await driver.takeScreenshot();
        fs.writeFile("out.png", screenShot, 'base64', () => {
            console.log("File saved");
        });
    }
    finally {
        await driver.quit();
        stopTime = new Date();
        let ellapsedTime = (stopTime - startTime) / 1000;
        console.log(ellapsedTime + " s");
    }
}());
