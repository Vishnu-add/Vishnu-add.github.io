// Small WebGL scenes for the "core capabilities" tiles — decorative, degrades silently without three.js/WebGL.
(function(){
  if(typeof THREE === 'undefined') return;
  var canvases = document.querySelectorAll('.cap-canvas');
  if(!canvases.length) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var paused = false;
  document.addEventListener('visibilitychange', function(){ paused = document.hidden; });

  // Mid-tone, fairly saturated colors read reasonably against both a dark
  // navy background and a light cream one, so these aren't theme-switched.
  var ACCENT = 0xE0932E, TEAL = 0x2BC7A8, LIGHT = 0x8A93AD;
  var scenes = [];

  canvases.forEach(function(canvas){
    var kind = canvas.getAttribute('data-scene');
    var renderer;
    try{ renderer = new THREE.WebGLRenderer({canvas:canvas, alpha:true, antialias:true}); }
    catch(e){ return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
    camera.position.z = 5;
    var group = new THREE.Group();
    scene.add(group);
    var update = null;

    if(kind === 'engineering'){
      // A complex interlocking structure (the "systems" of AI engineering)
      // with small satellite services orbiting it — deployed, connected pieces.
      var knot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.78, 0.16, 110, 10, 2, 3),
        new THREE.MeshBasicMaterial({color:ACCENT, wireframe:true, transparent:true, opacity:0.6})
      );
      group.add(knot);

      var sats = [];
      var satGeo = new THREE.BoxGeometry(0.16, 0.16, 0.16);
      var satMat = new THREE.MeshBasicMaterial({color:TEAL, wireframe:true});
      for(var i=0;i<3;i++){
        var sat = new THREE.Mesh(satGeo, satMat);
        group.add(sat);
        sats.push({mesh:sat, radius:1.5 + i*0.25, speed:0.5 + i*0.18, phase:i*2.1, tilt:0.3*i});
      }

      update = function(t){
        knot.rotation.x = t * 0.25;
        knot.rotation.y = t * 0.35;
        sats.forEach(function(s){
          var a = t * s.speed + s.phase;
          s.mesh.position.set(Math.cos(a) * s.radius, Math.sin(a * 0.7) * 0.5, Math.sin(a) * s.radius);
          s.mesh.rotation.x = a; s.mesh.rotation.y = a;
        });
        group.rotation.y = Math.sin(t * 0.15) * 0.2;
      };

    } else if(kind === 'neural'){
      // A layered feed-forward network — input, hidden, output — with full
      // connections between adjacent layers and a pulse of "activation".
      var layerSizes = [4, 5, 3];
      var layerX = [-1.05, 0, 1.05];
      var nodeGeo = new THREE.SphereGeometry(0.09, 12, 12);
      var layers = [];

      layerSizes.forEach(function(count, li){
        var nodes = [];
        for(var j=0;j<count;j++){
          var y = (j - (count-1)/2) * 0.42;
          var mat = new THREE.MeshBasicMaterial({color: li === 1 ? TEAL : ACCENT});
          var node = new THREE.Mesh(nodeGeo, mat);
          node.position.set(layerX[li], y, 0);
          group.add(node);
          nodes.push({mesh:node, mat:mat, baseColor: li === 1 ? TEAL : ACCENT});
        }
        layers.push(nodes);
      });

      // Full bipartite connections between adjacent layers, drawn once.
      var verts = [];
      for(var li=0; li<layers.length-1; li++){
        layers[li].forEach(function(a){
          layers[li+1].forEach(function(b){
            verts.push(a.mesh.position.x, a.mesh.position.y, a.mesh.position.z,
                       b.mesh.position.x, b.mesh.position.y, b.mesh.position.z);
          });
        });
      }
      var lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
      var lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({color:LIGHT, transparent:true, opacity:0.28}));
      group.add(lines);

      var allNodes = layers[0].concat(layers[1], layers[2]);
      update = function(t){
        allNodes.forEach(function(n, i){
          var pulse = 0.6 + Math.abs(Math.sin(t * 1.6 - i * 0.35)) * 0.6;
          n.mesh.scale.setScalar(pulse);
        });
        group.rotation.y = Math.sin(t * 0.25) * 0.35;
        group.rotation.x = Math.sin(t * 0.15) * 0.08;
      };

    } else if(kind === 'rag'){
      // A generator at the center, retrieving from documents orbiting it —
      // the retrieval channel to each doc is drawn as a connecting line.
      var core = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.42, 0),
        new THREE.MeshBasicMaterial({color:ACCENT, wireframe:true})
      );
      group.add(core);

      var docs = [], docCount = 4;
      var docGeo = new THREE.PlaneGeometry(0.5, 0.66);
      for(var d=0; d<docCount; d++){
        var docMat = new THREE.MeshBasicMaterial({color:TEAL, wireframe:true, side:THREE.DoubleSide});
        var doc = new THREE.Mesh(docGeo, docMat);
        group.add(doc);
        var lineGeom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0)]);
        var line = new THREE.Line(lineGeom, new THREE.LineBasicMaterial({color:LIGHT, transparent:true, opacity:0.4}));
        group.add(line);
        docs.push({mesh:doc, line:line, lineGeom:lineGeom, angle: (d / docCount) * Math.PI * 2, radius:1.3 + (d % 2) * 0.15});
      }

      update = function(t){
        core.rotation.x = t * 0.4; core.rotation.y = t * 0.5;
        var pulse = 1 + Math.sin(t * 2) * 0.08;
        core.scale.setScalar(pulse);
        docs.forEach(function(doc, i){
          var a = doc.angle + t * 0.35;
          var x = Math.cos(a) * doc.radius, z = Math.sin(a) * doc.radius, y = Math.sin(t * 0.8 + i) * 0.2;
          doc.mesh.position.set(x, y, z);
          doc.mesh.lookAt(0, 0, 0);
          var pos = doc.lineGeom.attributes.position;
          pos.setXYZ(0, 0, 0, 0);
          pos.setXYZ(1, x, y, z);
          pos.needsUpdate = true;
        });
        group.rotation.y = Math.sin(t * 0.12) * 0.15;
      };

    } else if(kind === 'voice'){
      var bars = [], barCount = 7;
      var mat1 = new THREE.MeshBasicMaterial({color:TEAL});
      var mat2 = new THREE.MeshBasicMaterial({color:ACCENT});
      for(var v=0;v<barCount;v++){
        var bar = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1, 0.22), v % 2 ? mat2 : mat1);
        bar.position.x = (v - (barCount-1)/2) * 0.34;
        group.add(bar);
        bars.push(bar);
      }
      update = function(t){
        bars.forEach(function(bar, i){
          bar.scale.y = 0.4 + Math.abs(Math.sin(t*2 + i*0.6)) * 1.1;
        });
        group.rotation.y = Math.sin(t * 0.3) * 0.3;
      };
    }

    function resize(){
      var w = canvas.clientWidth, h = canvas.clientHeight;
      if(!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();

    if(reduced){
      renderer.render(scene, camera);
      return;
    }
    scenes.push({renderer:renderer, scene:scene, camera:camera, update:update});
  });

  if(!scenes.length) return;
  var clock = 0;
  function animate(){
    requestAnimationFrame(animate);
    if(paused) return;
    clock += 0.016;
    scenes.forEach(function(s){
      if(s.update) s.update(clock);
      s.renderer.render(s.scene, s.camera);
    });
  }
  animate();
})();
