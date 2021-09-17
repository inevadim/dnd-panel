import './App.css';
import React from 'react';
import { WidthProvider, Responsive } from 'react-grid-layout';
import _ from 'lodash';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

const serializer = (name, val) =>
  typeof val === 'number' && !isFinite(val) ? val.toString() : val;

export default class AddRemoveLayout extends React.PureComponent {
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
      items: [0, 1, 2, 3, 4].map(function (i, key, list) {
        return {
          i: i.toString(),
          x: i * 2,
          y: 0,
          w: 2,
          h: 2,
          urlSite: null,
          typeItem: 1,
          add: i === list.length - 1,
        };
      }),
      newCounter: 0,
    };
    this.onAddItem = this.onAddItem.bind(this);
    this.onAddItemJSON = this.onAddItemJSON.bind(this);
  }
  onAddItem() {
    this.setState({
      items: this.state.items.concat({
        i: 'n' + this.state.newCounter,
        x: (this.state.items.length * 2) % (this.state.cols || 12),
        y: Infinity, // puts it at the bottom
        w: 2,
        h: 2,
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

  createElement(el) {
    const i = el.add ? '+' : el.i;
    return (
      <div key={i} data-grid={el}>
        {el.add ? (
          <span
            className="add text"
            onClick={this.onAddItem}
            title="You can add an item by clicking here, too.">
            Add +
          </span>
        ) : (
          <span className="text">
            <iframe src={el.urlSite} title={i} width="80%" height="98%" />
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
        <ResponsiveReactGridLayout>
          {_.map(this.state.items, el => this.createElement(el))}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}
