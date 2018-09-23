import * as React from 'react';
import { List } from "antd";
import server from '../../utils/server';
import { AxiosError, AxiosResponse } from "axios";
import { Comment } from '../../models/comment';

import CommentCard from '../../components/CommentCard/CommentCard';

interface IProps {
  user_id: number;
}

class OwnComments extends React.Component<IProps> {

  public state = {
    comments: Array<Comment>(),
    page: 1,
    size: 7,
    total: 0
  };

  public loadArticles = (page: number) => {
    server.get(`/users/${this.props.user_id}/comments?page=${page}&size=${this.state.size}`)
      .then((res: AxiosResponse) => {
        const comments = res.data.data ? res.data.data.entities : [];
        const total = res.data.data ? res.data.data.total : 0;
        this.setState({
          comments,
          total
        });
      })
      .catch((error: AxiosError) => {
        console.log(error);
      });
  };

  public handlePageChange = (page: number) => {
    this.loadArticles(page);
  };

  public componentDidMount() {
    this.loadArticles(1);
  }

  public render() {
    return (
      <List
        className={'w-100'}
        pagination={{
          pageSize: this.state.size,
          onChange: this.handlePageChange,
          total: this.state.total
        }}
        dataSource={this.state.comments}
        renderItem={(item: Comment) => (
          <List.Item>
            <CommentCard
              show_sub={false}
              show_reply_btn={false}
              comment={item}
              loadRootComments={() => console.log()}
            />
          </List.Item>
        )}
      />
    );
  }
}

export default OwnComments;
