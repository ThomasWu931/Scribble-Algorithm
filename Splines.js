function splineChain(points){
  // Combine several catmull rom splines
  fill(200, 0, 0, 75) // Darker sections are more opaque and less transparent
  for (let i = 0; i < points.length - 3; i++){
    createSpline(points[i], points[i + 1], points[i + 2], points[i + 3]);
  }
}

function createSpline(p0, p1, p2, p3){
  // Standard implmention of catumul rom splines
  // Given 4 control points, create a curve between p1 and p2
  let t0 = 0;
  let t1 = t0 + pow(sqrt(pow(p0.x - p1.x, 2) + pow(p0.y - p1.y, 2)),1);
  let t2 = t1 + pow(sqrt(pow(p1.x - p2.x, 2) + pow(p1.y - p2.y, 2)),1);
  let t3 = t2 + pow(sqrt(pow(p2.x - p3.x, 2) + pow(p2.y - p3.y, 2)),1);
  
  let a1; let a2; let a3; let b1; let b2; let c;
  for (let t = t1; t < t2; t++){
    a1 = p5.Vector.add(p5.Vector.mult(p0,((t1 - t)/(t1 - t0))),p5.Vector.mult(p1,((t - t0)/(t1 - t0))));
    a2 = p5.Vector.add(p5.Vector.mult(p1,((t2 - t)/(t2 - t1))),p5.Vector.mult(p2,((t - t1)/(t2 - t1))));
    a3 = p5.Vector.add(p5.Vector.mult(p2,((t3 - t)/(t3 - t2))),p5.Vector.mult(p3,((t - t2)/(t3 - t2))));

    b1 = p5.Vector.add(p5.Vector.mult(a1,((t2 - t)/(t2 - t0))),p5.Vector.mult(a2,((t - t0)/(t2 - t0))));
    b2 = p5.Vector.add(p5.Vector.mult(a2,((t3 - t)/(t3 - t1))),p5.Vector.mult(a3,((t - t1)/(t3 - t1))));
    c  = p5.Vector.add(p5.Vector.mult(b1,((t2 - t)/(t2 - t1))),p5.Vector.mult(b2,((t - t1)/(t2 - t1))));  
    circle(c.x, c.y, 1)
  }
  
}
