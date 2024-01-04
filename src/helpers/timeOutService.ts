let quantityTimeout: NodeJS.Timeout | null = null;

const timeOut = (callback: any) => {
  if (quantityTimeout) {
    clearTimeout(quantityTimeout);
  }

  setTimeout(() => {
    callback();
  }, 2000);
};

export default timeOut;
