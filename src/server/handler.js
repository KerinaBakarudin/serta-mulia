const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData');
 
async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;
 
  const { confidenceScore, label, explanation, suggestion } = await predictClassification(model, image);
  const uniqueId = crypto.randomUUID(); // Ubah nama variabel
  const createdAt = new Date().toISOString();
 
  const data = {
    id: uniqueId, // Gunakan uniqueId di sini
    result: label,
    explanation,
    suggestion,
    confidenceScore,
    createdAt,
  };
 
  await storeData(uniqueId, data); // Gunakan uniqueId di sini juga

  const response = h.response({
    status: 'success',
    message:
      confidenceScore > 99
        ? 'Model is predicted successfully.'
        : 'Model is predicted successfully but under threshold. Please use the correct picture',
    data,
  });
  response.code(201);
  return response;
}
 
module.exports = postPredictHandler;
