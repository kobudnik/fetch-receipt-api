import { SubmittedReceipt } from '../types';

//This receipt should amount to 28 points
export const validReceipt28: SubmittedReceipt = {
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

//This receipt should amount to 109 points
export const validReceipt109: SubmittedReceipt = {
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

export const validReceipt59: SubmittedReceipt = {
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
      shortDescription: 'GatoradeLight',
      price: '2.00'
    }
  ],
  total: '8.75'
};

export const invalidDateFormat: SubmittedReceipt = {
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

export const invalidTimeFormat: SubmittedReceipt = {
  retailer: 'M&M Corner Market',
  purchaseDate: '2022-03-01',
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

export const missingProperties: Partial<SubmittedReceipt> = {
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

export const invalidDataType = {
  retailer: 'Target',
  purchaseDate: 2022,
  purchaseTime: '13:01',
  items: {
    shortDescription: 'Mountain Dew 12PK',
    price: '6.49'
  },

  total: '35.35'
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

export const missingItemsProperty = {
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
      shortDescription: 'Gatorade'
    },
    {
      shortDescription: 'Gatorade',
      price: '2.25'
    }
  ],
  total: '9.00'
};
