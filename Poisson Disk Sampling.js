/*
Start with a random point on the screen
Append point into the process_list (Queue data structure), sample_points, and grid
while process_list not empty:
    point = process_list.pop()
    for i in range(generate_new_points_cnt): # 30 tries yeilds good results
        new_point = gen_new_point_within_annulus(point)
        if within_borders(new_point) and neighbor_check(new_point, min_dist) == "No close neighbors":
            process_list.append(new_point)
            sample_points.append(new_point)
            grid[new_point_grid_y][new_point_grid_x] = new_point

     return sample_points 
*/

function sigmoid(x, mag){
  let y = 1/(1 + pow(x/(1-x), -mag));
  return y;
}
function convertRange(high, low, num){
    // Converts range into 0 - 1
    // Used ratios and sorta a property of similar triangles
    let range = high - low;
    return (num - low) / range;
}
function generateNewPoint(p, minRadius){
    // Generates a random point relative to the annulus of another point
    // The region of the annulus has a radius from "min_dist" to "min_dist x 2"
    let v1 = random(1000) / 1000  // A little trick to get range between 0 - 1 in decimals (In this case, given to 3 decimals)
    let v2 = random(1000) / 1000  // A little trick to get range between 0 - 1 in decimals (In this case, given to 3 decimals)

    let radius = minRadius * (1 + v1)  // Radius is between 1 - 2 times of "min_dist"
    let angle = 2 * 3.1415926535 * v2  // Random angle (0 - 2pi radians)

    // Trig to solve for new point
    let new_x = p.x + cos(angle) * radius
    let new_y = p.y + sin(angle) * radius

    return createVector(new_x, new_y);
}

function inNeighborHood(p, grid, cellSize, minRadius){
  let x = int(p.x / cellSize);
  let y = int(p.y / cellSize);
  for (let ny = y-2; ny < y + 2 + 1; ny++){
    for (let nx = x-2; nx < x + 2 + 1; nx++){
      if (nx >= 0 && nx < grid[0].length && ny >= 0 && ny < grid.length){  // Check to see if coordinate is inside the screen
        if (grid[ny][nx].length > 0){
          for (let n of grid[ny][nx]){
            let d = dist(n.x, n.y, p.x, p.y);
            if (d < minRadius){
              return true;  // There is at least one neighbor who is too close
            }
          }
        }
      }
    }
  }
  return false;  // No neighbors are too close
}

function weightedPoissonDiskSampling(img, pointGenCnt, minDist, maxDist, sigmoidMag){
  let cellSize = maxDist / sqrt(2);
  let processQueue = new Deque();
  let pointsPlaced = [];
  let gridW = int((img.width / cellSize) + 0.999999);
  let gridH = int((img.height / cellSize) + 0.999999);
  let grid = [];
  for (let i = 0; i < gridH; i++){
    let row = [];
    for (let j = 0; j < gridW; j++){
      row.push([]);
    }
    grid.push(row);
  }
    
  // Generate random point
  let startPoints = uniformPoissonDiskSampling(img, pointGenCnt, minDist);
  for (let v of startPoints){
    // Run an RNG check to see if we check the point (higher chances of using point the darker it is)
    let percent = 0.5 + (0.5 - get(int(v.x), int(v.y))[0]/255/2);
    let roll = random(0,1);
    if (roll <= percent) processQueue.pushFront(v);
    else print("Passed");
  }
  
  // Begin generating other points
  while (processQueue.length > 0){
    let p = processQueue.popFront();
    let gray = get(int(p.x), int(p.y))[0];
    let minRadius = minDist + sigmoid(gray/255, sigmoidMag) * (maxDist - minDist);
    let pointSet = [];
    let lowGray = gray - 20; 
    let highGray = gray + 20;
    for (let i = 0; i < pointGenCnt;i++){
      let newP = generateNewPoint(p, minRadius);
      let newGray = get(int(newP.x), int(newP.y))[0];
      if (newP.x > 0 && newP.x < img.width && newP.y > 0 && newP.y < img.height && inNeighborHood(newP, grid, cellSize, minRadius)==false && lowGray < newGray && newGray < highGray) {
        processQueue.pushBack(newP);
        pointsPlaced.push(newP);
        let x = int(newP.x / cellSize);
        let y = int(newP.y / cellSize);
        grid[y][x].push(newP);
      }
    }
  }
  return pointsPlaced;
}

function uniformPoissonDiskSampling(img, pointGenCnt, minDist){
  let cellSize = minDist / sqrt(2);
  let processQueue = new Deque();
  let pointsPlaced = [];
  let gridW = int((img.width / cellSize) + 0.999999);
  let gridH = int((img.height / cellSize) + 0.999999);
  let grid = [];
  for (let i = 0; i < gridH; i++){
    let row = [];
    for (let j = 0; j < gridW; j++){
      row.push([]);
    }
    grid.push(row);
  }
    
  // Generate random point
  let v = createVector(random(img.width), random(img.height));
  processQueue.pushFront(v);
  pointsPlaced.push(v);
  let x = int(v.x / cellSize);
  let y = int(v.y / cellSize);
  grid[y][x].push(v);
    
  // Begin generating other points
  while (processQueue.length > 0){
    let p = processQueue.popFront();
    let cnt = 0;
    for (let i = 0; i < pointGenCnt;i++){
      let newP = generateNewPoint(p, minDist);
      if (newP.x > 0 && newP.x < img.width && newP.y > 0 && newP.y < img.height && inNeighborHood(newP, grid, cellSize, minDist)==false){
        processQueue.pushFront(newP);
        pointsPlaced.push(newP);
        let x = int(newP.x / cellSize);
        let y = int(newP.y / cellSize);
        grid[y][x].push(newP);
      }
    }
  }
  return pointsPlaced;
}
