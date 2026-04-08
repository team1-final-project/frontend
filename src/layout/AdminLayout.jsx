import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout() {
  return (
    <Wrap>
      <AdminSidebar />
      <Content>
        <Outlet />
      </Content>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f5f6f8;
`;

const Content = styled.main`
  flex: 1;
  min-width: 0;
`;
