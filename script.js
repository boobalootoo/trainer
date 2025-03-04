const imageUpload = document.getElementById("imageUpload");
const preview = document.getElementById("preview");
let model;

// Load the TensorFlow.js model
async function loadModel() {
    model = await tf.loadLayersModel("path_to_tfjs_model/model.json");
    console.log("Model loaded!");
}

// Handle image upload
document.getElementById("imageUpload").addEventListener("change", event => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = "block";
            predict(e.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Run classification
async function predict(imageSrc) {
    if (!model) return;
    const img = new Image();
    img.src = imageSrc;
    img.onload = async function() {
        const tensor = tf.browser.fromPixels(img)
            .resizeNearestNeighbor([224, 224])
            .toFloat()
            .expandDims();

        const predictions = await model.predict(tensor).data();
        const topPrediction = predictions.indexOf(Math.max(...predictions));

        document.getElementById("result").innerText = "Prediction: " + classNames[topPrediction];
    };
}

// Start the application
async function startApp() {
    await loadModel();
}

startApp();
