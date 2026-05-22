// Theme Initialization
const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme === 'acoustic') {
  document.documentElement.setAttribute('data-theme', 'acoustic');
}

document.addEventListener('DOMContentLoaded', () => {
  
  // --- 1. Custom Mouse Cursor ---
  const cursor = document.getElementById('custom-cursor');
  const cursorFollower = document.getElementById('custom-cursor-follower');
  
  if (window.matchMedia("(pointer: fine)").matches && cursor && cursorFollower) {
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      
      setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
      }, 50);
    });

    const hoverElements = document.querySelectorAll('a, button, .gallery-item, .video-placeholder, .bg-card, .ref-card');
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        cursorFollower.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        cursorFollower.classList.remove('hover');
      });
    });
  } else if (cursor && cursorFollower) {
    cursor.style.display = 'none';
    cursorFollower.style.display = 'none';
  }

  // --- 1.5 Tilt & Spotlight Effect for Cards ---
  const cards = document.querySelectorAll('.bg-card, .about-info-card, .ref-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Spotlight coordinates
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // --- 1.8 Hero Magic Particles ---
  const particlesContainer = document.getElementById('hero-particles');
  if (particlesContainer) {
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      particlesContainer.appendChild(particle);
    }
  }

  // --- 2. Scroll Progress Bar ---
  const progressBar = document.getElementById('scroll-progress-bar');
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });

  // --- 3. Navigation Scroll Effect & Active States ---
  const nav = document.getElementById('nav');
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Navbar background
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  });

  // --- 4. Mobile Menu Toggle ---
  const hamburger = document.getElementById('nav-hamburger');
  const navLinksContainer = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinksContainer.classList.remove('active');
    });
  });

  // --- 5. Scroll Reveal Animations (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal-item, .reveal-from-left, .reveal-from-right, .section');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Trigger skill bar animation if it's the background section
        if (entry.target.classList.contains('bg-column') || entry.target.querySelector('.skill-bar-fill')) {
          const fills = entry.target.querySelectorAll('.skill-bar-fill');
          fills.forEach(fill => {
            const level = fill.parentElement.getAttribute('data-level');
            fill.style.width = level + '%';
          });
        }
        
        // Optional: unobserve if you only want it to animate once
        // observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- 6. Parallax Effects ---
  const heroGuitar = document.getElementById('hero-guitar-bg');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    // Move guitar down slightly as user scrolls
    if (heroGuitar) {
      heroGuitar.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
  });

  // --- 7. Hero Audio Wave Canvas (Visual effect) ---
  const canvas = document.getElementById('wave-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = 300;
    }

    window.addEventListener('resize', resize);
    resize();

    let time = 0;
    function draw() {
      ctx.clearRect(0, 0, width, height);
      
      // Draw a gentle wave
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      
      for (let i = 0; i < width; i++) {
        // Complex wave combining sine waves for a musical feel
        const y = height/2 
                + Math.sin(i * 0.01 + time) * 20 
                + Math.sin(i * 0.02 - time * 1.5) * 15
                + Math.sin(i * 0.005 + time * 0.5) * 30;
        ctx.lineTo(i, y);
      }
      
      ctx.strokeStyle = 'rgba(245, 200, 66, 0.2)'; // Gold accent
      ctx.lineWidth = 2;
      ctx.stroke();

      time += 0.02;
      requestAnimationFrame(draw);
    }
    
    draw();
  }

  // --- 8. Lightbox for Gallery ---
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('.gallery-caption').textContent;
      
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxCaption.textContent = caption;
      
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
  });

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  });

  // --- 9. Preloader Logic ---
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add('hidden');
      }, 1500); // 1.5s minimum load time for cinematic effect
    }
  });

  // --- 10. Harmonic Card Hover Sound (Web Audio API + 2s cooldown per card) ---
  const cardCooldowns = new Map();
  let audioCtx = null;

  function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function playHarmonicChord(ctx) {
    // E major chord: E4, G#4, B4 — warm and musical
    const freqs = [329.63, 415.30, 493.88];
    const now = ctx.currentTime;
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2000;
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.5);
    });
  }

  const hoverAudioElements = document.querySelectorAll('.bg-card, .about-info-card, .ref-card, .gallery-item');
  hoverAudioElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      const now = Date.now();
      const lastPlayed = cardCooldowns.get(el) || 0;
      if (now - lastPlayed > 2000) {
        cardCooldowns.set(el, now);
        try { playHarmonicChord(getAudioCtx()); } catch(e) {}
      }
    });
  });

  // --- 11. Theme Toggle Logic ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if (currentTheme === 'acoustic') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('portfolio-theme', 'electric');
      } else {
        document.documentElement.setAttribute('data-theme', 'acoustic');
        localStorage.setItem('portfolio-theme', 'acoustic');
      }
    });
  }

  // --- 12. Mini Music Player ---
  const playlist = [
    { title: 'Lofi Chill',         src: 'nastelbom-lofi-chill-372954.mp3' },
    { title: 'Jazz Café',          src: 'waveloom-jazz-cafe-516774.mp3' },
    { title: 'Jazz No Copyright',  src: 'waveloom-music-no-copyright-jazz-516761.mp3' },
    { title: 'Jazz Elegant',       src: 'waveloom-no-copyright-jazz-elegant-525518.mp3' },
  ];

  const ambientAudio  = document.getElementById('ambient-audio');
  const mpPlay        = document.getElementById('mp-play');
  const mpPrev        = document.getElementById('mp-prev');
  const mpNext        = document.getElementById('mp-next');
  const mpTitle       = document.getElementById('mp-title');
  const mpVolume      = document.getElementById('mp-volume');

  let currentTrack  = 0;
  let userVolume    = 0.4;   // volume saved by user
  let ducked        = false; // true while a YT video is playing

  function loadTrack(index, autoplay = false) {
    currentTrack = (index + playlist.length) % playlist.length;
    ambientAudio.src = playlist[currentTrack].src;
    ambientAudio.loop = true;
    mpTitle.textContent = playlist[currentTrack].title;
    if (autoplay) {
      ambientAudio.play().catch(() => {});
      mpPlay.classList.add('playing');
      mpPlay.textContent = '⏸';
    }
  }

  function setVolume(v) {
    userVolume = v;
    ambientAudio.volume = ducked ? 0 : v;
    if (mpVolume) mpVolume.value = v;
  }

  // Init first track without playing
  loadTrack(0, false);
  ambientAudio.volume = userVolume;

  if (mpPlay) {
    mpPlay.addEventListener('click', () => {
      if (ambientAudio.paused) {
        ambientAudio.play().catch(() => {});
        mpPlay.classList.add('playing');
        mpPlay.textContent = '⏸';
      } else {
        ambientAudio.pause();
        mpPlay.classList.remove('playing');
        mpPlay.textContent = '▶';
      }
    });
  }

  if (mpPrev) mpPrev.addEventListener('click', () => loadTrack(currentTrack - 1, !ambientAudio.paused));
  if (mpNext) mpNext.addEventListener('click', () => loadTrack(currentTrack + 1, !ambientAudio.paused));

  // Auto-advance to next track when one ends
  ambientAudio.addEventListener('ended', () => loadTrack(currentTrack + 1, true));

  // Volume slider
  if (mpVolume) {
    mpVolume.addEventListener('input', () => setVolume(parseFloat(mpVolume.value)));
  }

  // --- YouTube iframe duck logic (pause/mute ambient when YT plays) ---
  const ytIframes = document.querySelectorAll('iframe[src*="youtube.com/embed"]');
  const players = [];
  let fadeInterval = null;

  // Add enablejsapi=1 to each iframe src so we can register to YT Events
  ytIframes.forEach(iframe => {
    try {
      const url = new URL(iframe.src);
      url.searchParams.set('enablejsapi', '1');
      iframe.src = url.toString();
    } catch (e) {
      console.warn("Failed to set enablejsapi on iframe:", iframe, e);
    }
  });

  // Global callback that YouTube Player API triggers
  window.onYouTubeIframeAPIReady = function() {
    ytIframes.forEach(iframe => {
      try {
        const player = new YT.Player(iframe, {
          events: {
            'onStateChange': onPlayerStateChange
          }
        });
        players.push(player);
      } catch (err) {
        console.error("Error creating YT.Player:", err);
      }
    });
  };

  function onPlayerStateChange(event) {
    // YT.PlayerState: 1 = playing, 2 = paused, 0 = ended, 3 = buffering
    const state = event.data;

    // Check if any player is currently playing
    const anyVideoPlaying = players.some(p => {
      try {
        return p && typeof p.getPlayerState === 'function' && p.getPlayerState() === 1;
      } catch (e) {
        return false;
      }
    }) || (state === 1);

    if (anyVideoPlaying) {
      // If a video is playing, fade out the background music to 0
      if (!ducked) {
        ducked = true;
        fadeMusic(0, 500);
      }
    } else {
      // Check if all players are stopped/paused/ended
      const allStopped = players.every(p => {
        try {
          if (p && typeof p.getPlayerState === 'function') {
            const s = p.getPlayerState();
            return s !== 1 && s !== 3; // not playing and not buffering
          }
        } catch (e) {}
        return true;
      });

      if (allStopped && state !== 1 && state !== 3) {
        if (ducked) {
          ducked = false;
          // Fade background music back to the user's volume
          fadeMusic(userVolume, 500);
        }
      }
    }
  }

  function fadeMusic(targetVolume, duration = 500) {
    if (fadeInterval) {
      clearInterval(fadeInterval);
    }

    const startVolume = ambientAudio.volume;
    const volumeDifference = targetVolume - startVolume;
    const intervalTime = 25; // 25ms steps
    const steps = duration / intervalTime;
    let currentStep = 0;

    fadeInterval = setInterval(() => {
      currentStep++;
      const nextVolume = startVolume + (volumeDifference * (currentStep / steps));
      ambientAudio.volume = Math.max(0, Math.min(1, nextVolume));

      if (currentStep >= steps) {
        ambientAudio.volume = targetVolume;
        clearInterval(fadeInterval);
        fadeInterval = null;
      }
    }, intervalTime);
  }

  // Load the YouTube Iframe Player API script dynamically
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


  // --- 13. Interactive Piano Keyboard ---
  const pianoContainer = document.getElementById('piano-keys');
  const noteDisplay = document.getElementById('piano-note-display');
  let noteDisplayTimer = null;

  const pianoNotes = [
    { note: 'C4',  freq: 261.63, type: 'white' },
    { note: 'C#4', freq: 277.18, type: 'black' },
    { note: 'D4',  freq: 293.66, type: 'white' },
    { note: 'D#4', freq: 311.13, type: 'black' },
    { note: 'E4',  freq: 329.63, type: 'white' },
    { note: 'F4',  freq: 349.23, type: 'white' },
    { note: 'F#4', freq: 369.99, type: 'black' },
    { note: 'G4',  freq: 392.00, type: 'white' },
    { note: 'G#4', freq: 415.30, type: 'black' },
    { note: 'A4',  freq: 440.00, type: 'white' },
    { note: 'A#4', freq: 466.16, type: 'black' },
    { note: 'B4',  freq: 493.88, type: 'white' },
    { note: 'C5',  freq: 523.25, type: 'white' },
  ];

  function playPianoNote(freq) {
    try {
      const ctx = getAudioCtx();
      const now = ctx.currentTime;
      // Layer harmonics for a richer piano tone
      [[1, 0.5], [2, 0.25], [3, 0.1], [4, 0.05]].forEach(([mult, vol]) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 4000;
        osc.type = 'sine';
        osc.frequency.value = freq * mult;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(vol * 0.4, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2.0);
      });
    } catch(e) {}
  }

  if (pianoContainer) {
    pianoNotes.forEach(({ note, freq, type }) => {
      const key = document.createElement('div');
      key.classList.add('pk', type);
      key.dataset.note = note;
      key.dataset.freq = freq;
      // Label
      const label = document.createElement('span');
      label.classList.add('pk-label');
      label.textContent = note.replace('#', '♯').replace(/\d/, '');
      key.appendChild(label);

      const triggerNote = () => {
        playPianoNote(freq);
        key.classList.add('pressed');
        // Show note name
        if (noteDisplay) {
          noteDisplay.textContent = note.replace('#', '♯');
          clearTimeout(noteDisplayTimer);
          noteDisplayTimer = setTimeout(() => { noteDisplay.textContent = ''; }, 1200);
        }
        setTimeout(() => key.classList.remove('pressed'), 200);
      };

      key.addEventListener('mousedown', triggerNote);
      key.addEventListener('touchstart', (e) => { e.preventDefault(); triggerNote(); }, { passive: false });
      pianoContainer.appendChild(key);
    });
  }

});

