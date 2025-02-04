export function PlayVideoInViewport() {
  const videos = document.querySelectorAll("[lazy-video]");
  if (!videos) return;

  for (const video of videos) {
    const playPromise = video.play();

    let observer;

    if (playPromise !== undefined) {
      playPromise
        .then((_) => {
          observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                video.play();
              } else {
                video.pause();
              }
            },
            { threshold: 0.05 }
          );

          observer.observe(video);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }
}