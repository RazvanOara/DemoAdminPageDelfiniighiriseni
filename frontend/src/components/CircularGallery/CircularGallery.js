import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { useEffect, useRef } from 'react';
import './CircularGallery.css';

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

function createTextTexture(gl, text, font = 'bold 24px Figtree', color = '#00d4ff') {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  context.font = font;
  const metrics = context.measureText(text);
  const textWidth = Math.ceil(metrics.width);
  const textHeight = Math.ceil(parseInt(font, 10) * 1.4);
  canvas.width = textWidth + 40;
  canvas.height = textHeight + 20;
  context.font = font;
  context.fillStyle = color;
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.clearRect(0, 0, canvas.width, canvas.height);
  
  // Add shadow for better visibility
  context.shadowColor = 'rgba(0, 0, 0, 0.8)';
  context.shadowBlur = 8;
  context.shadowOffsetX = 2;
  context.shadowOffsetY = 2;
  
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

class Media {
  constructor({
    geometry,
    gl,
    image,
    index,
    length,
    renderer,
    scene,
    screen,
    text,
    viewport,
    textColor,
    borderRadius,
    font
  }) {
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.text = text;
    this.viewport = viewport;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.font = font;
    this.extra = 0;
    this.opacity = 1;
    
    this.createShader();
    this.createMesh();
    if (this.text) {
      this.createTitle();
    }
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, {
      generateMipmaps: true
    });

    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uScale;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position * uScale;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMap;
        uniform float uBorderRadius;
        uniform float uOpacity;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b + r;
          return length(max(d, vec2(0.0))) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          vec4 color = texture2D(tMap, uv);
          
          vec2 center = vUv - 0.5;
          float dist = roundedBoxSDF(center, vec2(0.5 - uBorderRadius), uBorderRadius);
          float alpha = 1.0 - smoothstep(-0.005, 0.005, dist);
          
          gl_FragColor = vec4(color.rgb, color.a * alpha * uOpacity);
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uBorderRadius: { value: this.borderRadius },
        uOpacity: { value: 1 },
        uScale: { value: 1 }
      },
      transparent: true
    });

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    });
    this.plane.setParent(this.scene);
  }

  createTitle() {
    const { texture, width, height } = createTextTexture(this.gl, this.text, this.font, this.textColor);
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        uniform float uOpacity;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tMap, vUv);
          if (color.a < 0.01) discard;
          gl_FragColor = vec4(color.rgb, color.a * uOpacity);
        }
      `,
      uniforms: { 
        tMap: { value: texture },
        uOpacity: { value: 1 }
      },
      transparent: true
    });
    
    this.titleMesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeight = this.plane.scale.y * 0.08;
    const textWidth = textHeight * aspect;
    this.titleMesh.scale.set(textWidth, textHeight, 1);
    this.titleMesh.position.y = -this.plane.scale.y * 0.5 - textHeight * 0.8;
    this.titleMesh.position.z = 0.1;
    this.titleMesh.setParent(this.plane);
  }

  update(scroll, direction) {
    // Position calculation
    this.plane.position.x = this.x - scroll.current - this.extra;
    
    // Calculate distance from center
    const distanceFromCenter = Math.abs(this.plane.position.x);
    const viewportHalf = this.viewport.width / 2;
    
    // Scale based on distance (focused image is larger)
    const maxScale = 1.0;
    const minScale = 0.7;
    const scaleRange = viewportHalf * 0.8;
    const scale = maxScale - (distanceFromCenter / scaleRange) * (maxScale - minScale);
    this.program.uniforms.uScale.value = Math.max(minScale, Math.min(maxScale, scale));
    
    // Opacity based on distance
    const opacityRange = viewportHalf * 1.2;
    const opacity = 1.0 - Math.pow(distanceFromCenter / opacityRange, 2) * 0.5;
    this.program.uniforms.uOpacity.value = Math.max(0.3, Math.min(1, opacity));
    
    // Update title opacity if exists
    if (this.titleMesh) {
      this.titleMesh.program.uniforms.uOpacity.value = this.program.uniforms.uOpacity.value;
    }
    
    // Z-index based on distance (closer items on top)
    this.plane.position.z = -distanceFromCenter * 0.001;
    
    // Slight rotation for depth effect
    this.plane.rotation.y = -this.plane.position.x * 0.0003;
    
    // Handle wrapping
    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset - this.width;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset + this.width;
    
    if (direction === 'right' && this.isBefore) {
      this.extra -= this.widthTotal;
    }
    if (direction === 'left' && this.isAfter) {
      this.extra += this.widthTotal;
    }
  }

  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) this.viewport = viewport;
    
    // Calculate responsive sizing
    const isMobile = this.screen.width < 768;
    const isTablet = this.screen.width < 1024;
    
    // Adjust image size based on screen size
    let sizeMultiplier = 1.0;
    if (isMobile) {
      sizeMultiplier = 0.85;
    } else if (isTablet) {
      sizeMultiplier = 0.9;
    }
    
    // Make images take up most of viewport
    this.plane.scale.y = this.viewport.height * 0.7 * sizeMultiplier;
    this.plane.scale.x = this.plane.scale.y * 0.8; // Aspect ratio
    
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    
    // Spacing between images (negative for overlap)
    this.padding = isMobile ? -this.plane.scale.x * 0.3 : -this.plane.scale.x * 0.2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class App {
  constructor(
    container,
    {
      items,
      textColor = '#00d4ff',
      borderRadius = 0.08,
      font = 'bold 24px Figtree',
      scrollSpeed = 1.5,
      scrollEase = 0.08
    } = {}
  ) {
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.scroll = { 
      ease: scrollEase, 
      current: 0, 
      target: 0, 
      last: 0 
    };
    this.isDown = false;
    
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, textColor, borderRadius, font);
    this.update();
    this.addEventListeners();
    
    // Start with first image centered
    this.scroll.current = 0;
    this.scroll.target = 0;
  }

  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }

  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 5;
  }

  createScene() {
    this.scene = new Transform();
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 20,
      widthSegments: 20
    });
  }

  createMedias(items, textColor, borderRadius, font) {
    const defaultItems = [
      { image: `https://picsum.photos/seed/1/1200/800`, text: 'Sample 1' },
      { image: `https://picsum.photos/seed/2/1200/800`, text: 'Sample 2' },
      { image: `https://picsum.photos/seed/3/1200/800`, text: 'Sample 3' }
    ];
    
    const galleryItems = items && items.length ? items : defaultItems;
    
    // Only duplicate once for smooth infinite scroll
    this.mediasImages = [...galleryItems, ...galleryItems];
    
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        text: data.text,
        viewport: this.viewport,
        textColor,
        borderRadius,
        font
      });
    });
  }

  onTouchDown(e) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = e.touches ? e.touches[0].clientX : e.clientX;
  }

  onTouchMove(e) {
    if (!this.isDown) return;
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const distance = (this.start - x) * 0.003 * this.scrollSpeed;
    this.scroll.target = this.scroll.position + distance;
  }

  onTouchUp() {
    this.isDown = false;
    this.snapToImage();
  }

  onWheel(e) {
    e.preventDefault();
    const normalized = e.deltaY > 0 ? 1 : -1;
    this.scroll.target += normalized * this.scrollSpeed * 0.05;
    clearTimeout(this.wheelTimeout);
    this.wheelTimeout = setTimeout(() => this.snapToImage(), 100);
  }

  snapToImage() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(this.scroll.target / width);
    this.scroll.target = width * itemIndex;
  }

  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight
    };
    
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height
    });
    
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    
    if (this.medias) {
      this.medias.forEach(media => 
        media.onResize({ screen: this.screen, viewport: this.viewport })
      );
    }
  }

  update() {
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    
    if (this.medias && this.medias[0]) {
      const direction = this.scroll.current > this.scroll.last ? 'right' : 'left';
      this.medias.forEach(media => media.update(this.scroll, direction));
    }
    
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }

  addEventListeners() {
    this.onResizeBound = this.onResize.bind(this);
    this.onWheelBound = this.onWheel.bind(this);
    this.onTouchDownBound = this.onTouchDown.bind(this);
    this.onTouchMoveBound = this.onTouchMove.bind(this);
    this.onTouchUpBound = this.onTouchUp.bind(this);
    
    window.addEventListener('resize', this.onResizeBound);
    this.container.addEventListener('wheel', this.onWheelBound, { passive: false });
    this.container.addEventListener('mousedown', this.onTouchDownBound);
    window.addEventListener('mousemove', this.onTouchMoveBound);
    window.addEventListener('mouseup', this.onTouchUpBound);
    this.container.addEventListener('touchstart', this.onTouchDownBound, { passive: true });
    window.addEventListener('touchmove', this.onTouchMoveBound, { passive: true });
    window.addEventListener('touchend', this.onTouchUpBound);
  }

  destroy() {
    window.cancelAnimationFrame(this.raf);
    clearTimeout(this.wheelTimeout);
    
    window.removeEventListener('resize', this.onResizeBound);
    this.container.removeEventListener('wheel', this.onWheelBound);
    this.container.removeEventListener('mousedown', this.onTouchDownBound);
    window.removeEventListener('mousemove', this.onTouchMoveBound);
    window.removeEventListener('mouseup', this.onTouchUpBound);
    this.container.removeEventListener('touchstart', this.onTouchDownBound);
    window.removeEventListener('touchmove', this.onTouchMoveBound);
    window.removeEventListener('touchend', this.onTouchUpBound);
    
    if (this.gl && this.gl.canvas && this.gl.canvas.parentNode) {
      this.gl.canvas.parentNode.removeChild(this.gl.canvas);
    }
  }
}

export default function CircularGallery({
  items,
  textColor = '#00d4ff',
  borderRadius = 0.08,
  font = 'bold 24px Figtree',
  scrollSpeed = 1.5,
  scrollEase = 0.08
}) {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    const app = new App(containerRef.current, { 
      items, 
      textColor, 
      borderRadius, 
      font, 
      scrollSpeed, 
      scrollEase 
    });
    
    return () => {
      app.destroy();
    };
  }, [items, textColor, borderRadius, font, scrollSpeed, scrollEase]);
  
  return <div className="circular-gallery" ref={containerRef} />;
}