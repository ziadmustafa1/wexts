import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FusionFetcher } from './fetcher';

// Mock global fetch
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('FusionFetcher', () => {
    let fetcher: FusionFetcher;

    beforeEach(() => {
        fetcher = new FusionFetcher('https://api.example.com');
        fetchMock.mockReset();
    });

    it('should make a GET request', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ data: 'test' }),
        });

        const result = await fetcher.get('/test');
        expect(fetchMock).toHaveBeenCalledWith('https://api.example.com/test', expect.objectContaining({
            method: 'GET',
            headers: expect.objectContaining({
                'Content-Type': 'application/json',
            }),
        }));
        expect(result).toEqual({ data: 'test' });
    });

    it('should throw error on non-ok response', async () => {
        fetchMock.mockResolvedValueOnce({
            ok: false,
            statusText: 'Not Found',
        });

        await expect(fetcher.get('/error')).rejects.toThrow('Fusion API Error: Not Found');
    });
});
