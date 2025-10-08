import 'dotenv/config';
export default {
  expo: {
    name: 'SkillSwap',
    slug: 'skillswap',
    scheme: 'skillswap',
    extra: {
      apiUrl: process.env.API_URL || 'http://localhost:4000',
    },
  },
};
