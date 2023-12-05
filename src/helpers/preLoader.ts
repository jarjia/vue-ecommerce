export const loadImage = (imgs: string[]) => {
  imgs.map((img) => {
    const image = new Image();
    image.src = img;
  });
};
