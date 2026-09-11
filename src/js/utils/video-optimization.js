export function PlayVideoInViewport() {
  const videos = document.querySelectorAll('[lazy-video]');
  if (videos.length === 0) return;

  for (const video of videos) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(video);
  }
}
