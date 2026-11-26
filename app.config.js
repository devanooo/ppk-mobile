
export default ({ config }) => ({
  ...config,

  android: {
    ...config.android,
    googleServicesFile:
      process.env.GOOGLE_SERVICES_JSON ||
      "./google-services.json",
  },

  plugins: [
    ...(config.plugins ?? []),

    [
      "react-native-maps",
      {
        androidGoogleMapsApiKey:
          process.env.GOOGLE_MAPS_API_KEY,
      },
    ],
  ],
});
