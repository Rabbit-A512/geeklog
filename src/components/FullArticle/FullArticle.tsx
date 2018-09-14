import * as React from 'react';
import { FakeArticle } from "../../models/article";
import { Button, Card } from "antd";

const Meta = Card.Meta;
const ButtonGroup = Button.Group;

class FullArticle extends React.Component<{ article: FakeArticle }> {
  public render() {
    return (
      <Card
        title={(
          <h2
            style={{
              textAlign: 'center'
            }}
          >{this.props.article.title}</h2>
        )}
        style={{
          margin: '20px auto',
          width: '70%',
          maxWidth: '900px'
        }}
      >
        <p>{this.props.article.body}</p>
        <Meta
          description={(
            <ButtonGroup
              style={{
                marginLeft: 'auto'
              }}
            >
              <Button htmlType={'button'} icon={'star'}>收藏</Button>
              <Button htmlType={'button'} icon={'like'}>点赞</Button>
            </ButtonGroup>
          )}
          style={{
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        />
      </Card>
    );
  }
}

export default FullArticle;
