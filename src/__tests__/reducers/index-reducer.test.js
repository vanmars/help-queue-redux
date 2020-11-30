import rootReducer from '../../reducers/index';

describe('rootReducer', () => {
test('should return defauly state if no action type is recognized', () => {
    expect(rootReducer({}, {type:null})).toEqual({
      masterTicketList: {},
      formVisibleOnPage: false
    });
  });
})
