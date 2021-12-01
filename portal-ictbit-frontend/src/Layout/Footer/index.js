import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Paper, Container } from '@material-ui/core';
import Image from 'next/image';
import Logo from 'public/ictbit.png';

const Footer = () => {
  return (
    <>
      <div dir={'rtl'} style={{ textAlign: 'center' }}>
        <footer>
          <Paper>
            <Row>
              <Col className='text-center py-3'> &copy; כל הזכויות שמורות</Col>
            </Row>
            <Col className='text-center py-3'>
              {' '}
              <Image src={Logo} height={50} width={200} />
            </Col>
          </Paper>
        </footer>
      </div>
    </>
  );
};

export default Footer;
