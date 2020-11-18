function chunkImage(img, gridScale){
  // Given an image, chunk it into color segments
  // These color segmnets will simply be the average color of the region they occupy
  midGrid = [];
  for (let y = 0; y < int(img.height/gridScale +0.9990); y++){
    let row = [];
    for (let x = 0; x < int(img.width/gridScale + 0.9999); x++){
      row.push(null)
    }
    midGrid.push(row);
  }
  
  for (let y = gridScale/2; y < img.height; y+=gridScale){
    for (let x = gridScale/2; x < img.width; x+=gridScale){
      let avgGray = 0;
      for (let dy = -gridScale/2; dy < gridScale/2; dy++){
        for (let dx = -gridScale/2; dx < gridScale/2; dx++){
          avgGray += get(x + dx, y + dy)[0];
        }
      }
      avgGray /= gridScale * gridScale;
      midGrid[(y - gridScale/2)/gridScale][(x - gridScale/2)/gridScale] = avgGray;
    }
  }
  
  return midGrid;
}

function createIsolines(targetColor, midGrid, gridScale){
  // Given a chunked image, draw isolines that follow a given color
  let binaryMidGrid = [];
  for (let y = 0; y < midGrid.length;y ++){
    let row = [];
    for (let x = 0; x < midGrid[0].length; x++){
      if (targetColor < midGrid[y][x])  row.push(0);
      else row.push(1);
    }
    binaryMidGrid.push(row);
  }
    
  let lineSegs = [];
  for (let y = 0; y < midGrid.length - 1; y++){
    for (let x = 0; x < midGrid[0].length - 1; x++){
      let outcome = 0;
      // Use an "OR" bit operator followed by a "left shift" bit operator going clockwise from top-left to perform bitmasking
      // Bitmasking creates all permutations of possible arrangements of these 4 points
      outcome = (outcome | binaryMidGrid[y][x]) << 1;
      outcome = (outcome | binaryMidGrid[y][x + 1]) << 1;
      outcome = (outcome | binaryMidGrid[y + 1][x + 1]) << 1;
      outcome = outcome | binaryMidGrid[y + 1][x];
      
      
      // Find out which arrangement it is (of the 16 possible ones) according to a lookup table
      if (outcome == 0) continue;
      else if (outcome == 1){
        let p1 = findLeft(midGrid, x, y, gridScale, targetColor);
        let p2 = findBot(midGrid, x, y, gridScale, targetColor);
        lineSegs.push([p1, p2]);
      }
      else if (outcome == 2){
        let p1 = findBot(midGrid, x, y, gridScale, targetColor);
        let p2 = findRight(midGrid, x, y, gridScale, targetColor);
        lineSegs.push([p1, p2]);
      }
      else if (outcome == 3){
        let p1 = findLeft(midGrid, x, y, gridScale, targetColor);
        let p2 = findRight(midGrid, x, y, gridScale, targetColor);
        lineSegs.push([p1, p2]);
      }
      else if (outcome == 4){
        let p1 = findTop(midGrid, x, y, gridScale, targetColor);
        let p2 = findRight(midGrid, x, y, gridScale, targetColor);
        lineSegs.push([p1, p2]);
      }
      else if (outcome == 5){
        let p2 = findTop(midGrid, x, y, gridScale, targetColor);
        let p1 = findLeft(midGrid, x, y, gridScale, targetColor);
        lineSegs.push([p1, p2]);
        p1 = findRight(midGrid, x, y, gridScale, targetColor);
        p2 = findBot(midGrid, x, y, gridScale, targetColor);
        lineSegs.push([p1, p2]);
      }
      else if (outcome == 6){
        let p2 = findTop(midGrid, x, y, gridScale, targetColor);
        let p1 = findBot(midGrid, x, y, gridScale, targetColor);
        lineSegs.push([p1, p2]);
      }
      else if (outcome == 7){
        let p2 = findTop(midGrid, x, y, gridScale, targetColor);
        let p1 = findLeft(midGrid, x, y, gridScale, targetColor);
        lineSegs.push([p1, p2]);
      }
      else if (outcome == 8){
        let p2 = findTop(midGrid, x, y, gridScale, targetColor);
        let p1 = findLeft(midGrid, x, y, gridScale, targetColor);
        lineSegs.push([p1, p2]);
      }
      else if (outcome ==9){
        let p2 = findTop(midGrid, x, y, gridScale, targetColor);
        let p1 = findBot(midGrid, x, y, gridScale, targetColor);
        lineSegs.push([p1, p2]);
      }
      else if (outcome ==10){
        let p2 = findTop(midGrid, x, y, gridScale, targetColor);
        let p1 = findRight(midGrid, x, y, gridScale, targetColor);
        lineSegs.push([p1, p2]);
        p1 = findLeft(midGrid, x, y, gridScale, targetColor);
        p2 = findBot(midGrid, x, y, gridScale, targetColor);
        lineSegs.push([p1, p2]);
      }
      else if (outcome ==11){
        let p2 = findTop(midGrid, x, y, gridScale, targetColor);
        let p1 = findRight(midGrid, x, y, gridScale, targetColor);
        lineSegs.push([p1, p2]);
      }
      else if (outcome ==12){
        let p2 = findRight(midGrid, x, y, gridScale, targetColor);
        let p1 = findLeft(midGrid, x, y, gridScale, targetColor);
        lineSegs.push([p1, p2]);
      }
      else if (outcome ==13){
        let p2 = findRight(midGrid, x, y, gridScale, targetColor);
        let p1 = findBot(midGrid, x, y, gridScale, targetColor);
        lineSegs.push([p1, p2]);
      }
      else if (outcome ==14){
        let p2 = findLeft(midGrid, x, y, gridScale, targetColor);
        let p1 = findBot(midGrid, x, y, gridScale, targetColor);
        lineSegs.push([p1, p2]);
      }
      else if (outcome ==15) continue;
    }
    
  }
  strokeWeight(0.3);
  stroke(200, 0, 0, 155)
  for (let lineSeg of lineSegs){
    line(lineSeg[0].x, lineSeg[0].y,lineSeg[1].x, lineSeg[1].y)
  }
}

function findLeft(midGrid, x, y, gridScale, targetColor){
  return createVector(gito(x, gridScale), pointFinder(midGrid[y][x], midGrid[y + 1][x], targetColor, gito(y, gridScale), gito(y + 1, gridScale)));
}

function findBot(midGrid, x, y, gridScale, targetColor){
  return createVector(pointFinder(midGrid[y + 1][x], midGrid[y + 1][x + 1], targetColor, gito(x, gridScale), gito(x + 1, gridScale)), gito(y + 1, gridScale));
}

function findRight(midGrid, x, y, gridScale, targetColor){
  return createVector(gito(x + 1, gridScale), pointFinder(midGrid[y][x + 1], midGrid[y + 1][x + 1], targetColor, gito(y, gridScale), gito(y + 1, gridScale)));
}

function findTop(midGrid, x, y, gridScale, targetColor){
  return createVector(pointFinder(midGrid[y][x], midGrid[y][x + 1], targetColor, gito(x, gridScale), gito(x + 1, gridScale)), gito(y, gridScale))
}

function gito(index, gridScale){
  // Convert a grid index into a screen coordinate
  return gridScale/2 + index * gridScale;
}

function pointFinder(color1, color2, targetColor, pos1, pos2){
  // Given 2 points with positions and colors, find out the position of a third point whose color is in between that of the other two points.
  let percent = (targetColor - min(color1, color2)) / abs(color2 - color1);
  let newPos;
  if (color1 > color2){
    if (pos1 > pos2) newPos = pos2 + abs(pos1 - pos2) * percent;
    else newPos = pos2 - abs(pos1 - pos2) * percent;
  }
  else{
    if (pos1 > pos2) newPos = pos1 - abs(pos1 - pos2) * percent;
    else newPos = pos1 + abs(pos1 - pos2) * percent;
  }
  return newPos;
}
