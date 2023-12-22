import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useLocation, Link } from 'react-router-dom';
import { BIRDS_HOST } from '../Constants';
import {
    HeaderItems,
    AdminDropDownItems,
    PageLinkInfo,
    StatsDropdownItems,
} from '../RouterElements';
import { useAppSelector } from '../store/Store';

const itemToNavLinkInfo = (r: PageLinkInfo): { to: string; name: string } => {
    return {
        to: r.path,
        name: r.name,
    };
};

export const Header = (): JSX.Element => {
    const siteName = useAppSelector((state) => state.overviewStats.value?.siteName);

    const location = useLocation();

    const pages = HeaderItems.map(itemToNavLinkInfo);

    const statsPages = StatsDropdownItems.map(itemToNavLinkInfo);

    const otherPages = AdminDropDownItems.map(itemToNavLinkInfo);

    return (
        <header>
            <Navbar collapseOnSelect fixed="top" bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        {siteName}
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {pages.map((p) => {
                                return (
                                    <Nav.Link
                                        as={Link}
                                        to={p.to}
                                        href={p.to}
                                        active={location.pathname === p.to}
                                        key={p.to}
                                    >
                                        {p.name}
                                    </Nav.Link>
                                );
                            })}

                            <NavDropdown title="Other" id="other-nav-dropdown">
                                {statsPages.map((p) => {
                                    return (
                                        <NavDropdown.Item
                                            as={Link}
                                            to={p.to}
                                            href={p.to}
                                            active={location.pathname === p.to}
                                            key={p.to}
                                        >
                                            {p.name}
                                        </NavDropdown.Item>
                                    );
                                })}
                            </NavDropdown>

                            <NavDropdown title="Admin" id="admin-nav-dropdown">
                                {otherPages.map((p) => {
                                    return (
                                        <NavDropdown.Item
                                            as={Link}
                                            to={p.to}
                                            href={p.to}
                                            active={location.pathname === p.to}
                                            key={p.to}
                                        >
                                            {p.name}
                                        </NavDropdown.Item>
                                    );
                                })}
                            </NavDropdown>
                        </Nav>
                        <Nav>
                            <Navbar.Text>
                                <audio
                                    controls
                                    preload="none"
                                    src={`${BIRDS_HOST}/api/index.php?stream`}
                                ></audio>
                            </Navbar.Text>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};
