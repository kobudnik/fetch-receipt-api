import {
  calculatePoints,
  calculatePointsFromDay,
  calculatePointsFromItems,
  calculatePointsFromRetailer,
  calculatePointsFromTime,
  calculatePointsFromTotal
} from '../src/controllers/receiptController';

import { validReceipt109 } from '../src/data/mockReceipts';

describe('Calculate points from receipt properties', () => {
  it('should calculate 1 point for each alphanumeric char in the retailer', () => {
    const retailerPoints = calculatePointsFromRetailer('Tar!get?');
    expect(retailerPoints).toEqual(6);
  });

  it('should award 75 points if the total is a round dollar amount', () => {
    const pointsFromTotal = calculatePointsFromTotal('900.00');
    expect(pointsFromTotal).toEqual(75);
  });

  it('should award 25 points if the total is a divisible by 0.25 and not a round number', () => {
    const pointsFromTotal = calculatePointsFromTotal('87.75');
    expect(pointsFromTotal).toEqual(25);
  });

  it('should award 5 points for every two items on the receipt', () => {
    const pointsFromItemAmount = calculatePointsFromItems(items);
    expect(pointsFromItemAmount).toEqual(10);
  });

  it('should apply a bonus for each item having a trimmed description length that is a multiple of 3', () => {
    const pointsFromDescription = calculatePointsFromItems(itemsWithBonus);
    expect(pointsFromDescription).toEqual(16);
    // 10 points - 4 items (2 pairs @ 5 points each)
    // 3 Points - "Emils Cheese Pizza" is 18 characters (a multiple of 3)
    // item price of 12.25 * 0.2 = 2.45, rounded up is 3 points
    // 3 Points - "Klarbrunn 12-PK 12 FL OZ" is 24 characters (a multiple of 3)
    // item price of 12.00 * 0.2 = 2.4, rounded up is 3 points
  });

  it('should award 6 points if the purchase date is odd', () => {
    const pointsFromOddDay = calculatePointsFromDay('2022-01-01');
    const pointsFromEvenDay = calculatePointsFromDay('2022-01-02');
    expect(pointsFromOddDay).toEqual(6);
    expect(pointsFromEvenDay).toEqual(0);
  });

  it('should award 10 points if the purchase time was after 2:00pm and before 4:00pm', () => {
    const validTime = '14:01';
    const invalidTime = '17:32';
    const pointsAwarded = calculatePointsFromTime(validTime);
    const noPointsAwarded = calculatePointsFromTime(invalidTime);
    expect(pointsAwarded).toEqual(10);
    expect(noPointsAwarded).toEqual(0);
  });

  it('should return the sum from all these considerations', () => {
    const { retailer, total, purchaseDate, purchaseTime, items } =
      validReceipt109;

    const calculatedPoints = calculatePoints(validReceipt109);

    const fromRetailer = calculatePointsFromRetailer(retailer);
    const fromTotal = calculatePointsFromTotal(total);
    const fromDay = calculatePointsFromDay(purchaseDate);
    const fromTime = calculatePointsFromTime(purchaseTime);
    const fromItems = calculatePointsFromItems(items);

    const sum = fromRetailer + fromTotal + fromDay + fromTime + fromItems;

    expect(calculatedPoints).toEqual(sum);
  });
});

const items = [
  {
    shortDescription: 'Gatorade',
    price: '2.25'
  },
  {
    shortDescription: 'Gatorade',
    price: '2.25'
  },
  {
    shortDescription: 'Gatorade',
    price: '2.25'
  },
  {
    shortDescription: 'Gatorade',
    price: '2.25'
  }
];

const itemsWithBonus = [
  {
    shortDescription: 'Mountain Dew 12PK',
    price: '6.49'
  },
  {
    shortDescription: 'Emils Cheese Pizza',
    price: '12.25'
  },
  {
    shortDescription: 'Knorr Creamy Chicken',
    price: '1.26'
  },
  {
    shortDescription: 'Doritos Nacho Cheese',
    price: '3.35'
  },
  {
    shortDescription: '   Klarbrunn 12-PK 12 FL OZ  ',
    price: '12.00'
  }
];
