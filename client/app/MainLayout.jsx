MainLayout = React.createClass({
  mixins: [ReactMeteorData],
  getMeteorData() {
    return {
      editable: User.findOne({loggedIn: true}).editable
    }
  },

  getInitialState() {
    return {screenSize: 'desktop', published: false, editable: false}
  },
  componentDidMount() {
    this.widgetIn();
    let pusherWidth = $(window).width() - $('.ui.sidebar').width() - 56;
    $('.pusher').width(pusherWidth);
    $(window).on('resize', _.debounce(() => {
      let pusherWidth = $(window).width() - $('.ui.sidebar').width() - 56;
      $('.pusher').width(pusherWidth);
    }, 50));

  },
  switchMobile() {
    this.setState({screenSize: 'mobile'})
  },
  switchDesktop() {
    this.setState({screenSize: 'desktop'})
  },
  widgetIn() {
    $('.content').velocity('transition.slideLeftBigIn', {
      duration: 300,
      opacity: 1
    });
  },
  render() {
    return (
      <div className="main">
        <div className="ui sidebar inverted vertical menu fixed right wide visible">
          <div className="header">
            <h1>
              <i className="ui icon shop"></i>Add a product</h1>
          </div>
          <div className="content" ref="sidebar">
            <div className="ui inverted form">
              <div className="field">
                <label>Product Name</label>
                <input type="text" placeholder="E.g. Batarang"/>
              </div>
              <div className="field">
                <label>Price</label>
                <input type="text" placeholder="E.g. $500"/>
              </div>
              <div className="field">
                <label>Description</label>
                <textarea rows="4"></textarea>
              </div>
            </div>
          </div>
          <div className="footer">
            <a href="https://wayne-tech.myshopify.com/admin" target="_blank" data-content="Go to Shopify Admin" data-variation="inverted">
              <img className="ui rounded image spaced floated left" src="//placehold.it/40x40"/>
              <div>
                wayne-tech
                <br></br>
                <span>Andy Fang</span>
              </div>
            </a>
          </div>
        </div>
        <div className="pusher">
          <Metabar/>
          <Site screenSize={this.state.screenSize} editable={this.data.editable}/>
          <div className="actionbar">
            <div className="ui container">
              <div className="ui text menu">
                <div className="header item" style={this.data.editable
                  ? {
                    color: '#fff'
                  }
                  : null}>
                  <i className={this.data.editable
                    ? 'ui icon edit'
                    : 'ui icon idea'}></i>{this.data.editable
                    ? 'EDIT MODE'
                    : 'PREVIEW MODE'}</div>
                <a className={this.state.screenSize == 'desktop'
                  ? 'active item'
                  : 'item'} onClick={this.switchDesktop}>
                  <i className="ui icon desktop"></i>Desktop
                </a>
                <a className={this.state.screenSize == 'mobile'
                  ? 'active item'
                  : 'item'} onClick={this.switchMobile}>
                  <i className="ui icon mobile"></i>
                  Mobile
                </a>
                <div className="right menu">
                  <a className="item">
                    <button className="ui icon basic inverted button">
                      <i className="code icon"></i>
                    </button>
                  </a>
                  <a className="item">
                    <span className={this.state.published
                      ? 'ui primary button'
                      : 'ui primary button disabled'}>Publish to Shopify</span>
                  </a>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});
