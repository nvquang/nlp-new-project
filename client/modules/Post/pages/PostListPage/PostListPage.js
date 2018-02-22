import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

// Import Components
import PostCreateWidget from '../../components/PostCreateWidget/PostCreateWidget';

// Import Actions
import { addAspectBasedRequest} from '../../PostActions';
import { toggleAspectBased } from '../../../App/AppActions';


class PostListPage extends Component {

  handleAspectBased = (text, domain) => {
    this.props.dispatch(toggleAspectBased());
    this.props.dispatch(addAspectBasedRequest({ text, domain }));
  };

  render() {
    console.log("ben cai listpage", this.props.data)
    return (
      <div>
        <PostCreateWidget aspectBased={this.handleAspectBased} data={this.props.data}/>
      </div>
    );
  }
}


// Retrieve data from store as props
function mapStateToProps(state) {
  console.log("State PostListPage: ", state)
  return {
    data: state.posts.data
  };
}

PostListPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

PostListPage.contextTypes = {
  router: React.PropTypes.object,
};

export default connect(mapStateToProps)(PostListPage);
