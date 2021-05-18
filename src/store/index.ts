import Rekv from 'rekv';

// 定义副使用
const store = new Rekv(
  { foo: 'bar' },
  {
    effects: {
      changeFoo(name: string) {
        this.setState({ foo: name });
      },
    },
  },
);

// 使用副作用
store.effects.changeFoo('hello');

export default store;
