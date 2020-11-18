function preload() {
  img = loadImage('Images/Nunu_Render.png');
}

function randPointSpread(low, high, lowR, highR, pointLim,start){
  // Given a starting point, perform a random spread
  // Create more "chaotic" and noisey results
  let pos = start;
  let vertices = [createVector(start.x, start.y)];
  for (let i = 0; i < pointLim; i++){
    for (let j = 0; j < 100; j++){ // 100 attempts to create new point
      let newPos = genNewPoint(pos, lowR, highR);
      if (newPos.x > 0 && newPos.x < width && newPos.y > 0 && newPos.y < height){
        let gray = get(newPos.x, newPos.y)[0];
        if (low < gray && high > gray){
          let pos = newPos;
          vertices.push(pos.copy());
          break;
        }
      }
    }
  }
  return vertices;
}

function randPointSpread(low, high, lowR, highR, pointLim,start){
  // Given a point, generate a uniform poisson disk sample
  // Creates more "uniform" and less random results
  let pos = start;
  let vertices = [createVector(start.x, start.y)];
  for (let i = 0; i < pointLim; i++){
    for (let j = 0; j < 100; j++){ // 100 attempts to create new point
      let newPos = genNewPoint(pos, lowR, highR);
      if (newPos.x > 0 && newPos.x < width && newPos.y > 0 && newPos.y < height){
        let gray = get(newPos.x, newPos.y)[0];
        if (low < gray && high > gray){
          let flag = true;
          for(let v of vertices){
            if (dist(v.x, v.y, newPos.x, newPos.y) < lowR){
              flag = false;
              break;
            }
          }
          if (flag){
            let pos = newPos;
            vertices.push(pos.copy());
            break;
          }
        }
      }
    }
  }
  return vertices;
}

// function randPointSpread(low, high, lowR, highR, pointLim,start){
//   // Given a point, generate new points only along the annulus of the original point
//   // Limits spreading
//   let pos = start;
//   let vertices = [createVector(start.x, start.y)];
//   for (let i = 0; i < pointLim; i++){
//     for (let j = 0; j < 100; j++){ // 100 attempts to create new point
//       let newPos = genNewPoint(pos, lowR, highR);
//       if (newPos.x > 0 && newPos.x < width && newPos.y > 0 && newPos.y < height){
//         let gray = get(newPos.x, newPos.y)[0];
//         if (low < gray && high > gray){
//           let flag = true;
//           for(let v of vertices){
//             if (dist(v.x, v.y, newPos.x, newPos.y) < lowR){
//               flag = false;
//               break;
//             }
//           }
//           if (flag){
//             vertices.push(newPos.copy());
//           }
//         }
//       }
//     }
//   }
//   return vertices;
// }

function genNewPoint(p, minRadius, maxRadius){
    // Generates a random point within the annulus of another point
    let agl = random(1000) / 1000  // A little trick to get range between 0 - 1 in decimals (In this case, given to 3 decimals)

    let radius = random(minRadius, maxRadius + 1)
    let angle = 2 * 3.1415926535 * agl  // Random angle (0 - 2pi radians)

    // Trig to solve for new point
    let new_x = p.x + cos(angle) * radius
    let new_y = p.y + sin(angle) * radius

    return createVector(new_x, new_y);
}

function setup() {
  let gridScale = 10;  // Width of a chunked square
  createCanvas(2500, 900)
  img.resize(400, 400);
  image(img, 0, 0);
  filter(GRAY);
  noStroke();
  fill(0)

  // Collect Data
  // let midGrid = chunkImage(img, gridScale);

  let startPoints = weightedPoissonDiskSampling(img, 40, 5, 13, 1.5);
  let collection = [];
  
  print(startPoints.length)
  
  for (let v of startPoints){
    let gray = get(int(v.x), int(v.y))[0];
    let lowR = 5 + sigmoid(gray/255, 3) * 5;
    let highR = lowR + 10;
    let vertices = randPointSpread(max(0,gray - 10), min(255,gray + 10), lowR,highR,40, createVector(v.x, v.y));
    collection.push(vertices);    
  }
  
  // Begin scribble drawing
  background(255);
  
  image(img, img.width * 2, 0);
  filter(GRAY)
  
  // Draw the splines from poisson disc sampling
  for (let points of collection){
    splineChain(points);
  }
  
  // fill(200, 0, 0)
  // for (let v of startPoints){
  //   circle(v.x+img.width,v.y, 4)
  // }

  // Draw the isolines with respect to "color elevation"
  // for (let c = 0; c < 255; c+=50){
  //   createIsolines(c, midGrid, gridScale);
  // }
}

function mousePressed(){
  print(mouseX, mouseY, get(mouseX, mouseY)[0]);
}
