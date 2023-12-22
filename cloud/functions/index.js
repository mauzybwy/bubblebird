// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require('firebase-functions/v1');

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await admin
    .firestore()
    .collection("messages")
    .add({ original: original });
  // Send back a message that we've successfully written the message
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});


// Upload soundscape file to Storage
exports.soundscapes = functions.https.onRequest(async (req, res) => {
  const gzipped = req.body;
  const timestamp = req.query.timestamp;
  const analyzingNow = req.query.analyzing_now;
  
  console.log("TIMESTAMP:", timestamp);
  /* console.log("GZIP:", gzipped); */

  let soundscapeId = ""
  if (!analyzingNow) {
    const ref = admin
      .firestore()
      .collection("detections")
      .doc();
    
    soundscapeId = ref.id;
  }

  const folder = analyzingNow ? "analyzing_now" : soundscapeId;

  const fbPath = `soundscapes/${folder}/birdsong.mp3`;
  const birdsongUrl = await uploadGzipToStorage(gzipped, fbPath, "audio/mp3")

  if (!birdsongUrl) {
    return res.json({ err: true });
  }

  console.log('Uploaded file!');

  if (!analyzingNow) {
    await ref
      .set({
        timestamp: timestamp,
        //birdsongUrl
      });
  }

  res.json({ soundscape: { id: soundscapeId } });
});

// Upload spectrogram file to Storage
exports.spectrograms = functions.https.onRequest(async (req, res) => {
  const gzipped = req.body;
  const soundscapeId = req.query.soundscapeId;
  const analyzingNow = req.query.analyzing_now;
  const folder = analyzingNow ? "analyzing_now" : soundscapeId;

  const fbPath = `soundscapes/${folder}/spectrogram.png`;
  const spectrogramUrl = await uploadGzipToStorage(gzipped, fbPath, "image/png");

  if (!spectrogramUrl) {
    return res.json({ err: true });
  }

  console.log('Uploaded file');

  res.json({ soundscape: { id: soundscapeId } });
});

// Save bird detection as a doc
exports.detections = functions.https.onRequest(async (req, res) => {
  const detection = req.body;
  
  console.log("DETECTION:", detection);

  await admin
    .firestore()
    .collection("detections")
    .doc(detection.id)
    .update(detection);
  
  // Send back a message that we've successfully written the message
  res.json({ result: `Detection with ID: ${detection.soundscapeId} added.` });
});

/*****************************************************************************
 * Helper Functions
 *****************************************************************************/

const uploadGzipToStorage = async (gzipped, fbPath, contentType) => {
  const bucket = admin.storage().bucket();
  const gzipBuffer = new Uint8Array(gzipped);
  const file = bucket.file(fbPath);

  try {
    await file.save(
      gzipBuffer,
      {
        gzip: true,
        contentType,
        metadata: {
          cacheControl: 'public, max-age=31536000',
        },
      }
    );
  } catch (err) {
    console.error(`Error uploading: ${fbPath} with message: ${err.message}`);
    /* return ""; */
    return false
  }

  /* const urlOptions = {
*   version: "v4",
*   action: "read",
*   expires: Date.now() + 1000 * 60 * 2, // 2 minutes
* } */

  return true
  /* const [url] = await bucket
*   .file("uploads/file.txt")
*   .publicUrl()
*   //.getSignedUrl(urlOptions);

* return url */
}
