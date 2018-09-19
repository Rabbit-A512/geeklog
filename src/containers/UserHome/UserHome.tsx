import * as React from 'react';
import { Avatar, Card, Divider, Tabs } from "antd";
import HostestArticles from "../../components/HostestArticles/HostestArticles";
import { RouteComponentProps } from "react-router";
import { User } from "../../models/user";
import { getAuthServer } from '../../utils/server';
import { AxiosError, AxiosResponse } from "axios";
import * as _ from 'lodash';

const TabPane = Tabs.TabPane;

class UserHome extends React.Component<RouteComponentProps> {

  public state: { user: User | null } = {
    user: null
  };

  public componentDidMount() {

    console.log(this.props.match.params);

    const axios = getAuthServer();
    axios.get(`/users/${(this.props.match.params as any).user_id}`)
      .then((res: AxiosResponse) => {

        const userRes = _.pick(res.data.data, ['username', 'nickname', 'user_id', 'avatar', 'is_admin', 'bio']);

        this.setState({
          user: userRes
        });
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  }

  public render() {
    return (
      <div
        style={{
          maxWidth: '900px',
          width: '80%',
          margin: '100px auto'
        }}
      >
        <Card
          bordered={true}
        >
          <Card.Meta
            avatar={<Avatar icon={'user'} size={'large'}/>}
            title={this.state.user ? this.state.user.nickname : 'none'}
            description={this.state.user ? this.state.user.bio : 'none'}
          />
        </Card>
        <Divider/>
        <Tabs defaultActiveKey={'1'}>
          <TabPane tab={'收藏的文章'} key={'1'}>
            <HostestArticles/>
          </TabPane>
          <TabPane tab={'评论的文章'} key={'2'}>
            <HostestArticles/>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default UserHome;
