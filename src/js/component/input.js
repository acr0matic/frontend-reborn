for (const input of document.querySelectorAll('input[type="number"]')) {
  const max = Number.parseFloat(input.getAttribute('max'));
  const min = Number.parseFloat(input.getAttribute('min'));

  if (min && max) {
    input.addEventListener('input', function () {
      this.value = Math.max(min, Math.min(max, this.value));
    });
  }
}

