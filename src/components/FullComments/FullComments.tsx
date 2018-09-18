import * as React from 'react';

interface IProps {
  article_id: number
}

class FullComments extends React.Component<IProps> {



  public render() {
    return (
      <div>article_id: {this.props.article_id} works</div>
    );
  }
}

export default FullComments;
