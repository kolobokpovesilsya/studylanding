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
