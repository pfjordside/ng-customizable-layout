import { FilterPipe } from './filter.pipe';

describe('FilterPipe', () => {
  let pipe: FilterPipe;

  beforeEach(() => {
    pipe = new FilterPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform with filter function', () => {
    let filterFn: (element: number) => boolean;
    let array: number[];
    let answer: number;
    beforeEach(() => {
      answer = 42;
      filterFn = element => element === answer;
      array = [41, 42, 43, 44, 45];
    });

    it('should filter input array using provided filter function', () => {
      const res = pipe.transform(array, filterFn);
      expect(res.length).toBe(1);
      expect(res[0]).toEqual(answer);
    });

    it('should return input array if no filterFunction provided', () => {
      const res = pipe.transform(array, null);
      expect(res.length).toBe(5);
    });
  });
});
