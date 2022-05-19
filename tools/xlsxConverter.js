const xlsx = require("xlsx");

function xlsxToData(file) {
  let workbook = xlsx.read(file.buffer);
  let sheet_name_list = workbook.SheetNames;
  let data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

  return data;
}

function generateXlsx(file) {
  const workbook = xlsx.utils.book_new();
  const filename = "file";
  const dataSheet = xlsx.utils.json_to_sheet(file);
  xlsx.utils.book_append_sheet(workbook, dataSheet, filename.replace('/', ''));

  return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

module.exports = { xlsxToData, generateXlsx};