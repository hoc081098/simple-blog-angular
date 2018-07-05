// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBGZf50rC_z9gMNc4RwhI1AeylTPP8VSpU',
    authDomain: 'fir-demo-flutter.firebaseapp.com',
    databaseURL: 'https://fir-demo-flutter.firebaseio.com',
    projectId: 'firebase-demo-flutter',
    storageBucket: 'firebase-demo-flutter.appspot.com',
    messagingSenderId: '995926619937'
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
