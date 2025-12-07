import './cursor.css';

const isPointerCoarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

if (!isPointerCoarse) {
  const dot = document.createElement('div');
  const ring = document.createElement('div');

  dot.className = 'custom-cursor-dot custom-cursor-hidden';
  ring.className = 'custom-cursor-ring custom-cursor-hidden';

  document.body.appendChild(ring);
  document.body.appendChild(dot);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  const lerpFactor = 0.15; // Controls the chase lag

  const updateRing = () => {
    ringX += (mouseX - ringX) * lerpFactor;
    ringY += (mouseY - ringY) * lerpFactor;

    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;

    requestAnimationFrame(updateRing);
  };

  const handleMouseMove = (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

    dot.classList.remove('custom-cursor-hidden');
    ring.classList.remove('custom-cursor-hidden');
    dot.classList.add('custom-cursor-visible');
    ring.classList.add('custom-cursor-visible');
  };

  const hideCursor = () => {
    dot.classList.remove('custom-cursor-visible');
    ring.classList.remove('custom-cursor-visible');
    dot.classList.add('custom-cursor-hidden');
    ring.classList.add('custom-cursor-hidden');
  };

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseenter', handleMouseMove);
  window.addEventListener('mouseleave', hideCursor);

  requestAnimationFrame(updateRing);
}
