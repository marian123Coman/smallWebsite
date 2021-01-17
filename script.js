'use strict';

///////////////////////////////////////
// Modal window
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(function (btn) {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// metoda noua scroll
btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// event delegation for smooth scrolling= punem un eveniment
// pe parintele la cateva linkuri,asa nu folosim loops sau
// nu creem multimple copii ale acelui event in codul nostru
// putem prinde acel event cand se face event bubbling,
// evetn delegation se face cu event.target

// 1//add event listener to a common parent element of the target we want
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // matching strategy
  if (e.target.classList.contains('nav__link')) {
    const ids = e.target.getAttribute('href');
    document.querySelector(ids).scrollIntoView({ behavior: 'smooth' });
  }
});

// adding tab components

let tabs = document.querySelectorAll('.operations__tab');
let tabsContainer = document.querySelector('.operations__tab-container');
let tabsContent = document.querySelectorAll('.operations__content');
// selectam cele 3 butoane prin parintele lor comun,folosim event delegation
tabsContainer.addEventListener('click', function (e) {
  let clicked = e.target.closest('.operations__tab');

  // ignoram erori pentru null,daca dam click pe ceva ce nu e clicked,returnam imediat
  // guard clause
  if (!clicked) return;

  // facem butoanele sa se aseze,stergand clasa de active
  tabs.forEach(function (tab) {
    tab.classList.remove('operations__tab--active');
  });
  //  stergem clasa active de la fiecare content area
  // ca sa dispara cele ce nu au acea clasa
  tabsContent.forEach(function (content) {
    content.classList.remove('operations__content--active');
  });
  // facem butoanele sa se ridice
  clicked.classList.add('operations__tab--active');

  // activate content area din fiecare buton cand apasam
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// menu fade animations
const nav = document.querySelector('.nav');

let handlehover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    let link = e.target;
    let siblings = link.closest('.nav').querySelectorAll('.nav__link');
    let logo = link.closest('.nav').querySelector('img');
    siblings.forEach(function (el) {
      if (el !== link) {
        el.style.opacity = opacity;
      }
    });
    logo.style.opacity = opacity;
  }
};

nav.addEventListener('mouseover', function (e) {
  handlehover(e, 0.5);
});

nav.addEventListener('mouseout', function (e) {
  handlehover(e, 1);
});

// sticky navigation bar : intersection observer api
// permite codului sa observe schimbari la modul in care un anumit target
// element intersecteaza cu un alt elementsau cu felul in care intersecteaza
// cu viewport
// let obsCallback = function(entries,observer){
//    entries.forEach(function(entry){
//      console.log(entry)
//    })
// }

// let obsOptions = {
//   root: null,
//   threshold: [0, 0.2]
// }

// let observer = new IntersectionObserver(obsCallback, obsOptions)
// observer.observe(section1)

let header = document.querySelector('.header');
let heightNav = nav.getBoundingClientRect().height;

let stickyNav = function (entries) {
  let [entry] = entries;

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

let headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  rootMargin: `-${heightNav}px`,
  threshold: 0,
});

headerObserver.observe(header);

// reveal sections
let revealSection = function (entries, observer) {
  let [entry] = entries;

  if (!entry.isIntersecting) {
    return;
  }
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

let sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

let allSections = document.querySelectorAll('.section');
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// lazy loading images,imbunatateste performanta

let imgTargets = document.querySelectorAll('img[data-src]');

let loadImage = function (entries, observer) {
  let [entry] = entries;

  if (!entry.isIntersecting) return;

  // replace src attribute cu data-src
  entry.target.src = entry.target.dataset.src;

  // punem sa stergem clasa lazy img dupa ce s a incarcat site ul
  // asa cei cu telefoane maio vechi nu au probleme cu viteza
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

let observer = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  // cu root margin +200px,incarcam imaginea inainte ca userul sa vada
  // se intampla in fundal,cu 2--px inainte ca useru; sa ajunga la imagine
  rootMargin: '200px',
});

imgTargets.forEach(function (img) {
  observer.observe(img);
});

// slide functionality

let slides = document.querySelectorAll('.slide');
let btnLeft = document.querySelector('.slider__btn--left');
let btnRight = document.querySelector('.slider__btn--right');

let currentSlide = 0;
let maxSlide = slides.length;

// const slider = document.querySelector('.slider');
// slider.style.transform = 'scale(0.4) translateX(-1000px)';
// slider.style.overflow = 'visible';

// dots functionality
let dotContainer = document.querySelector('.dots');

let createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  });
};
createDots();

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    let slide = e.target.dataset.slide;
    goToSlide(slide);
    activateDot(slide)
  }
});

// change color of slide buttons to show wich is selscted
let activateDot = function (slide) {
  document.querySelectorAll('.dots__dot').forEach(function (dot) {
    dot.classList.remove('dots__dot--active');
  });
  document
    .querySelector(`.dots__dot[data-slide = "${slide}"]`)
    .classList.add('dots__dot--active');
};
activateDot(0)



// slide functionality
slides.forEach(function (slide, i) {
  slide.style.transform = ` translateX(${100 * i}%)`;
});

let goToSlide = function (slide1) {
  slides.forEach(function (slide, i) {
    slide.style.transform = ` translateX(${100 * (i - slide1)}%)`;
  });
};
// setam la 0 pentru ca aplicatia sa porneasca direct cu 0
goToSlide(0);

// go to next slide
let nextSlide = function () {
  if (currentSlide === maxSlide - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }

  goToSlide(currentSlide);
  activateDot(currentSlide)
};

let previousSlide = function () {
  if (currentSlide === 0) {
    currentSlide = maxSlide - 1;
  } else {
    currentSlide--;
    goToSlide(currentSlide);
    activateDot(currentSlide)
  }
};

btnRight.addEventListener('click', function () {
  nextSlide();
});

// previous slide
btnLeft.addEventListener('click', function () {
  previousSlide();
});

// slide with arrow left and right
document.addEventListener('keydown', function (e) {
  console.log(e);
  if (e.key === 'ArrowLeft') {
    previousSlide();
  } else if (e.key === 'ArrowRight') {
    nextSlide();
  }
});
























// sticky oldway
// let initialCoords = section1.getBoundingClientRect()
// console.log(initialCoords)
// window.addEventListener('scroll',function(e){
//   console.log(window.scrollY)

//   if(window.scrollY > initialCoords.top){
//     nav.classList.add('sticky')
//   }else{
//     nav.classList.remove('sticky')
//   }

// })

// mouse enter event
// let h1 = document.querySelector('h1')

// const alertH1 = function(e){
//   alert('hi')
// }
// h1.addEventListener('mouseenter', alertH1)

// setTimeout(function(){
//   h1.removeEventListener('mouseenter',alertH1)

// },3000)

// event bubling

// metoda veche
// h1.onmouseenter = function(e){
//   alert('hello')
// }

// metoda veche pentru scroll
// btnScrollTo.addEventListener('click', function (event) {
//   // const s1coords = section1.getBoundingClientRect();
//   // console.log(s1coords);

//   // console.log(event.target.getBoundingClientRect());

//   // console.log('Current scroll (x,y) ', window.pageXOffset, pageYOffset);

//   // console.log(
//   //   'heigth/width viewport: ',
//   //   document.documentElement.clientHeight,
//   //   document.documentElement.clientWidth
//   // );
//   // scrollin
//   // window.scrollTo(
//   //   s1coords.left + window.pageXOffset,
//   //   s1coords.top + window.pageYOffset
//   // );

//   // scrolling smooth
//   // window.scrollTo({
//   //   left: s1coords.left + window.pageXOffset,
//   //   top: s1coords.top + window.pageYOffset,
//   //   behavior: 'smooth'
//   // })
// // metoda moderna

//   section1.scrollIntoView({behavior: 'smooth'})

// });

// creating and inserting elements
// .insertAdjacentHTML
// let message  = document.createElement('div')
// message.classList.add('cookie-message')
// message.textContent = 'We  use cookies because we are stupid'
// message.innerHTML = 'We  use cookies because we are stupid <button class = "btn btn--close-cookie">Got it!</button'

// header.prepend(message)

// header.append(message)

// header.append(message.cloneNode(true))

// header.before(message)
// header.after(message)
// document.querySelector('.btn--close-cookie').addEventListener('click',function(){
//   message.remove()
// })

// message.style.backgroundColor = '#38393d'
// console.log(message.style.backgroundColor)
// console.log(message.style.color)

// console.log(getComputedStyle(message).color)
// console.log(getComputedStyle(message).height)

// message.style.height = Number.parseFloat(getComputedStyle(message).height,10) + 30 + 'px'

// document.documentElement.style.setProperty('--color-primary', 'orangered')

// const logo= document.querySelector('.nav__logo')
// console.log(logo.alt)
// console.log(logo.src)

// console.log(logo.getAttribute('src'))

// const link = document.querySelector('.nav__link--btn')
// console.log(link.href)
// console.log(link.getAttribute('href'))

// random color
// let randomInt = function (min, max) {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// };
// let randomColor = function () {
//   return `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(
//     0,
//     255
//   )})`;
// };

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   // let link  = document.querySelector('.nav__link')
//   // link.style.backgroundColor = randomColor()
//   this.style.backgroundColor = randomColor();
//     console.log('link', e.target, e.currentTarget)
//   // /this arata catre obiectul care a chemat acel event listener,
//   // in cazul nostru nav__link

//   // stop event propagation
//   // e.stopPropagation()
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('links', e.target, e.currentTarget)
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('nav', e.target, e.currentTarget)
// },false);
// in mod normal ,noi ascultam events cand se petrece avent bubbling
// daca vrem sa ascultam cand se petrece event capturing
// adaugam true /false(inseamna nu ),ca parametru la add event listener
// astfel ascultam eventul pentruu nav class in exemplul nostru
// in capturing phase,facand ca nav sa fie primul element pe care se aplica eventul

// dom traversing

// let h1= document.querySelector('h1')

// going downwards,selecting childs og=f h1
// console.log(h1.querySelectorAll('.highlight'))
// daca ar fi in pagina html alte elemente cu acesa clasa ,highlight
// nu le ar fi selectat pentru ca nu sunt childs ale h1
// gaseste toti childrens ale lui h1,oricat ar fi de nested
// console.log(h1.childNodes)
// cu child nodes primim toti childrens la h1,de orice tip care exista
// console.log(h1.children)
// asta e mai folosita,dar functioneaza doar pentru direct childrens
// h1.firstElementChild.style.color = 'white'
// h1.lastElementChild.style.color = 'orangered'

// going upwards,selecting parents

// console.log(h1.parentNode)
//  gaseste direct parent node la h1

// console.log(h1.parentElement)
// gaseste direct parent la h1

// h1.closest('.header').style.background = 'var(--gradient-primary)'
// cu closest , cautam un parent element la h1,care nu e direct parent la h1
// cautam parent element nu conteaza cat e departe in dom tree
// dar care are clasa care o trecem noi in paranteze
// daca intr o pagina avem ami multe h1,si noi vrem sa gasim parintele
// la acel h1 care vrem noi,folosim closest
// closest primeste un string ca argument,in cazul nostru header
// daca acel selector,header se potriveste cu elementul pe care chemam closest
// atunci acel element va fi returnat,in cazul nostru h1

// querySelector gaseste copii nu conteaza cat de deep sunt in Dom tree
// closest() gaseste parinti in Dom nu conteaza cat de deep sunt

// going sideways,selecting siblings
// in js putem accesa doar direct siblings,adica previous si next one

// console.log(h1.previousElementSibling)
// console.log(h1.nextElementSibling)

// // all of the siblings
// console.log(h1.parentElement.children)

// // [...h1.parentElement.children].forEach(function(element){
// //    if(element !== h1){
// //      element.style.transform = 'scale(0.5'
// //    }
// // })

// // node siblings
// console.log(h1.previousSibling)
// console.log(h1.nextSibling)


// lifecycle dom events => inseamna de la momentul in care userul acceseaza o 
// pagina si pana iese din ea