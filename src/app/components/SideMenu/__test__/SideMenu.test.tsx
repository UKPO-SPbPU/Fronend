import {render, waitFor} from '@testing-library/react';
import {SideMenu} from '../SideMenu';

vi.mock('react-router-dom');

describe('SideMenu component', () => {
    it('returns rendered SideMenu component', async () => {
        const view = render(<SideMenu />);
        await waitFor(() => {
            expect(view).not.toBe(null);
        });
    });
});
