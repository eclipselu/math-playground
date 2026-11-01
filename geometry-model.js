(function (root) {
  'use strict';
  const bases = {
    triangle: { name: 'Triangle', adjective: 'Triangular', sides: 3 },
    square: { name: 'Square', adjective: 'Square-based', sides: 4 },
    rectangle: { name: 'Rectangle', adjective: 'Rectangular-based', sides: 4 },
    pentagon: { name: 'Pentagon', adjective: 'Pentagonal', sides: 5 },
    hexagon: { name: 'Hexagon', adjective: 'Hexagonal', sides: 6 }
  };
  const subtract = (a, b) => a.map((v, i) => v - b[i]);
  const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
  const cross = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
  const average = points => [0,1,2].map(i => points.reduce((s, p) => s + p[i], 0) / points.length);
  function build(family, base) {
    if (!['prism', 'pyramid'].includes(family) || !bases[base]) throw new Error('Unknown solid');
    const n = bases[base].sides;
    const ring = base === 'rectangle' ? [[-1.35, -0.8], [1.35, -0.8], [1.35, 0.8], [-1.35, 0.8]] :
      base === 'square' ? [[-1,-1], [1,-1], [1,1], [-1,1]] :
      Array.from({length:n}, (_,i) => [1.3*Math.cos(2*Math.PI*i/n-Math.PI/2), 1.3*Math.sin(2*Math.PI*i/n-Math.PI/2)]);
    const vertices = ring.map(([x,z]) => [x,-1,z]);
    if (family === 'prism') vertices.push(...ring.map(([x,z]) => [x,1,z]));
    else vertices.push([0,1.4,0]);
    const faces = [{ indices:Array.from({length:n}, (_,i) => i), base:true, label:'Bottom base' }];
    if (family === 'prism') faces.push({ indices:Array.from({length:n}, (_,i) => n+i), base:true, label:'Matching top base' });
    for (let i=0;i<n;i++) faces.push({indices:family === 'prism' ? [i,(i+1)%n,(i+1)%n+n,i+n] : [i,(i+1)%n,n],base:false,label:(family === 'prism' ? 'Rectangle side ' : 'Triangle side ') + (i+1)});
    const center = average(vertices);
    faces.forEach((face,i) => {
      const points = face.indices.map(index => vertices[index]);
      face.center = average(points);
      let normal = cross(subtract(points[1],points[0]),subtract(points[2],points[0]));
      if (dot(normal,subtract(face.center,center)) < 0) { face.indices.reverse(); normal = normal.map(v => -v); }
      const length = Math.sqrt(dot(normal,normal));
      face.normal = normal.map(v => v/length); face.id = i;
    });
    const edges = [], map = new Map();
    faces.forEach(face => face.indices.forEach((a,i) => {
      const b = face.indices[(i+1)%face.indices.length], key = [a,b].sort((x,y)=>x-y).join('-');
      if (!map.has(key)) { const edge = {a,b,faces:[],id:edges.length}; map.set(key,edge); edges.push(edge); }
      map.get(key).faces.push(face.id);
    }));
    edges.forEach(edge => {
      const onBottom = edge.a < n && edge.b < n;
      const onTop = family === 'prism' && edge.a >= n && edge.b >= n;
      edge.group = onBottom ? 'Bottom base' : onTop ? 'Top base' : family === 'prism' ? 'Joining edge' : 'Edge to tip';
    });
    return { family, base, n, vertices, faces, edges, name:bases[base].adjective + ' ' + family };
  }
  function rotate(point, yaw, tilt) {
    const [x,y,z] = point, cy=Math.cos(yaw), sy=Math.sin(yaw), ct=Math.cos(tilt), st=Math.sin(tilt);
    const xx=x*cy+z*sy, zz=-x*sy+z*cy;
    return [xx,y*ct-zz*st,y*st+zz*ct];
  }
  root.GeometryModel = { bases, build, rotate, average };
})(typeof window === 'undefined' ? globalThis : window);
