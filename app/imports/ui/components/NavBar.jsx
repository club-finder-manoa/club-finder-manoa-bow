import React from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { NavLink } from 'react-router-dom';
import { Col, Container, Image, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { BoxArrowRight, PersonFill, PersonPlusFill } from 'react-bootstrap-icons';
import { ComponentIDs } from '../utilities/ids';
import { Users } from '../../api/users/Users';

const NavBar = () => {
  // useTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
  const { currentUser, userProfilePic, ready } = useTracker(() => {
    const sub1 = Meteor.subscribe(Users.userPublicationName);
    const rdy = sub1.ready();
    const userData = Users.collection.findOne({ email: Meteor.user()?.username });
    return {
      currentUser: userData ? userData.displayName : '',
      userProfilePic: userData ? userData.picture : '',
      ready: rdy,
    };
  }, []);
  const menuStyle = { marginBottom: '0px' };

  return (
    <Navbar expand="lg" style={menuStyle} className="bg-dark">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="align-items-center">
          <span><Image src="/images/uh-rainbow.png" width={70} style={{ marginBottom: 3 }} /></span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls={ComponentIDs.basicNavbarNav} />
        <Navbar.Collapse id={ComponentIDs.basicNavbarNav}>
          <Nav className="me-auto justify-content-start">
            {currentUser ? (
              [<Nav.Link as={NavLink} id={ComponentIDs.allClubsMenuItem} className="ms-4" style={{ fontWeight: 600 }} to="/all-clubs" key="allClubs">All Clubs</Nav.Link>,
                <Nav.Link as={NavLink} id={ComponentIDs.myClubsMenuItem} className="ms-4" style={{ fontWeight: 600 }} to="/my-clubs" key="myClubs">My Clubs</Nav.Link>]
            ) : ''}
            {Roles.userIsInRole(Meteor.userId(), 'admin') ? (
              <Nav.Link as={NavLink} id={ComponentIDs.adminMenuItem} className="ms-4" style={{ fontWeight: 600 }} to="/admin" key="admin">Admin</Nav.Link>
            ) : ''}
          </Nav>
          {!currentUser ? (
            <Col className="justify-content-center text-center my-2 me-2">
              <span style={{ fontWeight: 500, fontSize: '30px' }}><b>Club Finder Mānoa</b></span>
            </Col>
          )
            : '' }
          <Nav className="justify-content-end">
            {currentUser === '' ? (
              <NavDropdown align="end" id={ComponentIDs.loginDropdown} style={{ fontWeight: 425 }} title="Login">
                <NavDropdown.Item id={ComponentIDs.loginDropdownSignIn} style={{ fontWeight: 425 }} as={NavLink} to="/sign-in">
                  <PersonFill className="me-2 mb-1" />Sign in
                </NavDropdown.Item>
                <NavDropdown.Item id={ComponentIDs.loginDropdownSignUp} style={{ fontWeight: 425 }} as={NavLink} to="/sign-up">
                  <PersonPlusFill className="me-2 mb-1" />Sign up
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <NavDropdown
                align="end"
                id={ComponentIDs.currentUserDropdown}
                style={{ fontWeight: 450 }}
                title={<>{currentUser}<Image roundedCircle width="40px" src={ready ? userProfilePic : ''} className="ms-2 mb-1" /></>}
              >
                <NavDropdown.Item id={ComponentIDs.currentUserDropdownProfile} style={{ fontWeight: 425 }} as={NavLink} to="/profile">
                  <PersonFill className="me-2 mb-1" />Profile
                </NavDropdown.Item>

                <NavDropdown.Item id={ComponentIDs.currentUserDropdownSignOut} style={{ fontWeight: 425 }} as={NavLink} to="/sign-out">
                  <BoxArrowRight className="me-2 mb-1" />Sign out
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
