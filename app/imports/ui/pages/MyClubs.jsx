import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Badge, Container, Card, Image, Row, Col, Button } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { ChevronDown, ChevronUp } from 'react-bootstrap-icons';
import { Clubs } from '../../api/clubs/Clubs';
import { Users } from '../../api/users/Users';
import LoadingSpinner from '../components/LoadingSpinner';
import { pageStyle } from '../utilities/pageStyles';
import { PageIDs } from '../utilities/ids';
import RemoveClubModal from '../components/RemoveClubModal';

const MakeCard = ({ club }) => {
  const expandDescButtonStyle = {
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: 'grey',
    fontSize: '18px',
    padding: 2,
  };

  const [expandedDesc, setExpandedDesc] = useState(false);

  const shortDesc = () => {
    // eslint-disable-next-line for-direction
    for (let i = 0; i < club.description.length; i++) {
      if ((club.description[i] === ' ' || club.description[i] === ',') && i > 70) {
        return `${club.description.substring(0, i)}...`;
      }
    }
    return club.description;
  };

  return (
    <Col>
      <Card className="h-100">
        <Card.Header id="myclubs-club-header" style={{ backgroundColor: 'white' }}>
          <Col className="d-flex justify-content-end">
            <RemoveClubModal clubName={club.clubName} email={Meteor.user().username} buttonText="" />
          </Col>
          <a style={{ color: 'black', textDecoration: 'none' }} href={`/club/${club._id}`}>
            <Col style={{ height: '130px' }} className="d-flex justify-content-center my-2">
              {club.mainPhoto ? <Image style={{ maxWidth: '90%', maxHeight: '100%' }} className="my-auto" src={club.mainPhoto} /> : ''}
            </Col>
            <Card.Title className="pt-1"><b>{club.clubName}</b></Card.Title>
            <Card.Subtitle className="mb-1"><span className="date">{club.clubType}</span></Card.Subtitle>
            {club.tags ? club.tags.map((tag, index) => <Badge key={index} className="rounded-pill" bg="secondary">{tag}</Badge>) : ''}
          </a>
          <Row className="mt-2">
            <Col>
              <a style={{ textDecoration: 'none', fontWeight: 600 }} href={`/club/${club._id}`}>More info</a>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="p-2" style={{ backgroundColor: '#F6F6F6' }}>
          <Row className="mx-2">
            {expandedDesc ? club.description : shortDesc()}
          </Row>
          {shortDesc().length < club.description.length ? (
            <Row className="mx-2 align-text-bottom">
              <Button className="text-end" style={expandDescButtonStyle} onClick={() => (expandedDesc ? setExpandedDesc(false) : setExpandedDesc(true))}>
                {expandedDesc ? <ChevronUp /> : <ChevronDown />}
              </Button>
            </Row>
          )
            : ''}
        </Card.Body>
      </Card>
    </Col>
  );
};

MakeCard.propTypes = {
  club: PropTypes.shape({
    _id: PropTypes.string,
    mainPhoto: PropTypes.string,
    clubName: PropTypes.string,
    clubType: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
  }).isRequired,
};

/* Renders the Clubs Collection as a set of Cards. */
const MyClubs = () => {
  const { ready, clubs } = useTracker(() => {
    // Ensure that minimongo is populated with all collections prior to running render().
    let loaded = false;
    const sub = Meteor.subscribe(Clubs.userPublicationName);
    const sub2 = Meteor.subscribe(Users.userPublicationName);
    const clubList = [];
    if (sub.ready() && sub2.ready()) {
      if ((Users.collection.find({ email: Meteor.user().username }).fetch())[0].savedClubs) {
        const myClubs = (Users.collection.find({ email: Meteor.user().username }).fetch())[0].savedClubs;
        // eslint-disable-next-line no-restricted-syntax
        for (const club of myClubs) {
          clubList.push(Clubs.collection.find({ clubName: club }).fetch()[0]);
        }
      }
      loaded = true;
    }
    return {
      ready: loaded,
      clubs: clubList,
    };
  }, []);

  document.title = 'Club Finder Mānoa - My Clubs';

  const getClubs = () => (clubs.length > 0 ? (
    <Row xs={1} md={2} lg={3} className="g-2">
      {clubs.map((club, index) => <MakeCard key={index} club={club} />)}
    </Row>
  )
    : (
      <Col className="mt-4 text-center">
        <h4>No clubs saved!</h4><br />
        Go to the &quot;All Clubs&quot; page to find clubs
      </Col>
    ));

  return (
    <div className="backgroundImageTop">
      <Container id={PageIDs.myClubsPage} style={pageStyle}>
        <Row className="align-middle text-center">
          <Col className="d-flex flex-column justify-content-center">
            <h1 style={{ color: '#16211b' }} className="my-2 mb-3">
              <b>My Clubs</b>
            </h1>
          </Col>
        </Row>
        {ready ? getClubs() : <LoadingSpinner />}
      </Container>
    </div>
  );
};

export default MyClubs;
