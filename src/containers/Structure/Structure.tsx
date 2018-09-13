import * as React from 'react';
import { Icon, Layout, Menu } from "antd";
import { CollapseType } from "antd/lib/layout/Sider";
import { Link, Route } from "react-router-dom";

import LoginForm from "../../components/LoginForm/LoginForm";
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import Editor from "../../components/Editor/Editor";
import ChangePasswordForm from '../../components/ChangePasswordForm/ChangePasswordForm';

import './Structure.css';
import AvatarUpload from "../../components/AvatarUpload/AvatarUpload";
import ModifyProfileForm from '../../components/ModiifyProfileForm/ModifyProfileForm';

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class App extends React.Component {
  public state = {
    collapsed: true
  };

  public onCollapse = (collapsed: boolean, type: CollapseType) => {
    console.log(collapsed);
    this.setState({collapsed});
  };

  public render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header className={'Header'} style={{padding: '0 10px'}}>
          <Icon type={'book'}/>
          &nbsp;
          Geeklog
        </Header>
        <Layout>
          <Sider
            collapsible={true}
            collapsed={this.state.collapsed}
            onCollapse={this.onCollapse}
          >
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              <SubMenu
                key="sub1"
                title={<span><Icon type="user" /><span>用户</span></span>}
              >
                <Menu.Item key="3">
                  <Link to={'/login'}>
                    <Icon type="login" />
                    <span>登录</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="4">
                  <Link to={'/register'}>
                    <Icon type="desktop" />
                    <span>注册</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="5">
                  <Link to={'/new-post'}>
                    <Icon type={'edit'}/>
                    写文章
                  </Link>
                </Menu.Item>
              </SubMenu>
              <SubMenu
                key="sub2"
                title={<span><Icon type="setting" /><span>设置</span></span>}
              >
                <Menu.Item key="6">
                  <Link to={'/change-password'}>
                    <Icon type={'lock'}/>
                    修改密码
                  </Link>
                </Menu.Item>
                <Menu.Item key="8">
                  <Link to={'/avatar-upload'}>
                    <Icon type={'picture'}/>
                    上传头像
                  </Link>
                </Menu.Item>
                <Menu.Item key={'9'}>
                  <Link to={'/modify-profile'}>
                    <Icon type={'profile'}/>
                    修改个人资料
                  </Link>
                </Menu.Item>
              </SubMenu>
              <Menu.Item key="9">
                <Icon type="file" />
                <span>File</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Content style={{ margin: '0 16px', minHeight: '80vh' }}>
              <Route path={'/login'} component={LoginForm}/>
              <Route path={'/register'} component={RegisterForm}/>
              <Route path={'/new-post'} component={Editor}/>
              <Route path={'/change-password'} component={ChangePasswordForm}/>
              <Route path={'/avatar-upload'} component={AvatarUpload}/>
              <Route path={'/modify-profile'} component={ModifyProfileForm}/>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              Ant Design ©2018 Created by Ant UED
            </Footer>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

export default App;
