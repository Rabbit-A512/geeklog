import * as React from 'react';
import { Comment } from "../../models/comment";
import { List } from "antd";
import Avatar from "antd/lib/avatar";
import { AxiosResponse } from 'axios';
import server from '../../utils/server';
import axios from 'axios';

const Item = List.Item;

class LatestComments extends React.Component {

  public state = {
    comments: Array<Comment>()
  };

  public componentDidMount() {
    // hard code the number of the comments displayed on home page to 5
    server.get('/comments/latest/5')
      .then((res: AxiosResponse<{ data: Comment[] }>) => {
        console.log(res.data);
        const latestComments = res.data.data;
        this.setState({
          comments: latestComments
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  public componentWillUnmount() {
    axios.CancelToken.source().cancel();
  }

  public render() {
    return (
      <List
        header={<h2>最新评论</h2>}
        bordered={true}
        itemLayout={'horizontal'}
        dataSource={this.state.comments}
        renderItem={(item: Comment) => (
          <Item>
            <List.Item.Meta
              avatar={<Avatar icon={'user'}/>}
              title={`user_id:${item.user_id}`}
              description={item.content}
            />
          </Item>
        )}
      />
    );
  }
}

export default LatestComments;
