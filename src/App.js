import './App.css';
import React from 'react';
import { WidthProvider, Responsive } from 'react-grid-layout';
import _ from 'lodash';
const ResponsiveReactGridLayout = WidthProvider(Responsive);

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
  }
  render() {
    return <div></div>;
  }
}
