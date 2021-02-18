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

        let cookieBtn = await driver.wait(until.elementLocated(By.id("CybotCookiebotDialogBodyButtonAccept")), 4000);
        await cookieBtn.click();

        let searchBar = await driver.findElement(By.id("site-search"));
        await searchBar.sendKeys("padló");

        let searchResults = await driver.wait(until.elementsLocated(By.className("prefixbox-autocomplete-keyword-container  ")), 3000);
        await searchResults[1].click();

        let addToChartBtns = await driver.wait(until.elementsLocated(By.xpath('//*[contains(text(), "Kosárhoz adás")]')), 5000);
        await driver.executeScript("arguments[0].scrollIntoView(false)", addToChartBtns[3]);
        addToChartBtns[3].click();

        await driver.sleep(3000);

        let successElement = await driver.findElement(By.xpath("//div[@id='myModal']/h3"));
        let text = await successElement.getText();
        let expectedText = "1 termék hozzáadva a kosárhoz";

        if (text != expectedText) {
            throw 'Expected: "' + expectedText + '", got: "' + text + '"';
        }

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
