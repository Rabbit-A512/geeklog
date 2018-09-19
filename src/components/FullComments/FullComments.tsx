import * as React from 'react';
import TextArea from "antd/lib/input/TextArea";
import { Card, Divider, List } from "antd";
import axios from '../../utils/server';
import { AxiosResponse } from "axios";
import { Comment } from "../../models/comment";

import CommentCard from '../CommentCard/CommentCard';

const Item = List.Item;

interface IProps {
  article_id: number
}

interface IState {
  comments: Comment[];
  modalVisible: boolean;
}

class FullComments extends React.Component<IProps> {

  public state: IState = {
    comments: Array<Comment>(),
    modalVisible: false
  };

  public newComment: TextArea;



  public componentDidMount() {

    console.log('[fullComment]', this.props.article_id);

    axios.get(`/articles/${this.props.article_id}/comments?page=1&size=10`)
      .then((res: AxiosResponse<{ data: Comment[] }>) => {
        const comments = res.data.data;
        this.setState({
          comments
        });
      })
  }

  public saveNewComment = (textarea: TextArea) => this.newComment = textarea;

  public render() {
    return (
      <div>
        <Divider />
        <Card
          title={'所有评论'}
        >
          <List
            itemLayout={'horizontal'}
            dataSource={this.state.comments}
            renderItem={(item: Comment) => (
              <Item
                style={{
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <CommentCard
                  comment={item}
                />
              </Item>
            )}
          />

          <Divider orientation={'left'}>发表评论</Divider>
          <TextArea
            ref={this.saveNewComment}
            autosize={{
              minRows: 2,
              maxRows: 8
            }}/>

        </Card>

      </div>
    );
  }
}

export default FullComments;
