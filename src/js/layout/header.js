import { SetSize } from "../global/func";

export const header = document.querySelector('#header');

if (header) {
  SetSize(header, 'header');

  window.addEventListener('resize', () => {
    SetSize(header, 'header');
  });
}
