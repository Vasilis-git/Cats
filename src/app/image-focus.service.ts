import { Injectable, OnDestroy, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ImageFocusService implements OnDestroy {
  private selectedSubject = new BehaviorSubject<{ url: string; title?: string } | null>(null);
  selected$ = this.selectedSubject.asObservable();

  private mutationObserver: MutationObserver | null = null;
  private clickHandler = this.onClick.bind(this);
  private keydownHandler = this.onKeydown.bind(this);

  constructor(private ngZone: NgZone) {
    // Make current images interactive
    this.makeImagesInteractive(document);

    // Global listeners
    document.addEventListener('click', this.clickHandler, true);
    document.addEventListener('keydown', this.keydownHandler, true);

    // Observe DOM mutations to pick up dynamically added <img> elements
    this.mutationObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of Array.from(m.addedNodes)) {
          if ((node as Element).nodeType === 1) this.makeImagesInteractive(node as Element);
        }
      }
    });

    const startObserving = () => {
      try {
        // try to observe the body for future DOM additions
        if (document.body && this.mutationObserver) {
          this.mutationObserver.observe(document.body, { childList: true, subtree: true });
        }
        // also run once more to pick up any elements added after constructor ran
        this.makeImagesInteractive(document);
      } catch (e) { /* ignore */ }
    };

    if (document.body) {
      startObserving();
    } else {
      // If body is not present yet (very early bootstrap), wait for DOMContentLoaded
      document.addEventListener('DOMContentLoaded', () => startObserving(), { once: true });
      // fallback shortly after to catch cases where DOMContentLoaded already fired but body wasn't available earlier
      setTimeout(() => startObserving(), 50);
    }
  }

  private makeImagesInteractive(root: Element | Document) {
    try {
      const imgs = (root as Document).querySelectorAll ? (root as Document).querySelectorAll('img') : [];
      imgs.forEach((img) => {
        const el = img as HTMLImageElement;
        // add accessibility/click affordances if not present
        if (!el.getAttribute('role')) el.setAttribute('role', 'button');
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
        (el.style as CSSStyleDeclaration).cursor = 'pointer';
      });
    } catch (e) {
      // ignore
    }
  }

  private onClick(ev: Event) {
    const target = ev.target as HTMLElement | null;
    if (target && target.tagName === 'IMG') {
      const img = target as HTMLImageElement;
      const url = (img.currentSrc || img.src || '').toString();
      const title = img.getAttribute('title') || img.alt || '';
      if (url) this.open({ url, title });
    }
  }

  private onKeydown(ev: KeyboardEvent) {
    if (ev.key === 'Enter' && document.activeElement && document.activeElement.tagName === 'IMG') {
      const img = document.activeElement as HTMLImageElement;
      const url = (img.currentSrc || img.src || '').toString();
      const title = img.getAttribute('title') || img.alt || '';
      if (url) this.open({ url, title });
    }
  }

  open(image: { url: string; title?: string }) {
    // ensure UI updates happen inside Angular's zone
    try {
      this.ngZone.run(() => this.selectedSubject.next(image));
    } catch (e) {
      this.selectedSubject.next(image);
    }
  }
  close() {
    try {
      this.ngZone.run(() => this.selectedSubject.next(null));
    } catch (e) {
      this.selectedSubject.next(null);
    }
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.clickHandler, true);
    document.removeEventListener('keydown', this.keydownHandler, true);
    if (this.mutationObserver) this.mutationObserver.disconnect();
  }
}
