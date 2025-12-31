import { Task } from '../types';

const SCHEMA_VERSION = 1;
const MAX_PAYLOAD_SIZE = 100 * 1024; // 100KB limit for URL sanity

interface SharePayload {
    v: number;
    d: Task[];
    t: number; // Export timestamp
}

/**
 * Encodes tasks into a compressed, URL-safe base64 string
 */
export async function encodeTasks(tasks: Task[]): Promise<string> {
    const payload: SharePayload = {
        v: SCHEMA_VERSION,
        d: tasks,
        t: Date.now()
    };

    const json = JSON.stringify(payload);

    // Check size before compression as a heuristic
    if (json.length > MAX_PAYLOAD_SIZE * 2) {
        throw new Error('Task list is too large to share via URL.');
    }

    try {
        const stream = new Blob([json]).stream();
        const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
        const buffer = await new Response(compressedStream).arrayBuffer();

        // Convert to Base64URL
        const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        return base64;
    } catch (error) {
        console.error('Compression failed:', error);
        throw new Error('Failed to compress share data.');
    }
}

/**
 * Decodes tasks from a compressed, URL-safe base64 string
 */
export async function decodeTasks(base64: string): Promise<{ tasks: Task[], timestamp: number }> {
    try {
        // Restore Base64URL to standard Base64
        let standardBase64 = base64.replace(/-/g, '+').replace(/_/g, '/');
        while (standardBase64.length % 4) standardBase64 += '=';

        const binary = atob(standardBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }

        const stream = new Blob([bytes]).stream();
        const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
        const json = await new Response(decompressedStream).text();

        const payload: SharePayload = JSON.parse(json);

        // Validation
        if (payload.v !== SCHEMA_VERSION) {
            throw new Error(`Incompatible version: ${payload.v}`);
        }
        if (!Array.isArray(payload.d)) {
            throw new Error('Invalid data format: tasks must be an array');
        }

        return {
            tasks: payload.d,
            timestamp: payload.t
        };
    } catch (error) {
        console.error('Decompression/Parsing failed:', error);
        throw new Error('Invalid or corrupted import link.');
    }
}

export function getShareUrl(base64: string): string {
    const url = new URL(window.location.href);
    url.hash = `import=${base64}`;
    return url.toString();
}

export function clearShareHash() {
    window.location.hash = '';
    // Use history to remove hash without triggering scroll or reload if possible
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
}

/**
 * Generates a unique fingerprint for a set of tasks
 */
export async function generateFingerprint(tasks: Task[]): Promise<string> {
    const sorted = [...tasks].sort((a, b) => a.id.localeCompare(b.id));
    const msgUint8 = new TextEncoder().encode(JSON.stringify(sorted));
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
