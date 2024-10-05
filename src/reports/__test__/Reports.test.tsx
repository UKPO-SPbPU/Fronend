import {describe, it, vi, afterEach, beforeEach, test} from 'vitest';
import {render, screen} from '@testing-library/react';
import user from '@testing-library/user-event';
import {Reports} from '../Reports';

describe('Reports', () => {
    beforeEach(() => {
        global.console.error = () => null;
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('return render Reports page', () => {
        const view = render(<Reports />);
        expect(view).not.toBe(null);
    });

    it('return render report spinner', async () => {
        render(<Reports />);
        await user.click(screen.getByTestId('generateReportButton'));
        expect(screen.getByTestId('reportSpinner')).toBeInTheDocument();
    });

    test('check generate report', async () => {
        render(<Reports />);
        const button = screen.getByTestId('generateReportButton');
        expect(button).toBeInTheDocument();

        await user.click(button);
        expect(screen.getByTestId('reportSpinner')).toBeInTheDocument();
    });
});
