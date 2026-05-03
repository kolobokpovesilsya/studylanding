 

const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
            <style> 

                .rating {
                    display: inline-flex;
                    gap:1rem;
                }

                .rating__star {
                    fill: none !important;
                    stroke: #f9bb1c !important;
                    cursor: pointer;
                    width:2rem;
                    height:2rem
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
export class RatingInput extends HTMLElement {
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
            this.hilightStars(this._value); 
            this.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
        }
    }

    _initShadow() {
        if (this.shadowRoot) return;
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(TEMPLATE.content.cloneNode(true));
        
        this._ratingContainer = shadow.querySelector('.rating')
        this._ratingContainer.addEventListener("mouseover", this.onHover);
        this._ratingContainer.addEventListener("mouseleave", this.onLeave);
        this._ratingContainer.addEventListener("click", this.onStarClick);
        this.hilightStars(this.value);
    }

    hilightStars = (rating) => {
        const stars = this._ratingContainer.children;
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
    onStarClick = (e) => {
        const star = e.target.closest(".rating__star");
        const isStar = !!star;
        if (!isStar) {
            return;
        }
        const starIndex = Array.from(this._ratingContainer.children).indexOf(
            star,
        );
        this.value= starIndex + 1
    };
    onHover = (e) => {
        const star = e.target.closest(".rating__star");
        const isStar = !!star;
        if (!isStar) {
            this.hilightStars(this._value);
        } else {
            const starIndex = Array.from(this._ratingContainer.children).indexOf(
                star,
            );
            this.hilightStars(starIndex + 1);
        }
    };
    onLeave = () => {
        this.hilightStars(this._value);
    };
    _syncFromAttribute() {
        const attr = this.getAttribute('value');
        if (attr !== null) {
            this.value = attr
            this.hilightStars(this._value);
        };
    }

     
}

customElements.define('rating-input', RatingInput);

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