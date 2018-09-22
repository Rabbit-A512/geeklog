import * as React from 'react';
import { Comment } from "../../models/comment";
import { List } from "antd";
import { AxiosResponse } from 'axios';
import server from '../../utils/server';
import CommentCard from '../CommentCard/CommentCard';

const Item = List.Item;

class LatestComments extends React.Component {

  public state = {
    comments: Array<Comment>()
  };

  public componentDidMount() {
    // hard code the number of the comments displayed on home page to 10
    server.get('/comments/latest/10')
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
        className={'w-100'}
        header={<h2>最新评论</h2>}
        bordered={true}
        itemLayout={'horizontal'}
        dataSource={this.state.comments}
        renderItem={(item: Comment) => (
          <Item>
            <CommentCard
              show_reply_btn={false}
              show_sub={false}
              comment={item}
              loadRootComments={() => console.log(1)}
            />
          </Item>
        )}
      />
    );
  }
}

export default LatestComments;
