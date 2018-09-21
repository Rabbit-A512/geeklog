import * as React from 'react';
import { Card, Divider, Tabs } from "antd";
import { RouteComponentProps } from "react-router";
import { User } from "../../models/user";
import { getAuthServer } from '../../utils/server';
import { AxiosError, AxiosResponse } from "axios";
import * as _ from 'lodash';
import { Article } from "../../models/article";
import CollectArticles from "../../components/CollectArticles/CollectArticles";
import StarArticles from "../../components/StarArticles/StarArticles";
import SaveAvatar from '../../components/SafeAvatar/SafeAvatar';
import OwnArticles from "../../components/OwnArticles/OwnArticle";

const TabPane = Tabs.TabPane;

interface IState {
  user: User | null;
  collect_articles: Article[];
  star_articles: Article[];
}

class UserHome extends React.Component<RouteComponentProps> {

  public state: IState = {
    user: null,
    collect_articles: [],
    star_articles: []
  };

  public componentDidMount() {

    const authServer = getAuthServer();
    authServer.get(`/users/${(this.props.match.params as any).user_id}`)
      .then((res: AxiosResponse) => {

        const userRes = _.pick(res.data.data, ['username', 'nickname', 'user_id', 'avatar', 'is_admin', 'bio']);
        console.log(userRes);

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
            avatar={(
              <SaveAvatar
                avatarPath={this.state.user ? this.state.user.avatar : undefined}
              />
            )}
            title={this.state.user ? this.state.user.nickname : 'none'}
            description={this.state.user ? this.state.user.bio : 'none'}
          />
        </Card>
        <Divider/>
        <Tabs defaultActiveKey={'0'}>
          <TabPane tab={'作品'} key={'0'}>
            <OwnArticles
              user_id={(this.props.match.params as any).user_id}
            />
          </TabPane>
          <TabPane tab={'点赞的文章'} key={'1'}>
            <StarArticles
              user_id={(this.props.match.params as any).user_id}
            />
          </TabPane>
          <TabPane tab={'收藏的文章'} key={'2'}>
            <CollectArticles
              user_id={(this.props.match.params as any).user_id}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export default UserHome;
