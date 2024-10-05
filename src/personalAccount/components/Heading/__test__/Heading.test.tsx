import {render, waitFor} from '@testing-library/react';
import {Heading} from '../Heading';

describe('Heading component', () => {
    it('returns rendered Heading component', async () => {
        const view = render(<Heading header="Test heading" description="Test description" />);
        await waitFor(() => {
            expect(view).not.toBe(null);
        });
    });
});
