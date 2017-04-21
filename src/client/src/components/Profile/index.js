// From here we can use react-redux to connect them together
// OR just simply export the component

import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import * as authActions from '../../reducers/auth';

import Profile from './profile';

const mapStateToProps = (state) => ({
  ...state
});

const mapDispatchToProps = {
  ...authActions
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
