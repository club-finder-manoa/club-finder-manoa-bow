import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Image, Row, Col, Table } from 'react-bootstrap';
import { useTracker } from 'meteor/react-meteor-data';
import { _ } from 'meteor/underscore';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Clubs } from '../../api/clubs/Clubs';
import LoadingSpinner from '../components/LoadingSpinner';

const ClubPage = () => {

  const { _id } = useParams();

  const { ready, club } = useTracker(() => {
    const sub = Meteor.subscribe(Clubs.userPublicationName);
    const oneClub = Clubs.collection.find({ _id: _id }).fetch();
    return {
      ready: sub.ready(),
      club: oneClub[0],
    };
  }, false);

  return ready ? (
    <Container id="landing-page" fluid className="py-3">
      <Row className="align-middle text-center">
        <Col xs={4}>
          <Image src={club.mainPhoto} width={200} />
        </Col>

        <Col xs={8} className="d-flex flex-column justify-content-center">
          <h1>{club.clubName}</h1>
          <p>{club.clubType}</p>
          <p>{club.description}</p>
        </Col>
      </Row>

      <h3>Meeting Times and Location</h3>
      <Table striped bordered hover size="sm">
        <thead>
        <tr>
          <th>Date</th>
          <th>Time</th>
          <th>Location</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{club.meetingInfo}</td>
          <td>{club.meetingInfo}</td>
          <td>{club.meetingInfo}</td>
        </tr>
        </tbody>
      </Table>

      <h3>Contact Us!</h3>
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{club.contactName}</td>
            <td>{club.contactEmail}</td>
          </tr>
        </tbody>
      </Table>

    </Container>
  ) : <LoadingSpinner />;
};

export default ClubPage;