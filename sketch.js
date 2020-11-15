function preload() {
  img = loadImage('Images/Draven.png');
}

function randPointSpread(low, high, lowR, highR, pointLim,start){
  let pointsGenerated = 1;
  let pos = start;
  let vertices = [createVector(start.x, start.y)];
  for (let i = 0; i < pointLim; i++){
    for (let j = 0; j < 100; j++){
      let newPos = genNewPoint(pos, lowR, highR);
      if (newPos.x > 0 && newPos.x < width && newPos.y > 0 && newPos.y < height){
        let gray = get(newPos.x, newPos.y)[0];
        if (low < gray && high > gray){
          let pos = newPos;
          vertices.push(pos.copy());
          pointsGenerated++;
          break;
        }
      }
    }
  }
  return vertices;
}

function genNewPoint(p, minRadius, maxRadius){
    // Generates a random point relative to the annulus of another point
    // The region of the annulus has a radius from "min_dist" to "min_dist x 2"
    let agl = random(1000) / 1000  // A little trick to get range between 0 - 1 in decimals (In this case, given to 3 decimals)

    let radius = random(minRadius, maxRadius + 1)
    let angle = 2 * 3.1415926535 * agl  // Random angle (0 - 2pi radians)

    // Trig to solve for new point
    let new_x = p.x + cos(angle) * radius
    let new_y = p.y + sin(angle) * radius

    return createVector(new_x, new_y);
}

function setup() {
  let gridScale = 4;
  createCanvas(2500, 900)
  img.resize(900, 900);
  image(img, 0, 0);
  filter(GRAY);
  noStroke();
  fill(0)

  chunkImage(img, gridScale);
  let startPoints = weightedPoissonDiskSampling(img, 40, 7, 20, 2.5);
  let collection = [];
  
  print(startPoints.length)
  
  for (let v of startPoints){
    let gray = get(int(v.x), int(v.y))[0];
    let lowR = 5 + sigmoid(gray/255, 3) *(10 - 5);
    let highR = lowR + 10;
    let vertices = randPointSpread(max(0,gray - 20), min(255,gray + 20), lowR,highR,20, createVector(v.x, v.y));
    collection.push(vertices);    
  }
  background(255);
  
  for (let points of collection){
    splineChain(points);
  }
  image(img, img.width * 2, 0);
  fill(200, 0, 0)
  for (let v of startPoints){
    circle(v.x+img.width,v.y, 4)
  }

  for (let c = 50; c < 255; c+=50){
    createIsolines(c, midGrid, gridScale);
  }
  // createIsolines(30, midGrid, gridScale);
  // createIsolines(100, midGrid, gridScale);
  // createIsolines(125, midGrid, gridScale);
  // createIsolines(150, midGrid, gridScale);
  // createIsolines(200, midGrid, gridScale);
  line(0, 700, 100, 700)
}

function mousePressed(){
  print(mouseX, mouseY, get(mouseX, mouseY)[0]);
}

// function draw() {
//   background(220);
//   image(img, 0, 0);
//   rect(0,0, 50, 50)
// } 
