import { expect, test } from "@playwright/test";
import { hasSubscribers } from "node:diagnostics_channel";
// Importing npm exceljs npm package to be able to manipulate excel files
const ExcelJS = require("exceljs");

async function selectExcelFile(path, sheetNumber) {
  // Create a workobook
  const workbook = new ExcelJS.Workbook();
  // Tell where is the file in the system
  const file = await workbook.xlsx.readFile(path);
  // Access to worksheet array
  return { sheet: file.worksheets[sheetNumber], workbook: workbook };
}

async function readExcel(sheet, searchValue) {
  const coordinate = {
    row: -1,
    column: -1,
  };
  // Iterate over all rows that have values in a worksheet
  sheet.eachRow((row, rowNumber) => {
    // Iterate over all non-null cells in a row
    row.eachCell(function (cell, colNumber) {
      //   Get coordinate of specific value
      if (cell.value === searchValue) {
        coordinate.column = colNumber;
        coordinate.row = rowNumber;
      }
    });
  });

  return coordinate;
}

async function writeExcel(searchValue, updateValue, filePath) {
  // Select file
  const sheet1 = await selectExcelFile(filePath, 0);

  // Get coordinate
  const coordinate = await readExcel(sheet1.sheet, searchValue);

  // Select the cell to update
  const cell = sheet1.sheet.getCell(coordinate.row, coordinate.column);
  //  Update that specific cell
  cell.value = updateValue;
  await sheet1.workbook.xlsx.writeFile(filePath);
}

test.only("Download Upload Excel validation", async ({ page }) => {
  const filePath = "/Users/giuseppetropea/Downloads/download.xlsx";
  await page.goto("https://rahulshettyacademy.com/upload-download-test/");

  // Wait for download event
  const downloadPromise = page.waitForEvent("download");
  // Fire the event
  await page.getByRole("button", { name: "Download" }).click();

  //   Playrwitght save the files in a temporary folder and deletes them when the browser context closes.
  // waitForEvent('download') is the receipt that knows where the temporary folder is
  const receiptOfTempFolder = await downloadPromise;

  // Using the receipt that knows where the tempFolder is, we can use it to save the file in our file system
  await receiptOfTempFolder.saveAs(filePath);

  //  Call writeExcel function
  await writeExcel("Yellow", "blue", filePath);

  await page.locator("#fileinput").setInputFiles(filePath);

  //  Getting the update value a put an assertion
  const rows = page.locator("[role=row]");
  const column = rows.nth(1).locator("[role=cell]");

  const allColArray = await column.all();

  const allRowsArray = await rows.all();
  let elementFound = false;
  for (let r = 1; r < allRowsArray.length; r++) {
    for (let c = 1; c <= allColArray.length; c++) {
      const cellValue = await allRowsArray[r]
        .locator(`#cell-${c}-undefined`)
        .textContent();
      if (cellValue === "blue") {
        elementFound = true;
        break;
      }
    }
  }
  expect(elementFound).toBeTruthy();
});
