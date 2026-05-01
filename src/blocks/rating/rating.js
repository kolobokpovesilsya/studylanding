export class RatingInput {
    ratingContainer;
    constructor(selector) {
        this.ratingContainer = document.querySelector(selector);
        if (!this.ratingContainer) {
            return;
        }
        let currentRatingValue = this.getRating();
        const stars = this.ratingContainer.children;
        if (stars.length != 5) {
            console.warn(`Rating element ${selector} must have 5 stars`);
            return;
        }

        this.ratingContainer.addEventListener("mouseover", this.onHover);
        this.ratingContainer.addEventListener("mouseleave", this.onLeave);
        this.ratingContainer.addEventListener("click", this.onStarClick);
        this.fillRating(currentRatingValue);
    }
    getRating = () => {
        let initialRatingValue =
            +this.ratingContainer.getAttribute("data-value");
        if (isNaN(initialRatingValue)) {
            initialRatingValue = 0;
        } else if (initialRatingValue < 0) {
            initialRatingValue = 0;
        } else if (initialRatingValue > 5) {
            initialRatingValue = 5;
        }
        return initialRatingValue;
    };
    onStarClick = (e) => {
        const star = e.target.closest(".rating__star");
        const isStar = !!star;
        if (!isStar) {
            return;
        }
        const starIndex = Array.from(this.ratingContainer.children).indexOf(
            star,
        );
        this.ratingContainer.setAttribute("data-value", starIndex + 1);
    };
    onHover = (e) => {
        const star = e.target.closest(".rating__star");
        const isStar = !!star;
        if (!isStar) {
            const currentRating = this.getRating();
            this.fillRating(currentRating);
        } else {
            const starIndex = Array.from(this.ratingContainer.children).indexOf(
                star,
            );
            this.fillRating(starIndex + 1);
        }
    };
    onLeave = () => {
        const currentRating = this.getRating();
        this.fillRating(currentRating);
    };
    fillRating = (rating) => {
        const stars = this.ratingContainer.children;
        for (let i = 0; i < 5; i++) {
            const st = stars[i];
            if (i < rating) {
                if (st.classList.contains("rating__star--filled")) {
                    continue;
                }
                st.classList.add("rating__star--filled");
            } else {
                st.classList.remove("rating__star--filled");
            }
        }
    };
    setRating = (rating) => {
        this.fillRating(rating);
        this.ratingContainer.setAttribute("data-value", rating);
    };
}

const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                }

                .rating {
                    display: flex;
                }

                .rating__star {
                    fill: none !important;
                    stroke: #f9bb1c !important;
                    cursor: pointer;
                }

                .rating__star--filled {
                    fill: #f9bb1c !important;
                }
            </style>
            <script>
                alert("Привет");
            </script>
            <div class="rating ">
                <svg class="icon rating__star ">
                    <use href="sprites.svg#star"></use>
                </svg>
                <svg class="icon rating__star">
                    <use href="sprites.svg#star"></use>
                </svg>
                <svg class="icon rating__star">
                    <use href="sprites.svg#star"></use>
                </svg>
                <svg class="icon rating__star">
                    <use href="sprites.svg#star"></use>
                </svg>
                <svg class="icon rating__star">
                    <use href="sprites.svg#star"></use>
                </svg>
            </div>
`;
 class RatingInput1 extends HTMLElement {
      static formAssociated = true;

      constructor() {
        super();
        this._value = 0;
        this._internals = this.attachInternals();
        this._internals.setFormValue(this._value);
      }

      static get observedAttributes() { return ['value']; }

      connectedCallback() {
        this._initShadow();
        this._syncFromAttribute();
      }

      attributeChangedCallback() {
        this._syncFromAttribute();
      }

      get value() { return this._value; }
      set value(val) {
        const newVal = Number(val) || 0;
        if (this._value !== newVal) {
          this._value = newVal;
          this._internals.setFormValue(String(this._value));
          this._updateDisplay();          
          this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
        }
      }

      _initShadow() {
        if (this.shadowRoot) return;
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(TEMPLATE.content.cloneNode(true));
       
        this._circleEl = shadow.querySelector('.circle');
        this._circleEl.addEventListener('click', () => this.value++);
      }

      _syncFromAttribute() {
        const attr = this.getAttribute('value');
        if (attr !== null) this.value = attr;
      }

      _updateDisplay() {
        if (this._circleEl) this._circleEl.textContent = this._value;
      }
    }

    // customElements.define('counter-circle', CounterCircle);

    // ───────── Как слушать нативное событие ─────────
    // const circle = document.querySelector('counter-circle');
    // const log = document.getElementById('log');

    // circle.addEventListener('change', (e) => {
    //   // 🟡 В нативных событиях нет e.detail
    //   // Значение берётся напрямую из e.target.value
    //   log.textContent = `change event → target.value = ${e.target.value}`;
    // });

    // // Проверка отправки формы (работает благодаря formAssociated + setFormValue)
    // document.getElementById('demo-form').addEventListener('submit', (e) => {
    //   e.preventDefault();
    //   const formData = new FormData(e.target);
    //   log.textContent += `\nFormData: my-counter = ${formData.get('my-counter')}`;
    // });