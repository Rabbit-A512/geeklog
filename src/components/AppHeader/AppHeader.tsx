import * as React from 'react';
import { Icon } from "antd";
import { Layout } from 'antd';
import { Link } from "react-router-dom";
import { CSSProperties } from "react";

const appHeader = () => {
  const Header = Layout.Header;

  const linkStyle: CSSProperties = {
    textDecoration: 'none',
    color: 'white',
    display: 'inline-block'
  };

  return (
      <Header
        className={'Header'}
        style={{
          padding: '0 10px',
          display: 'flex'
        }}
      >
        <Link
          to={'/'}
          style={linkStyle}
        >
          <Icon type={'book'}/>
          &nbsp;
          Geeklog
        </Link>
        <Link
          to={'/feature'}
          style={{
            ...linkStyle,
            marginLeft: 'auto',
            fontSize: 'large'
          }}
        >
          <Icon type={'user'}/>
        </Link>
      </Header>
  );
};

export default appHeader;
