import Schema from 'validate';

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    use: {
      min: (val) => val > 0,
    },
  },
  count: {
    type: Number,
    required: true,
    use: {
      min: (val) => val > 0,
    },
  },
});

export const validateProduct = (product) => {
  const errors = productSchema.validate(product);

  return errors.length ? errors : null;
};
