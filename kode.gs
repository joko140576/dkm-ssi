// Code.gs
// Ganti SPREADSHEET_ID_HERE dengan ID spreadsheet Anda
const SPREADSHEET_ID = '1yhl8DctrwPLCSr0APQUpaRc8ZQoTgHn7QcyOjeDSXCw';

function doGet(e) {
  // Endpoint: ?sheet=NamaSheet
  const sheetName = e.parameter.sheet || 'Laporan';
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({ error: 'Sheet not found' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const data = sheet.getDataRange().getValues();
  const headers = data.shift().map(h => String(h));
  const rows = data.map(r => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = r[i]; });
    return obj;
  });

  const output = {
    sheet: sheetName,
    rows: rows,
    updated: new Date().toISOString()
  };

  // Support JSONP/cors-friendly
  const callback = e.parameter.callback;
  const text = (callback) ? `${callback}(${JSON.stringify(output)})` : JSON.stringify(output);
  const mime = (callback) ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON;
  return ContentService.createTextOutput(text).setMimeType(mime);
}
