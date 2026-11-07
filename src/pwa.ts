// PWA Service Worker Registration & Lifecycle

export interface PWAState {
  isUpdateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
}

let registration: ServiceWorkerRegistration | null = null;
const updateListeners: ((isUpdateAvailable: boolean) => void)[] = [];

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });

        // Check if there's already a waiting worker
        if (registration.waiting) {
          notifyUpdateAvailable();
        }

        registration.addEventListener('updatefound', () => {
          const newWorker = registration?.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                notifyUpdateAvailable();
              }
            });
          }
        });
      } catch (err) {
        console.warn('PWA service worker registration failed:', err);
      }
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }
}

function notifyUpdateAvailable() {
  updateListeners.forEach((listener) => listener(true));
}

export function onServiceWorkerUpdate(callback: (isUpdateAvailable: boolean) => void) {
  updateListeners.push(callback);
  if (registration?.waiting) {
    callback(true);
  }
  return () => {
    const idx = updateListeners.indexOf(callback);
    if (idx !== -1) updateListeners.splice(idx, 1);
  };
}

export function applyServiceWorkerUpdate() {
  if (registration?.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }
}

