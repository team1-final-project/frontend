import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <Wrap>
      <Header />
      <Content>
        <Outlet />
      </Content>
      <Footer />
    </Wrap>
  );
}

const Wrap = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  flex: 1;
`;
