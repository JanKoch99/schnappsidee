const production = {
    url: 'https://schnappsidee-api.onrender.com'
};
const development = {
    url: 'http://localhost:4000'
};
export const config = process.env.NODE_ENV === 'development' ? development : production;