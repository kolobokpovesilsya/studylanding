export class Virtualizer {
    container;
    sizeObserver;
    topSpacer;
    bottomSpacer;
    childrenList = {};
    triggerSpace = 150;
    topTriggerY;
    bottomTriggerY;
    constructor(containerElement) {
        this.container = containerElement;
        this.container.addEventListener(
            "scroll",
            (e) => {
                this.handleScrollTrigger();
            },
            { passive: true },
        );
        requestAnimationFrame(() => {
            this.init();
        });
    }
    handleScrollTrigger = () => {
        const container = this.container;
        const { scrollTop, scrollHeight, clientHeight } = container;
        if (
            scrollTop <= this.topTriggerY ||
            scrollTop + clientHeight >= this.bottomTriggerY
        ) {
            requestAnimationFrame(() => {
                this.updateItemsVisibility();
                this.updateTriggerY();
            });
        }
    };
    init() {
        const spacer = document.createElement("div");
        spacer.className = "spacer";
        spacer.style.gridColumn = "1 / -1";
        spacer.style.minHeight = "0px";
        spacer.style.margin = "0px";
        spacer.style.padding = "0px";
        this.topSpacer = spacer;
        this.bottomSpacer = spacer.cloneNode();
        this.container.appendChild(this.bottomSpacer);
        this.container.prepend(this.topSpacer);
        this.updateTriggerY();
        const children = Array.from(this.container.children || []);
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const chY = child.offsetTop;
            const chHeight = child.offsetHeight;
            this.childrenList[i] = {
                y: chY,
                height: chHeight,
            };
        }
        requestAnimationFrame(() => {
            this.updateItemsVisibility();
        });
    }
    updateTriggerY = () => {
        const { scrollTop, clientHeight } = this.container;
        this.topTriggerY = scrollTop - this.triggerSpace;
        this.bottomTriggerY = scrollTop + clientHeight + this.triggerSpace;
    };

    updateItemsVisibility() {
        const { scrollTop, clientHeight, scrollHeight } = this.container;
        const children = Array.from(this.container.children || []);
        const bottomBorder = scrollTop + clientHeight + this.triggerSpace;
        let paddingTop = scrollTop - this.triggerSpace;
        let paddingBottom = scrollHeight - bottomBorder;

        let topDelta = 0;
        let bottomDelta = 0;
        let topBorder = scrollTop - this.triggerSpace;
        this.topTriggerY = topBorder;

        for (let i = 0; i < children.length; i++) {
            const child = children[i];

            if (child.classList.contains("spacer")) {
                continue;
            }
            const size = this.childrenList[i];
            const chY = size?.y ?? child.offsetTop;
            const chHeight = size?.height ?? child.offsetHeight;

            if (chY + chHeight <= topBorder) {
                child.style.display = "none";
            } else if (chY >= bottomBorder) {
                child.style.display = "none";
            } else {
                child.style.display = "block";
                if (chY <= topBorder && chY + chHeight > topBorder) {
                    topDelta = Math.max(topDelta, topBorder - chY);
                } else if (
                    chY < bottomBorder &&
                    chY + chHeight >= bottomBorder
                ) {
                    bottomDelta = Math.max(
                        bottomDelta,
                        chY + chHeight - bottomBorder,
                    );
                }
            }
        }

        if (scrollTop - this.triggerSpace <= 0) {
            paddingTop = 0;
        } else {
            paddingTop -= topDelta;
        }
        if (scrollTop + clientHeight + this.triggerSpace >= scrollHeight) {
            paddingBottom = 0;
        } else {
            paddingBottom -= bottomDelta;
        }

        this.topSpacer.style.paddingTop = `${paddingTop}px`;
        this.bottomSpacer.style.paddingBottom = `${paddingBottom}px`;
    }
}

/*

export class VirtualList {
  constructor(container, options = {}) {
    this.container = container;
    this.data = options.data || [];
    this.itemHeight = typeof options.itemHeight === 'number' ? options.itemHeight : 50;
    this.bufferCount = options.bufferCount ?? 3; // Узлы за пределами viewport
    this.renderItem = options.renderItem || ((item, i) => `<div style="padding:12px;">${item?.text ?? `Item ${i}`}</div>`);
    this.cleanupItem = options.cleanupItem || (() => {});

    this.pool = [];                 // Переработанные DOM-узлы
    this.rendered = new Map();      // index -> DOM Element
    this.rafId = null;
    this._isDestroyed = false;

    // Настройка контейнера
    this.container.style.overflow = 'auto';
    this.container.style.position = 'relative';
    // Запрещаем браузеру пересчитывать стили внутри элементов при скролле
    this.container.style.contain = 'layout style'; 

    // Спейсер для корректной высоты скроллбара
    this.spacer = document.createElement('div');
    this.spacer.style.pointerEvents = 'none';
    this.container.appendChild(this.spacer);
    this._updateSpacer();

    // Слушатель скролла
    this._onScroll = this._onScroll.bind(this);
    this.container.addEventListener('scroll', this._onScroll, { passive: true });

    this.render();
  }

  _onScroll() {
    if (this._isDestroyed) return;
    if (!this.rafId) {
      this.rafId = requestAnimationFrame(() => this.render());
    }
  }

  render() {
    this.rafId = null;
    if (this._isDestroyed) return;

    const { scrollTop, clientHeight } = this.container;
    const total = this.data.length;

    // 📐 Математический расчёт видимого диапазона + буфер
    const start = Math.max(0, Math.floor(scrollTop / this.itemHeight) - this.bufferCount);
    const end = Math.min(total - 1, Math.ceil((scrollTop + clientHeight) / this.itemHeight) + this.bufferCount);

    const needed = new Set();
    for (let i = start; i <= end; i++) needed.add(i);

    // 🗑 Удаляем элементы, вышедшие за диапазон → возвращаем в пул
    for (const [idx, el] of this.rendered) {
      if (!needed.has(idx)) {
        this.cleanupItem(el, this.data[idx], idx);
        this.container.removeChild(el);
        this.pool.push(el);
        this.rendered.delete(idx);
      }
    }

    // ➕ Создаём/переиспользуем элементы для нового диапазона
    for (let i = start; i <= end; i++) {
      if (!this.rendered.has(i)) {
        const el = this.pool.pop() || document.createElement('div');
        el.innerHTML = ''; // Очищаем старый контент перед повторным использованием

        el.style.position = 'absolute';
        el.style.top = `${i * this.itemHeight}px`;
        el.style.left = '0';
        el.style.width = '100%';
        el.style.height = `${this.itemHeight}px`;
        el.style.boxSizing = 'border-box';
        el.style.overflow = 'hidden';

        // Рендер контента
        const content = this.renderItem(this.data[i], i, el);
        if (typeof content === 'string') {
          el.innerHTML = content;
        } else if (content instanceof HTMLElement) {
          el.appendChild(content);
        }

        this.container.appendChild(el);
        this.rendered.set(i, el);
      }
    }
  }

  _updateSpacer() {
    this.spacer.style.height = `${this.data.length * this.itemHeight}px`;
  }

 
  updateData(newData) {
    this.data = newData;
    this._updateSpacer();
    
    // Сбрасываем текущий DOM, чтобы избежать "призрачного" контента
    for (const el of this.rendered.values()) {
      this.cleanupItem(el, null, null);
      this.container.removeChild(el);
      this.pool.push(el);
    }
    this.rendered.clear();
    this.render();
  }

 
  scrollToIndex(index) {
    const target = Math.max(0, Math.min(this.data.length - 1, index)) * this.itemHeight;
    this.container.scrollTo({ top: target, behavior: 'smooth' });
  }

 
  destroy() {
    this._isDestroyed = true;
    this.container.removeEventListener('scroll', this._onScroll);
    cancelAnimationFrame(this.rafId);
    for (const el of this.rendered.values()) {
      this.cleanupItem(el, null, null);
      el.remove();
    }
    this.rendered.clear();
    this.pool = [];
    this.spacer.remove();
  }
}
*/
