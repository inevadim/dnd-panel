import './App.css';
import React from 'react';
import { WidthProvider, Responsive } from 'react-grid-layout';
import _ from 'lodash';
import axios from 'axios';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

const serializer = (name, val) =>
  typeof val === 'number' && !isFinite(val) ? val.toString() : val;

export default class AddRemoveLayout extends React.PureComponent {
  componentDidMount() {
    axios.get(`/bd.json`).then(res => {
      const bdJSON = res.data;
      this.setState({ bdJSON });
    });
    // console.log(this.state.bdJSON.itemDND);
  }
  static defaultProps = {
    className: 'items',
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 100,
    typeItem: 1,
  };
  constructor(props) {
    super(props);
    const parser = (name, val) => (val === 'Infinity' ? Infinity : val);
    this.state = JSON.parse(localStorage.getItem('items'), parser) ?? {
      // Чтение
      items: [],
      newCounter: 0,
    };
    this.onAddItem = this.onAddItem.bind(this);
    this.onAddItemJSON = this.onAddItemJSON.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
  }

  onLayoutChange(items) {
    const newItems = items.map((el, i) => ({ ...this.state.items[i], ...el }));
    this.setState({ items: newItems });
    localStorage.setItem('items', JSON.stringify(this.state, serializer));
  }

  onAddItem() {
    let rand = Math.floor(Math.random() * this.state.items.length);
    console.log(rand);
    console.log(this.state.bdJSON.itemDND[rand].imgUrl);
    this.setState({
      items: this.state.items.concat({
        i: 'n' + this.state.newCounter,
        x: (this.state.items.length * 2) % (this.state.cols || 12),
        y: Infinity, // puts it at the bottom
        w: 2,
        h: 2,
        imgItem: this.state.bdJSON.itemDND[rand].imgUrl,
        urlSite: null,
        typeItem: 1,
      }),
      newCounter: this.state.newCounter + 1,
    });
    localStorage.setItem('items', JSON.stringify(this.state, serializer));
  }

  onAddItemJSON(urlItem) {
    this.setState({
      items: this.state.items.concat({
        i: 'n' + this.state.newCounter,
        x: (this.state.items.length * 2) % (this.state.cols || 12),
        y: Infinity, // puts it at the bottom
        w: 2,
        h: 2,
        urlSite: urlItem,
        typeItem: 2,
      }),
      newCounter: this.state.newCounter + 1,
    });
    localStorage.setItem('items', JSON.stringify(this.state, serializer));
  }

  onRemoveItem(i) {
    this.setState({
      items: _.reject(this.state.items, { i: i }),
      newCounter: this.state.newCounter - 1,
    });
    localStorage.setItem('items', JSON.stringify(this.state, serializer));
  }

  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols,
    });
  }

  createElement(el) {
    const i = el.add ? '+' : el.i;
    return (
      <div className="wrap_item" key={i} data-grid={el}>
        {el.add ? (
          <span
            className="add text"
            onClick={this.onAddItem}
            title="You can add an item by clicking here, too.">
            Add +
          </span>
        ) : (
          <span className="text">
            {el.typeItem === 2 ? (
              <iframe src={el.urlSite} title={i} width="80%" height="98%" />
            ) : (
              <img src={el.imgItem} alt={el.imgItem} width="80%" height="100%" />
            )}
          </span>
        )}
        {el.typeItem}
        <span
          className="remove removeStyle"
          // style="removeStyle"
          onClick={this.onRemoveItem.bind(this, i)}>
          ❌
        </span>
      </div>
    );
  }

  render() {
    return (
      <div>
        <hr />
        <button onClick={this.onAddItem}>Add Item</button>
        <button onClick={() => this.onAddItemJSON(prompt())}>Add Item JSON</button>
        <hr />
        <ResponsiveReactGridLayout
          onLayoutChange={this.onLayoutChange}
          onBreakpointChange={this.onBreakpointChange}
          {...this.props}>
          {_.map(this.state.items, el => this.createElement(el))}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}
