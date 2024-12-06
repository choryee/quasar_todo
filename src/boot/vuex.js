import store from 'src/store';

export default async ({ app }) => {
  app.store = store;
};
