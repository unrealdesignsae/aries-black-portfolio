import React, { useEffect, useRef } from 'react';

declare const gsap: any;
declare const THREE: any;

export function Component() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let unmounted = false;
    let reqFrame: any = null;
    let resizeListener: any = null;
    let visibilityListener: any = null;
    let progressAnimation: any = null;
    let autoSlideTimer: any = null;

    // --- DYNAMIC SCRIPT LOADING ---
    const loadScripts = async () => {
      const loadScript = (src: string, globalName: string) => new Promise<void>((res, rej) => {
        if ((window as any)[globalName]) { res(); return; }
        if (document.querySelector(`script[src="${src}"]`)) {
          const check = setInterval(() => {
            if ((window as any)[globalName]) { clearInterval(check); res(); }
          }, 50);
          setTimeout(() => { clearInterval(check); rej(new Error(`Timeout waiting for ${globalName}`)); }, 10000);
          return;
        }
        const s = document.createElement('script');
        s.src = src;
        s.onload = () => { setTimeout(() => res(), 100); };
        s.onerror = () => rej(new Error(`Failed to load ${src}`));
        document.head.appendChild(s);
      });

      try {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js', 'gsap');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'THREE');
      } catch (e) {
        console.error('Failed to load base scripts:', e);
      }

      if (!unmounted) initApplication();
    };

    const initApplication = async () => {
      const SLIDER_CONFIG: any = {
        settings: {
          transitionDuration: 2.5, autoSlideSpeed: 12000, currentEffect: "glass", currentEffectPreset: "Default",
          globalIntensity: 1.0, speedMultiplier: 1.0, distortionStrength: 1.0, colorEnhancement: 1.0,
          glassRefractionStrength: 1.0, glassChromaticAberration: 1.0, glassBubbleClarity: 1.0, glassEdgeGlow: 1.0, glassLiquidFlow: 1.0,
          frostIntensity: 1.5, frostCrystalSize: 1.0, frostIceCoverage: 1.0, frostTemperature: 1.0, frostTexture: 1.0,
          rippleFrequency: 25.0, rippleAmplitude: 0.08, rippleWaveSpeed: 1.0, rippleRippleCount: 1.0, rippleDecay: 1.0,
          plasmaIntensity: 1.2, plasmaSpeed: 0.8, plasmaEnergyIntensity: 0.4, plasmaContrastBoost: 0.3, plasmaTurbulence: 1.0,
          timeshiftDistortion: 1.6, timeshiftBlur: 1.5, timeshiftFlow: 1.4, timeshiftChromatic: 1.5, timeshiftTurbulence: 1.4
        },
      };

      // --- GLOBAL STATE ---
      let currentSlideIndex = 0;
      let isTransitioning = false;
      let shaderMaterial: any, renderer: any, scene: any, camera: any;
      let slideTextures: any[] = [];
      let texturesLoaded = false;
      let sliderEnabled = false;

      const SLIDE_DURATION = () => SLIDER_CONFIG.settings.autoSlideSpeed;
      const PROGRESS_UPDATE_INTERVAL = 50;
      const TRANSITION_DURATION = () => SLIDER_CONFIG.settings.transitionDuration;

      const R2_CDN = 'https://pub-340c09903d0b49fea4aec85224bcb1bb.r2.dev';

      // Six hero slides sourced from Cloudflare R2 CDN
      const slides = [
        { title: "DAMAC Luxury Tower",        description: "Photorealistic high-rise architectural visualisation for DAMAC.", videoSrc: `${R2_CDN}/video_1.mp4`  },
        { title: "World Government Summit",   description: "Monumental stage design for the UAE's flagship global event.",   videoSrc: `${R2_CDN}/video_3.mp4`  },
        { title: "TAG Heuer Activation",      description: "Immersive luxury brand experience stage engineered in 3D.",      videoSrc: `${R2_CDN}/video_4.mp4`  },
        { title: "Real-Time Cityscape",       description: "Live UE5 walkthrough of a fully rendered Dubai cityscape.",       videoSrc: `${R2_CDN}/video_5.mp4`  },
        { title: "Entourage Mega-Event",      description: "Massive event stage visualization for a 10,000-seat arena.",     videoSrc: `${R2_CDN}/video_21.mp4` },
        { title: "Ministry of Transport Hub", description: "Architectural masterplan render for a major UAE transit hub.",   videoSrc: `${R2_CDN}/video_19.mp4` },
      ];

      // --- SHADERS ---
      const vertexShader = `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
      const fragmentShader = `
        uniform sampler2D uTexture1, uTexture2;
        uniform float uProgress;
        uniform vec2 uResolution, uTexture1Size, uTexture2Size;
        uniform int uEffectType;
        uniform float uGlobalIntensity, uSpeedMultiplier, uDistortionStrength, uColorEnhancement;
        uniform float uGlassRefractionStrength, uGlassChromaticAberration, uGlassBubbleClarity, uGlassEdgeGlow, uGlassLiquidFlow;
        uniform float uFrostIntensity, uFrostCrystalSize, uFrostIceCoverage, uFrostTemperature, uFrostTexture;
        uniform float uRippleFrequency, uRippleAmplitude, uRippleWaveSpeed, uRippleRippleCount, uRippleDecay;
        uniform float uPlasmaIntensity, uPlasmaSpeed, uPlasmaEnergyIntensity, uPlasmaContrastBoost, uPlasmaTurbulence;
        uniform float uTimeshiftDistortion, uTimeshiftBlur, uTimeshiftFlow, uTimeshiftChromatic, uTimeshiftTurbulence;
        varying vec2 vUv;

        vec2 getCoverUV(vec2 uv, vec2 textureSize) {
          vec2 s = uResolution / textureSize;
          float scale = max(s.x, s.y);
          vec2 scaledSize = textureSize * scale;
          vec2 offset = (uResolution - scaledSize) * 0.5;
          return (uv * uResolution - offset) / scaledSize;
        }

        vec4 glassEffect(vec2 uv, float progress) {
          float time = progress * 5.0 * uSpeedMultiplier;
          vec2 uv1 = getCoverUV(uv, uTexture1Size); vec2 uv2 = getCoverUV(uv, uTexture2Size);
          float maxR = length(uResolution) * 0.85; float br = progress * maxR;
          vec2 p = uv * uResolution; vec2 c = uResolution * 0.5;
          float d = length(p - c); float nd = d / max(br, 0.001);
          float param = smoothstep(br + 3.0, br - 3.0, d);
          vec4 img;
          if (param > 0.0) {
            float ro = 0.08 * uGlassRefractionStrength * uDistortionStrength * uGlobalIntensity * pow(smoothstep(0.3 * uGlassBubbleClarity, 1.0, nd), 1.5);
            vec2 dir = (d > 0.0) ? (p - c) / d : vec2(0.0);
            vec2 distUV = uv2 - dir * ro;
            distUV += vec2(sin(time + nd * 10.0), cos(time * 0.8 + nd * 8.0)) * 0.015 * uGlassLiquidFlow * uSpeedMultiplier * nd * param;
            float ca = 0.02 * uGlassChromaticAberration * uGlobalIntensity * pow(smoothstep(0.3, 1.0, nd), 1.2);
            img = vec4(texture2D(uTexture2, distUV + dir * ca * 1.2).r, texture2D(uTexture2, distUV + dir * ca * 0.2).g, texture2D(uTexture2, distUV - dir * ca * 0.8).b, 1.0);
            if (uGlassEdgeGlow > 0.0) {
              float rim = smoothstep(0.95, 1.0, nd) * (1.0 - smoothstep(1.0, 1.01, nd));
              img.rgb += rim * 0.08 * uGlassEdgeGlow * uGlobalIntensity;
            }
          } else { img = texture2D(uTexture2, uv2); }
          vec4 oldImg = texture2D(uTexture1, uv1);
          if (progress > 0.95) img = mix(img, texture2D(uTexture2, uv2), (progress - 0.95) / 0.05);
          return mix(oldImg, img, param);
        }
        vec4 frostEffect(vec2 uv, float progress) { return mix(texture2D(uTexture1, getCoverUV(uv, uTexture1Size)), texture2D(uTexture2, getCoverUV(uv, uTexture2Size)), progress); }
        vec4 rippleEffect(vec2 uv, float progress) { return mix(texture2D(uTexture1, getCoverUV(uv, uTexture1Size)), texture2D(uTexture2, getCoverUV(uv, uTexture2Size)), progress); }
        vec4 plasmaEffect(vec2 uv, float progress) { return mix(texture2D(uTexture1, getCoverUV(uv, uTexture1Size)), texture2D(uTexture2, getCoverUV(uv, uTexture2Size)), progress); }
        vec4 timeshiftEffect(vec2 uv, float progress) { return mix(texture2D(uTexture1, getCoverUV(uv, uTexture1Size)), texture2D(uTexture2, getCoverUV(uv, uTexture2Size)), progress); }

        void main() {
          if (uEffectType == 0) gl_FragColor = glassEffect(vUv, uProgress);
          else if (uEffectType == 1) gl_FragColor = frostEffect(vUv, uProgress);
          else if (uEffectType == 2) gl_FragColor = rippleEffect(vUv, uProgress);
          else if (uEffectType == 3) gl_FragColor = plasmaEffect(vUv, uProgress);
          else gl_FragColor = timeshiftEffect(vUv, uProgress);
        }
      `;

      // --- CORE FUNCTIONS ---
      const getEffectIndex = (n: string) => ({ glass: 0, frost: 1, ripple: 2, plasma: 3, timeshift: 4 } as any)[n] || 0;

      const updateShaderUniforms = () => {
        if (!shaderMaterial) return;
        const s = SLIDER_CONFIG.settings, u = shaderMaterial.uniforms;
        for (const key in s) {
          const uName = 'u' + key.charAt(0).toUpperCase() + key.slice(1);
          if (u[uName]) u[uName].value = s[key];
        }
        u.uEffectType.value = getEffectIndex(s.currentEffect);
      };

      const splitText = (text: string) => {
        return text.split('').map(char => `<span style="display: inline-block; opacity: 0;">${char === ' ' ? '&nbsp;' : char}</span>`).join('');
      };

      const updateContent = (idx: number) => {
        const titleEl = containerRef.current?.querySelector('#mainTitle') as HTMLElement;
        const descEl = containerRef.current?.querySelector('#mainDesc') as HTMLElement;
        if (titleEl && descEl) {
          gsap.to(titleEl.children, { y: -20, opacity: 0, duration: 0.5, stagger: 0.02, ease: "power2.in" });
          gsap.to(descEl, { y: -10, opacity: 0, duration: 0.4, ease: "power2.in" });

          setTimeout(() => {
            titleEl.innerHTML = splitText(slides[idx].title);
            descEl.textContent = slides[idx].description;

            gsap.set(titleEl.children, { opacity: 0 });
            gsap.set(descEl, { y: 20, opacity: 0 });

            const children = titleEl.children;
            switch (idx) {
              case 0:
                gsap.set(children, { y: 20 });
                gsap.to(children, { y: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: "power3.out" });
                gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
                break;
              case 1:
                gsap.set(children, { y: -20 });
                gsap.to(children, { y: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: "back.out(1.7)" });
                gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
                break;
              case 2:
                gsap.set(children, { filter: "blur(10px)", scale: 1.5, y: 0 });
                gsap.to(children, { filter: "blur(0px)", scale: 1, opacity: 1, duration: 1, stagger: { amount: 0.5, from: "random" }, ease: "power2.out" });
                gsap.to(descEl, { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power2.out" });
                break;
              case 3:
                gsap.set(children, { scale: 0, y: 0 });
                gsap.to(children, { scale: 1, opacity: 1, duration: 0.6, stagger: 0.05, ease: "back.out(1.5)" });
                gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
                break;
              case 4:
                gsap.set(children, { rotationX: 90, y: 0, transformOrigin: "50% 50%" });
                gsap.to(children, { rotationX: 0, opacity: 1, duration: 0.8, stagger: 0.04, ease: "power2.out" });
                gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power2.out" });
                break;
              case 5:
                gsap.set(children, { x: 30, y: 0 });
                gsap.to(children, { x: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: "power3.out" });
                gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
                break;
              default:
                gsap.set(children, { y: 20 });
                gsap.to(children, { y: 0, opacity: 1, duration: 0.8, stagger: 0.03, ease: "power3.out" });
                gsap.to(descEl, { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out" });
            }
          }, 500);
        }
      };

      const navigateToSlide = (targetIndex: number) => {
        if (isTransitioning || targetIndex === currentSlideIndex) return;
        stopAutoSlideTimer();
        quickResetProgress(currentSlideIndex);

        const currentTexture = slideTextures[currentSlideIndex];
        const targetTexture = slideTextures[targetIndex];
        if (!currentTexture || !targetTexture) return;

        isTransitioning = true;
        shaderMaterial.uniforms.uTexture1.value = currentTexture;
        shaderMaterial.uniforms.uTexture2.value = targetTexture;
        shaderMaterial.uniforms.uTexture1Size.value = currentTexture.userData.size;
        shaderMaterial.uniforms.uTexture2Size.value = targetTexture.userData.size;

        updateContent(targetIndex);

        currentSlideIndex = targetIndex;
        updateCounter(currentSlideIndex);
        updateNavigationState(currentSlideIndex);

        if (targetTexture?.userData?.video) {
          targetTexture.userData.video.play().catch(() => {});
        }

        gsap.fromTo(shaderMaterial.uniforms.uProgress,
          { value: 0 },
          {
            value: 1,
            duration: TRANSITION_DURATION(),
            ease: "power2.inOut",
            onComplete: () => {
              if (unmounted) return;
              shaderMaterial.uniforms.uProgress.value = 0;
              shaderMaterial.uniforms.uTexture1.value = targetTexture;
              shaderMaterial.uniforms.uTexture1Size.value = targetTexture.userData.size;
              if (currentTexture?.userData?.video && currentTexture !== targetTexture) {
                currentTexture.userData.video.pause();
              }
              isTransitioning = false;
              safeStartTimer(100);
            }
          }
        );
      };

      const handleSlideChange = () => {
        if (isTransitioning || !texturesLoaded || !sliderEnabled) return;
        navigateToSlide((currentSlideIndex + 1) % slides.length);
      };

      const createSlidesNavigation = () => {
        const nav = containerRef.current?.querySelector("#slidesNav"); if (!nav) return;
        nav.innerHTML = "";
        slides.forEach((slide, i) => {
          const item = document.createElement("div");
          item.className = `slide-nav-item${i === 0 ? " active" : ""}`;
          item.dataset.slideIndex = String(i);
          item.innerHTML = `<div class="slide-progress-line"><div class="slide-progress-fill"></div></div><div class="slide-nav-title">${slide.title}</div>`;
          item.addEventListener("click", (e) => {
            e.stopPropagation();
            if (!isTransitioning && i !== currentSlideIndex) {
              stopAutoSlideTimer();
              quickResetProgress(currentSlideIndex);
              navigateToSlide(i);
            }
          });
          nav.appendChild(item);
        });
      };

      const updateNavigationState = (idx: number) => containerRef.current?.querySelectorAll(".slide-nav-item").forEach((el, i) => el.classList.toggle("active", i === idx));
      const updateSlideProgress = (idx: number, prog: number) => { const el = containerRef.current?.querySelectorAll(".slide-nav-item")[idx]?.querySelector(".slide-progress-fill") as HTMLElement; if (el) { el.style.width = `${prog}%`; el.style.opacity = '1'; } };
      const fadeSlideProgress = (idx: number) => { const el = containerRef.current?.querySelectorAll(".slide-nav-item")[idx]?.querySelector(".slide-progress-fill") as HTMLElement; if (el) { el.style.opacity = '0'; setTimeout(() => el.style.width = "0%", 300); } };
      const quickResetProgress = (idx: number) => { const el = containerRef.current?.querySelectorAll(".slide-nav-item")[idx]?.querySelector(".slide-progress-fill") as HTMLElement; if (el) { el.style.transition = "width 0.2s ease-out"; el.style.width = "0%"; setTimeout(() => el.style.transition = "width 0.1s ease, opacity 0.3s ease", 200); } };
      const updateCounter = (idx: number) => {
        const sn = containerRef.current?.querySelector("#slideNumber"); if (sn) sn.textContent = String(idx + 1).padStart(2, "0");
        const st = containerRef.current?.querySelector("#slideTotal"); if (st) st.textContent = String(slides.length).padStart(2, "0");
      };

      const startAutoSlideTimer = () => {
        if (unmounted || !texturesLoaded || !sliderEnabled) return;
        stopAutoSlideTimer();
        let progress = 0;
        const increment = (100 / SLIDE_DURATION()) * PROGRESS_UPDATE_INTERVAL;
        progressAnimation = setInterval(() => {
          if (unmounted || !sliderEnabled) { stopAutoSlideTimer(); return; }
          progress += increment;
          updateSlideProgress(currentSlideIndex, progress);
          if (progress >= 100) {
            clearInterval(progressAnimation); progressAnimation = null;
            fadeSlideProgress(currentSlideIndex);
            if (!isTransitioning) handleSlideChange();
          }
        }, PROGRESS_UPDATE_INTERVAL);
      };
      const stopAutoSlideTimer = () => { if (progressAnimation) clearInterval(progressAnimation); if (autoSlideTimer) clearTimeout(autoSlideTimer); progressAnimation = null; autoSlideTimer = null; };
      const safeStartTimer = (delay = 0) => { stopAutoSlideTimer(); if (unmounted) return; if (sliderEnabled && texturesLoaded) { if (delay > 0) autoSlideTimer = setTimeout(startAutoSlideTimer, delay); else startAutoSlideTimer(); } };

      // Creates an autoplaying THREE.VideoTexture
      const loadVideoTexture = (videoSrc: string) => new Promise<any>((resolve, reject) => {
        const vid = document.createElement('video');
        vid.src = videoSrc;
        vid.muted = true;
        vid.loop = true;
        vid.crossOrigin = 'anonymous';
        vid.playsInline = true;

        vid.addEventListener('loadedmetadata', () => {
          const seekTarget = Math.min(5, Math.max(0, vid.duration - 0.1));
          if (!isNaN(seekTarget)) vid.currentTime = seekTarget;
        }, { once: true });

        const onCanPlay = () => {
          if (vid.dataset.resolved) return;
          vid.dataset.resolved = "true";
          
          const tex = new THREE.VideoTexture(vid);
          tex.minFilter = tex.magFilter = THREE.LinearFilter;
          tex.userData = { video: vid, size: new THREE.Vector2(vid.videoWidth || 1920, vid.videoHeight || 1080) };
          resolve(tex);
        };

        vid.addEventListener('canplay', onCanPlay);
        vid.addEventListener('error', () => reject(new Error(`Video load error: ${videoSrc}`)), { once: true });
        vid.load();
      });

      const initRenderer = async () => {
        const canvas = containerRef.current?.querySelector(".webgl-canvas") as HTMLCanvasElement; if (!canvas) return;
        scene = new THREE.Scene(); camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
        renderer.setSize(window.innerWidth, window.innerHeight); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        shaderMaterial = new THREE.ShaderMaterial({
          uniforms: {
            uTexture1: { value: null }, uTexture2: { value: null }, uProgress: { value: 0 },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uTexture1Size: { value: new THREE.Vector2(1, 1) }, uTexture2Size: { value: new THREE.Vector2(1, 1) },
            uEffectType: { value: 0 },
            uGlobalIntensity: { value: 1.0 }, uSpeedMultiplier: { value: 1.0 }, uDistortionStrength: { value: 1.0 }, uColorEnhancement: { value: 1.0 },
            uGlassRefractionStrength: { value: 1.0 }, uGlassChromaticAberration: { value: 1.0 }, uGlassBubbleClarity: { value: 1.0 }, uGlassEdgeGlow: { value: 1.0 }, uGlassLiquidFlow: { value: 1.0 },
            uFrostIntensity: { value: 1.0 }, uFrostCrystalSize: { value: 1.0 }, uFrostIceCoverage: { value: 1.0 }, uFrostTemperature: { value: 1.0 }, uFrostTexture: { value: 1.0 },
            uRippleFrequency: { value: 25.0 }, uRippleAmplitude: { value: 0.08 }, uRippleWaveSpeed: { value: 1.0 }, uRippleRippleCount: { value: 1.0 }, uRippleDecay: { value: 1.0 },
            uPlasmaIntensity: { value: 1.2 }, uPlasmaSpeed: { value: 0.8 }, uPlasmaEnergyIntensity: { value: 0.4 }, uPlasmaContrastBoost: { value: 0.3 }, uPlasmaTurbulence: { value: 1.0 },
            uTimeshiftDistortion: { value: 1.6 }, uTimeshiftBlur: { value: 1.5 }, uTimeshiftFlow: { value: 1.4 }, uTimeshiftChromatic: { value: 1.5 }, uTimeshiftTurbulence: { value: 1.4 }
          },
          vertexShader, fragmentShader
        });
        scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), shaderMaterial));

        for (const s of slides) { try { slideTextures.push(await loadVideoTexture(s.videoSrc)); } catch (err) { console.warn('Failed video texture', err); } }
        if (slideTextures.length >= 2) {
          shaderMaterial.uniforms.uTexture1.value = slideTextures[0];
          shaderMaterial.uniforms.uTexture2.value = slideTextures[1];
          shaderMaterial.uniforms.uTexture1Size.value = slideTextures[0].userData.size;
          shaderMaterial.uniforms.uTexture2Size.value = slideTextures[1].userData.size;
          
          if (slideTextures[0].userData?.video) slideTextures[0].userData.video.play().catch(()=>{});

          texturesLoaded = true; sliderEnabled = true;
          updateShaderUniforms();
          document.querySelector(".slider-wrapper")?.classList.add("loaded");
          safeStartTimer(500);
        }

        const render = () => { if (unmounted) return; reqFrame = requestAnimationFrame(render); renderer.render(scene, camera); };
        render();
      };

      createSlidesNavigation(); updateCounter(0);

      const tEl = containerRef.current?.querySelector('#mainTitle');
      const dEl = containerRef.current?.querySelector('#mainDesc');
      if (tEl && dEl) {
        tEl.innerHTML = splitText(slides[0].title);
        dEl.textContent = slides[0].description;
        gsap.fromTo(tEl.children, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.03, ease: "power3.out", delay: 0.5 });
        gsap.fromTo(dEl, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.8 });
      }

      initRenderer();

      visibilityListener = () => document.hidden ? stopAutoSlideTimer() : (!isTransitioning && safeStartTimer());
      resizeListener = () => { if (renderer) { renderer.setSize(window.innerWidth, window.innerHeight); shaderMaterial.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight); } };

      document.addEventListener("visibilitychange", visibilityListener);
      window.addEventListener("resize", resizeListener);
    };

    loadScripts();
    
    return () => {
      unmounted = true;
      if (reqFrame) cancelAnimationFrame(reqFrame);
      if (progressAnimation) clearInterval(progressAnimation);
      if (autoSlideTimer) clearTimeout(autoSlideTimer);
      if (visibilityListener) document.removeEventListener("visibilitychange", visibilityListener);
      if (resizeListener) window.removeEventListener("resize", resizeListener);
    };
  }, []);

  return (
    <main className="slider-wrapper" ref={containerRef}>
      <canvas className="webgl-canvas"></canvas>
      <span className="slide-number" id="slideNumber">01</span>
      <span className="slide-total" id="slideTotal">06</span>

      <div className="slide-content">
        <h1 className="slide-title" id="mainTitle"></h1>
        <p className="slide-description" id="mainDesc"></p>
      </div>

      <nav className="slides-navigation" id="slidesNav"></nav>
    </main>
  );
}

// Named export alias for backward compatibility with App.tsx
export const LuminaSlider = Component;
