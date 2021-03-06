import * as React from 'react';
import { Icon, Menu, Dropdown } from "antd";
import { Layout } from 'antd';
import { Link, RouteComponentProps } from "react-router-dom";
import { CSSProperties } from "react";
import { getCurrentUser, logout } from "../../utils/auth";
import MenuItem from "antd/lib/menu/MenuItem";
import { withRouter } from "react-router-dom";
import SafeAvatar from '../../components/SafeAvatar/SafeAvatar';

const Header = Layout.Header;

const linkStyle: CSSProperties = {
  textDecoration: 'none',
  color: 'white',
  display: 'inline-block',
  marginRight: 'auto'
};

class AppHeader extends React.Component<RouteComponentProps> {

  public logoutHandler = () => {
    logout();
    this.props.history.replace('/');
  };

  public render() {

    let dropdown = null;
    let menu = null;

    const currentUser = getCurrentUser();

    if (currentUser) {
      menu = (
        <Menu>
          <MenuItem key={'0'}>
            <Link to={`/feature/user-home/${currentUser.user_id}`}>
              我的主页
            </Link>
          </MenuItem>
          <MenuItem key={'1'}>
            <a onClick={this.logoutHandler}>
              <Icon type={'logout'}/>
              &nbsp;登出
            </a>
          </MenuItem>
        </Menu>
      );

      dropdown = (
        <Dropdown overlay={menu}>
          <span
            style={{
              fontSize: 'medium'
            }}
          >
            <SafeAvatar
              size={'default'}
              avatarPath={currentUser.avatar}
            />
            &nbsp;
            {currentUser.nickname}&nbsp;
            <Icon type={'down'}/>
          </span>
        </Dropdown>
      );
    } else {
      menu = (
        <Menu>
          <MenuItem key={'0'}>
            <Link to={'/login'}>
              <Icon type={'login'}/>
              &nbsp;登录
            </Link>
          </MenuItem>
          <MenuItem key={'1'}>
            <Link to={'/register'}>
              <Icon type={'user-add'}/>
              &nbsp;注册
            </Link>
          </MenuItem>
        </Menu>
      );

      dropdown = (
        <Dropdown overlay={menu}>
          <span>游客&nbsp;<Icon type={'down'}/></span>
        </Dropdown>
      );
    }


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
        {dropdown}
      </Header>
    );
  }
}

export default withRouter(AppHeader);
