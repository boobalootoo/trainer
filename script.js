const video = document.getElementById("webcam");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let model;

// Load the TensorFlow.js model
async function loadModel() {
    model = await tf.loadLayersModel("path_to_tfjs_model/model.json");
    console.log("Model loaded!");
}

// Access webcam
async function setupCamera() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    return new Promise((resolve) => {
        video.onloadedmetadata = () => resolve(video);
    });
}

// Run classification
async function predict() {
    if (!model) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const img = tf.browser.fromPixels(canvas)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .expandDims();
    
    const predictions = await model.predict(img).data();
    const topPrediction = predictions.indexOf(Math.max(...predictions));
    
    document.getElementById("result").innerText = "Prediction: " + classNames[topPrediction];
}

// Start the application
async function startApp() {
    await setupCamera();
    await loadModel();
    setInterval(predict, 1000); // Predict every second
}

startApp();
