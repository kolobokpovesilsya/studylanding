 
// import { initHeader } from './blocks/header.js'; 

import { Slider } from "./blocks/slider/slider";

// Инициализация всех блоков при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
  
//   initHeader(); 
  const slider = new Slider({
    selector:'.team__slider.slider',
    
  })
});
 