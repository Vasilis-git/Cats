import { Component, HostListener, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NgIf } from '@angular/common';
import { ImageFocusService } from './image-focus.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-image-focus-overlay',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="overlay" *ngIf="selected" (click)="close()" aria-hidden="false">
      <div class="overlay-content" (click)="$event.stopPropagation()">
        <button class="overlay-close" (click)="close()" aria-label="Close">✕</button>
        <button
          class="overlay-copy"
          (click)="copyUrl($event)"
          title="Copy image URL"
          aria-label="Copy image URL"
        >
          <span *ngIf="!copySuccess">🔗</span>
          <span *ngIf="copySuccess">✓</span>
        </button>
        <img class="overlay-img" [src]="selected!.url" [alt]="selected!.title || 'Image'" />
        <div class="overlay-copy-msg" *ngIf="copySuccess">Copied URL ✓</div>
      </div>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.75);
      z-index: 1050;
      padding: 24px;
      animation: fadeIn 150ms ease;
    }
    .overlay-content {
      position: relative;
      max-width: 95%;
      max-height: 95%;
      display:flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      overflow: visible; /* allow close button to sit outside image bounds */
    }
    .overlay-img {
      position: relative;
      z-index: 1;
      max-width: 100%;
      max-height: 80vh;
      border-radius: 4px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.6);
      transition: transform 220ms cubic-bezier(.2,.8,.2,1), opacity 180ms ease;
      transform-origin: center center;
      animation: popIn 200ms cubic-bezier(.2,.8,.2,1);
      opacity: 1;
    }
    .overlay-img:hover { transform: scale(1.02); }

    .overlay-close {
      position: absolute;
      top: -10px;
      right: -10px;
      z-index: 3; /* ensure it sits above the image */
      background: rgba(255,255,255,0.95);
      border: 1px solid #ccc;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      font-size: 16px;
      cursor: pointer;
      display:flex;
      align-items:center;
      justify-content:center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }



    .overlay-copy {
      position: absolute;
      bottom: -10px;
      right: -10px;
      z-index: 3;
      background: rgba(255,255,255,0.95);
      border: 1px solid #ccc;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      font-size: 16px;
      cursor: pointer;
      display:flex;
      align-items:center;
      justify-content:center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    .overlay-copy-msg {
      position: absolute;
      bottom: -40px;
      right: -12px;
      color: #fff;
      background: rgba(0,0,0,0.6);
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 12px;
      z-index: 4;
      max-width: 160px;
      text-align: left;
    }

    .overlay-caption {
      color: #fff;
      text-align: center;
      max-width: 90%;
      word-break: break-word;
    }

    @keyframes fadeIn {
      from { opacity: 0 }
      to { opacity: 1 }
    }

    @keyframes popIn {
      from { transform: scale(.9); opacity: 0 }
      to { transform: scale(1); opacity: 1 }
    }
  `]
})
export class ImageFocusOverlayComponent implements OnDestroy {
  selected: { url: string; title?: string } | null = null;
  copySuccess = false;
  private sub: Subscription;

  constructor(private svc: ImageFocusService, private cdr: ChangeDetectorRef) {
    this.sub = this.svc.selected$.subscribe((s) => {
      this.selected = s;
      try { document.body.style.overflow = s ? 'hidden' : ''; } catch (e) { /* ignore */ }
      // ensure view updates immediately even if events fire outside Angular's CD
      try { this.cdr.detectChanges(); } catch (e) { /* ignore */ }
    });
  }

  async copyUrl(ev: Event) {
    ev.stopPropagation();
    if (!this.selected) return;
    try {
      await navigator.clipboard.writeText(this.selected.url);
      this.copySuccess = true;
      try { this.cdr.detectChanges(); } catch (e) {}
      setTimeout(() => { this.copySuccess = false; try { this.cdr.detectChanges(); } catch (e) {} }, 2000);
    } catch (e) {
      // fallback: open prompt briefly instructing user
      this.copySuccess = false;
      try { this.cdr.detectChanges(); } catch (err) {}
    }
  }

  private _deriveFilename(title?: string, url?: string) {
    // prefer a sanitized title, otherwise use the last path segment from URL
    const sanitize = (s: string) => s.replace(/[^a-z0-9._-]/gi, '_');
    if (title && title.trim().length) {
      let ext = '';
      try { const u = new URL(url || ''); const path = u.pathname; const match = path.match(/\.([a-z0-9]+)$/i); if (match) ext = '.' + match[1]; } catch (e) {}
      return sanitize(title) + ext;
    }
    try { const u = new URL(url || ''); const parts = u.pathname.split('/').filter(Boolean); return parts.length ? parts[parts.length - 1] : 'image'; } catch (e) { return 'image'; }
  }

  close() { this.svc.close(); }

  @HostListener('document:keydown.escape')
  onEsc() { if (this.selected) this.close(); }

  ngOnDestroy() {
    this.sub.unsubscribe();
    try { document.body.style.overflow = ''; } catch (e) { /* ignore */ }
  }
}
