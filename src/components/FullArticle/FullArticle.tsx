import * as React from 'react';
import { Article } from "../../models/article";
import { Button, Card } from "antd";

const Meta = Card.Meta;
const ButtonGroup = Button.Group;

class FullArticle extends React.Component<{ article: Article }> {
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

      >
        <p>{this.props.article.content}</p>
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
