import './App.css';
import React from 'react';
import { WidthProvider, Responsive } from 'react-grid-layout';
import _ from 'lodash';
import axios from 'axios';
import { randomColor } from 'randomcolor';
import { v4 as uuidv4 } from 'uuid';
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
    let rand = Math.floor(Math.random() * this.state.bdJSON.itemDND.length);
    console.log(rand);
    console.log(this.state.bdJSON.itemDND[rand].imgUrl);
    this.setState({
      items: this.state.items.concat({
        i: uuidv4(),
        x: (this.state.items.length * 2) % (this.state.cols || 12),
        y: Infinity, // puts it at the bottom
        w: 2,
        h: 2,
        imgItem: this.state.bdJSON.itemDND[rand].imgUrl,
        urlSite: null,
        color: randomColor({
          luminosity: 'light',
        }),
        typeItem: 1,
      }),
      counterAdd: this.state.counterAdd + 1,
      newCounter: this.state.counterAdd,
    });
    localStorage.setItem('items', JSON.stringify(this.state, serializer));
  }

  onAddItemJSON(urlItem) {
    this.setState({
      items: this.state.items.concat({
        i: uuidv4(),
        x: (this.state.items.length * 2) % (this.state.cols || 12),
        y: Infinity, // puts it at the bottom
        w: 2,
        h: 2,
        urlSite: urlItem,
        color: randomColor({
          luminosity: 'light',
        }),
        typeItem: 2,
      }),
    });
    localStorage.setItem('items', JSON.stringify(this.state, serializer));
  }

  onRemoveItem(i) {
    this.setState({
      items: _.reject(this.state.items, { i: i }),
      // counterAdd: this.state.counterAdd - 1,
      // newCounter:this.state.counterAdd
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
      <div className="wrap_item" style={{ backgroundColor: `${el.color}` }} key={i} data-grid={el}>
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
              window.self !== window.top ? (
                <iframe
                  //https://utyatnishna.ru
                  //https://askdev.ru
                  //https://codengineering.ru
                  src={el.urlSite}
                  title={i}
                  width="80%"
                  height="100%"
                  style={{ border: 'none', borderRight: '1px solid' }}
                />
              ) : (
                <span>
                  <center>you entered the site address incorrectly</center>
                </span>
              )
            ) : (
              <img src={el.imgItem} alt={el.imgItem} width="100%" height="100%" />
            )}
          </span>
        )}
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
        <button onClick={this.onAddItem}>Add Item JSON</button>
        <button
          onClick={() =>
            this.onAddItemJSON(
              prompt(
                `because the policy of most sites prohibits embedding their site on other peoples
                  sites, here is a small list of sites on which the ban does not apply `,
              ),
            )
          }>
          Add Item
        </button>
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
