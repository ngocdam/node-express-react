import React from 'react';
import { Grid, Button, Modal, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: true
    };
  }

  close() {
    this.setState({ showModal: false });
  }

  open() {
    this.setState({ showModal: true });
  }

  login = () => {
    this.props.authenticate();
  }

  render() {
    return (
      <div>
        {this.renderOnPage()}
        {this.renderDialog()}
      </div>
    );
  }

  renderOnPage() {
    console.info('Login component => props: ', this.props);

    const { location } = this.props;
    const from = location && location.state ? location.state.from : { pathname: '/' };

    return (
      <Grid>
        <p>You must log in to view the page at {from.pathname}</p>
        <Button bsStyle="success" onClick={this.login}>Log in</Button>
      </Grid>
    )
  }

  renderDialog() {
    console.info('Login component => props: ', this.props);

    const { location } = this.props;
    const from = location && location.state ? location.state.from : { pathname: '/' };

    const popover = (
      <Popover id="modal-popover" title="popover">
        very popover. such engagement
      </Popover>
    );
    const tooltip = (
      <Tooltip id="modal-tooltip">
        wow.
      </Tooltip>
    );

    return (
      <Modal show={this.state.showModal} onHide={() => this.close()}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Text in a modal</h4>
          <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>

          <h4>Popover in a modal</h4>
          <p>there is a <OverlayTrigger overlay={popover}><a href="#">popover</a></OverlayTrigger> here</p>

          <h4>Tooltips in a modal</h4>
          <p>there is a <OverlayTrigger overlay={tooltip}><a href="#">tooltip</a></OverlayTrigger> here</p>

          <hr />

          <Grid>
            <p>You must log in to view the page at {from.pathname}</p>
            <Button bsStyle="success" onClick={() => this.login()}>Log in</Button>
          </Grid>

        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => this.close()}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
};
