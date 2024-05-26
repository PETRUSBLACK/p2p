// export function authenticateApiKey(req, res, next) {
//     const apiKey = req.headers['x-api-key'];
//     if (apiKey === 'your_api_key') {
//       next();
//     } else {
//       res.sendStatus(403);
//     }
//   }
  
//   export function authenticateCustomHeader(req, res, next) {
//     const customHeader = req.headers['x-custom-header'];
//     if (customHeader === 'your_custom_header_value') {
//       next();
//     } else {
//       res.sendStatus(403);
//     }
//   }