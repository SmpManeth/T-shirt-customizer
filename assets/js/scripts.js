const stage = new Konva.Stage({
  container: "tshirt-container",
  width: 500,
  height: 600,
});

const frontLayer = new Konva.Layer();
const backLayer = new Konva.Layer();
stage.add(frontLayer);
stage.add(backLayer);

backLayer.visible(false);

let selectedElement = null;

// Load T-Shirt Templates
Konva.Image.fromURL("./assets/images/tshirt-front-template.png", (frontTemplate) => {
  frontTemplate.setAttrs({
    x: 0,
    y: 0,
    width: 500,
    height: 600,
    draggable: false,
  });
  frontLayer.add(frontTemplate);
  frontLayer.draw();
});

Konva.Image.fromURL("./assets/images/tshirt-back-template.png", (backTemplate) => {
  backTemplate.setAttrs({
    x: 0,
    y: 0,
    width: 500,
    height: 600,
    draggable: false,
  });
  backLayer.add(backTemplate);
  backLayer.draw();
});

// Add Text
function addText() {
  const textValue = document.getElementById("text-input").value;
  if (!textValue) {
    alert("Please enter some text!");
    return;
  }

  const activeLayer = frontLayer.visible() ? frontLayer : backLayer;

  const text = new Konva.Text({
    x: 50,
    y: 50,
    text: textValue,
    fontSize: 24,
    fill: "black",
    draggable: true,
  });

  activeLayer.add(text);
  activeLayer.draw();

  calculatePrice();
}

// Handle Selection
stage.on("click", (e) => {
  if (e.target === stage) {
    deselectElement();
    return;
  }

  if (e.target.getClassName() === "Text" || e.target.getClassName() === "Image") {
    if (selectedElement) {
      selectedElement.stroke(null);
      selectedElement.strokeWidth(0);
    }

    selectedElement = e.target;
    selectedElement.stroke("red");
    selectedElement.strokeWidth(2);

    selectedElement.getLayer().draw();
  }
});

// Handle Image Upload
document.getElementById("upload-image").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const activeLayer = frontLayer.visible() ? frontLayer : backLayer;

    Konva.Image.fromURL(reader.result, (image) => {
      image.setAttrs({
        x: 50,
        y: 50,
        width: 150,
        height: 150,
        draggable: true,
      });

      activeLayer.add(image);
      activeLayer.draw();
      calculatePrice();
    });
  };
  reader.readAsDataURL(file);
});

// Apply Text Styles
function applyTextStyles() {
  if (!selectedElement || selectedElement.getClassName() !== "Text") {
    alert("Please select a text element to apply styles.");
    return;
  }

  const fontSize = document.getElementById("font-size-input").value;
  const fontColor = document.getElementById("font-color-input").value;
  const fontFamily = document.getElementById("font-family-input").value;

  selectedElement.fontSize(fontSize);
  selectedElement.fill(fontColor);
  selectedElement.fontFamily(fontFamily);

  selectedElement.getLayer().draw();
}

// Deselect Element
function deselectElement() {
  if (selectedElement) {
    selectedElement.stroke(null);
    selectedElement.strokeWidth(0);
    selectedElement.getLayer().draw();
    selectedElement = null;
  }
}

// Export the Design
function exportDesign() {
  const dataURL = stage.toDataURL();
  const link = document.createElement("a");
  link.download = "tshirt-design.png";
  link.href = dataURL;
  link.click();
}

// Switch Views
function toggleView() {
  const isFrontVisible = frontLayer.visible();
  frontLayer.visible(!isFrontVisible);
  backLayer.visible(isFrontVisible);
  stage.draw();
}

// Calculate Pricing
function calculatePrice() {
  const activeLayer = frontLayer.visible() ? frontLayer : backLayer;
  const textCount = activeLayer.find("Text").length;
  const imageCount = activeLayer.find("Image").length;
  const totalPrice = 10 + textCount * 2 + imageCount * 3;
  document.getElementById("price").textContent = totalPrice;
}