import { useSyncExternalStore } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { scanImage } from '@/src/lib/scanPipeline';
import type { LastScan } from '@/src/state/lastScan';
import { recordError } from '@/src/lib/firebase';

/**
 * Batch-scan queue. Lets the user fire off many photos ("чик-чик-чик")
 * without waiting for each: every photo is enqueued and a single background
 * worker scans them one at a time (sequential — the scan-image Edge Function
 * + OpenAI is the bottleneck, parallel calls would just rate-limit). Results
 * stream into /scan-batch as each completes.
 *
 * Module-level so the queue survives navigating between capture and the
 * batch-results screen.
 */
export type QueueStatus = 'pending' | 'scanning' | 'done' | 'error';

export type QueueItem = {
  id: string;
  uri: string; // local preview uri
  status: QueueStatus;
  result?: LastScan;
  error?: string;
  addedToFridge?: boolean;
};

let items: QueueItem[] = [];
let running = false;
const listeners = new Set<() => void>();

function emit() {
  // Replace the array reference so useSyncExternalStore sees a change.
  items = [...items];
  for (const l of listeners) l();
}

function patch(id: string, next: Partial<QueueItem>) {
  items = items.map((it) => (it.id === id ? { ...it, ...next } : it));
  for (const l of listeners) l();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): QueueItem[] {
  return items;
}

export function useScanQueue(): QueueItem[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function getQueue(): QueueItem[] {
  return items;
}

export function enqueueScans(uris: string[]) {
  const base = Date.now();
  const newItems: QueueItem[] = uris.map((uri, i) => ({
    id: `q_${base}_${i}_${Math.floor(Math.random() * 1e6)}`,
    uri,
    status: 'pending',
  }));
  items = [...items, ...newItems];
  emit();
}

export function clearQueue() {
  items = [];
  running = false;
  emit();
}

export function removeQueued(id: string) {
  items = items.filter((it) => it.id !== id);
  emit();
}

export function markAddedToFridge(id: string) {
  patch(id, { addedToFridge: true });
}

/**
 * Drains all pending items sequentially. Safe to call on every enqueue —
 * the `running` guard means new photos added while a drain is in flight are
 * picked up by the same loop, and a second concurrent drain never starts.
 */
export async function processQueue(supabase: SupabaseClient, userId: string) {
  if (running) return;
  running = true;
  try {
    // Re-scan `items` each iteration so photos enqueued mid-drain are caught.
    for (;;) {
      const next = items.find((it) => it.status === 'pending');
      if (!next) break;
      patch(next.id, { status: 'scanning' });
      try {
        const result = await scanImage(supabase, userId, next.uri);
        patch(next.id, { status: 'done', result });
      } catch (e) {
        recordError(e, 'scan-queue');
        patch(next.id, {
          status: 'error',
          error: e instanceof Error ? e.message : 'scan failed',
        });
      }
    }
  } finally {
    running = false;
  }
}
