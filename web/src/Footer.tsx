import { Nav, NavLink } from 'react-bootstrap';

export const Footer = (): JSX.Element => {
    return (
        <footer className="footer mt-auto my-1 py-3 bg-light text-muted">
            <Nav className="justify-content-center">
                <NavLink
                    className="text-muted"
                    href="https://birdnetpi.com"
                    target="_blank"
                    rel="noopener noreferer"
                >
                    Powered by BirdNET-Pi
                </NavLink>
            </Nav>
        </footer>
    );
};
