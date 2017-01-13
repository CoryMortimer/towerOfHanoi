import { TowerOfHanoiPage } from './app.po';

describe('towerOfHanoi App', function() {
  let page: TowerOfHanoiPage;

  beforeEach(() => {
    page = new TowerOfHanoiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
