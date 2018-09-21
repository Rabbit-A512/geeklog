import * as React from 'react';
import { Comment } from "../../models/comment";
import { List } from "antd";
import Avatar from "antd/lib/avatar";
import { AxiosResponse } from 'axios';
import server from '../../utils/server';
import { Link } from "react-router-dom";

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
              avatar={(
                <Link to={`/user-home/${item.user_id}`}>
                  <Avatar icon={'user'}/>
                </Link>
              )}
              title={(
                <Link to={`/user-home/${item.user_id}`}>
                  <span>user #{item.user_id}</span>
                </Link>
              )}
              description={item.content}
            />
          </Item>
        )}
      />
    );
  }
}

export default LatestComments;
