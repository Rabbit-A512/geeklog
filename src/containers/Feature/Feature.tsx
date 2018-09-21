import * as React from 'react';
import { Icon, Layout, Menu } from "antd";
import { Link, Route, RouteComponentProps } from "react-router-dom";
import ChangePasswordForm from "../../components/ChangePasswordForm/ChangePasswordForm";
import AvatarUpload from "../../components/AvatarUpload/AvatarUpload";
import ModifyProfileForm from "../../components/ModiifyProfileForm/ModifyProfileForm";
import { CollapseType } from "antd/lib/layout/Sider";
import { StaticContext } from "react-router";
import UserHome from "../UserHome/UserHome";
import NewArticle from "../NewArticle/NewArticle";
import EditArticle from "../EditArticle/EditArticle";

const { Content, Footer, Sider } = Layout;

const SubMenu = Menu.SubMenu;

class Feature extends React.Component<RouteComponentProps<any, StaticContext, any>> {

  public state = {
    collapsed: false
  };

  public componentDidMount() {
    // this.props.history.replace('/login');
  }

  public onCollapse = (collapsed: boolean, type: CollapseType) => {
    console.log(collapsed);
    this.setState({collapsed});
  };

  public render() {
    return (
      <Layout>
        <Sider
          collapsible={true}
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className="logo" />
          <Menu theme={'dark'} defaultSelectedKeys={['1']} mode="inline">
            <SubMenu
              key="sub1"
              title={<span><Icon type="user" /><span>用户</span></span>}
            >
              <Menu.Item key="5">
                <Link to={'/feature/new-article'}>
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
                <Link to={'/feature/change-password'}>
                  <Icon type={'lock'}/>
                  修改密码
                </Link>
              </Menu.Item>
              <Menu.Item key="8">
                <Link to={'/feature/avatar-upload'}>
                  <Icon type={'picture'}/>
                  上传头像
                </Link>
              </Menu.Item>
              <Menu.Item key={'9'}>
                <Link to={'/feature/modify-profile'}>
                  <Icon type={'profile'}/>
                  修改个人资料
                </Link>
              </Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ margin: '0 16px', minHeight: '80vh' }}>
            <Route path={'/feature/user-home/:user_id'} component={UserHome} />
            <Route path={'/feature/edit-article/:article_id'} component={EditArticle} />
            <Route path={'/feature/new-article'} component={NewArticle}/>
            <Route path={'/feature/change-password'} component={ChangePasswordForm}/>
            <Route path={'/feature/avatar-upload'} component={AvatarUpload}/>
            <Route path={'/feature/modify-profile'} component={ModifyProfileForm}/>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            开发团队：云南大学软件学院2015级
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default Feature;
