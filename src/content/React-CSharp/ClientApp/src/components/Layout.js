import React from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';

export function Layout({children}) {
  return (
    <div>
      <NavMenu />
      <Container>
        {children})
      </Container>
    </div>
  );
}