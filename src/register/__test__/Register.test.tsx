import {describe, it, vi, afterEach, beforeEach} from 'vitest';
import {render, screen} from '@testing-library/react';
import {Register} from '../Register';

vi.mock('react-router-dom');

describe('Register', () => {
    beforeEach(() => {
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('return render Tariffs page', async () => {
        const view = render(<Register />);
        expect(view).not.toBe(null);
    });
});
