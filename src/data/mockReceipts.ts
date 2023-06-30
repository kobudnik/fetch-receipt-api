import { Receipt } from '../types';
export const validReceiptA: Receipt = {
  retailer: 'Target',
  purchaseDate: '2022-01-01',
  purchaseTime: '13:01',
  items: [
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
  ],
  total: '35.35'
};

export const validReceiptB: Receipt = {
  retailer: 'M&M Corner Market',
  purchaseDate: '2022-03-20',
  purchaseTime: '14:33',
  items: [
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
  ],
  total: '9.00'
};

export const invalidDateFormat: Receipt = {
  retailer: 'M&M Corner Market',
  purchaseDate: '2022-03-k',
  purchaseTime: '14:33',
  items: [
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
  ],
  total: '9.00'
};

export const invalidTimeFormat: Receipt = {
  retailer: 'M&M Corner Market',
  purchaseDate: '2022-03-k',
  purchaseTime: '14:',
  items: [
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
  ],
  total: '9.00'
};

export const missingProperties: Partial<Receipt> = {
  retailer: 'M&M Corner Market',
  items: [
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
  ],
  total: '9.00'
};

export const invalidItemsPrice = {
  retailer: 'M&M Corner Market',
  purchaseDate: '2022-03-20',
  purchaseTime: '14:33',
  items: [
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
      price: 4.32
    },
    {
      shortDescription: 'Gatorade',
      price: '2.25'
    }
  ],
  total: '9.00'
};

export const invalidItemsDescription = {
  retailer: 'M&M Corner Market',
  purchaseDate: '2022-03-20',
  purchaseTime: '14:33',
  items: [
    {
      shortDescription: 'Gatorade',
      price: '100.25'
    },
    {
      shortDescription: 'Gatorade',
      price: '2.25'
    },
    {
      shortDescription: 123,
      price: '2.25'
    },
    {
      shortDescription: 'Gatorade',
      price: '2.25'
    }
  ],
  total: '9.00'
};
