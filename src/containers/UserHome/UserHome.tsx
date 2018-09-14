import * as React from 'react';
import { Avatar, Card, Divider, Tabs } from "antd";
import HostestArticles from "../../components/HostestArticles/HostestArticles";

const TabPane = Tabs.TabPane;

class UserHome extends React.Component {
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
            title={'syf'}
            description={'A developer.'}
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
